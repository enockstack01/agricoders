import mongoose from "mongoose";

interface OneHealthCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var onehealthMongoose: OneHealthCache | undefined;
}

const cached: OneHealthCache = global.onehealthMongoose ?? { conn: null, promise: null };
global.onehealthMongoose = cached;

/** Separate MongoDB cluster dedicated to the One Health intelligence dashboard's own data
 *  (synced livestock records, computed risk alerts, sync state) — kept apart from the
 *  primary Logistack Plan database. */
export async function connectOneHealthDB(): Promise<mongoose.Connection> {
  const uri = process.env.LIVESTOCK_MONGODB_URI;
  if (!uri) {
    throw new Error("LIVESTOCK_MONGODB_URI is not defined");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .createConnection(uri, {
        dbName: "onehealth",
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
      })
      .asPromise()
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
