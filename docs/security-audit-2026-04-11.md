# Venti Scale Portal — Security Audit
**Date:** 2026-04-11
**Scope:** Client portal (auth, multi-tenancy, data isolation, public endpoints)
**Commit (post-fix):** `f14d933`

---

## What I looked for

The #1 thing clients will ask about is whether their data is safe. I walked the portal front-to-back looking for:

- Cross-tenant data leaks (can client A ever see client B's data?)
- Auth bypass paths (can a non-member reach the portal?)
- Secret exposure (are service keys, tokens, env vars leaking anywhere?)
- Open redirects, CSRF, XSS, injection
- Debug endpoints reachable in production
- Personally identifiable info (PII) in server logs
- RLS policy gaps on the Supabase tables
- Rate-limit abuse / spam on the public marketing endpoint

---

## Findings, fixed today

### CRITICAL — Debug endpoints leaked session + membership data
- **What:** `/api/portal/debug-session` and `/debug/client` were live in production and returned cookie values, user ID/email, and the full membership list for the caller.
- **Impact:** A curious visitor could probe session state for any authed user they could coax into visiting the page. The JSON endpoint also exposed session shape that's useful for attackers.
- **Fix:** Both routes deleted from the repo.

### HIGH — PII in Vercel Function Logs
- **What:** `lib/current-client.ts` logged `{userId, email, activeClientId, validIds}` on every request. `/api/audit` logged the full submitted form (name, email, business, URL, IP, notes) as JSON.
- **Impact:** Anyone with Vercel project access could read every user's email + client affiliations and every audit lead. Insider risk, but also exposed if a Vercel account were compromised.
- **Fix:** All PII stripped from logs. Lead data still persists to the `audit_leads` table where it belongs.

### HIGH — Magic-link open redirect
- **What:** `/auth/callback?code=X&next=//evil.com` would complete sign-in and then redirect off-site, sending the auth `code` to the attacker's server via the Referer header.
- **Impact:** Phishing via attacker-crafted magic links. Session hijack risk if the code was still exchangeable.
- **Fix:** `next` is now validated to be a same-origin absolute path. `//evil.com` and `/\evil.com` both get rewritten to `/dashboard`.

### HIGH — Active-client route accepted any clientId
- **What:** `POST /api/portal/active-client` let any authed user set `vs-active-client` to any UUID without checking membership. The cookie was later re-validated in `getPortalSession()` (so data never actually leaked), but the write was sloppy.
- **Impact:** Low actual leak risk, but violated defense-in-depth. A future code path reading the cookie directly would be exposed.
- **Fix:** Route now requires an authed user AND verifies the target client is in their `client_users` rows. Bogus values return `403`.

### MEDIUM — RLS policies had no explicit write denial
- **What:** Phase 2 migration relied on the *absence* of write policies to block user writes to `clients`, `client_users`, and `client_metrics`. Postgres enforces "no policy = no access" by default, so this was technically safe — but a single later `CREATE POLICY ... FOR UPDATE USING (true)` added by a distracted developer would silently open it up.
- **Impact:** Implicit security is regression-prone.
- **Fix:** New migration `20260411_03_rls_deny_writes.sql` adds explicit `INSERT/UPDATE/DELETE` denial policies on all three tables. The service role (used by the nightly metrics puller) still bypasses RLS entirely. Applied to production.

### MEDIUM — Audit endpoint had no CSRF / Origin check
- **What:** `POST /api/audit` accepted requests from any origin. A malicious third-party page could trick a visitor's browser into submitting audits with their email, spamming the audit pipeline.
- **Impact:** Spam and lead-system abuse (Brevo emails, Telegram alerts, database rows). Not a data leak, but an abuse vector.
- **Fix:** Browser POSTs now require `Origin` to match `ventiscale.com` (or localhost for dev). Server-to-server callers (no Origin header) still work — legitimate testing isn't blocked.

---

## Findings, confirmed safe

- **RLS SELECT policies** on `clients`, `client_users`, and `client_metrics` all scope by `auth.uid()` → `client_users` → `client_id`. I tested the matrix; there is no way for one client to read another client's metrics from the authed user role.
- **Cookie security** — auth cookies are httpOnly, `secure` in production, and sameSite=lax. Not accessible from JavaScript, not sent on most cross-site requests.
- **Service role key** is used in exactly one place: the nightly Python puller that writes `client_metrics`. It's in `.env.local` (gitignored, never committed) and in Vercel's encrypted project env.
- **Middleware** refreshes Supabase sessions on every request and protects all portal routes. The layout re-checks session on render as a second gate.
- **Magic-link confirmation page** exists specifically because Gmail pre-scans links and was burning OTPs. The click-through page is the fix, not a vulnerability.
- **Sign-out** is POST-only. (GET-based signout was the bug that caused Next.js prefetch to silently sign users out.)

---

## Still open, not blocking client conversations

These are real but small — worth doing soon, not worth pausing client conversations over:

1. **Role-based access control (RBAC) is defined but not enforced.** `client_users.role` supports `owner/admin/viewer`, but no code path checks the role. Matters the minute we add write endpoints (campaign approval, content edits). Not a data-read issue today.
2. **In-memory rate limiter on `/api/audit`** resets on every cold start. Works against casual bots, not determined ones. Real shield is Vercel's built-in DDoS protection. Add a persistent limiter (Redis or a Supabase table) when we have real abuse.
3. **`logo_url` input validation.** The `clients` table stores a logo URL with no schema check. Currently only agency admins (me) set it, so low risk — but add a CDN-whitelist validator before we open that to a client-facing UI.

---

## What changed in production today

| File | Change |
|---|---|
| `app/api/portal/debug-session/route.ts` | deleted |
| `app/debug/client/page.tsx` | deleted |
| `app/api/portal/active-client/route.ts` | requires auth + membership check |
| `app/api/audit/route.ts` | Origin check, PII scrubbed from logs |
| `app/auth/callback/route.ts` | `next` validated to same-origin path |
| `app/auth/confirm/page.tsx` | `next` validated to same-origin path |
| `lib/current-client.ts` | PII scrubbed from logs |
| `supabase/migrations/20260411_03_rls_deny_writes.sql` | explicit RLS write denial, applied |
