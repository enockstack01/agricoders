import mongoose, { Schema } from "mongoose";

export type NotificationType =
  | "credits_approved"
  | "credits_rejected"
  | "credits_assigned"
  | "credits_deducted"
  | "document_ready";

export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const NotificationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["credits_approved", "credits_rejected", "credits_assigned", "credits_deducted", "document_ready"],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
