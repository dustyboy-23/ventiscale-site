import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// Diagnostic endpoint for the workspace switcher bug. Hit this after
// clicking a workspace to see exactly what the server sees: the user,
// the active-client cookie, and the memberships the session would
// resolve against. Safe to keep around — it only reads your own data
// (RLS gates the query by auth.uid()).
export async function GET() {
  const jar = await cookies();
  const activeClientId = jar.get("vs-active-client")?.value ?? null;
  const allCookieNames = jar.getAll().map((c) => c.name);

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
    activeClientId,
    cookieNames: allCookieNames,
    user: userInfo,
    memberships,
    membershipErr,
  });
}
