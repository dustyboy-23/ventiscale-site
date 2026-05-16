import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Middleware runs on every matched request. It does two jobs:
//
// 1. Refresh the Supabase session by round-tripping auth cookies. Without
//    this, long-lived sessions would silently expire on the server and
//    users would see unauthenticated state even when logged in.
// 2. Generate a per-request nonce, set it on a request header so server
//    components can read it (`headers().get('x-nonce')`), and emit a
//    Content-Security-Policy with `'nonce-{value}'` for inline scripts.
//
// CSP posture (M3 — hardened 2026-05-14): script-src lists 'nonce-{value}'
// only. The 5/11 audit confirmed all 244 inline <script> blocks across 84
// files carry nonce={nonce}. After 72h+ clean soak of commit 5791b3b
// (final un-nonced gap fix), 'unsafe-inline' removed. style-src keeps
// 'unsafe-inline' because React emits inline styles and removing it
// breaks the site.
//
// Designed to fail-open: if Supabase env vars are missing, the auth
// refresh is skipped but the nonce + CSP still apply.

function generateNonce(): string {
  // 16 random bytes encoded as base64. Cryptographically random, unique
  // per request. Browsers accept any non-empty token; 16 bytes is the
  // commonly-cited minimum for unguessability.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce: string): string {
  // React + Turbopack dev mode requires eval() for HMR + error introspection
  // (reconstructing callstacks from React server components). Production
  // never uses eval(); the M3-hardened script-src stays nonce-only there.
  // Origin: 2026-05-15 — dev server blank-screened after CSP M3 landed 5/14.
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com`
      : `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://va.vercel-scripts.com`;
  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.googleusercontent.com https://drive.google.com https://www.google-analytics.com",
    "font-src 'self' data:",
    "frame-src https://*.google.com https://drive.google.com",
    "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.vercel-insights.com https://va.vercel-scripts.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

export async function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // Forward the nonce to server components via a request header.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touch the user to trigger cookie refresh. Result is intentionally ignored
  // here — per-route gating happens in layouts when we're ready for it.
  await supabase.auth.getUser();

  // Set CSP on the final response (after any cookie-refresh re-creation).
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    // Run on everything except static assets, Next internals, and the
    // active-client cookie setter. The cookie setter is deliberately
    // excluded because the middleware's Supabase refresh creates its own
    // NextResponse, and the route handler creates a different one for
    // its JSON reply — the two can clobber each other's cookies, which
    // was causing the workspace switcher to drop the user's auth.
    "/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|robots.txt|sitemap.xml|api/portal/active-client|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
