import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RateLimit } from "@/models/RateLimit";

/**
 * Per-user rate limiting for AI usage.
 *
 * Counters live in MongoDB so the limits hold across serverless instances and restarts.
 * Each policy has several fixed windows (minute, hour, day). A request is counted against
 * every window, shortest first, and is refused as soon as one window is over its limit.
 * Admins and super admins get a higher allowance. Limits can be tuned with environment variables.
 */

export interface RateRule {
  /** Window length in seconds. */
  windowSec: number;
  limit: number;
  /** Used in the message shown to the user, for example "per minute". */
  unit: string;
}

export interface RatePolicy {
  name: string;
  /** What the limit protects, used in the message shown to the user. */
  subject: string;
  rules: RateRule[];
}

export interface RateResult {
  ok: boolean;
  /** Limit of the tightest window. */
  limit: number;
  /** Requests left in the tightest window. -1 when limiting was skipped. */
  remaining: number;
  /** Seconds until the window that blocked the request opens again. */
  retryAfterSec: number;
  /** Unix time in seconds when the tightest window resets. */
  resetAt: number;
  /** The rule that blocked the request. */
  blockedBy?: RateRule;
  policy: RatePolicy;
}

function envInt(name: string, fallback: number): number {
  const v = parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

/** Section by section AI assist in the plan form (one request per click). */
export const AI_ASSIST_POLICY: RatePolicy = {
  name: "ai-assist",
  subject: "AI assist",
  rules: [
    { windowSec: 60, limit: envInt("AI_ASSIST_PER_MINUTE", 6), unit: "per minute" },
    { windowSec: 3600, limit: envInt("AI_ASSIST_PER_HOUR", 40), unit: "per hour" },
    { windowSec: 86400, limit: envInt("AI_ASSIST_PER_DAY", 100), unit: "per day" },
  ],
};

/** Full business plan generation, which runs the AI narrative (the most expensive AI call). */
export const BUSINESS_PLAN_AI_POLICY: RatePolicy = {
  name: "business-plan-ai",
  subject: "AI business plan generation",
  rules: [
    { windowSec: 3600, limit: envInt("AI_PLAN_PER_HOUR", 6), unit: "per hour" },
    { windowSec: 86400, limit: envInt("AI_PLAN_PER_DAY", 20), unit: "per day" },
  ],
};

const STAFF_MULTIPLIER = envInt("AI_RATE_LIMIT_STAFF_MULTIPLIER", 5);

export function roleFromClaims(sessionClaims: unknown): string | undefined {
  const meta = (sessionClaims as { public_metadata?: { role?: string } } | null | undefined)?.public_metadata;
  return meta?.role;
}

async function bump(key: string, expiresAt: Date): Promise<number> {
  const update = { $inc: { count: 1 }, $setOnInsert: { expiresAt } };
  const opts = { upsert: true, new: true } as const;
  try {
    const doc = await RateLimit.findOneAndUpdate({ key }, update, opts);
    return doc.count as number;
  } catch (err) {
    // Two first requests can race to create the counter. The loser retries and increments.
    if ((err as { code?: number }).code === 11000) {
      const doc = await RateLimit.findOneAndUpdate({ key }, update, opts);
      return doc.count as number;
    }
    throw err;
  }
}

export async function checkRateLimit(userId: string, policy: RatePolicy, role?: string): Promise<RateResult> {
  const multiplier = role === "admin" || role === "super_admin" ? STAFF_MULTIPLIER : 1;
  const now = Date.now();
  const rules = [...policy.rules].sort((a, b) => a.windowSec - b.windowSec);

  let tightest: { remaining: number; limit: number; resetAt: number } | null = null;

  try {
    await connectDB();
    for (const rule of rules) {
      const windowMs = rule.windowSec * 1000;
      const windowStart = Math.floor(now / windowMs) * windowMs;
      const windowEnd = windowStart + windowMs;
      const limit = rule.limit * multiplier;
      const key = `${policy.name}:${userId}:${rule.windowSec}:${windowStart}`;

      const count = await bump(key, new Date(windowEnd + 60_000));
      const remaining = Math.max(0, limit - count);

      if (count > limit) {
        return {
          ok: false,
          limit,
          remaining: 0,
          retryAfterSec: Math.max(1, Math.ceil((windowEnd - now) / 1000)),
          resetAt: Math.ceil(windowEnd / 1000),
          blockedBy: { ...rule, limit },
          policy,
        };
      }
      if (!tightest || remaining < tightest.remaining) {
        tightest = { remaining, limit, resetAt: Math.ceil(windowEnd / 1000) };
      }
    }
  } catch (err) {
    // If the counter store is unreachable, let the request through rather than block every user.
    // Credits and authentication still apply. The failure is logged so it can be fixed.
    console.error("[rateLimit] check failed, allowing request", err);
    return { ok: true, limit: 0, remaining: -1, retryAfterSec: 0, resetAt: 0, policy };
  }

  return {
    ok: true,
    limit: tightest?.limit ?? 0,
    remaining: tightest?.remaining ?? -1,
    retryAfterSec: 0,
    resetAt: tightest?.resetAt ?? 0,
    policy,
  };
}

function formatWait(sec: number): string {
  if (sec < 90) return `${sec} second${sec === 1 ? "" : "s"}`;
  const min = Math.ceil(sec / 60);
  if (min < 90) return `${min} minutes`;
  const hours = Math.ceil(min / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

export function rateLimitHeaders(r: RateResult): Record<string, string> {
  if (r.remaining < 0) return {};
  return {
    "X-RateLimit-Limit": String(r.limit),
    "X-RateLimit-Remaining": String(r.remaining),
    "X-RateLimit-Reset": String(r.resetAt),
  };
}

/** The 429 response sent when a user is over a limit. */
export function rateLimitResponse(r: RateResult): NextResponse {
  const rule = r.blockedBy;
  const message =
    `You have reached the ${r.policy.subject} limit` +
    (rule ? ` of ${rule.limit} ${rule.limit === 1 ? "request" : "requests"} ${rule.unit}` : "") +
    `. Please try again in ${formatWait(r.retryAfterSec)}.`;
  return NextResponse.json(
    { error: "RATE_LIMITED", message, retryAfter: r.retryAfterSec },
    { status: 429, headers: { "Retry-After": String(r.retryAfterSec), ...rateLimitHeaders(r) } }
  );
}
