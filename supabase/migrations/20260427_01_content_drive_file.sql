-- Per-content-item Drive asset preview.
--
-- Each content_items row optionally points at one Google Drive file. The
-- portal renders that file's Drive preview iframe inline above the
-- approve/reject buttons so the client sees the asset (image/video/PDF)
-- as part of the review.
--
-- Drive itself enforces access: the file must be shared with the
-- reviewer's Google account. The portal stores nothing but the opaque
-- ID. No Drive API calls server-side, no service-account fetch, no
-- thumbnail caching. If the reviewer isn't signed into a Google account
-- with read access, Drive renders "request access" inside the iframe.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS guards re-runs.

ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS drive_file_id text;

COMMENT ON COLUMN public.content_items.drive_file_id IS
  'Google Drive file ID for the asset attached to this draft. Rendered as a preview iframe in the portal. Drive enforces access; this is just an opaque pointer.';
