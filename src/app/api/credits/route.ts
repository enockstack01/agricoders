import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { UserCredit } from "@/models/UserCredit";
import { CreditTransaction } from "@/models/CreditTransaction";

// GET /api/credits — returns current user's balance and recent transactions
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const [creditDoc, transactions] = await Promise.all([
      UserCredit.findOne({ userId }).lean(),
      CreditTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ]);

    return NextResponse.json({
      credits: (creditDoc?.credits as number) ?? 0,
      transactions,
    });
  } catch (err) {
    console.error("[/api/credits GET]", err);
    return NextResponse.json({ error: "Failed to load credits" }, { status: 500 });
  }
}
