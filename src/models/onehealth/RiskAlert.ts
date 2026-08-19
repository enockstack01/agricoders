import mongoose, { Schema, type Connection } from "mongoose";

export type RiskAlertType = "zoonotic_watchlist" | "mortality_spike" | "symptom_cluster";
export type RiskSeverity = "low" | "medium" | "high" | "critical";
export type RiskAlertStatus = "open" | "reviewed" | "dismissed";

export interface IRiskAlert {
  alertKey: string;
  type: RiskAlertType;
  disease?: string;
  zoonotic: boolean;
  severity: RiskSeverity;
  title: string;
  description: string;
  affectedRecordIds: mongoose.Types.ObjectId[];
  farmIds: string[];
  species: string[];
  district?: string;
  status: RiskAlertStatus;
  detectedAt: Date;
  updatedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

const RiskAlertSchema = new Schema<IRiskAlert>({
  alertKey: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ["zoonotic_watchlist", "mortality_spike", "symptom_cluster"], required: true },
  disease: String,
  zoonotic: { type: Boolean, default: false },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  affectedRecordIds: { type: [Schema.Types.ObjectId], ref: "LivestockRecord", default: [] },
  farmIds: { type: [String], default: [] },
  species: { type: [String], default: [] },
  district: String,
  status: { type: String, enum: ["open", "reviewed", "dismissed"], default: "open", index: true },
  detectedAt: { type: Date, required: true, index: true },
  updatedAt: { type: Date, default: () => new Date() },
  reviewedBy: String,
  reviewedAt: Date,
});

export function getRiskAlertModel(conn: Connection) {
  return (
    (conn.models.RiskAlert as mongoose.Model<IRiskAlert>) ||
    conn.model<IRiskAlert>("RiskAlert", RiskAlertSchema)
  );
}
