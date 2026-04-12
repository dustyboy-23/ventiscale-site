create table if not exists public.content_items (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.clients(id) on delete cascade,
  platform     text not null check (platform in ('facebook','linkedin','blog','instagram','other')),
  title        text not null,
  body         text,
  status       text not null check (status in ('draft','scheduled','published')),
  scheduled_at timestamptz,
  published_at timestamptz,
  external_id  text,
  created_at   timestamptz not null default now()
);

create index if not exists content_items_client_idx on public.content_items (client_id, created_at desc);
alter table public.content_items enable row level security;

drop policy if exists "members see their client content" on public.content_items;
create policy "members see their client content"
  on public.content_items for select
  using (client_id in (
    select client_id from public.client_users where user_id = auth.uid()
  ));
