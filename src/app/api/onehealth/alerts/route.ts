import { NextResponse } from "next/server";
import { requireRole } from "@/lib/roleGuard";
import { connectOneHealthDB } from "@/lib/onehealthDb";
import { getRiskAlertModel } from "@/models/onehealth/RiskAlert";

export async function GET(req: Request) {
  try {
    await requireRole("admin");
    const conn = await connectOneHealthDB();
    const RiskAlert = getRiskAlertModel(conn);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = 20;

    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;
    if (severity && severity !== "all") filter.severity = severity;

    const [alerts, total] = await Promise.all([
      RiskAlert.find(filter)
        .sort({ detectedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      RiskAlert.countDocuments(filter),
    ]);

    return NextResponse.json({ alerts, total, page, limit });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[/api/onehealth/alerts]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
