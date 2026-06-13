import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { CreditRequest } from "@/models/CreditRequest";
import { addCredits } from "@/lib/credits";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin" && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { action, adminNote } = (await req.json()) as {
    action: "approve" | "reject";
    adminNote?: string;
  };

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
  }

  await connectDB();

  const request = await CreditRequest.findById(id);
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (request.status !== "pending") {
    return NextResponse.json({ error: "Request already reviewed" }, { status: 409 });
  }

  request.status = action === "approve" ? "approved" : "rejected";
  request.adminNote = adminNote?.trim() || undefined;
  request.reviewedBy = userId;
  request.reviewedAt = new Date();
  await request.save();

  let newBalance: number | undefined;
  if (action === "approve") {
    const docLabels = request.documents
      .map((d: { count: number; type: string }) => `${d.count}x ${d.type}`)
      .join(", ");
    newBalance = await addCredits(
      request.userId,
      request.creditsRequested,
      `Approved request: ${docLabels}`
    );
  }

  return NextResponse.json({ ok: true, status: request.status, newBalance });
}
