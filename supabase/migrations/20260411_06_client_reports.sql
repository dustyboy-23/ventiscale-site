-- Published reports per client. Rendered into the /reports tab of the portal.
-- html_body is the full standalone HTML document (iframe srcDoc on the viewer).
--
-- Writes are service-role only (the publish-report script). Clients can only
-- read rows where they have a membership in client_users.

create table if not exists public.client_reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  type text not null check (type in ('client', 'seo', 'baseline', 'internal')),
  title text not null,
  period_start date,
  period_end date,
  summary text,
  html_body text not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists client_reports_client_id_published_idx
  on public.client_reports (client_id, published_at desc);

alter table public.client_reports enable row level security;

-- Members of a client can read its reports
drop policy if exists "members can read client reports" on public.client_reports;
create policy "members can read client reports"
  on public.client_reports for select
  using (
    client_id in (
      select client_id from public.client_users where user_id = auth.uid()
    )
  );

-- Explicit deny on all writes from the authed user role. Service role
-- bypasses RLS entirely, which is how the publish-report script inserts.
drop policy if exists "client_reports_deny_insert" on public.client_reports;
create policy "client_reports_deny_insert"
  on public.client_reports for insert
  with check (false);

drop policy if exists "client_reports_deny_update" on public.client_reports;
create policy "client_reports_deny_update"
  on public.client_reports for update
  using (false);

drop policy if exists "client_reports_deny_delete" on public.client_reports;
create policy "client_reports_deny_delete"
  on public.client_reports for delete
  using (false);
