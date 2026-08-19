import type { Types } from "mongoose";
import type { ILivestockRecord } from "@/models/onehealth/LivestockRecord";
import type { RiskAlertType, RiskSeverity } from "@/models/onehealth/RiskAlert";

export interface AlertCandidate {
  alertKey: string;
  type: RiskAlertType;
  disease?: string;
  zoonotic: boolean;
  severity: RiskSeverity;
  title: string;
  description: string;
  affectedRecordIds: Types.ObjectId[];
  farmIds: string[];
  species: string[];
  district?: string;
  detectedAt: Date;
}

type RecordWithId = ILivestockRecord & { _id: Types.ObjectId };

/**
 * Priority One Health watchlist. `zoonotic` marks diseases known to transmit between
 * animals and humans; the rest are major transboundary/economic livestock diseases that
 * still warrant a One Health response (biosecurity, trade, food security). Not exhaustive —
 * intended as a sensible starting point to refine with real veterinary input.
 */
const WATCHLIST: { disease: string; keywords: string[]; zoonotic: boolean; severity: RiskSeverity }[] = [
  { disease: "Anthrax", keywords: ["anthrax", "bacillus anthracis"], zoonotic: true, severity: "critical" },
  { disease: "Rabies", keywords: ["rabies", "rabid"], zoonotic: true, severity: "critical" },
  { disease: "Highly Pathogenic Avian Influenza", keywords: ["avian influenza", "bird flu", "h5n1", "h5n8", "hpai"], zoonotic: true, severity: "critical" },
  { disease: "Rift Valley Fever", keywords: ["rift valley fever", "rvf"], zoonotic: true, severity: "critical" },
  { disease: "Brucellosis", keywords: ["brucellosis", "brucella"], zoonotic: true, severity: "high" },
  { disease: "Bovine Tuberculosis", keywords: ["bovine tuberculosis", "bovine tb", "mycobacterium bovis"], zoonotic: true, severity: "high" },
  { disease: "Q Fever", keywords: ["q fever", "coxiella"], zoonotic: true, severity: "high" },
  { disease: "Leptospirosis", keywords: ["leptospirosis", "leptospira"], zoonotic: true, severity: "high" },
  { disease: "Trypanosomiasis", keywords: ["trypanosomiasis", "nagana", "sleeping sickness"], zoonotic: true, severity: "medium" },
  { disease: "Foot-and-Mouth Disease", keywords: ["foot-and-mouth", "foot and mouth", "fmd"], zoonotic: false, severity: "high" },
  { disease: "Peste des Petits Ruminants", keywords: ["peste des petits ruminants", "ppr", "goat plague", "sheep plague"], zoonotic: false, severity: "high" },
  { disease: "African Swine Fever", keywords: ["african swine fever", "asf"], zoonotic: false, severity: "high" },
  { disease: "Newcastle Disease", keywords: ["newcastle disease"], zoonotic: false, severity: "medium" },
  { disease: "Lumpy Skin Disease", keywords: ["lumpy skin disease"], zoonotic: false, severity: "medium" },
  { disease: "Contagious Bovine Pleuropneumonia", keywords: ["contagious bovine pleuropneumonia", "cbpp"], zoonotic: false, severity: "medium" },
];

const MORTALITY_WINDOW_DAYS = 7;
const MORTALITY_THRESHOLD = 3;
const CLUSTER_WINDOW_DAYS = 14;
const CLUSTER_FARM_THRESHOLD = 3;
const MIN_SYMPTOM_LEN = 4; // skip trivially short/noisy symptom tokens

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${week}`;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function severityRank(s: RiskSeverity): number {
  return { low: 0, medium: 1, high: 2, critical: 3 }[s];
}

function bumpSeverity(base: RiskSeverity, extraCount: number): RiskSeverity {
  const order: RiskSeverity[] = ["low", "medium", "high", "critical"];
  const idx = Math.min(order.length - 1, severityRank(base) + Math.floor(extraCount / 3));
  return order[idx];
}

export function evaluateOneHealthRisks(records: RecordWithId[]): AlertCandidate[] {
  const candidates = new Map<string, AlertCandidate>();

  const dedupeIds = (ids: Types.ObjectId[]): Types.ObjectId[] => {
    const seen = new Map<string, Types.ObjectId>();
    for (const id of ids) seen.set(id.toString(), id);
    return [...seen.values()];
  };

  const upsert = (c: AlertCandidate) => {
    const existing = candidates.get(c.alertKey);
    if (!existing) {
      candidates.set(c.alertKey, c);
      return;
    }
    existing.affectedRecordIds = dedupeIds([...existing.affectedRecordIds, ...c.affectedRecordIds]);
    existing.farmIds = [...new Set([...existing.farmIds, ...c.farmIds])];
    existing.species = [...new Set([...existing.species, ...c.species])];
    if (severityRank(c.severity) > severityRank(existing.severity)) existing.severity = c.severity;
    if (c.detectedAt > existing.detectedAt) existing.detectedAt = c.detectedAt;
  };

  // 1) Watchlist keyword matches
  for (const rec of records) {
    const haystack = `${rec.diagnosis ?? ""} ${(rec.symptoms ?? []).join(" ")}`.toLowerCase();
    if (!haystack.trim()) continue;
    for (const entry of WATCHLIST) {
      if (!entry.keywords.some((k) => haystack.includes(k))) continue;
      const week = isoWeekKey(rec.recordedAt);
      const farmId = rec.farmId ?? "unknown-farm";
      upsert({
        alertKey: `zoonotic:${slug(entry.disease)}:${farmId}:${week}`,
        type: "zoonotic_watchlist",
        disease: entry.disease,
        zoonotic: entry.zoonotic,
        severity: entry.severity,
        title: `${entry.disease} suspected — ${rec.farmName ?? farmId}`,
        description: `${entry.disease}${entry.zoonotic ? " (zoonotic)" : ""} matched on a ${rec.species} ${rec.eventType.replace("_", " ")} record${rec.district ? ` in ${rec.district}` : ""}.`,
        affectedRecordIds: [rec._id],
        farmIds: [farmId],
        species: [rec.species],
        district: rec.district,
        detectedAt: rec.recordedAt,
      });
    }
  }

  // 2) Mortality clustering per farm within a trailing window
  const mortalityCutoff = daysAgo(MORTALITY_WINDOW_DAYS);
  const byFarm = new Map<string, RecordWithId[]>();
  for (const rec of records) {
    if (!rec.mortality && rec.eventType !== "mortality") continue;
    if (rec.recordedAt < mortalityCutoff) continue;
    const farmId = rec.farmId ?? "unknown-farm";
    if (!byFarm.has(farmId)) byFarm.set(farmId, []);
    byFarm.get(farmId)!.push(rec);
  }
  for (const [farmId, recs] of byFarm) {
    if (recs.length < MORTALITY_THRESHOLD) continue;
    const week = isoWeekKey(recs[0].recordedAt);
    const latest = recs.reduce((a, b) => (b.recordedAt > a.recordedAt ? b : a));
    upsert({
      alertKey: `mortality:${farmId}:${week}`,
      type: "mortality_spike",
      zoonotic: false,
      severity: bumpSeverity("medium", recs.length - MORTALITY_THRESHOLD),
      title: `Mortality spike — ${latest.farmName ?? farmId}`,
      description: `${recs.length} mortality events recorded at this farm in the last ${MORTALITY_WINDOW_DAYS} days, across ${new Set(recs.map((r) => r.species)).size} species.`,
      affectedRecordIds: recs.map((r) => r._id),
      farmIds: [farmId],
      species: [...new Set(recs.map((r) => r.species))],
      district: latest.district,
      detectedAt: latest.recordedAt,
    });
  }

  // 3) Symptom clustering across farms within a district
  const clusterCutoff = daysAgo(CLUSTER_WINDOW_DAYS);
  const byDistrictSymptom = new Map<string, RecordWithId[]>();
  for (const rec of records) {
    if (rec.recordedAt < clusterCutoff) continue;
    if (!rec.symptoms?.length) continue;
    const district = rec.district ?? "unknown-district";
    for (const raw of rec.symptoms) {
      const symptom = raw.toLowerCase().trim();
      if (symptom.length < MIN_SYMPTOM_LEN) continue;
      const key = `${district}::${symptom}`;
      if (!byDistrictSymptom.has(key)) byDistrictSymptom.set(key, []);
      byDistrictSymptom.get(key)!.push(rec);
    }
  }
  for (const [key, recs] of byDistrictSymptom) {
    const farmIds = new Set(recs.map((r) => r.farmId ?? "unknown-farm"));
    if (farmIds.size < CLUSTER_FARM_THRESHOLD) continue;
    const [district, symptom] = key.split("::");
    const week = isoWeekKey(recs[0].recordedAt);
    const latest = recs.reduce((a, b) => (b.recordedAt > a.recordedAt ? b : a));
    upsert({
      alertKey: `cluster:${slug(district)}:${slug(symptom)}:${week}`,
      type: "symptom_cluster",
      zoonotic: false,
      severity: bumpSeverity("medium", farmIds.size - CLUSTER_FARM_THRESHOLD),
      title: `Possible outbreak cluster — "${symptom}" in ${district}`,
      description: `"${symptom}" reported across ${farmIds.size} different farms in ${district} within the last ${CLUSTER_WINDOW_DAYS} days — a pattern consistent with an emerging shared exposure or spreading disease.`,
      affectedRecordIds: recs.map((r) => r._id),
      farmIds: [...farmIds],
      species: [...new Set(recs.map((r) => r.species))],
      district,
      detectedAt: latest.recordedAt,
    });
  }

  return [...candidates.values()];
}
