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

export interface MembershipSummary {
  id: string;
  slug: string;
  name: string;
  role: "owner" | "admin" | "viewer";
  isAgency: boolean;
}

type MembershipRow = {
  role: "owner" | "admin" | "viewer";
  client_id: string;
  clients: {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    brand_color: string | null;
    logo_url: string | null;
    is_agency: boolean;
  } | null;
};

// Single source of truth for "who is viewing the portal right now".
//
// Resolution order:
//   1. Authed user with at least one client_users row → mode: "real"
//      - If vs-active-client cookie matches one of their memberships, use it
//      - Otherwise default to oldest membership (created_at asc)
//   2. Authed user with no memberships → mode: "orphan" (show empty state)
//   3. No auth but vs-demo cookie set → mode: "demo" (Stoneline fallback)
//   4. None of the above → null (layout redirects to /login)
//
// Wrapped in React cache() so every Server Component in one request
// shares the result instead of re-querying Supabase.
export const getPortalSession = cache(async (): Promise<PortalSession | null> => {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("vs-demo")?.value === "1";
  const activeClientId = cookieStore.get("vs-active-client")?.value;

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    console.error("[portal-session] createClient threw", err);
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

  const { data: memberships, error: membershipsErr } = await supabase
    .from("client_users")
    .select("role, client_id, clients(id, slug, name, tagline, brand_color, logo_url, is_agency)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (membershipsErr) {
    console.error("[portal-session] memberships query failed");
  }

  const rows = (memberships ?? []) as unknown as MembershipRow[];
  const valid = rows.filter((r): r is MembershipRow & { clients: NonNullable<MembershipRow["clients"]> } => Boolean(r.clients));

  if (valid.length === 0) {
    return {
      mode: "orphan",
      client: null,
      userEmail: user.email ?? "",
      role: null,
    };
  }

  const active = (activeClientId && valid.find((r) => r.client_id === activeClientId)) || valid[0];
  const clientRow = active.clients;

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
    role: active.role,
  };
});

// Returns all client memberships for the current user. Used by the sidebar
// switcher when the user has 2+ workspaces. Cached per request alongside
// getPortalSession so it doesn't re-query.
export const getMemberships = cache(async (): Promise<MembershipSummary[]> => {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return [];
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return [];

  const { data: memberships } = await supabase
    .from("client_users")
    .select("role, client_id, clients(id, slug, name, tagline, brand_color, logo_url, is_agency)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const rows = (memberships ?? []) as unknown as MembershipRow[];
  return rows
    .filter((r): r is MembershipRow & { clients: NonNullable<MembershipRow["clients"]> } => Boolean(r.clients))
    .map((r) => ({
      id: r.clients.id,
      slug: r.clients.slug,
      name: r.clients.name,
      role: r.role,
      isAgency: r.clients.is_agency,
    }));
});
