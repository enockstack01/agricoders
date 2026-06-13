import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { CreditRequest } from "@/models/CreditRequest";

const CREDITS_PER_DOC = 5;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { documents, note } = body as {
    documents: { type: "business-plan" | "financial-model"; count: number }[];
    note?: string;
  };

  if (!Array.isArray(documents) || documents.length === 0) {
    return NextResponse.json({ error: "Select at least one document type." }, { status: 400 });
  }

  const validTypes = ["business-plan", "financial-model"];
  for (const d of documents) {
    if (!validTypes.includes(d.type) || !Number.isInteger(d.count) || d.count < 1) {
      return NextResponse.json({ error: "Invalid document entry." }, { status: 400 });
    }
  }

  const totalDocs = documents.reduce((sum, d) => sum + d.count, 0);
  const creditsRequested = totalDocs * CREDITS_PER_DOC;

  await connectDB();

  // Prevent duplicate pending requests
  const existing = await CreditRequest.findOne({ userId, status: "pending" });
  if (existing) {
    return NextResponse.json(
      { error: "You already have a pending credit request. Wait for the admin to review it." },
      { status: 409 }
    );
  }

  const request = await CreditRequest.create({
    userId,
    documents,
    creditsRequested,
    note: note?.trim() || undefined,
  });

  return NextResponse.json({ ok: true, requestId: request._id.toString(), creditsRequested }, { status: 201 });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const requests = await CreditRequest.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return NextResponse.json(requests);
}
