const SYNC_INTERVAL_MS = 3 * 60 * 1000; // every 3 minutes

declare global {
  // eslint-disable-next-line no-var
  var __oneHealthPollerStarted: boolean | undefined;
}

export async function register() {
  // Only in the long-running Node server — not the edge runtime, and not more than once
  // (Next.js can call register() multiple times across module reloads in dev).
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (global.__oneHealthPollerStarted) return;
  global.__oneHealthPollerStarted = true;

  const { runOneHealthSync } = await import("@/lib/oneHealthSync");

  const tick = async () => {
    try {
      await runOneHealthSync();
    } catch (err) {
      console.error("[oneHealthPoller] unexpected error:", err);
    }
  };

  setInterval(tick, SYNC_INTERVAL_MS);
  // Kick off an initial sync shortly after boot rather than waiting a full interval.
  setTimeout(tick, 10_000);
}
