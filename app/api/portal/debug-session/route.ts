import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// Diagnostic endpoint for the workspace switcher bug. Hit this after
// clicking a workspace to see exactly what the server sees: the request
// host, all cookies (names + truncated values), the user, and what
// Supabase returns for the session.
export async function GET(_req: NextRequest) {
  const jar = await cookies();
  const hdrs = await headers();

  const host = hdrs.get("host");
  const referer = hdrs.get("referer");

  const cookieList = jar.getAll().map((c) => ({
    name: c.name,
    valuePreview: c.value.length > 40 ? `${c.value.slice(0, 40)}…` : c.value,
    valueLength: c.value.length,
  }));

  const activeClientId = jar.get("vs-active-client")?.value ?? null;
  const vsDemo = jar.get("vs-demo")?.value ?? null;

  // List cookie names that look like Supabase auth cookies
  const sbCookieNames = cookieList
    .map((c) => c.name)
    .filter((n) => n.startsWith("sb-"));

  let userInfo: Record<string, unknown> = {};
  let memberships: unknown = null;
  let membershipErr: string | null = null;
  try {
    const supabase = await createClient();
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    userInfo = {
      hasUser: Boolean(userData.user),
      userId: userData.user?.id ?? null,
      email: userData.user?.email ?? null,
      userErr: userErr?.message ?? null,
    };

    if (userData.user) {
      const { data, error } = await supabase
        .from("client_users")
        .select("role, client_id, clients(id, slug, name, is_agency)")
        .eq("user_id", userData.user.id);
      memberships = data;
      membershipErr = error?.message ?? null;
    }
  } catch (err) {
    userInfo = { threw: err instanceof Error ? err.message : String(err) };
  }

  return NextResponse.json({
    host,
    referer,
    activeClientId,
    vsDemo,
    sbCookieNames,
    allCookies: cookieList,
    user: userInfo,
    memberships,
    membershipErr,
  });
}
