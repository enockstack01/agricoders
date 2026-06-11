import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { GeneratedDocument } from "@/models/GeneratedDocument";

// GET /api/documents/meta?ids=id1,id2,id3
// Returns { id1: { docx: "ISO", docxEditedAt: "ISO|null", xlsx: "ISO" }, ... }
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const idsParam = req.nextUrl.searchParams.get("ids") || "";
    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 100);
    if (ids.length === 0) return NextResponse.json({});

    await connectDB();
    const docs = await GeneratedDocument.find(
      { submissionId: { $in: ids }, userId },
      { submissionId: 1, type: 1, generatedAt: 1, editedAt: 1 }
    ).lean();

    const result: Record<string, { docx?: string; docxEditedAt?: string; xlsx?: string }> = {};
    for (const doc of docs) {
      const sid = String(doc.submissionId);
      if (!result[sid]) result[sid] = {};
      if (doc.type === "docx") {
        result[sid].docx = doc.generatedAt ? new Date(doc.generatedAt).toISOString() : undefined;
        result[sid].docxEditedAt = doc.editedAt ? new Date(doc.editedAt).toISOString() : undefined;
      } else if (doc.type === "xlsx") {
        result[sid].xlsx = doc.generatedAt ? new Date(doc.generatedAt).toISOString() : undefined;
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/documents/meta]", err);
    return NextResponse.json({});
  }
}
