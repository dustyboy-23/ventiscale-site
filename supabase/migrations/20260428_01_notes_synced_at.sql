-- Track when reviewer notes were last appended to the Drive Revisions doc.
--
-- Without this, the sweep doesn't know which notes are new since the
-- last run, so we'd either spam-append every cron tick or miss notes
-- that came in between runs. The sweep compares reviewed_at against
-- notes_synced_at to decide what to append, then writes notes_synced_at
-- = reviewed_at after a successful append.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS. Safe to re-run.

ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS notes_synced_at timestamptz;

COMMENT ON COLUMN public.content_items.notes_synced_at IS
  'Last time reviewer_notes were appended to the brand''s Drive Revisions doc. Null = never synced. Compared against reviewed_at to decide what is new.';
