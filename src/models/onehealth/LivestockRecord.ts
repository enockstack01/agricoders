import mongoose, { Schema, type Connection } from "mongoose";

export interface ILivestockRecord {
  externalId: string;
  animalId?: string;
  species: string;
  farmId?: string;
  farmName?: string;
  district?: string;
  country?: string;
  lat?: number;
  lng?: number;
  eventType: "health_record" | "vaccination" | "mortality" | "diagnosis";
  symptoms: string[];
  diagnosis?: string;
  severity?: "mild" | "moderate" | "severe" | "fatal";
  mortality: boolean;
  vaccinated: boolean;
  recordedAt: Date;
  notes?: string;
  syncedAt: Date;
}

const LivestockRecordSchema = new Schema<ILivestockRecord>({
  externalId: { type: String, required: true, unique: true, index: true },
  animalId: String,
  species: { type: String, required: true, index: true },
  farmId: { type: String, index: true },
  farmName: String,
  district: { type: String, index: true },
  country: String,
  lat: Number,
  lng: Number,
  eventType: {
    type: String,
    enum: ["health_record", "vaccination", "mortality", "diagnosis"],
    required: true,
  },
  symptoms: { type: [String], default: [] },
  diagnosis: String,
  severity: { type: String, enum: ["mild", "moderate", "severe", "fatal"] },
  mortality: { type: Boolean, default: false, index: true },
  vaccinated: { type: Boolean, default: false },
  recordedAt: { type: Date, required: true, index: true },
  notes: String,
  syncedAt: { type: Date, default: () => new Date() },
});

LivestockRecordSchema.index({ farmId: 1, recordedAt: -1 });
LivestockRecordSchema.index({ district: 1, recordedAt: -1 });

export function getLivestockRecordModel(conn: Connection) {
  return (
    (conn.models.LivestockRecord as mongoose.Model<ILivestockRecord>) ||
    conn.model<ILivestockRecord>("LivestockRecord", LivestockRecordSchema)
  );
}
