import mongoose, { Schema, Document } from "mongoose";

export interface IGeneratedDocument extends Document {
  submissionId: string;
  userId: string;
  type: "docx" | "xlsx";
  data: Buffer;
  editedHtml?: string;
  generatedAt: Date;
  editedAt?: Date;
}

const GeneratedDocumentSchema = new Schema<IGeneratedDocument>({
  submissionId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ["docx", "xlsx"], required: true },
  data: { type: Buffer, required: true },
  editedHtml: { type: String },
  generatedAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
});

GeneratedDocumentSchema.index({ submissionId: 1, type: 1 }, { unique: true });

export const GeneratedDocument =
  mongoose.models.GeneratedDocument ||
  mongoose.model<IGeneratedDocument>("GeneratedDocument", GeneratedDocumentSchema);
