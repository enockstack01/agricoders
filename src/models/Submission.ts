import mongoose, { Schema, Document } from "mongoose";
import { FormSubmission } from "@/types";

export interface ISubmission extends FormSubmission, Document {}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: { type: String, required: true, index: true },
    companyInfo: { type: Schema.Types.Mixed, required: true },
    businessDescription: { type: Schema.Types.Mixed, required: true },
    marketAnalysis: { type: Schema.Types.Mixed, required: true },
    staff: { type: Schema.Types.Mixed, required: true },
    financial: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Submission =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);
