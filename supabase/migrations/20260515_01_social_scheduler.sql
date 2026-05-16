-- Migration: Social Scheduler — internal post scheduling
-- Created: 2026-05-15
-- Status: DRAFT — apply via Supabase BRANCH first, validate, merge to main
-- Plan: ~/.claude/plans/you-might-need-to-enumerated-nest.md
--
-- What this enables:
--   - In-portal scheduling of social posts (TT/IG/FB/LI) for our clients
--   - Replaces Postiz Cloud (cancel before 2026-06-14 renewal)
--   - Worker on Dustin-PC polls scheduled_posts every minute + dispatches
--     to the existing platform clients in services/tiktok-poster/src/*.py
--
-- Reuses existing patterns from 20260411_01_multitenancy.sql + 20260509_01_agency_layer.sql:
--   - RLS enabled by default
--   - Reader policies via subquery membership lookup (client_users + team layer)
--   - Service role bypasses for cron/server-side mutations
--   - Explicit deny policies on user-side INSERT/UPDATE/DELETE
--
-- Tables:
--   social_accounts   — per-client, per-platform connected accounts
--   scheduled_posts   — the queue (caption + media + platforms + when)
--   post_attempts     — per-platform delivery history (one row per platform per post)

BEGIN;

------------------------------------------------------------
-- 1. social_accounts: per-client, per-platform OAuth account refs
------------------------------------------------------------
-- Credentials themselves live in ~/.secure/<client>-<platform>.env on Dustin-PC.
-- This table only stores the POINTER (credentials_env_path) + display metadata.
-- Phase 1 OAuth bootstrap is CLI-driven; the UI consumes already-authorized rows.

CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'facebook', 'linkedin')),
    account_handle TEXT NOT NULL,        -- e.g. "@cuddle.box2" or "Cuddle Box FB Page"
    account_id TEXT NOT NULL,            -- platform-side ID (TT open_id, FB Page ID, IG user ID, LI URN)
    credentials_env_path TEXT NOT NULL,  -- e.g. "~/.secure/cuddle-box-tiktok.env"
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disabled')),
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (client_id, platform, account_id)
);

CREATE INDEX IF NOT EXISTS social_accounts_client_id_idx ON social_accounts(client_id);
CREATE INDEX IF NOT EXISTS social_accounts_status_idx ON social_accounts(status) WHERE status = 'active';

------------------------------------------------------------
-- 2. scheduled_posts: the queue
------------------------------------------------------------
-- One row per planned post (which may fan out to multiple platforms).
-- media_r2_keys: array of R2 object keys; worker generates signed URLs at dispatch time.
-- platforms: subset of the platforms this post should fire on.
-- status transitions: queued → processing → (success | partial | failed)
--                     queued → canceled (user action before fire time)
-- result: aggregate snapshot of per-platform outcomes, mirrors post_attempts but
--         denormalized for fast UI rendering.

CREATE TABLE IF NOT EXISTS scheduled_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    caption TEXT NOT NULL,
    media_r2_keys TEXT[] NOT NULL CHECK (array_length(media_r2_keys, 1) >= 1),
    scheduled_for TIMESTAMPTZ NOT NULL,
    platforms TEXT[] NOT NULL CHECK (array_length(platforms, 1) >= 1),
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'partial', 'success', 'failed', 'canceled')),
    result JSONB,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS scheduled_posts_client_id_idx ON scheduled_posts(client_id);
CREATE INDEX IF NOT EXISTS scheduled_posts_status_idx ON scheduled_posts(status);
-- Partial index for the worker's hot query: "what's due to fire?"
CREATE INDEX IF NOT EXISTS scheduled_posts_due_idx ON scheduled_posts(scheduled_for)
    WHERE status = 'queued';

------------------------------------------------------------
-- 3. post_attempts: per-platform delivery history
------------------------------------------------------------
-- One row per platform per scheduled_post. Stores full platform response for debug.
-- Worker writes one row when it dispatches; UI shows them as a per-platform log.

CREATE TABLE IF NOT EXISTS post_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheduled_post_id UUID NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'facebook', 'linkedin')),
    social_account_id UUID REFERENCES social_accounts(id) ON DELETE SET NULL,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    platform_post_id TEXT,            -- e.g. TikTok publish_id, IG media_id, FB post id, LI urn
    platform_post_url TEXT,           -- e.g. https://www.tiktok.com/@x/video/123
    error_message TEXT,
    raw_response JSONB
);

CREATE INDEX IF NOT EXISTS post_attempts_scheduled_post_id_idx ON post_attempts(scheduled_post_id);
CREATE INDEX IF NOT EXISTS post_attempts_attempted_at_idx ON post_attempts(attempted_at DESC);

------------------------------------------------------------
-- 4. Row Level Security — enable on all three tables
------------------------------------------------------------
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_attempts ENABLE ROW LEVEL SECURITY;

------------------------------------------------------------
-- 5. Read policies — client_users membership pattern
------------------------------------------------------------
-- Mirrors 20260411_01_multitenancy.sql: users see rows for clients they have
-- a client_users membership for.

CREATE POLICY "users see social_accounts for their clients" ON social_accounts FOR SELECT
    USING (client_id IN (
        SELECT client_id FROM client_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "users see scheduled_posts for their clients" ON scheduled_posts FOR SELECT
    USING (client_id IN (
        SELECT client_id FROM client_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "users see post_attempts for their accessible scheduled_posts" ON post_attempts FOR SELECT
    USING (scheduled_post_id IN (
        SELECT id FROM scheduled_posts
        WHERE client_id IN (
            SELECT client_id FROM client_users WHERE user_id = auth.uid()
        )
    ));

------------------------------------------------------------
-- 6. Team-layer cross-read — mirrors 20260509_01_agency_layer.sql
------------------------------------------------------------
-- Team members see social data for clients their team manages, in addition
-- to anything they have direct client_users access to.

CREATE POLICY "team_member_read_social_accounts" ON social_accounts FOR SELECT
    USING (client_id IN (
        SELECT tc.client_id
        FROM team_clients tc
        JOIN team_members tm ON tm.team_id = tc.team_id
        WHERE tm.user_id = auth.uid()
    ));

CREATE POLICY "team_member_read_scheduled_posts" ON scheduled_posts FOR SELECT
    USING (client_id IN (
        SELECT tc.client_id
        FROM team_clients tc
        JOIN team_members tm ON tm.team_id = tc.team_id
        WHERE tm.user_id = auth.uid()
    ));

CREATE POLICY "team_member_read_post_attempts" ON post_attempts FOR SELECT
    USING (scheduled_post_id IN (
        SELECT sp.id
        FROM scheduled_posts sp
        JOIN team_clients tc ON tc.client_id = sp.client_id
        JOIN team_members tm ON tm.team_id = tc.team_id
        WHERE tm.user_id = auth.uid()
    ));

------------------------------------------------------------
-- 7. Deny user writes — service role bypasses for cron + server actions
------------------------------------------------------------
-- All mutations go through the service role (worker + portal server actions).
-- Matches the pattern in 20260411_03_rls_deny_writes.sql + 20260509_01.

CREATE POLICY "deny_user_writes_social_accounts" ON social_accounts FOR INSERT WITH CHECK (false);
CREATE POLICY "deny_user_updates_social_accounts" ON social_accounts FOR UPDATE USING (false);
CREATE POLICY "deny_user_deletes_social_accounts" ON social_accounts FOR DELETE USING (false);

CREATE POLICY "deny_user_writes_scheduled_posts" ON scheduled_posts FOR INSERT WITH CHECK (false);
CREATE POLICY "deny_user_updates_scheduled_posts" ON scheduled_posts FOR UPDATE USING (false);
CREATE POLICY "deny_user_deletes_scheduled_posts" ON scheduled_posts FOR DELETE USING (false);

CREATE POLICY "deny_user_writes_post_attempts" ON post_attempts FOR INSERT WITH CHECK (false);
CREATE POLICY "deny_user_updates_post_attempts" ON post_attempts FOR UPDATE USING (false);
CREATE POLICY "deny_user_deletes_post_attempts" ON post_attempts FOR DELETE USING (false);

COMMIT;

-- ROLLBACK (manual): drop in reverse order
-- BEGIN;
-- DROP POLICY IF EXISTS "deny_user_deletes_post_attempts" ON post_attempts;
-- DROP POLICY IF EXISTS "deny_user_updates_post_attempts" ON post_attempts;
-- DROP POLICY IF EXISTS "deny_user_writes_post_attempts" ON post_attempts;
-- DROP POLICY IF EXISTS "deny_user_deletes_scheduled_posts" ON scheduled_posts;
-- DROP POLICY IF EXISTS "deny_user_updates_scheduled_posts" ON scheduled_posts;
-- DROP POLICY IF EXISTS "deny_user_writes_scheduled_posts" ON scheduled_posts;
-- DROP POLICY IF EXISTS "deny_user_deletes_social_accounts" ON social_accounts;
-- DROP POLICY IF EXISTS "deny_user_updates_social_accounts" ON social_accounts;
-- DROP POLICY IF EXISTS "deny_user_writes_social_accounts" ON social_accounts;
-- DROP POLICY IF EXISTS "team_member_read_post_attempts" ON post_attempts;
-- DROP POLICY IF EXISTS "team_member_read_scheduled_posts" ON scheduled_posts;
-- DROP POLICY IF EXISTS "team_member_read_social_accounts" ON social_accounts;
-- DROP POLICY IF EXISTS "users see post_attempts for their accessible scheduled_posts" ON post_attempts;
-- DROP POLICY IF EXISTS "users see scheduled_posts for their clients" ON scheduled_posts;
-- DROP POLICY IF EXISTS "users see social_accounts for their clients" ON social_accounts;
-- DROP TABLE IF EXISTS post_attempts;
-- DROP TABLE IF EXISTS scheduled_posts;
-- DROP TABLE IF EXISTS social_accounts;
-- COMMIT;
