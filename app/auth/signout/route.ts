import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Sign-out endpoint. POST-ONLY — do not add a GET handler. Next.js
// <Link> prefetches destinations on hover, and a GET-capable signout
// meant the router was silently signing users out in the background
// every time the sidebar rendered. The sidebar's sign-out control
// must be a form POST (or client fetch POST), never a bare <Link>.
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
  response.cookies.set("vs-active-client", "", { path: "/", maxAge: 0 });
  return response;
}
