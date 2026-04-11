import { NextRequest, NextResponse } from "next/server";

// Sets the vs-active-client cookie. Used by the sidebar workspace
// switcher. We deliberately do NOT call supabase.auth.getUser() here —
// see the comment in getPortalSession for the real access gate. This
// endpoint just records a hint; the next render validates it against
// the user's actual memberships.
//
// Lives as a route handler instead of a server action because server
// actions + redirect() drop Supabase auth cookie writes that middleware
// made during the same POST, which caused the switcher to log users out.
//
// We set the cookie on the NextResponse object directly (instead of via
// `cookies()` from next/headers) because that's the canonical route
// handler pattern and avoids any cookie-store merging weirdness with
// the middleware-refreshed auth cookies.
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

  console.log("[active-client] setting cookie", { clientId });

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
