import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/roleGuard";
import { connectOneHealthDB } from "@/lib/onehealthDb";
import { getRiskAlertModel } from "@/models/onehealth/RiskAlert";
import { getLivestockRecordModel } from "@/models/onehealth/LivestockRecord";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("admin");
    const conn = await connectOneHealthDB();
    const RiskAlert = getRiskAlertModel(conn);
    const LivestockRecord = getLivestockRecordModel(conn);

    const { id } = await params;
    const alert = await RiskAlert.findById(id).lean();
    if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const records = await LivestockRecord.find({ _id: { $in: alert.affectedRecordIds } })
      .sort({ recordedAt: -1 })
      .lean();

    return NextResponse.json({ alert, records });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[/api/onehealth/alerts/[id]] GET", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole("admin");
    const conn = await connectOneHealthDB();
    const RiskAlert = getRiskAlertModel(conn);

    const { id } = await params;
    const { status } = (await req.json()) as { status?: "open" | "reviewed" | "dismissed" };
    if (!status || !["open", "reviewed", "dismissed"].includes(status)) {
      return NextResponse.json({ error: "status must be open, reviewed, or dismissed" }, { status: 400 });
    }

    const alert = await RiskAlert.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          updatedAt: new Date(),
          reviewedBy: session.userId,
          reviewedAt: new Date(),
        },
      },
      { new: true }
    ).lean();

    if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ alert });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[/api/onehealth/alerts/[id]] PATCH", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
