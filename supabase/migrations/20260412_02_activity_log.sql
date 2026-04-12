create table if not exists public.activity_log (
  id         bigserial primary key,
  client_id  uuid not null references public.clients(id) on delete cascade,
  type       text not null check (type in ('report','draft','campaign','post','system')),
  title      text not null,
  detail     text,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_client_idx on public.activity_log (client_id, created_at desc);
alter table public.activity_log enable row level security;

drop policy if exists "members see their client activity" on public.activity_log;
create policy "members see their client activity"
  on public.activity_log for select
  using (client_id in (
    select client_id from public.client_users where user_id = auth.uid()
  ));
