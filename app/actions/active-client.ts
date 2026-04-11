"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Switch the active client for the current portal session.
//
// We deliberately do NOT call supabase.auth.getUser() here. Server actions
// in Next.js 16 sometimes can't see the freshly-refreshed auth cookies that
// middleware just wrote, which would cause us to spuriously redirect the
// user to /login. The cookie we set is just a hint — getPortalSession()
// re-validates it against the user's real memberships on the next render
// and falls back to the first valid membership if the hint is bogus. RLS
// is the real gate.
export async function setActiveClient(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  if (!clientId) redirect("/dashboard");

  const cookieStore = await cookies();
  cookieStore.set("vs-active-client", clientId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
