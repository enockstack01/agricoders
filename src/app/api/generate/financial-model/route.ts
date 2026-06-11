import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { Submission } from "@/models/Submission";
import { GeneratedDocument } from "@/models/GeneratedDocument";
import { computeFinancials } from "@/lib/calculations";
import { generateFinancialModelXlsx } from "@/lib/generate-xlsx";
import { deductCredits, refundCredits, CREDITS_NEW_GENERATION, CREDITS_REGENERATION } from "@/lib/credits";

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
      const doc = await GeneratedDocument.findOne({ submissionId: id, userId, type: "xlsx" });
      if (!doc) return NextResponse.json({ error: "No stored document found" }, { status: 404 });
      const name = (req.nextUrl.searchParams.get("name") || "FinancialModel").replace(/\s+/g, "_");
      return new NextResponse(new Uint8Array(doc.data as unknown as ArrayBuffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${name}_Financial_Model.xlsx"`,
        },
      });
    }

    // ── Credit check ─────────────────────────────────────────────────────────
    const existing = await GeneratedDocument.findOne(
      { submissionId: id, userId, type: "xlsx" },
      { _id: 1 }
    ).lean();
    const isRegeneration = !!existing;
    const creditCost = isRegeneration ? CREDITS_REGENERATION : CREDITS_NEW_GENERATION;

    const deduction = await deductCredits(
      userId,
      creditCost,
      isRegeneration ? "regenerate" : "generate",
      `Financial Model ${isRegeneration ? "regeneration" : "generation"} for submission ${id}`
    );
    if (!deduction.ok) {
      return NextResponse.json(
        { error: "INSUFFICIENT_CREDITS", required: deduction.required, balance: deduction.balance },
        { status: 402 }
      );
    }

    const submission = await Submission.findOne({ _id: id, userId });
    if (!submission) {
      await refundCredits(userId, creditCost, "Refund: submission not found");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let buffer: any;
    try {
      const results = computeFinancials(submission.financial, submission.staff);
      buffer = await generateFinancialModelXlsx(submission.toObject(), results);
    } catch (genErr) {
      console.error("[financial-model] Generation failed, refunding credits:", genErr);
      await refundCredits(userId, creditCost, "Refund: generation failed");
      return NextResponse.json({ error: "Failed to generate financial model. Please try again." }, { status: 500 });
    }

    await GeneratedDocument.findOneAndUpdate(
      { submissionId: id, userId, type: "xlsx" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $set: { data: Buffer.from(buffer) as any, generatedAt: new Date() } },
      { upsert: true }
    ).catch((e) => console.error("[financial-model] Failed to persist:", e));

    const companyName = submission.companyInfo?.companyName || "FinancialModel";
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${companyName.replace(/\s+/g, "_")}_Financial_Model.xlsx"`,
        "X-Credits-Remaining": String(deduction.balanceAfter),
      },
    });
  } catch (err) {
    console.error("[/api/generate/financial-model]", err);
    return NextResponse.json({ error: "Failed to generate financial model. Please try again." }, { status: 500 });
  }
}
