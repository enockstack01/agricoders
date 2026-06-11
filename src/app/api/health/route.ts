import { NextResponse } from "next/server";
import { connectDB, classifyMongoError } from "@/lib/mongodb";

export const maxDuration = 15;

export async function GET() {
  const checks: Record<string, { ok: boolean; message: string; latencyMs?: number }> = {};

  // MongoDB check
  const mongoStart = Date.now();
  try {
    await connectDB();
    checks.mongodb = { ok: true, message: "Connected", latencyMs: Date.now() - mongoStart };
  } catch (err) {
    const code = classifyMongoError(err);
    const messages: Record<string, string> = {
      CLUSTER_PAUSED: "Cluster is paused. Resume it at cloud.mongodb.com.",
      IP_BLOCKED: "Your IP is not whitelisted on Atlas Network Access.",
      AUTH_FAILED: "Authentication failed. Check MONGODB_URI credentials.",
      NETWORK: "Network unreachable. Check firewall/internet.",
      UNKNOWN: "Connection failed. Check Atlas cluster status.",
    };
    checks.mongodb = { ok: false, message: messages[code] ?? "Unknown error", latencyMs: Date.now() - mongoStart };
  }

  // Env check
  checks.env = {
    ok: !!(process.env.MONGODB_URI && process.env.CLERK_SECRET_KEY && process.env.ANTHROPIC_API_KEY),
    message: [
      process.env.MONGODB_URI ? null : "MONGODB_URI missing",
      process.env.CLERK_SECRET_KEY ? null : "CLERK_SECRET_KEY missing",
      process.env.ANTHROPIC_API_KEY ? null : "ANTHROPIC_API_KEY missing",
    ].filter(Boolean).join(", ") || "All required env vars set",
  };

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    { status: allOk ? "ok" : "degraded", checks, timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  );
}
