import mongoose, { Schema, type Connection } from "mongoose";

export interface ISyncState {
  key: "livestockpro";
  lastCursor?: string;
  lastSyncedAt?: Date;
  lastRunAt?: Date;
  lastRunStatus: "ok" | "error" | "not_configured";
  lastRunError?: string;
  recordsFetchedLastRun: number;
  alertsCreatedLastRun: number;
}

const SyncStateSchema = new Schema<ISyncState>({
  key: { type: String, required: true, unique: true, default: "livestockpro" },
  lastCursor: String,
  lastSyncedAt: Date,
  lastRunAt: Date,
  lastRunStatus: { type: String, enum: ["ok", "error", "not_configured"], default: "not_configured" },
  lastRunError: String,
  recordsFetchedLastRun: { type: Number, default: 0 },
  alertsCreatedLastRun: { type: Number, default: 0 },
});

export function getSyncStateModel(conn: Connection) {
  return (
    (conn.models.SyncState as mongoose.Model<ISyncState>) ||
    conn.model<ISyncState>("SyncState", SyncStateSchema)
  );
}
