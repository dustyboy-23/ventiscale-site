-- Venti Scale Portal — Phase 3: Client metrics storage
--
-- One row per (client, period) holding the full KPI snapshot as JSONB.
-- The shape matches the existing ClientKpis type in lib/sg-data.ts so
-- portal-data can hand it straight to the dashboard components.
--
-- Periods we support today: '7d', '28d', '90d'. Add more by inserting.
--
-- A nightly cron (scripts/pull-sg-metrics.py) upserts fresh snapshots
-- for each client with integrations configured. No per-client schema
-- divergence — everything lives in the kpis JSONB.

create table if not exists public.client_metrics (
  client_id    uuid not null references public.clients(id) on delete cascade,
  period       text not null check (period in ('7d','28d','90d')),
  snapshot_at  timestamptz not null default now(),
  kpis         jsonb not null,
  primary key (client_id, period)
);

create index if not exists client_metrics_client_id_idx on public.client_metrics(client_id);

-- RLS: users can read metrics for any client they have a client_users
-- row for. Writes are service-role only (cron jobs + admin scripts).
alter table public.client_metrics enable row level security;

drop policy if exists "users see metrics for their clients" on public.client_metrics;
create policy "users see metrics for their clients"
  on public.client_metrics
  for select
  using (
    client_id in (
      select client_id from public.client_users where user_id = auth.uid()
    )
  );
