-- Persistent rate limiter table. Replaces the in-memory Map-based
-- buckets in app/api/audit/route.ts and app/actions/request-login.ts
-- which reset on every cold start, which on Vercel means a determined
-- attacker effectively had no limit.
--
-- One row per request hit, keyed by an arbitrary string (IP, email,
-- endpoint name). The server counts rows inside the window and inserts
-- a new row on each call. Rows older than the window are reaped
-- opportunistically on writes.

create table if not exists public.rate_limits (
  id bigserial primary key,
  key text not null,
  hit_at timestamptz not null default now()
);

create index if not exists rate_limits_key_hit_at_idx
  on public.rate_limits (key, hit_at desc);

alter table public.rate_limits enable row level security;

-- No policies = no access for the anon / authed user roles. The only
-- writer is the service role (used by route handlers), which bypasses
-- RLS entirely. Explicit denies for future-proofing in case someone
-- later adds a broad permissive policy.
drop policy if exists "no user reads to rate_limits" on public.rate_limits;
create policy "no user reads to rate_limits"
  on public.rate_limits for select using (false);

drop policy if exists "no user writes to rate_limits (insert)" on public.rate_limits;
create policy "no user writes to rate_limits (insert)"
  on public.rate_limits for insert with check (false);

drop policy if exists "no user writes to rate_limits (update)" on public.rate_limits;
create policy "no user writes to rate_limits (update)"
  on public.rate_limits for update using (false) with check (false);

drop policy if exists "no user writes to rate_limits (delete)" on public.rate_limits;
create policy "no user writes to rate_limits (delete)"
  on public.rate_limits for delete using (false);
