-- Add a comments array to content_items.
--
-- Each row holds 0 to N "first comment" / story-reply suggestions that
-- the portal renders below the image on the review card. These are the
-- short follow-ups a poster drops underneath a Facebook post (link to
-- booking, sizing FYI, urgency nudge, etc.) and they get reviewed
-- alongside the main caption.
--
-- Stored as jsonb of strings. Portal maps to a string[] in the type
-- (lib/sg-data.ts ContentDraft.comments).
--
-- Idempotent.

ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS comments jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.content_items.comments IS
  'First-comment / story-reply suggestions for the draft. Rendered below the image in the portal review card. JSONB array of strings.';
