import mongoose, { Schema, Document } from "mongoose";

export type TxType = "purchase" | "generate" | "regenerate";

export interface ICreditTransaction extends Document {
  userId: string;
  adminId?: string;
  type: TxType;
  credits: number;
  balanceAfter: number;
  paymentAmount?: number;
  currency?: string;
  stripeSessionId?: string;
  note?: string;
  createdAt: Date;
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    userId: { type: String, required: true, index: true },
    adminId: { type: String },
    type: { type: String, enum: ["purchase", "generate", "regenerate"], required: true },
    credits: { type: Number, required: true },        // positive = added, negative = spent
    balanceAfter: { type: Number, required: true },
    paymentAmount: { type: Number },
    currency: { type: String },
    stripeSessionId: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

export const CreditTransaction =
  mongoose.models.CreditTransaction ||
  mongoose.model<ICreditTransaction>("CreditTransaction", CreditTransactionSchema);
