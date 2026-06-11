import mongoose, { Schema, Document } from "mongoose";
import { UserProfile } from "@/types";

export interface IUserProfile extends UserProfile, Document {}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    defaults: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const UserProfileModel =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
