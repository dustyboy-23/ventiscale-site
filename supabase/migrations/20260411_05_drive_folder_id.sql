-- Store the Google Drive folder ID for each client. When set, the portal
-- Files tab embeds that folder directly. Admin-only writes (no RLS policy
-- for INSERT/UPDATE/DELETE = service role only).

alter table public.clients
  add column if not exists drive_folder_id text;

comment on column public.clients.drive_folder_id is
  'Google Drive folder ID for the client workspace. Shown in /files. Null = no folder yet.';
