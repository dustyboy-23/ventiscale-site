import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Allow only same-origin, absolute-path redirects after sign-in. This
// stops `?next=//evil.com` from turning the callback into an open
// redirect (which would leak the auth context via the Referer header
// once the browser jumped off-site).
function safeNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  // Must be an absolute path on our own origin: starts with `/`, does
  // not start with `//` (protocol-relative) or `/\\` (backslash trick).
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//") || raw.startsWith("/\\")) return "/dashboard";
  // Strip CR/LF (header-injection paranoia) and cap length. A legitimate
  // post-login destination is always a portal route — short, ASCII path
  // characters only. Anything weirder gets the safe default.
  const cleaned = raw.replace(/[\r\n]/g, "");
  if (cleaned.length > 200) return "/dashboard";
  if (!/^\/[A-Za-z0-9_\-./?=&%]*$/.test(cleaned)) return "/dashboard";
  return cleaned;
}

// Magic-link landing URL. Supabase sends the user here with a one-time
// `code` query param; we exchange it for a session cookie, then redirect
// into the portal. On failure we send them back to /login with an error
// flag so the form can surface a helpful message.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] exchange failed", error.message);
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    }
    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    console.error("[auth/callback] threw", err);
    return NextResponse.redirect(`${origin}/login?error=server_error`);
  }
}
