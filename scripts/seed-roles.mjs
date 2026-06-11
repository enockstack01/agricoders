/**
 * One-time bootstrap script: sets roles in Clerk publicMetadata.
 *
 * Usage (from the logistackplan directory):
 *   node scripts/seed-roles.mjs
 *
 * Reads CLERK_SECRET_KEY from .env.local automatically.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env.local ──────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env.local");
try {
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {
  // env.local not found — rely on process.env being pre-populated
}

const SECRET_KEY = process.env.CLERK_SECRET_KEY;
if (!SECRET_KEY) {
  console.error("ERROR: CLERK_SECRET_KEY not found in .env.local or environment.");
  process.exit(1);
}

// ── Role assignments ─────────────────────────────────────────────────────────
const ASSIGNMENTS = [
  { email: "nshimiyimanaenock4@gmail.com", role: "super_admin" },
  { email: "enockstack@gmail.com",         role: "admin"       },
];

const BASE = "https://api.clerk.com/v1";
const headers = {
  Authorization: `Bearer ${SECRET_KEY}`,
  "Content-Type": "application/json",
};

async function clerkGet(path) {
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function clerkPatch(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function getUserByEmail(email) {
  // Clerk user list supports ?email_address=...
  const data = await clerkGet(`/users?email_address=${encodeURIComponent(email)}&limit=5`);
  const users = Array.isArray(data) ? data : (data.data ?? []);
  return users.find((u) =>
    u.email_addresses?.some((e) => e.email_address.toLowerCase() === email.toLowerCase())
  ) ?? null;
}

async function setRole(userId, role) {
  return clerkPatch(`/users/${userId}/metadata`, {
    public_metadata: { role },
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
for (const { email, role } of ASSIGNMENTS) {
  process.stdout.write(`Setting ${email} → ${role} … `);
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      console.log(`SKIPPED (user not found — they must sign up first)`);
      continue;
    }
    const currentRole = user.public_metadata?.role ?? "user";
    if (currentRole === role) {
      console.log(`already ${role}`);
      continue;
    }
    await setRole(user.id, role);
    console.log(`done (was: ${currentRole})`);
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
  }
}

console.log("\nDone. Roles take effect on next sign-in (Clerk token refresh).");
