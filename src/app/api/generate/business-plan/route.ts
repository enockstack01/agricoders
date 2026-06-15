import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Submission } from "@/models/Submission";
import { GeneratedDocument } from "@/models/GeneratedDocument";
import { computeFinancials } from "@/lib/calculations";
import { generateBusinessPlanDocx } from "@/lib/generate-docx";
import { generateCharts } from "@/lib/chartGenerator";
import { generateAINarrative } from "@/lib/aiNarrative";
import { deductCredits, refundCredits, CREDITS_NEW_GENERATION, CREDITS_REGENERATION } from "@/lib/credits";
import { createNotification } from "@/lib/notifications";

export const maxDuration = 120;

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await connectDB();

    // ── Free: return previously stored document ──────────────────────────────
    if (req.nextUrl.searchParams.get("stored") === "true") {
      const doc = await GeneratedDocument.findOne({ submissionId: id, userId, type: "docx" });
      if (!doc) return NextResponse.json({ error: "No stored document found" }, { status: 404 });
      const name = (req.nextUrl.searchParams.get("name") || "BusinessPlan").replace(/\s+/g, "_");
      return new NextResponse(new Uint8Array(doc.data as unknown as ArrayBuffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${name}_Business_Plan.docx"`,
        },
      });
    }

    // ── Credit check: determine cost ─────────────────────────────────────────
    const existing = await GeneratedDocument.findOne(
      { submissionId: id, userId, type: "docx" },
      { _id: 1 }
    ).lean();
    const isRegeneration = !!existing;
    const creditCost = isRegeneration ? CREDITS_REGENERATION : CREDITS_NEW_GENERATION;

    const deduction = await deductCredits(
      userId,
      creditCost,
      isRegeneration ? "regenerate" : "generate",
      `Business Plan ${isRegeneration ? "regeneration" : "generation"} for submission ${id}`
    );
    if (!deduction.ok) {
      return NextResponse.json(
        { error: "INSUFFICIENT_CREDITS", required: deduction.required, balance: deduction.balance },
        { status: 402 }
      );
    }

    const useAI = req.nextUrl.searchParams.get("ai") !== "false";
    const useCharts = req.nextUrl.searchParams.get("charts") !== "false";

    const submission = await Submission.findOne({ _id: id, userId });
    if (!submission) {
      await refundCredits(userId, creditCost, "Refund: submission not found");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const submissionObj = submission.toObject();
    const results = computeFinancials(submissionObj.financial, submissionObj.staff);
    const currency = submissionObj.companyInfo?.currency || "USD";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let buffer: any;
    try {
      const [charts, aiNarrative] = await Promise.all([
        useCharts
          ? generateCharts(results, currency).catch(() => ({}))
          : Promise.resolve({}),
        useAI
          ? generateAINarrative(submissionObj, results).catch(() => ({
              executiveSummary: "", introduction: "", industryAnalysis: "",
              localMarketContext: "", marketContext: "", conclusion: "", references: "",
            }))
          : Promise.resolve({
              executiveSummary: "", introduction: "", industryAnalysis: "",
              localMarketContext: "", marketContext: "", conclusion: "", references: "",
            }),
      ]);
      buffer = await generateBusinessPlanDocx(submissionObj, results, charts, aiNarrative);
    } catch (genErr) {
      console.error("[business-plan] Generation failed, refunding credits:", genErr);
      await refundCredits(userId, creditCost, "Refund: generation failed");
      return NextResponse.json({ error: "Failed to generate business plan. Please try again." }, { status: 500 });
    }

    // Persist generated document (upsert — clears any previous edits on regeneration)
    await GeneratedDocument.findOneAndUpdate(
      { submissionId: id, userId, type: "docx" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $set: { data: Buffer.from(buffer) as any, generatedAt: new Date(), editedHtml: undefined, editedAt: undefined } },
      { upsert: true }
    ).catch((e) => console.error("[business-plan] Failed to persist:", e));

    const companyName = submissionObj.companyInfo?.companyName || "BusinessPlan";

    createNotification(
      userId,
      "document_ready",
      "Business Plan ready to download",
      `Your Business Plan for "${companyName}" has been generated and is ready to download. ${deduction.balanceAfter} credits remaining.`
    ).catch(() => {});

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${companyName.replace(/\s+/g, "_")}_Business_Plan.docx"`,
        "X-Credits-Remaining": String(deduction.balanceAfter),
      },
    });
  } catch (err) {
    console.error("[/api/generate/business-plan]", err);
    return NextResponse.json({ error: "Failed to generate business plan. Please try again." }, { status: 500 });
  }
}
