import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Magic-link landing URL. Supabase sends the user here with a one-time
// `code` query param; we exchange it for a session cookie, then redirect
// into the portal. On failure we send them back to /login with an error
// flag so the form can surface a helpful message.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

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
