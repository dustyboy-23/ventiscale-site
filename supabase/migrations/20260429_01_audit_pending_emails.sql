-- 20260429_01: queue audit emails for async send via local cron + gog gmail
--
-- Why: the audit form's transactional email layer was non-functional.
-- Switching to a queue-based path that sends from dustin@ventiscale.com
-- via the gog Gmail OAuth setup already authenticated on the cron host.
-- The route writes a fully-rendered email payload here; the cron worker
-- reads pending entries, sends, and clears them.
--
-- Schema:
--   pending_emails: jsonb keyed by email kind ("visitor" | "lead").
--     Each value is { from, to, reply_to, subject, html, text }.
--     Cron deletes the key on successful send and NULLs the column when
--     all keys are sent.
--   email_visitor_sent_at, email_lead_sent_at: timestamp of successful
--     send (also flips the existing _sent boolean in the same UPDATE).

ALTER TABLE audit_leads
  ADD COLUMN IF NOT EXISTS pending_emails jsonb,
  ADD COLUMN IF NOT EXISTS email_visitor_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_lead_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS audit_leads_pending_emails_idx
  ON audit_leads ((pending_emails IS NOT NULL))
  WHERE pending_emails IS NOT NULL;

COMMENT ON COLUMN audit_leads.pending_emails IS
  'JSONB keyed by email kind (visitor|lead). Each value is { from, to, reply_to, subject, html, text }. Drained by ops/audit-email-queue cron.';
