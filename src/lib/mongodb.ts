import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

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
  const reason = (err as { reason?: { servers?: Record<string, { error?: { beforeHandshake?: boolean } }> } }).reason;

  // Check beforeHandshake across all servers
  if (reason?.servers) {
    const serverEntries = Object.values(reason.servers);
    const anyBeforeHandshake = serverEntries.some((s) => s?.error?.beforeHandshake === true);
    const allUnknown = serverEntries.every((s) => (s as { type?: string }).type === "Unknown");
    if (anyBeforeHandshake) return "IP_BLOCKED";
    if (allUnknown && !anyBeforeHandshake) return "CLUSTER_PAUSED";
  }

  if (msg.includes("Authentication failed") || msg.includes("SCRAM")) return "AUTH_FAILED";
  if (msg.includes("IP") || msg.includes("whitelist") || msg.includes("beforeHandshake")) return "IP_BLOCKED";
  if (msg.includes("ECONNREFUSED") || msg.includes("ETIMEDOUT")) return "NETWORK";
  return "CLUSTER_PAUSED"; // Most common cause of ReplicaSetNoPrimary on free tier
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
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
