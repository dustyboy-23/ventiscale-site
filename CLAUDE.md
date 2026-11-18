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

## Marketing site v5 (2026-11-17 redesign) — read before touching `app/(marketing)/`

- **Light theme, scoped.** Everything public renders inside `.vs-site` (set in `app/(marketing)/layout.tsx`). Palette tokens live in `app/globals.css` `@theme`: `paper`, `mist`, `evergreen`, `moss`, `leaf`, `leaf-deep`, `highlighter`, `line`. Fonts: Bricolage Grotesque (display) + Figtree (body), loaded in the marketing layout only. The portal keeps Inter.
- **Every price comes from `lib/pricing.ts`.** Services, setup fees, bundle discounts, bundles. The homepage rate sheet, `/pricing`, `/start`, `/api/start`, the OG image, `llms.txt` and the structured data all read it. Change a number there and nowhere else.
- **The highlighter (`.vs-mark`) is for prices only.** Do not use it to decorate headings.
- **Component classes are `vs-*`** (`vs-container`, `vs-section`, `vs-h1/h2/h3`, `vs-lede`, `vs-btn`, `vs-btn-quiet`, `vs-sheet`, `vs-ledger`, `vs-bundles`, `vs-steps`, `vs-faq`, `vs-input`). Match them. No gradients, no glow, no all-caps mono labels.
- **Legacy bridge.** The 180 blog posts and the guide pages still use dark-era utilities (`text-white/60`, `border-white/[0.06]`). A block at the end of the v5 CSS remaps those to the light palette inside `.vs-site`. New components must NOT use `text-white` / `border-white` / `bg-white/[..]`: inside the site they no longer mean white.
- **Blog post footer CTA = `<BlogCta />`** from `components/marketing/blog-cta.tsx`. Never paste a `<div className="blog-cta">` block. The blog writer prompt (`~/venti-scale/.claude/prompts/vs-blog-post.md`, paused) still emits the old block and the old "free audit" offer: fix the prompt before reviving that cron.
- **Lead flow.** `/start` posts to `/api/start`, which saves to `audit_leads` (notes prefixed `[PLAN REQUEST]`, `reachable` left NULL so the audit email worker ignores it) and pings Telegram. It answers "sent" only if at least one of those worked. `/api/audit` still exists but nothing on the site calls it.
- **Copy rules:** first person ("I"), no em dashes, never "quote", no "book a call". No invented testimonials, client counts or results. Third-party numbers on `/pricing` are cited and were read at source on 2026-11-17: re-read before changing them.
- **Month view + dashboard proof.** `MonthView` draws one green mark per piece of work from `weeks` on each service in `lib/pricing.ts`: change a deliverable count in `includes` and change `weeks` and `monthTotal` with it. `DashboardProof` shows `public/demo-dashboard.webp`, a real screenshot of `/dashboard` in demo mode (cookie `vs-demo=1`, fictional Stoneline workspace). Re-shoot it if the portal UI changes.
- **Services are one line each (Dusty 2026-11-18: "wall of text").** `ServiceRows` renders a folded `<details>` per service: outcome, what ships, price. Detail only appears on tap. Keep `includes` to four short lines and `setupCovers` / `needs` / `notIncluded` to one short sentence each. `/pricing#ads` opens that row (`OpenFromHash`).
- **Dusty's rulings on what stays OFF the public site (2026-11-18):** no AI photos of him anywhere, no statement of where he lives or runs the business from (footer stays `Venti Scale LLC, Sheridan, WY 82801, USA`), and no sample work until it is built with him. `public/founder/dustin.png` is the one photo file left on purpose: his Gmail signature loads it by URL. No page may use it.
- **Pricing rules** (all in `lib/pricing.ts`): ads management is priced **per channel** (Dusty's ruling; `AD_CHANNELS`, plan tokens `ads-meta` / `ads-google`, a bare `ads` = Meta). The only discounts are the 10% / 15% bundle discounts on the monthly. Setup fees add up and are never discounted. Always call `quote(ids, channels)` and `planQuery(ids, channels)`; `planLabel(q)` gives the human line.
- **Never add anything that costs Dusty money or adds work without his explicit yes (his ruling, 2026-11-18).** That means no refunds, guarantees, trials, extra discounts, free audits, free reviews of a prospect's site, or extras inside a package. He removed a first-month refund, a setup cap, half-price setup, a free Google Business Profile tune-up and "I'll tell you before you pay" promises the same day they went up. "Handle everything" is not a yes to any of these.
- **Homepage order is deliberate:** problem + plan sheet, what you get (no prices), how it works, dashboard, why it costs less, then prices again at the bundles, then FAQ. Do not put prices between the hero and `#packages`.
- **Phone rules:** tap targets 42px or taller, no text under 13px, tables that matter use `vs-table-stack` (they become cards under 720px), service detail stays folded in `ServiceRows`, and `PlanBuilder` shows a bottom bar with the running total until its own button is on screen. Re-run a phone pass (360 and 390 wide) after layout changes. Check CSS changes against `next build` + `next start`: the dev server has served a stale stylesheet.
- **`/services` 308-redirects to `/pricing`.** `id="audit"` on the homepage closing band exists only so old in-article `/#audit` links land somewhere useful.
