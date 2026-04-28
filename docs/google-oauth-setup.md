# Google OAuth Setup for the Venti Scale Portal

Two consoles to touch (Google Cloud + Supabase). Code is already wired. After steps 1 and 2 below, the "Sign in with Google" button on `/login` works.

This is a one-time setup. Once done, every future client signs in with one click.

---

## Step 1: Google Cloud Console

Go to https://console.cloud.google.com/

### 1a. Create or select a project

Top bar project dropdown → New Project → name it `Venti Scale` → Create. Or pick an existing one if you have one for this brand.

### 1b. Configure the OAuth consent screen

Sidebar: **APIs & Services → OAuth consent screen**.

- User Type: **External**
- App name: `Venti Scale`
- User support email: `dustin@ventiscale.com`
- App logo: (optional, skip for now or upload the VS mark)
- App domain: `https://www.ventiscale.com`
- Authorized domains: `ventiscale.com`
- Developer contact: `dustin@ventiscale.com`
- Save and continue.

Scopes screen: **leave default**. We're only requesting basic profile (email + name). No Drive scope. Save and continue.

Test users screen: while the app is in **Testing** mode (default for new projects), only test users you add here can sign in. Add:
- `dustin@ventiscale.com`
- Ken's email
- Any other test accounts you need

When ready for any-Google-user access, click **Publish App** at the top of the OAuth consent screen page. This sends Google a verification request. Until verified, users see an "unverified app" warning but can still sign in. For 1-3 known clients, just keep test users and skip publishing.

### 1c. Create the OAuth Client ID

Sidebar: **APIs & Services → Credentials**.

Click **+ Create Credentials → OAuth client ID**.

- Application type: **Web application**
- Name: `Venti Scale Portal`
- Authorized JavaScript origins:
  - `https://www.ventiscale.com`
  - `http://localhost:3030` (for local dev)
- Authorized redirect URIs:
  - `https://<YOUR-SUPABASE-PROJECT>.supabase.co/auth/v1/callback`

The Supabase callback URL is the critical one. Find your Supabase project ref by:
- Open `~/.openclaw/workspace/ventiscale/.env.local`
- The `NEXT_PUBLIC_SUPABASE_URL` value is `https://<project-ref>.supabase.co`
- The redirect URI is `https://<project-ref>.supabase.co/auth/v1/callback`

Click Create. A modal pops up with **Client ID** and **Client secret**. Copy both. Treat the secret like any other API key (not in git, not in chat unless to a paste-once destination).

---

## Step 2: Supabase Dashboard

Go to https://supabase.com/dashboard/project/<YOUR-PROJECT-REF>

Sidebar: **Authentication → Providers → Google**.

- Toggle **Enabled** on
- Paste the Google **Client ID** into the Client ID field
- Paste the Google **Client Secret** into the Client Secret field
- Skip "Skip nonce checks" (leave off)
- Save

Sidebar: **Authentication → URL Configuration**.

- Site URL: `https://www.ventiscale.com`
- Redirect URLs (add each, click + to add a row):
  - `https://www.ventiscale.com/auth/callback`
  - `http://localhost:3030/auth/callback`
- Save

---

## Step 3: Verify

After steps 1 and 2 (and after the portal is deployed), navigate to:

https://www.ventiscale.com/login

Click **Sign in with Google**. You should see Google's account picker, choose your account, get redirected back, and land in `/dashboard`.

If you see "Access blocked: This app's request is invalid":
- The redirect URI in Google Cloud Console doesn't exactly match Supabase's callback URL. Double-check it's `https://<project-ref>.supabase.co/auth/v1/callback` (HTTPS, exact subdomain).

If you see "Error 400: redirect_uri_mismatch":
- Same as above. Google is strict about exact-match.

If you sign in but land on the orphan empty state ("No workspace"):
- Your auth.users row exists but no client_users membership. Run:
  ```bash
  cd ~/.openclaw/workspace/ventiscale
  python scripts/seed-client-user.py --email <your-email> --client-slug sprinkler-guard --role owner --confirm
  ```

---

## What this does NOT include

- **Drive scope.** The OAuth flow requests only `email` and `profile`. We don't ask for Drive access. The Drive iframe previews still rely on the user being signed into a Google account that has access to the file (which they will be, since they just signed in with Google).

  If we later want server-side Drive thumbnail fetching (so previews work even if the user signs out of Google), we'd add `drive.readonly` scope here and store refresh tokens. Separate decision.

- **Verification.** The app stays in "Testing" mode by default. Only test users you list in Step 1b can sign in. For 1-3 known clients, this is fine. To open it to anyone with a Google account, click **Publish App** on the OAuth consent screen.

---

## Rolling it back

If anything breaks, disable Google in Supabase Dashboard → Authentication → Providers → Google → toggle off. The "Sign in with Google" button will surface an `oauth_failed` error to the user; the email/manual fallback path (`/login?manual=1`) still works for admins, and `scripts/login-link.py` still mints links via service role.
