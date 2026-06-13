import { UserCredit } from "@/models/UserCredit";
import { CreditTransaction } from "@/models/CreditTransaction";
import { TxType } from "@/models/CreditTransaction";

export const CREDITS_NEW_GENERATION = 5;
export const CREDITS_REGENERATION = 5;

interface DeductResult {
  ok: true;
  balanceAfter: number;
}
interface DeductError {
  ok: false;
  required: number;
  balance: number;
}

/**
 * Atomically deduct credits from a user's account.
 * Returns { ok: false } if the user has insufficient credits.
 */
export async function deductCredits(
  userId: string,
  amount: number,
  type: TxType,
  note?: string
): Promise<DeductResult | DeductError> {
  // Try to atomically decrement only if balance >= amount
  const updated = await UserCredit.findOneAndUpdate(
    { userId, credits: { $gte: amount } },
    { $inc: { credits: -amount } },
    { new: true }
  );

  if (!updated) {
    // Either user doesn't have a credit document or has insufficient credits
    const existing = await UserCredit.findOne({ userId }).lean();
    const balance = (existing?.credits as number) ?? 0;
    return { ok: false, required: amount, balance };
  }

  // Log the transaction
  await CreditTransaction.create({
    userId,
    type,
    credits: -amount,
    balanceAfter: updated.credits,
    note,
  }).catch(() => {/* non-fatal */});

  return { ok: true, balanceAfter: updated.credits };
}

/** Refund credits (used when generation fails after deduction) */
export async function refundCredits(userId: string, amount: number, note?: string) {
  const updated = await UserCredit.findOneAndUpdate(
    { userId },
    { $inc: { credits: amount } },
    { new: true, upsert: true }
  );
  await CreditTransaction.create({
    userId,
    type: "purchase",
    credits: amount,
    balanceAfter: updated?.credits ?? amount,
    note: note || "Refund",
  }).catch(() => {/* non-fatal */});
}

/** Get a user's current credit balance (0 if no account yet) */
export async function getBalance(userId: string): Promise<number> {
  const doc = await UserCredit.findOne({ userId }).lean();
  return (doc?.credits as number) ?? 0;
}

/** Add credits (called by admin credit assignment) */
export async function addCredits(
  userId: string,
  amount: number,
  note?: string
): Promise<number> {
  const updated = await UserCredit.findOneAndUpdate(
    { userId },
    { $inc: { credits: amount }, $set: { updatedAt: new Date() } },
    { upsert: true, new: true }
  );
  await CreditTransaction.create({
    userId,
    type: "purchase" as TxType,
    credits: amount,
    balanceAfter: updated.credits,
    note: note || "Credits added",
  }).catch(() => {/* non-fatal */});
  return updated.credits;
}
