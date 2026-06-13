import mongoose, { Document, Schema } from "mongoose";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface IDocumentItem {
  type: "business-plan" | "financial-model";
  count: number;
}

export interface ICreditRequest extends Document {
  userId: string;
  status: RequestStatus;
  documents: IDocumentItem[];
  creditsRequested: number;
  note?: string;
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CreditRequestSchema = new Schema<ICreditRequest>(
  {
    userId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    documents: [
      {
        type: { type: String, enum: ["business-plan", "financial-model"], required: true },
        count: { type: Number, required: true, min: 1 },
      },
    ],
    creditsRequested: { type: Number, required: true, min: 1 },
    note: { type: String },
    adminNote: { type: String },
    reviewedBy: { type: String },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const CreditRequest =
  mongoose.models.CreditRequest ||
  mongoose.model<ICreditRequest>("CreditRequest", CreditRequestSchema);
