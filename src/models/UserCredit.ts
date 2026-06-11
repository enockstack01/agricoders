import mongoose, { Schema, Document } from "mongoose";

export interface IUserCredit extends Document {
  userId: string;
  credits: number;
  updatedAt: Date;
}

const UserCreditSchema = new Schema<IUserCredit>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    credits: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const UserCredit =
  mongoose.models.UserCredit ||
  mongoose.model<IUserCredit>("UserCredit", UserCreditSchema);
