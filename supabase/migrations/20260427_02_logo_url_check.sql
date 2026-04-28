-- Defense-in-depth: clients.logo_url must be HTTPS or null.
--
-- Currently only the service role can write to clients (Phase 3 RLS deny
-- policies block authenticated users). Risk today is low, but when a
-- client-facing settings UI ships in a future phase, the database will
-- already reject http:// values regardless of what the application code
-- does.
--
-- Application-layer CDN allowlist (e.g., only *.cloudfront.net,
-- *.googleusercontent.com) is a follow-up. This migration only enforces
-- protocol; that's the cheap win.
--
-- Pre-flight: this migration will fail if any existing clients row has
-- a non-HTTPS logo_url. Run this first to find offenders:
--
--   select id, slug, logo_url from public.clients
--   where logo_url is not null and logo_url !~ '^https://';
--
-- The constraint name is namespaced for easy rollback:
--   alter table public.clients drop constraint clients_logo_url_https;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'clients_logo_url_https'
      AND conrelid = 'public.clients'::regclass
  ) THEN
    ALTER TABLE public.clients
      ADD CONSTRAINT clients_logo_url_https
      CHECK (logo_url IS NULL OR logo_url ~ '^https://');
  END IF;
END $$;

COMMENT ON CONSTRAINT clients_logo_url_https ON public.clients IS
  'Defense in depth: rejects non-HTTPS logo URLs at the database layer regardless of what application code allows.';
