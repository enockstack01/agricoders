import { NextResponse } from "next/server";
import { requireRole } from "@/lib/roleGuard";
import { connectOneHealthDB } from "@/lib/onehealthDb";
import { getRiskAlertModel } from "@/models/onehealth/RiskAlert";
import { getLivestockRecordModel } from "@/models/onehealth/LivestockRecord";
import { getSyncStateModel } from "@/models/onehealth/SyncState";

export async function GET() {
  try {
    await requireRole("admin");
    const conn = await connectOneHealthDB();
    const RiskAlert = getRiskAlertModel(conn);
    const LivestockRecord = getLivestockRecordModel(conn);
    const SyncState = getSyncStateModel(conn);

    const [bySeverity, openCount, zoonoticOpenCount, totalRecords, syncState] = await Promise.all([
      RiskAlert.aggregate([
        { $match: { status: "open" } },
        { $group: { _id: "$severity", count: { $sum: 1 } } },
      ]),
      RiskAlert.countDocuments({ status: "open" }),
      RiskAlert.countDocuments({ status: "open", zoonotic: true }),
      LivestockRecord.countDocuments({}),
      SyncState.findOne({ key: "livestockpro" }).lean(),
    ]);

    const severityCounts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const row of bySeverity as { _id: string; count: number }[]) {
      severityCounts[row._id] = row.count;
    }

    return NextResponse.json({
      openAlerts: openCount,
      zoonoticOpenAlerts: zoonoticOpenCount,
      severityCounts,
      totalRecordsSynced: totalRecords,
      sync: {
        status: syncState?.lastRunStatus ?? "not_configured",
        lastSyncedAt: syncState?.lastSyncedAt ?? null,
        lastRunAt: syncState?.lastRunAt ?? null,
        lastRunError: syncState?.lastRunError ?? null,
        recordsFetchedLastRun: syncState?.recordsFetchedLastRun ?? 0,
        alertsCreatedLastRun: syncState?.alertsCreatedLastRun ?? 0,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[/api/onehealth/summary]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
