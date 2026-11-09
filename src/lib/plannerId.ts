import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { PlannerIdModel } from "@/models/PlannerId";

/*
 * Planner IDs: a short public ID for every user, the word "Planner" followed by
 * 10 digits (for example Planner4829173650), safe to read out on the phone or
 * share with an admin instead of the long Clerk sign in ID.
 *
 * The digits are an encrypted form of the user's Clerk ID: an HMAC-SHA256 of the
 * ID under a server side secret (PLANNER_ID_SECRET, else CLERK_SECRET_KEY), the
 * first 8 bytes read as a number and folded into 1000000000 to 9999999999 (so it
 * never starts with 0). Without the secret nobody can work out a Planner ID from
 * a Clerk ID, or the other way round. Each ID is saved the first time and the
 * saved one is always used after that, so an ID never changes. If two users ever
 * landed on the same number, the second tries the hash of "<id>:1", "<id>:2" and
 * so on; the unique _id makes sure no two users can hold one ID.
 */

export const PLANNER_PREFIX = "Planner";
export const PLANNER_ID_RE = /^Planner\d{10}$/;

const SPAN = BigInt(9_000_000_000);
const FLOOR = BigInt(1_000_000_000);

const secret = () => process.env.PLANNER_ID_SECRET || process.env.CLERK_SECRET_KEY || "";

export function candidate(userId: string, attempt = 0): string {
  const input = attempt ? `${userId}:${attempt}` : userId;
  const key = secret();
  const hash = key
    ? crypto.createHmac("sha256", key).update(input).digest()
    : crypto.createHash("sha256").update(input).digest();
  return `${PLANNER_PREFIX}${(hash.readBigUInt64BE(0) % SPAN + FLOOR).toString()}`;
}

/** The user's Planner ID, created the first time it is asked for. */
export async function ensurePlannerId(userId: string): Promise<string> {
  await connectDB();
  const found = await PlannerIdModel.findOne({ userId }).lean<{ _id: string }>();
  if (found) return found._id;
  for (let attempt = 0; attempt < 50; attempt++) {
    const id = candidate(userId, attempt);
    try {
      await PlannerIdModel.create({ _id: id, userId });
      return id;
    } catch (err) {
      if ((err as { code?: number }).code !== 11000) throw err;
      // taken: by this same user (a parallel request won), or by someone else
      const mine = await PlannerIdModel.findOne({ userId }).lean<{ _id: string }>();
      if (mine) return mine._id;
    }
  }
  throw new Error("Could not create a Planner ID.");
}

/** Planner IDs for many users at once (admin lists), creating missing ones. */
export async function plannerIdsFor(userIds: string[]): Promise<Record<string, string>> {
  await connectDB();
  const list = [...new Set(userIds.filter(Boolean))];
  const rows = await PlannerIdModel.find({ userId: { $in: list } }).lean<{ _id: string; userId: string }[]>();
  const out: Record<string, string> = Object.fromEntries(rows.map((r) => [r.userId, r._id]));
  for (const id of list) if (!out[id]) out[id] = await ensurePlannerId(id);
  return out;
}

/** Accepts a Planner ID or a Clerk ID and returns the Clerk ID (admin tools). */
export async function resolveUserId(idOrPlannerId: string): Promise<string | null> {
  const value = idOrPlannerId.trim();
  if (!PLANNER_ID_RE.test(value)) return value || null;
  await connectDB();
  const row = await PlannerIdModel.findById(value).lean<{ userId: string }>();
  return row ? row.userId : null;
}
