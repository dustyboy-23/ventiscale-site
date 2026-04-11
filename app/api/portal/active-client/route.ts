import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Sets the vs-active-client cookie. Used by the sidebar workspace
// switcher.
//
// Defense in depth: even though getPortalSession() re-validates the
// cookie against the user's actual memberships on every render (so a
// tampered cookie can never expose another client's data), we still
// require an authed user here AND check that the requested clientId
// is one they belong to. A bogus clientId returns 403 instead of
// silently being ignored.
//
// Lives as a route handler instead of a server action because server
// actions + redirect() drop Supabase auth cookie writes that middleware
// made during the same POST, which caused the switcher to log users out.
export async function POST(request: NextRequest) {
  let clientId: string | undefined;
  try {
    const body = await request.json();
    clientId = typeof body?.clientId === "string" ? body.clientId : undefined;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_body" }, { status: 400 });
  }

  if (!clientId) {
    return NextResponse.json({ ok: false, error: "missing_client_id" }, { status: 400 });
  }

  // Require auth + confirm the user is actually a member of this client.
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return NextResponse.json({ ok: false, error: "auth_unavailable" }, { status: 503 });
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }

  const { data: membership } = await supabase
    .from("client_users")
    .select("client_id")
    .eq("user_id", user.id)
    .eq("client_id", clientId)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("vs-active-client", clientId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
