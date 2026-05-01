-- Expand content_items for client review workflow
ALTER TABLE public.content_items
  DROP CONSTRAINT IF EXISTS content_items_status_check;

ALTER TABLE public.content_items
  ADD CONSTRAINT content_items_status_check
  CHECK (status IN ('draft','scheduled','approved','rejected','published'));

ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewer_notes text;

-- Allow authenticated users to update their own client's content items
drop policy if exists "members update their client content" on public.content_items;
create policy "members update their client content"
  on public.content_items for update
  using (client_id in (
    select client_id from public.client_users where user_id = auth.uid()
  ))
  with check (client_id in (
    select client_id from public.client_users where user_id = auth.uid()
  ));
