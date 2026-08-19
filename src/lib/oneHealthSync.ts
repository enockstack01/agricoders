import { connectOneHealthDB } from "@/lib/onehealthDb";
import { getLivestockRecordModel } from "@/models/onehealth/LivestockRecord";
import { getRiskAlertModel } from "@/models/onehealth/RiskAlert";
import { getSyncStateModel } from "@/models/onehealth/SyncState";
import { fetchLivestockRecords, isLivestockApiConfigured, type LivestockApiRecord } from "@/lib/livestockProClient";
import { evaluateOneHealthRisks } from "@/lib/oneHealthRiskEngine";

const MAX_PAGES_PER_RUN = 10; // safety cap so a huge backlog can't run forever in one pass
const ANALYSIS_WINDOW_DAYS = 30; // covers both the mortality (7d) and cluster (14d) windows with margin

export interface SyncSummary {
  status: "ok" | "error" | "not_configured";
  recordsFetched: number;
  alertsCreated: number;
  error?: string;
}

function toRecordDoc(r: LivestockApiRecord) {
  return {
    externalId: r.id,
    animalId: r.animalId ?? undefined,
    species: r.species,
    farmId: r.farmId ?? undefined,
    farmName: r.farmName ?? undefined,
    district: r.district ?? undefined,
    country: r.country ?? undefined,
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
    eventType: r.eventType,
    symptoms: r.symptoms ?? [],
    diagnosis: r.diagnosis ?? undefined,
    severity: r.severity ?? undefined,
    mortality: Boolean(r.mortality),
    vaccinated: Boolean(r.vaccinated),
    recordedAt: new Date(r.recordedAt),
    notes: r.notes ?? undefined,
    syncedAt: new Date(),
  };
}

export async function runOneHealthSync(): Promise<SyncSummary> {
  const conn = await connectOneHealthDB();
  const SyncState = getSyncStateModel(conn);
  const LivestockRecord = getLivestockRecordModel(conn);
  const RiskAlert = getRiskAlertModel(conn);

  if (!isLivestockApiConfigured()) {
    await SyncState.updateOne(
      { key: "livestockpro" },
      { $set: { lastRunAt: new Date(), lastRunStatus: "not_configured" } },
      { upsert: true }
    );
    return { status: "not_configured", recordsFetched: 0, alertsCreated: 0 };
  }

  try {
    const state = await SyncState.findOne({ key: "livestockpro" }).lean();
    let cursor = state?.lastCursor ?? null;
    let totalFetched = 0;

    for (let page = 0; page < MAX_PAGES_PER_RUN; page++) {
      const { records, nextCursor } = await fetchLivestockRecords(cursor);
      if (records.length > 0) {
        await Promise.all(
          records.map((r) =>
            LivestockRecord.updateOne({ externalId: r.id }, { $set: toRecordDoc(r) }, { upsert: true })
          )
        );
        totalFetched += records.length;
      }
      cursor = nextCursor;
      if (!nextCursor || records.length === 0) break;
    }

    // Re-evaluate risk over the full trailing window so patterns spanning multiple
    // sync runs (and records fetched in earlier runs) are still caught.
    const windowStart = new Date(Date.now() - ANALYSIS_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const recentRecords = await LivestockRecord.find({ recordedAt: { $gte: windowStart } }).lean();
    const candidates = evaluateOneHealthRisks(recentRecords);

    let alertsCreated = 0;
    for (const c of candidates) {
      const res = await RiskAlert.updateOne(
        { alertKey: c.alertKey },
        {
          $setOnInsert: { status: "open", detectedAt: c.detectedAt },
          $set: {
            type: c.type,
            disease: c.disease,
            zoonotic: c.zoonotic,
            severity: c.severity,
            title: c.title,
            description: c.description,
            district: c.district,
            updatedAt: new Date(),
          },
          $addToSet: {
            affectedRecordIds: { $each: c.affectedRecordIds },
            farmIds: { $each: c.farmIds },
            species: { $each: c.species },
          },
        },
        { upsert: true }
      );
      if (res.upsertedCount > 0) alertsCreated++;
    }

    await SyncState.updateOne(
      { key: "livestockpro" },
      {
        $set: {
          lastCursor: cursor ?? undefined,
          lastSyncedAt: new Date(),
          lastRunAt: new Date(),
          lastRunStatus: "ok",
          lastRunError: undefined,
          recordsFetchedLastRun: totalFetched,
          alertsCreatedLastRun: alertsCreated,
        },
      },
      { upsert: true }
    );

    return { status: "ok", recordsFetched: totalFetched, alertsCreated };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[oneHealthSync] failed:", message);
    await SyncState.updateOne(
      { key: "livestockpro" },
      { $set: { lastRunAt: new Date(), lastRunStatus: "error", lastRunError: message } },
      { upsert: true }
    );
    return { status: "error", recordsFetched: 0, alertsCreated: 0, error: message };
  }
}
