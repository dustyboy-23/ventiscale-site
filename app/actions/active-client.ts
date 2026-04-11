"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Switch the active client for the current portal session. Validates the
// user actually has a client_users row for the requested client_id before
// setting the cookie — defense in depth alongside RLS.
//
// After setting the cookie we revalidate the layout AND redirect to
// /dashboard. The redirect forces a fresh GET so getPortalSession() runs
// against the new cookie and the entire portal chrome rerenders with the
// new client. revalidatePath alone isn't reliable across all Next.js
// caching layers.
export async function setActiveClient(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  if (!clientId) redirect("/dashboard");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("client_users")
    .select("client_id")
    .eq("user_id", user.id)
    .eq("client_id", clientId)
    .maybeSingle();

  if (!membership) redirect("/dashboard");

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
