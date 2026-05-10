-- Fix: 20260509_01 had a recursive RLS policy on team_members.
-- The original `team_member_read_members` policy queried team_members from
-- within a policy ON team_members → Postgres infinite-recursion error.
-- That broke any query touching `clients` (because team_member_read_managed_clients
-- subqueries team_members), which silently returned 0 rows for portal users.
--
-- Symptom: portal showed "You're signed in but no workspace yet" orphan page
-- even though client_users rows existed.
--
-- Fix: replace the recursive policy with a simple "users see their own rows"
-- pattern. The portal only needs to check "am I on this team," not
-- "list all members of this team," so this is sufficient.

DROP POLICY IF EXISTS "team_member_read_members" ON team_members;

CREATE POLICY "team_member_read_own" ON team_members FOR SELECT
    USING (user_id = auth.uid());
