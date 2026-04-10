import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface ClientRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  brandColor: string | null;
  logoUrl: string | null;
  isAgency: boolean;
  isDemo: boolean;
}

export type PortalSession =
  | {
      mode: "demo";
      client: ClientRecord;
      userEmail: null;
      role: null;
    }
  | {
      mode: "real";
      client: ClientRecord;
      userEmail: string;
      role: "owner" | "admin" | "viewer";
    }
  | {
      mode: "orphan";
      client: null;
      userEmail: string;
      role: null;
    };

const DEMO_CLIENT: ClientRecord = {
  id: "demo",
  slug: "stoneline",
  name: "Stoneline Apparel",
  tagline: "Premium menswear · Built to last",
  brandColor: "#1F3D2B",
  logoUrl: null,
  isAgency: false,
  isDemo: true,
};

// Single source of truth for "who is viewing the portal right now".
//
// Resolution order:
//   1. Authed user with at least one client_users row → mode: "real"
//   2. Authed user with no memberships → mode: "orphan" (show empty state)
//   3. No auth but vs-demo cookie set → mode: "demo" (Stoneline fallback)
//   4. None of the above → null (layout redirects to /login)
//
// Wrapped in React cache() so every Server Component in one request
// shares the result instead of re-querying Supabase.
export const getPortalSession = cache(async (): Promise<PortalSession | null> => {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("vs-demo")?.value === "1";

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return isDemo
      ? { mode: "demo", client: DEMO_CLIENT, userEmail: null, role: null }
      : null;
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return isDemo
      ? { mode: "demo", client: DEMO_CLIENT, userEmail: null, role: null }
      : null;
  }

  const { data: memberships } = await supabase
    .from("client_users")
    .select("role, client_id, clients(id, slug, name, tagline, brand_color, logo_url, is_agency)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1);

  const row = memberships?.[0];
  const clientRow = row?.clients as unknown as
    | {
        id: string;
        slug: string;
        name: string;
        tagline: string | null;
        brand_color: string | null;
        logo_url: string | null;
        is_agency: boolean;
      }
    | undefined;

  if (!row || !clientRow) {
    return {
      mode: "orphan",
      client: null,
      userEmail: user.email ?? "",
      role: null,
    };
  }

  return {
    mode: "real",
    client: {
      id: clientRow.id,
      slug: clientRow.slug,
      name: clientRow.name,
      tagline: clientRow.tagline,
      brandColor: clientRow.brand_color,
      logoUrl: clientRow.logo_url,
      isAgency: clientRow.is_agency,
      isDemo: false,
    },
    userEmail: user.email ?? "",
    role: row.role as "owner" | "admin" | "viewer",
  };
});
