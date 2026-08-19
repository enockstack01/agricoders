import { NextResponse } from "next/server";
import { requireRole } from "@/lib/roleGuard";
import { runOneHealthSync } from "@/lib/oneHealthSync";

export const maxDuration = 60;

export async function POST() {
  try {
    await requireRole("admin");
    const summary = await runOneHealthSync();
    return NextResponse.json(summary);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[/api/onehealth/sync]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
