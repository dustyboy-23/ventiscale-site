# portal/ — pre-flight for any agent touching this repo

Read this FIRST before writing, editing, or recommending anything in `portal/`. It exists because the portal has bespoke conventions that are easy to violate by autopilot.

## Stack facts (don't assume the defaults)

- **Next.js 16** with App Router + **Turbopack** (not webpack)
- **Tailwind 4** with theme tokens declared inline in `app/globals.css` via `@theme {}` — NOT shadcn/ui, NOT a `tailwind.config.ts`
- **Components live at `components/`** (flat) — NOT `components/ui/`. Bespoke wrappers: `Card`, `CardHeader`, `KpiCard`, `PageHeader`, `Sidebar`, `MobileNav`. Match these.
- **Forms = server actions** with native HTML `<form>` and `"use server"` action functions. NO `react-hook-form`, NO `zod`, NO controlled-input libraries. Reference: `app/actions/request-login.ts`.
- **Icons = `lucide-react` only.** No other icon libs. (TikTok icon is inline SVG in `components/social/platform-icons.tsx` because Lucide doesn't ship one.)
- **Auth = Supabase via `@supabase/ssr`** with magic-link OTP. Helpers: `lib/supabase/server.ts` (SSR), `lib/supabase/client.ts` (browser), `lib/current-client.ts` (session + role resolution).
- **Multi-tenancy** = `clients` + `client_users` + `teams` + `team_members` + `team_clients` via RLS. See `supabase/migrations/20260411_01_multitenancy.sql` + `20260509_01_agency_layer.sql`.

## Routing facts

- **`app/(team)/[slug]/...` is a route group.** `(team)` does NOT appear in the URL. Effective path: `/<slug>/...` (e.g. `/venti-scale/dashboard`). Do NOT publish `/team/<slug>/...` URLs anywhere.
- **`app/(portal)/...` is also a route group.** Effective path: `/...` (e.g. `/dashboard`, `/settings`).
- **`app/(marketing)/...` is also a route group.** Marketing pages at root: `/about`, `/privacy`, `/terms`, `/blog/*`, etc.
- Top-level real segments: `login`, `oauth`, `auth`, `api`, `actions`. These DO appear in URLs.

## CSP rules (DO NOT BREAK THESE)

- Middleware in `middleware.ts` generates a per-request nonce + emits CSP header.
- **Production CSP is M3-hardened (2026-05-14, commit `2a43518`):** `script-src` is `'self' 'nonce-{value}' https://www.googletagmanager.com https://va.vercel-scripts.com`. Zero `'unsafe-inline'`, zero `'unsafe-eval'`. ALL 244 inline scripts across 84 files carry `nonce={nonce}` — confirmed 2026-05-11 audit. If you add an inline `<script>`, it MUST have `nonce={nonce}` from `headers().get('x-nonce')`.
- **Dev mode adds `'unsafe-eval'` to script-src** (added 2026-05-15). React + Turbopack HMR + error introspection use `eval()`. The middleware branches on `process.env.NODE_ENV === "development"`. Don't remove this branch — dev server blank-screens without it.
- `style-src` keeps `'unsafe-inline'` because React emits inline styles; removing breaks the site. Don't try to harden style-src without a full inline-style audit + refactor.

## Auth state gotchas

- Team layout at `app/(team)/[slug]/layout.tsx` calls `getPortalSession()` then `getTeamSession(slug)`. If `getPortalSession()` returns null OR `mode !== "real"` → redirects to `/login`. If `getTeamSession()` returns null → `notFound()`.
- `getPortalSession()` returns `mode: "demo"` when user has the `vs-demo` cookie AND has an agency-flagged client_users row. That triggers the redirect-to-login from team layouts. To get back into team views: clear `vs-demo` cookie.
- Curl/server requests with no cookie always get 307 → /login from team routes. That's NORMAL, not a bug.

## Dev server quirks

- Port: **3030** (not 3000). See `package.json` scripts.
- Background-start pattern that survives wsl.exe shell-out:
  ```bash
  wsl.exe -u dustin -- bash -c "cd ~/venti-scale/portal && setsid nohup npm run dev </dev/null >/tmp/portal-dev.log 2>&1 &"
  ```
  Without `setsid`, the child process dies when the parent wsl.exe call returns.
- Read dev server output: `tail /tmp/portal-dev.log`. Stop it: `pkill -9 -f 'next dev'`.

## Deploy

- **Vercel** auto-deploys on push to `master` (this is `dustyboy-23/ventiscale-site` on GitHub).
- Pre-push hook runs `npx tsc --noEmit` — if TS fails locally, push is blocked. Vercel build also runs tsc + linter; failures Slack `#ops` via the alert wired in.
- `.vercel/` is gitignored; project config lives in `vercel.json`.

## Common mistakes to NOT make

| Mistake | Fix |
|---|---|
| Publishing `/team/<slug>/...` URLs | Use `/<slug>/...` |
| Adding `react-hook-form` or `zod` | Native form + server action |
| Adding shadcn primitives | Match `components/card.tsx` patterns |
| Removing `'unsafe-eval'` from dev CSP | Don't. Dev breaks without it. |
| Adding inline `<script>` without nonce | Pull `headers().get('x-nonce')` |
| Hardcoding Supabase URL | Read from env: `NEXT_PUBLIC_SUPABASE_URL` |
| Running `npm run dev` from Windows-side bash | Use wsl.exe wrapper (see Dev server quirks above) |

## File freshness check

Before recommending an architecture decision, check these for recent changes:
- `~/venti-scale/open-loops.md` — current load-bearing carries
- `~/venti-scale/memory/daily/YYYY-MM-DD.md` (most recent) — what shipped today
- `git log -10 --oneline` in this repo — recent commits

CSP, auth, RLS, multi-tenancy, and routing all changed in the last 30 days. Don't assume.
