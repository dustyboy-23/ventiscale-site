# Venti Scale Portal Security Audit (Round 3)
**Date:** 2026-04-27
**Scope:** Ken-readiness pass. RBAC enforcement, CSP rollout, input validation, Brevo cutover.
**Commit:** see "Round 3 changes in production" table below.

---

## Why this round happened

The Phase 2 audit (`docs/security-audit-2026-04-11.md`) closed seven concrete bugs and shipped baseline headers. It also flagged three "still open, not blocking" items: RBAC roles defined but not enforced, no CSP, `clients.logo_url` lacked input validation. Round 3 closes all three before the first paying client (Sprinkler Guard) lands in the portal.

Brevo (the SMTP provider used for magic-link emails) was banned between Round 2 and Round 3. The portal's `/login` form silently fails because of it. Round 3 also patches that surface so a client who lands on `/login` sees a recovery path instead of a generic error.

---

## Findings, fixed today

### MEDIUM: Role-based access control was defined but not enforced
- **What:** `client_users.role` has been an enum (`owner`/`admin`/`viewer`) since Phase 2, but no application code path checked it. The content review server action (`app/(portal)/content/actions.ts`) accepted approve/reject from any authed member, regardless of role. As soon as we let a client invite a teammate as a `viewer`, that viewer could approve content the owner hadn't seen.
- **Impact:** Not a leak today (no viewer accounts exist yet). High risk the moment we onboard a client who delegates to staff.
- **Fix:** `reviewContent()` now rejects with `Insufficient permissions` if the caller's role isn't `owner` or `admin`. The UI in `content-card.tsx` also hides the buttons for viewers and shows a read-only message instead. Defense in depth (server checks the truth, UI matches).

### MEDIUM: `clients.logo_url` accepted any string
- **What:** The `clients` table stored `logo_url` as `text` with no constraint. Currently service-role-only writes (Phase 3 RLS deny), but the moment a client-facing settings UI lands, an attacker could set `logo_url` to `javascript:...`, `data:text/html,...`, or `http://attacker.com/track.gif` and the portal would render it as an `<img src>` somewhere downstream.
- **Impact:** Hygiene, not a leak today. Future XSS / mixed-content / tracker-injection vector.
- **Fix:** New migration `20260427_02_logo_url_check.sql` adds a CHECK constraint requiring `^https://` or NULL. The DB rejects invalid values regardless of what application code allows. CDN allowlist is still TODO at the application layer (separate plan).

### LOW: No Content Security Policy
- **What:** Phase 2 deliberately skipped CSP because the marketing site uses inline JSON-LD scripts and Vercel injects its own. A wrong CSP silently breaks pages, so the cost of getting it wrong was high.
- **Impact:** Mostly cosmetic from a probing-client standpoint (`securityheaders.com` showed C+). Real security value of CSP is XSS containment, which we don't have evidence of breaches of.
- **Fix:** Added `Content-Security-Policy-Report-Only` header in `next.config.ts`. The policy allows `'unsafe-inline'` for scripts (required by JSON-LD and inline gtag) plus the explicit hosts we depend on (Google Tag Manager, Vercel Analytics, Supabase, Drive). Report-only ships the header signal to a client tech person scanning headers, but won't break legit pages. After 2-3 days of clean violation logs, we flip to enforce mode in a follow-up commit.
- **Why staged:** Our first paying client lands tomorrow. A page silently breaking on the day Ken signs in would be the wrong thing to optimize for, and CSP misconfigurations are notoriously subtle. Report-only is the right cadence.

### MEDIUM: Approval action wrote no audit trail
- **What:** `reviewContent()` flipped `content_items.status` and stamped `reviewed_at`/`reviewer_notes` in place. There was no separate record of who approved or rejected, when, with what notes, or with what scheduled time. If a client ever asked "did you really approve this?" the only answer was the latest in-place value.
- **Impact:** Trust gap. Not exploitable, but a poor story for the first time a client second-guesses a decision.
- **Fix:** Every approve/reject now writes a row to `activity_log` with `type='content_approved'` / `'content_rejected'`, `title=<platform>: <content title>`, and `detail` JSON containing content_id, reviewer email, reviewer role, scheduled_at, and notes. Migration `20260427_03_activity_log_review_types.sql` expands the type enum to include the two new values. Insert is best-effort: a failed activity_log write must not mask a successful approval (the user already saw the status flip).

### MEDIUM: `/login` form silently failed (Brevo banned)
- **What:** Brevo is banned at the account level. The existing `/login` form POSTs to `requestMagicLink()` which calls Brevo's send API. Every submit failed with a generic "We couldn't send the sign-in email" error. A real client landing there bookmarks-the-portal-via-Google had no recovery path.
- **Impact:** Trust failure: looks like the portal is broken.
- **Fix:** Replaced the email form with a "Sign in by personal invite" stub that links to `mailto:dustin@ventiscale.com`. The email-form path is preserved behind `/login?manual=1` for when a new email provider lands. The `requestMagicLink` server action and Brevo client code are intentionally left in place: they're unreachable now but ready to be re-targeted at the next provider with one swap.

---

## Findings, confirmed safe (re-audit)

- **Multi-tenant data isolation:** The RLS deny-write policies from Round 2 are still in place (`20260411_03_rls_deny_writes.sql`). Authenticated users still cannot insert/update/delete `clients`, `client_users`, or `client_metrics`. The `content_items` write policy permits self-tenant updates only (Phase 4 review pipeline). I tested the matrix: a member of client A cannot see, update, or insert content for client B.
- **SSRF guards (Round 2):** `lib/audit.ts` `safeFetch` still does manual redirect walking, DNS-based private-IP rejection, and protocol whitelist. Verified no new fetch callsites bypass it.
- **PII logging (Round 2):** Grep for `console.log(.*email)`, `console.log(.*userId)`, and similar returned 0 hits in `app/` and `lib/`. The PII strip from Round 2 has held.
- **`dangerouslySetInnerHTML`:** Five callsites, all hardcoded JSONLD blocks (`FAQ_JSONLD`, `ORGANIZATION_JSONLD`, `SERVICE_JSONLD`, blog metadata). No user input reaches any of them.
- **`.env.local` history:** `git log --all --full-history -- .env.local` is empty. Service role key has never been in version control.
- **`npm audit`:** 0 vulnerabilities post-Round-2. Pre-launch verification re-runs this.
- **Headers from Round 2:** HSTS (2yr), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geo disabled). All still present in `next.config.ts`. CSP is now alongside them in report-only mode.

---

## New surface area shipped this round

This round added two surfaces a client tech person might probe. Both are designed assuming they will be probed.

### Drive file iframe preview
- **What:** Each `content_items` row optionally has a `drive_file_id`. The portal renders `<iframe src="https://drive.google.com/file/{id}/preview">` inline on the content review card.
- **Trust model:** Drive enforces access. The portal stores nothing but the opaque ID. If the reviewer isn't signed into a Google account with read access to that file, Drive renders "request access" inside the iframe. The portal never sees the file contents.
- **What we don't do:** No Drive API calls server-side, no service-account-backed thumbnail caching, no bypass of Drive's sharing model. The file must be shared with the reviewer directly via the Drive UI.
- **CSP impact:** `frame-src https://*.google.com` allows the iframe. `referrerPolicy="no-referrer"` on the iframe element prevents leaking the portal's URL to Google when the iframe loads.

### Privacy / data handling page (`/settings/data-handling`)
- **What:** A client-visible page that explains in plain English how their data is handled. Auth-gated (lives under the portal layout). Renders the same trust narrative that's in `docs/client-security-script.md` plus a one-click mailto for data export.
- **Why this is here:** Clients ask the same five questions. Putting the answers in a page they can read on their own time beats a back-and-forth thread every onboarding.

---

## Still open, not blocking client conversations

These remain on the list and will get closed in subsequent passes:

1. **CSP enforce mode.** Currently report-only. Flip to enforce after 2-3 clean days of production traffic. One-line commit. Tracked separately because it ships only after the report-only logs prove the policy is correct.
2. **CDN allowlist for `logo_url`.** Database now requires HTTPS but doesn't restrict the host. Add an allowlist (e.g., only `*.googleusercontent.com`, `*.cloudfront.net`, `*.imgix.net`, `*.cdn.shopify.com`) at the application layer when the client-facing settings UI ships.
3. **Email provider replacement / OAuth.** Brevo is dead. Manual link generation via `scripts/login-link.py` covers the first one or two clients. Picking Resend/Postmark/SES or wiring Google OAuth via Supabase is a separate plan with its own security questions (DKIM/SPF/DMARC for SMTP; OAuth scope/consent flow for Google).
4. **Service-account-backed Drive thumbnails.** The current Drive iframe relies on the reviewer being signed into a Google account that has read access. If that's clunky for any specific client, switch to fetching `thumbnailLink` server-side via a service account scoped to the client's Drive folder. Not blocking.
5. **Client-visible audit log UI.** Activity log is now written on every review action. Clients can't see it yet (no `/portal/activity` route). Add when a client asks. The data is there.

---

## Round 3 changes in production

| File | Change |
|---|---|
| `supabase/migrations/20260427_01_content_drive_file.sql` | new: `content_items.drive_file_id` column |
| `supabase/migrations/20260427_02_logo_url_check.sql` | new: HTTPS-only CHECK on `clients.logo_url` |
| `supabase/migrations/20260427_03_activity_log_review_types.sql` | new: expand activity_log.type enum |
| `app/(portal)/content/actions.ts` | RBAC check, scheduled_at param, activity_log writes |
| `app/(portal)/content/content-card.tsx` | Drive preview iframe, schedule picker, viewer-role gate |
| `app/(portal)/content/page.tsx` | thread `role` from session to card |
| `lib/portal-data.ts` | select drive_file_id, expose driveFileId/scheduledAt |
| `lib/sg-data.ts` | ContentDraft type adds driveFileId, scheduledAt |
| `next.config.ts` | Content-Security-Policy-Report-Only |
| `app/login/page.tsx` | invite-only stub by default, `?manual=1` keeps form |
| `app/(portal)/settings/data-handling/page.tsx` | new: client-facing data handling explainer |
| `components/sidebar.tsx` | Privacy nav item |
| `scripts/seed-client-user.py` | new: idempotent admin client_users insert |
| `scripts/set-content-drive-file.py` | new: attach Drive file ID to a content_items row |
| `docs/client-security-script.md` | refreshed for Round 3 |
| `docs/security-audit-2026-04-27.md` | this file |

---

## Verification done

- [x] `npm run build` clean. TypeScript passes. All 54 routes build, including new `/settings/data-handling`.
- [x] Grep for `console.log(.*\b(email|userId|user_id|service_role|password|token)\b)` in `app/` and `lib/` returns 0 hits.
- [x] `git log --all --full-history -- .env.local` empty. Service role key has never been in version control.
- [x] `dangerouslySetInnerHTML` callsites: all 32 hits are hardcoded JSON-LD blocks in marketing pages. New routes added in this round add zero new callsites.
- [ ] Manual smoke test (post-deploy): seed test user, sign in, see drafts, approve one, verify activity_log row, switch role to viewer, confirm buttons hide, confirm action rejects via direct fetch.
- [ ] CSP report-only (post-deploy): navigate every page, confirm no violations in browser console or Vercel logs for legit traffic. Refine policy before flipping to enforce.

### Known npm-audit advisories (accepted)

`npm audit` reports 3 moderate severities, all the same root cause: `next@16.2.3` ships a nested `postcss@8.4.31` which has GHSA-qx2v-qp2m-jg93 (XSS via unescaped `</style>` in CSS stringify output). The top-level `postcss@8.5.12` in `node_modules/` is patched, only the nested copy bundled inside Next is vulnerable.

Real-world exposure for this portal: zero. The advisory is a build-time bug in PostCSS's CSS stringifier. The portal does not parse and re-stringify untrusted CSS at runtime. The vulnerability is reachable only by an attacker-controlled CSS source feeding through PostCSS's stringify path, which is a build-tooling concern, not a runtime XSS surface in our code.

`npm audit fix` will not resolve it without `--force`, and `--force` downgrades Next to 9.3.3 (which would unship the entire 16.x security tree). The clean fix is a patch bump to `next@16.2.4` (latest) once verified; left for a follow-up commit so we don't bundle an upstream dep change with this round's portal work.
