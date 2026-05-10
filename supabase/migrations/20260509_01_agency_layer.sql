-- Migration: Agency Layer (teams, cross-client team membership, team performance rollups)
-- Created: 2026-05-09
-- Status: DRAFT — apply via Supabase BRANCH first, validate, merge to main
-- Plan: ~/.claude/plans/so-i-want-you-synchronous-emerson.md (Phase 2.1)
--
-- What this enables:
--   - Venti Scale agency has a "team" (Dusty + Olmo + Braklez + RadWalz initially)
--   - Team is mapped to multiple clients (iron-paws, sprinkler-guard, pilothouse, future)
--   - Team members get cross-client visibility (the new /team/[slug]/ portal routes)
--   - Daily perf snapshots roll up client_metrics into team-level KPIs
--
-- Reuses existing patterns from 20260411_01_multitenancy.sql:
--   - RLS enabled by default
--   - Reader policies via subquery membership lookup
--   - Service role bypasses for cron/server-side mutations

BEGIN;

------------------------------------------------------------
-- 1. teams: a Venti Scale team operates across multiple clients
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    brand_color TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS teams_owner_id_idx ON teams(owner_id);

------------------------------------------------------------
-- 2. team_members: link auth.users to teams with role
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_members (
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'lead', 'editor', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON team_members(user_id);

------------------------------------------------------------
-- 3. team_clients: many-to-many between teams and clients
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_clients (
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    primary_brand_manager UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (team_id, client_id)
);

CREATE INDEX IF NOT EXISTS team_clients_client_id_idx ON team_clients(client_id);
CREATE INDEX IF NOT EXISTS team_clients_brand_manager_idx ON team_clients(primary_brand_manager);

------------------------------------------------------------
-- 4. team_performance_snapshots: daily KPI rollups
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_performance_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    total_reach INTEGER,
    total_engagement INTEGER,
    total_published INTEGER,
    avg_roas NUMERIC(10,2),
    cron_failures_today INTEGER,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (team_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS team_perf_team_date_idx ON team_performance_snapshots(team_id, snapshot_date DESC);

------------------------------------------------------------
-- 5. RLS policies
------------------------------------------------------------
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_performance_snapshots ENABLE ROW LEVEL SECURITY;

-- Team members can read their own team
CREATE POLICY "team_member_read_team" ON teams FOR SELECT
    USING (id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
    ));

-- Team members can read membership for teams they belong to
CREATE POLICY "team_member_read_members" ON team_members FOR SELECT
    USING (team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
    ));

-- Team members can read team_clients for their team
CREATE POLICY "team_member_read_team_clients" ON team_clients FOR SELECT
    USING (team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
    ));

-- Team members can read perf snapshots for their team
CREATE POLICY "team_member_read_snapshots" ON team_performance_snapshots FOR SELECT
    USING (team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
    ));

-- Writes: deny for users; service role bypasses RLS for cron/server actions
-- (matches the pattern in 20260411_03_rls_deny_writes.sql)
CREATE POLICY "deny_user_writes_teams" ON teams FOR INSERT WITH CHECK (false);
CREATE POLICY "deny_user_updates_teams" ON teams FOR UPDATE USING (false);
CREATE POLICY "deny_user_deletes_teams" ON teams FOR DELETE USING (false);

CREATE POLICY "deny_user_writes_members" ON team_members FOR INSERT WITH CHECK (false);
CREATE POLICY "deny_user_updates_members" ON team_members FOR UPDATE USING (false);
CREATE POLICY "deny_user_deletes_members" ON team_members FOR DELETE USING (false);

CREATE POLICY "deny_user_writes_team_clients" ON team_clients FOR INSERT WITH CHECK (false);
CREATE POLICY "deny_user_updates_team_clients" ON team_clients FOR UPDATE USING (false);
CREATE POLICY "deny_user_deletes_team_clients" ON team_clients FOR DELETE USING (false);

CREATE POLICY "deny_user_writes_snapshots" ON team_performance_snapshots FOR INSERT WITH CHECK (false);
CREATE POLICY "deny_user_updates_snapshots" ON team_performance_snapshots FOR UPDATE USING (false);
CREATE POLICY "deny_user_deletes_snapshots" ON team_performance_snapshots FOR DELETE USING (false);

------------------------------------------------------------
-- 6. Cross-table access: team members see clients + content their team manages
------------------------------------------------------------
-- Existing policies on clients/content_items/etc. restrict to client_users membership.
-- Add UNION-style policies so team members ALSO see clients their team manages.
-- We add NEW policies (not modify existing) so this migration is reversible:
-- dropping these new policies removes team-cross-client access without affecting
-- the existing client_users-based access.

CREATE POLICY "team_member_read_managed_clients" ON clients FOR SELECT
    USING (id IN (
        SELECT tc.client_id
        FROM team_clients tc
        JOIN team_members tm ON tm.team_id = tc.team_id
        WHERE tm.user_id = auth.uid()
    ));

CREATE POLICY "team_member_read_managed_content" ON content_items FOR SELECT
    USING (client_id IN (
        SELECT tc.client_id
        FROM team_clients tc
        JOIN team_members tm ON tm.team_id = tc.team_id
        WHERE tm.user_id = auth.uid()
    ));

CREATE POLICY "team_member_read_managed_metrics" ON client_metrics FOR SELECT
    USING (client_id IN (
        SELECT tc.client_id
        FROM team_clients tc
        JOIN team_members tm ON tm.team_id = tc.team_id
        WHERE tm.user_id = auth.uid()
    ));

CREATE POLICY "team_member_read_managed_reports" ON client_reports FOR SELECT
    USING (client_id IN (
        SELECT tc.client_id
        FROM team_clients tc
        JOIN team_members tm ON tm.team_id = tc.team_id
        WHERE tm.user_id = auth.uid()
    ));

CREATE POLICY "team_member_read_managed_activity" ON activity_log FOR SELECT
    USING (client_id IN (
        SELECT tc.client_id
        FROM team_clients tc
        JOIN team_members tm ON tm.team_id = tc.team_id
        WHERE tm.user_id = auth.uid()
    ));

COMMIT;

-- ROLLBACK (manual): drop new policies + tables in reverse order
-- DROP POLICY IF EXISTS team_member_read_managed_activity ON activity_log;
-- DROP POLICY IF EXISTS team_member_read_managed_reports ON client_reports;
-- DROP POLICY IF EXISTS team_member_read_managed_metrics ON client_metrics;
-- DROP POLICY IF EXISTS team_member_read_managed_content ON content_items;
-- DROP POLICY IF EXISTS team_member_read_managed_clients ON clients;
-- DROP TABLE IF EXISTS team_performance_snapshots;
-- DROP TABLE IF EXISTS team_clients;
-- DROP TABLE IF EXISTS team_members;
-- DROP TABLE IF EXISTS teams;
