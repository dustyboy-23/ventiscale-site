-- Venti Scale Portal — Phase 2: Real multi-tenancy
--
-- Adds two tables:
--   clients       — the tenants (agencies + their customer brands)
--   client_users  — which auth.users can access which clients, in what role
--
-- RLS: a user can only SELECT rows they have a client_users row for.
-- The service role bypasses RLS for cron jobs + admin writes.
--
-- Run this in the Supabase SQL editor once. Safe to re-run (uses IF NOT
-- EXISTS / DROP POLICY IF EXISTS guards on everything).

-- ──────────────────────────────────────────────────────────
-- Tables
-- ──────────────────────────────────────────────────────────

create table if not exists public.clients (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  tagline      text,
  brand_color  text,
  logo_url     text,
  is_agency    boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.client_users (
  user_id    uuid not null references auth.users(id) on delete cascade,
  client_id  uuid not null references public.clients(id) on delete cascade,
  role       text not null check (role in ('owner','admin','viewer')),
  created_at timestamptz not null default now(),
  primary key (user_id, client_id)
);

create index if not exists client_users_user_id_idx on public.client_users(user_id);
create index if not exists client_users_client_id_idx on public.client_users(client_id);

-- ──────────────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────────────

alter table public.clients enable row level security;
alter table public.client_users enable row level security;

-- Users can SELECT any client they have a client_users row for.
drop policy if exists "users see their accessible clients" on public.clients;
create policy "users see their accessible clients"
  on public.clients
  for select
  using (
    id in (
      select client_id from public.client_users where user_id = auth.uid()
    )
  );

-- Users can SELECT their own client_users rows (so the app can list
-- which clients they have access to).
drop policy if exists "users see their own memberships" on public.client_users;
create policy "users see their own memberships"
  on public.client_users
  for select
  using (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies. All mutations go through the service
-- role for Phase 2 (admin writes via SQL or a future /admin route). We
-- can add user-level write policies in Phase 5 when the onboarding UI
-- lands.
