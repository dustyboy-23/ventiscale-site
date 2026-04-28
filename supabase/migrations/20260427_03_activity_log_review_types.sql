-- Expand activity_log.type to record content review actions.
--
-- The review server action (app/(portal)/content/actions.ts) writes one
-- activity_log row per approve/reject so the portal has a verifiable
-- record of who-decided-what. The original type CHECK constraint did not
-- include these values; this migration replaces the constraint with the
-- expanded set.
--
-- Idempotent: drops the old constraint by name before re-adding the new
-- one. Safe to re-run.

ALTER TABLE public.activity_log
  DROP CONSTRAINT IF EXISTS activity_log_type_check;

ALTER TABLE public.activity_log
  ADD CONSTRAINT activity_log_type_check
  CHECK (type IN (
    'report',
    'draft',
    'campaign',
    'post',
    'system',
    'content_approved',
    'content_rejected'
  ));

COMMENT ON CONSTRAINT activity_log_type_check ON public.activity_log IS
  'Whitelist of activity event types. Expand here when new event categories ship.';
