-- Venti Scale Portal — Phase 5: Extend explicit RLS write denials
--
-- Audit finding M1 (2026-04-28): activity_log, audit_leads, and content_items
-- have RLS enabled but no explicit deny on INSERT/UPDATE/DELETE for
-- non-service-role connections. The default "no policy = deny" today keeps
-- writes blocked, but a future careless migration that adds a permissive
-- policy without a `with_check` could open a multi-tenant write hole.
--
-- These explicit false policies match the pattern set in
-- 20260411_03_rls_deny_writes.sql so the intent is load-bearing.

-- activity_log ────────────────────────────────────────────────
drop policy if exists "no user writes to activity_log (insert)" on public.activity_log;
create policy "no user writes to activity_log (insert)"
  on public.activity_log for insert with check (false);

drop policy if exists "no user writes to activity_log (update)" on public.activity_log;
create policy "no user writes to activity_log (update)"
  on public.activity_log for update using (false) with check (false);

drop policy if exists "no user writes to activity_log (delete)" on public.activity_log;
create policy "no user writes to activity_log (delete)"
  on public.activity_log for delete using (false);

-- audit_leads ─────────────────────────────────────────────────
drop policy if exists "no user writes to audit_leads (insert)" on public.audit_leads;
create policy "no user writes to audit_leads (insert)"
  on public.audit_leads for insert with check (false);

drop policy if exists "no user writes to audit_leads (update)" on public.audit_leads;
create policy "no user writes to audit_leads (update)"
  on public.audit_leads for update using (false) with check (false);

drop policy if exists "no user writes to audit_leads (delete)" on public.audit_leads;
create policy "no user writes to audit_leads (delete)"
  on public.audit_leads for delete using (false);

-- audit_leads SELECT denial (PII; only service role / dashboard query)
drop policy if exists "no user reads from audit_leads" on public.audit_leads;
create policy "no user reads from audit_leads"
  on public.audit_leads for select using (false);

-- content_items ───────────────────────────────────────────────
-- content_items has a SELECT + UPDATE policy scoped to client_users.
-- INSERT and DELETE should remain service-role-only (cron pipelines write
-- drafts; clients only review them).
drop policy if exists "no user writes to content_items (insert)" on public.content_items;
create policy "no user writes to content_items (insert)"
  on public.content_items for insert with check (false);

drop policy if exists "no user writes to content_items (delete)" on public.content_items;
create policy "no user writes to content_items (delete)"
  on public.content_items for delete using (false);
