import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export function classifyMongoError(err: unknown): "CLUSTER_PAUSED" | "IP_BLOCKED" | "AUTH_FAILED" | "NETWORK" | "UNKNOWN" {
  const msg = err instanceof Error ? err.message : String(err);
  const reason = (err as { reason?: { servers?: Record<string, { error?: { beforeHandshake?: boolean; message?: string } }> } }).reason;

  if (reason?.servers) {
    const serverEntries = Object.values(reason.servers);
    const anyBeforeHandshake = serverEntries.some((s) => s?.error?.beforeHandshake === true);
    if (anyBeforeHandshake) return "IP_BLOCKED";

    // Check server error messages for timeout/network vs paused
    const serverMsgs = serverEntries.map((s) => s?.error?.message ?? "").join(" ");
    if (serverMsgs.includes("ETIMEDOUT") || serverMsgs.includes("ECONNREFUSED")) return "NETWORK";
    if (serverMsgs.includes("ReplicaSetNoPrimary") || serverMsgs.includes("paused")) return "CLUSTER_PAUSED";
  }

  if (msg.includes("Authentication failed") || msg.includes("SCRAM")) return "AUTH_FAILED";
  if (msg.includes("IP") || msg.includes("whitelist") || msg.includes("beforeHandshake")) return "IP_BLOCKED";
  if (msg.includes("ECONNREFUSED") || msg.includes("ETIMEDOUT") || msg.includes("timed out")) return "NETWORK";
  if (msg.includes("ReplicaSetNoPrimary") || msg.includes("paused")) return "CLUSTER_PAUSED";
  return "UNKNOWN";
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
      })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}
