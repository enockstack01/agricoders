import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { UserCredit } from "@/models/UserCredit";
import { CreditTransaction } from "@/models/CreditTransaction";
import { createNotification } from "@/lib/notifications";

// POST /api/admin/credits/assign
// Body: { userId, credits, paymentAmount, currency, note }
// Requires admin or super_admin role
export async function POST(req: NextRequest) {
  try {
    const { userId: adminId } = await auth();
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify admin role via Clerk publicMetadata
    const { currentUser } = await import("@clerk/nextjs/server");
    const adminUser = await currentUser();
    const adminRole = adminUser?.publicMetadata?.role as string | undefined;
    if (adminRole !== "admin" && adminRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, credits, paymentAmount, currency, note } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    const creditsNum = parseInt(credits);
    if (!creditsNum || creditsNum <= 0) {
      return NextResponse.json({ error: "credits must be a positive integer" }, { status: 400 });
    }

    await connectDB();

    // Upsert credit balance, atomically add credits
    const updated = await UserCredit.findOneAndUpdate(
      { userId },
      { $inc: { credits: creditsNum } },
      { upsert: true, new: true }
    );

    // Log transaction
    await CreditTransaction.create({
      userId,
      adminId,
      type: "purchase",
      credits: creditsNum,
      balanceAfter: updated.credits,
      paymentAmount: paymentAmount ? parseFloat(paymentAmount) : undefined,
      currency: currency || "USD",
      note: note || `Assigned by admin`,
    });

    createNotification(
      userId,
      "credits_assigned",
      `${creditsNum} credits added to your account`,
      `An admin has added ${creditsNum} credits to your account. Your new balance is ${updated.credits} credits.${note ? ` Note: ${note}` : ""}`
    ).catch(() => {});

    return NextResponse.json({ ok: true, newBalance: updated.credits });
  } catch (err) {
    console.error("[/api/admin/credits/assign]", err);
    return NextResponse.json({ error: "Failed to assign credits" }, { status: 500 });
  }
}

// GET /api/admin/credits/assign?userId=... — fetch a user's current credit balance
export async function GET(req: NextRequest) {
  try {
    const { userId: adminId } = await auth();
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { currentUser } = await import("@clerk/nextjs/server");
    const adminUser = await currentUser();
    const adminRole = adminUser?.publicMetadata?.role as string | undefined;
    if (adminRole !== "admin" && adminRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    await connectDB();
    const [creditDoc, transactions] = await Promise.all([
      UserCredit.findOne({ userId }).lean(),
      CreditTransaction.find({ userId }).sort({ createdAt: -1 }).limit(30).lean(),
    ]);

    return NextResponse.json({
      credits: (creditDoc?.credits as number) ?? 0,
      transactions,
    });
  } catch (err) {
    console.error("[/api/admin/credits/assign GET]", err);
    return NextResponse.json({ error: "Failed to load user credits" }, { status: 500 });
  }
}
