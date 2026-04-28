-- Per-post engagement metrics for published content_items.
--
-- metrics: free-form JSONB so each platform can store whatever shape
--   makes sense (FB Graph insights vs LI engagement counts).
--   Typical keys: likes, comments, shares, reach, impressions,
--   video_views (videos), clicks (LI), engagement_rate.
-- metrics_synced_at: when sg-pull-post-metrics.py last refreshed
--   this row. Cron uses this to skip rows synced recently.
--
-- Idempotent.

ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS metrics_synced_at timestamptz;

COMMENT ON COLUMN public.content_items.metrics IS
  'Per-post engagement metrics. Pulled from FB Graph + LI API after publish.';
COMMENT ON COLUMN public.content_items.metrics_synced_at IS
  'Last time the metrics jsonb was refreshed.';
