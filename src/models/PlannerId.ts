import mongoose, { Schema } from "mongoose";

// One row per user. _id is the Planner ID itself, so MongoDB's unique _id index
// guarantees no two users can ever hold the same ID.
const PlannerIdSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const PlannerIdModel =
  mongoose.models.PlannerId || mongoose.model("PlannerId", PlannerIdSchema);
