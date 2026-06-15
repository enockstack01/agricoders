import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { UserCredit } from "@/models/UserCredit";
import { CreditTransaction } from "@/models/CreditTransaction";
import { createNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const { userId: adminId } = await auth();
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { currentUser } = await import("@clerk/nextjs/server");
  const me = await currentUser();
  const role = me?.publicMetadata?.role as string | undefined;
  if (role !== "admin" && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, credits, note } = await req.json() as {
    userId: string;
    credits: number;
    note?: string;
  };

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (!Number.isInteger(credits) || credits <= 0) {
    return NextResponse.json({ error: "credits must be a positive integer" }, { status: 400 });
  }

  await connectDB();

  const current = await UserCredit.findOne({ userId });
  if (!current) {
    return NextResponse.json({ error: "User has no credit account." }, { status: 404 });
  }

  const deduct = Math.min(current.credits, credits);
  const updated = await UserCredit.findOneAndUpdate(
    { userId },
    { $inc: { credits: -deduct }, $set: { updatedAt: new Date() } },
    { new: true }
  );

  await CreditTransaction.create({
    userId,
    adminId,
    type: "generate",
    credits: -deduct,
    balanceAfter: updated!.credits,
    note: note?.trim() || "Admin credit deduction",
  }).catch(() => {});

  createNotification(
    userId,
    "credits_deducted",
    `${deduct} credits removed from your account`,
    `An admin has removed ${deduct} credits from your account. Your new balance is ${updated!.credits} credits.`
  ).catch(() => {});

  return NextResponse.json({ ok: true, newBalance: updated!.credits, deducted: deduct });
}
