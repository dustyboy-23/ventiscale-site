import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Sign-out endpoint. Kills the Supabase session if one exists, clears the
// vs-demo cookie, then sends the user back to /login. Safe to hit while
// unauthenticated — signOut() is a no-op without a session.
export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // No Supabase configured — nothing to sign out of.
  }
  const response = NextResponse.redirect(`${origin}/login`, { status: 303 });
  response.cookies.set("vs-demo", "", { path: "/", maxAge: 0 });
  return response;
}

// Allow GET too so the sidebar link works without JS.
export async function GET(request: NextRequest) {
  return POST(request);
}
