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

---

## Round 2 — unbiased self-audit (same day)

Round 1 was scoped by what I told the agent to look at. I went back in to find what I missed by reading the code myself instead of summarizing a report. One real finding, two smaller ones.

### HIGH — SSRF via the public audit endpoint
- **What:** `lib/audit.ts → fetchHtml()` took any visitor-submitted URL and fetched it from the Vercel serverless function with `redirect: "follow"` and no hostname validation. `isValidUrl` in the audit route only checked that the string *looked* like a domain — it still accepted `169.254.169.254`, `127.0.0.1`, `10.0.0.5`, or any public hostname that 302s to an internal target. `probeFreshness()` did the same thing against `/sitemap.xml` and friends.
- **Impact:** An attacker could POST an audit for `http://169.254.169.254/latest/meta-data/...` and our function would fetch the cloud metadata service and mail the HTML back to the attacker's email. Same class of bug as the old Capital One breach. On Vercel the metadata endpoint isn't the exact AWS one, but the category (probe internal services, enumerate infra) is exactly what SSRF is.
- **Fix:**
  1. New `safeFetch()` walks redirects manually (`redirect: "manual"`, max 5 hops). Every hop is re-validated — a public URL that 302s to an internal IP is caught on the second hop.
  2. Every hop runs `assertPublicHost()`, which does a real DNS lookup (`dns.lookup`, same resolver fetch uses) and rejects if *any* returned address is in a blocked range: `10/8`, `127/8`, `169.254/16`, `172.16/12`, `192.168/16`, `100.64/10` (CGNAT), `0/8`, multicast, plus IPv6 `::1`, `fe80::/10`, `fc00::/7`, `ff00::/8`, and IPv4-mapped `::ffff:...`.
  3. Protocol whitelist: only `http:` / `https:`. `file://`, `gopher://`, `ftp://` are rejected before the socket is opened.
  4. `isValidUrl` in `app/api/audit/route.ts` now rejects bare IP literals and numeric TLDs up-front, so the fast path never even hits DNS.
  5. `probeFreshness()` now goes through `safeFetch()` too — same guard, same redirect handling.

### LOW — Sign-out left `vs-active-client` cookie behind
- **What:** `POST /auth/signout` cleared Supabase auth cookies and `vs-demo`, but not `vs-active-client`. The cookie is always re-validated against the new user's memberships on next login, so it's never a leak — but leaving it set meant a user logging into a second account on the same browser would briefly see their old active-client id attempted before the re-check rejected it.
- **Impact:** Hygiene, not a leak. Noisy from a defense-in-depth standpoint.
- **Fix:** Sign-out now clears `vs-active-client` alongside `vs-demo`.

### Confirmed safe in round 2
- **`dangerouslySetInnerHTML`** — used only for hardcoded JSONLD schema (`FAQ_JSONLD`, `ORGANIZATION_JSONLD`, `SERVICE_JSONLD`). Zero user input reaches it. Not an XSS surface.
- **`client.logo_url`** — stored in `clients`, admin-only writes (explicit RLS deny from phase 3), and currently rendered nowhere in the portal UI. When it does get rendered, add a scheme whitelist (`https:` only) and a CDN allowlist before opening it to client-set input.
- **Marketing audit form inputs reaching Brevo** — `sendLeadNotification()` HTML-escapes every user field before putting it in the email template. `entry.notes` is escaped and line-breaks are converted with `replace(/\n/g, "<br>")` on the *escaped* string, so raw HTML can't enter the mail body.

### HIGH — Next.js DoS CVE (GHSA-q4gf-8mx6-v5v3)
- **What:** `npm audit` flagged `next@16.2.0` for a Server Components DoS vulnerability. Affects 16.0.0-beta.0 through 16.2.2. Fix released in 16.2.3.
- **Impact:** A crafted request could exhaust server resources on a page that uses Server Components — every portal page falls into this category. On Vercel it would burn function time and quota before the edge kills the request.
- **Fix:** Upgraded to `next@16.2.3`. `npm audit` clean (0 vulnerabilities). Build succeeds.

### MEDIUM — Rate limiters were in-memory (Vercel cold start bypass)
- **What:** Both `/api/audit` and the `requestMagicLink` server action used per-process `Map`-based rate limiters. On Vercel, serverless functions cold-start frequently — any determined attacker could bypass the limits just by spreading requests across cold starts.
- **Impact:** Audit endpoint could be used to spam the Brevo send pipeline and the `audit_leads` table. Magic-link endpoint could be used to spray signup emails at arbitrary addresses (Brevo abuse reports + sender reputation damage).
- **Fix:**
  1. New `rate_limits` Supabase table (migration `20260411_04_rate_limits.sql`) with explicit RLS deny on all roles — only the service role bypasses. Applied to production.
  2. New `lib/rate-limit.ts` helper: counts hits in the window, inserts on admit, fails open if Supabase is down, and opportunistically reaps rows older than 24h on ~1% of writes.
  3. `/api/audit` now calls `checkRateLimit("audit:<ip>", 3, 10min)`.
  4. `requestMagicLink` now calls `checkRateLimit("login:<email>", 5, 10min)`. The email is no longer logged alongside the rate-limit warning.

### Hardening — baseline security headers
- **What:** Added `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a minimal `Permissions-Policy` to every response via `next.config.ts`.
- **Why:** HSTS forces browsers to remember HTTPS-only for 2 years so a downgrade attack on the next visit can't strip TLS. X-Frame-Options: DENY prevents the portal from being iframed (clickjacking). nosniff forces browsers to honor our Content-Type. Referrer-Policy stops the auth `code` query param from leaking in the Referer when a signed-in user clicks an outbound link. Permissions-Policy disables features we'll never use (camera/mic/geo) so a compromised third-party script can't prompt for them.
- **Note:** Deliberately skipped CSP — a wrong CSP silently breaks pages, and the marketing site uses inline JSON-LD scripts. Adding CSP belongs in a follow-up where we can dry-run it against a staging env.

### Round 2 changes in production

| File | Change |
|---|---|
| `lib/audit.ts` | SSRF-safe `fetchHtml` + `safeFetch` (DNS validation, manual redirect walk, protocol whitelist) |
| `app/api/audit/route.ts` | `isValidUrl` rejects bare IP literals and numeric TLDs |
| `app/auth/signout/route.ts` | clears `vs-active-client` cookie on signout |
| `package.json` + `package-lock.json` | `next` 16.2.0 → 16.2.3 (DoS CVE patch) |
| `next.config.ts` | HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy |
| `supabase/migrations/20260411_04_rate_limits.sql` | persistent `rate_limits` table with RLS deny-all, applied |
| `lib/rate-limit.ts` | shared `checkRateLimit()` helper backed by the table |
| `app/api/audit/route.ts` | swapped in-memory limiter for persistent one |
| `app/actions/request-login.ts` | swapped in-memory limiter for persistent one, stopped logging email |
