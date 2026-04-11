import { createAdminClient } from "@/lib/supabase/admin";

// Persistent rate limiter backed by the rate_limits Supabase table.
// Replaces the old per-process in-memory Map, which reset every cold
// start and gave attackers a trivial bypass on Vercel.
//
// Usage:
//   const ok = await checkRateLimit("audit:" + ip, 3, 10 * 60 * 1000);
//   if (!ok) return 429;
//
// Semantics: counts rows with matching key inserted within `windowMs`.
// If under the limit, writes a new row and returns true. Fails open
// (returns true) if the admin client is unavailable — we'd rather let
// a request through than 503 every caller during a Supabase outage.

export async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<boolean> {
  const db = createAdminClient();
  if (!db) return true;

  const cutoffIso = new Date(Date.now() - windowMs).toISOString();

  const { count, error: countErr } = await db
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("key", key)
    .gte("hit_at", cutoffIso);

  if (countErr) {
    console.error("[rate-limit] count failed", countErr.message);
    return true;
  }

  if ((count ?? 0) >= max) {
    return false;
  }

  const { error: insertErr } = await db.from("rate_limits").insert({ key });
  if (insertErr) {
    console.error("[rate-limit] insert failed", insertErr.message);
  }

  // Opportunistic cleanup: 1% of writes sweep rows older than 24h so the
  // table doesn't grow without bound. A persistent cron would be cleaner
  // but this avoids adding infra for a table that turns over fast.
  if (Math.random() < 0.01) {
    const reapCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await db.from("rate_limits").delete().lt("hit_at", reapCutoff);
  }

  return true;
}
