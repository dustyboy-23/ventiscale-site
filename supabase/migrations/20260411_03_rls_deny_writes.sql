-- Venti Scale Portal — Phase 3: Explicit RLS write denials
--
-- Phase 2 relied on the *absence* of write policies to keep users from
-- mutating clients / client_users / client_metrics. Postgres RLS does
-- enforce "no policy = no access", so this is technically safe — but
-- an implicit deny is easy to regress (someone later adds a permissive
-- update policy for one column and forgets the rest).
--
-- These explicit false policies make the intent load-bearing: the only
-- path that can write to these tables is the service role, which
-- bypasses RLS entirely. Every other write — even from a future admin
-- UI run as the logged-in user — will be blocked here, forcing the
-- author to add a scoped policy alongside the feature.

-- clients ─────────────────────────────────────────────────────
drop policy if exists "no user writes to clients (insert)" on public.clients;
create policy "no user writes to clients (insert)"
  on public.clients for insert with check (false);

drop policy if exists "no user writes to clients (update)" on public.clients;
create policy "no user writes to clients (update)"
  on public.clients for update using (false) with check (false);

drop policy if exists "no user writes to clients (delete)" on public.clients;
create policy "no user writes to clients (delete)"
  on public.clients for delete using (false);

-- client_users ────────────────────────────────────────────────
drop policy if exists "no user writes to client_users (insert)" on public.client_users;
create policy "no user writes to client_users (insert)"
  on public.client_users for insert with check (false);

drop policy if exists "no user writes to client_users (update)" on public.client_users;
create policy "no user writes to client_users (update)"
  on public.client_users for update using (false) with check (false);

drop policy if exists "no user writes to client_users (delete)" on public.client_users;
create policy "no user writes to client_users (delete)"
  on public.client_users for delete using (false);

-- client_metrics ──────────────────────────────────────────────
drop policy if exists "no user writes to client_metrics (insert)" on public.client_metrics;
create policy "no user writes to client_metrics (insert)"
  on public.client_metrics for insert with check (false);

drop policy if exists "no user writes to client_metrics (update)" on public.client_metrics;
create policy "no user writes to client_metrics (update)"
  on public.client_metrics for update using (false) with check (false);

drop policy if exists "no user writes to client_metrics (delete)" on public.client_metrics;
create policy "no user writes to client_metrics (delete)"
  on public.client_metrics for delete using (false);
