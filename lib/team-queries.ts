import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface TeamRecord {
  id: string;
  slug: string;
  name: string;
  brandColor: string | null;
  logoUrl: string | null;
  ownerId: string;
}

export interface ManagedClient {
  id: string;
  slug: string;
  name: string;
  brandColor: string | null;
  isAgency: boolean;
}

export interface TeamSession {
  team: TeamRecord;
  role: "owner" | "lead" | "editor" | "viewer";
  userId: string;
}

// Resolves the team for the authed user. Returns null if user is not on any team.
// Cached per-request via React `cache`.
export const getTeamSession = cache(
  async (slug: string): Promise<TeamSession | null> => {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return null;

    const { data, error } = await supabase
      .from("teams")
      .select(`
        id, slug, name, brand_color, logo_url, owner_id,
        team_members!inner(role, user_id)
      `)
      .eq("slug", slug)
      .eq("team_members.user_id", authData.user.id)
      .maybeSingle();

    if (error || !data) return null;
    const member = (data.team_members as Array<{ role: string; user_id: string }>)[0];
    if (!member) return null;

    return {
      team: {
        id: data.id,
        slug: data.slug,
        name: data.name,
        brandColor: data.brand_color,
        logoUrl: data.logo_url,
        ownerId: data.owner_id,
      },
      role: member.role as TeamSession["role"],
      userId: authData.user.id,
    };
  },
);

export const getManagedClients = cache(
  async (teamId: string): Promise<ManagedClient[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_clients")
      .select(`
        client_id,
        clients(id, slug, name, brand_color, is_agency)
      `)
      .eq("team_id", teamId);

    if (error || !data) return [];
    type Row = { client_id: string; clients: { id: string; slug: string; name: string; brand_color: string | null; is_agency: boolean } | null };
    return (data as unknown as Row[])
      .filter((r) => r.clients !== null)
      .map((r) => ({
        id: r.clients!.id,
        slug: r.clients!.slug,
        name: r.clients!.name,
        brandColor: r.clients!.brand_color,
        isAgency: r.clients!.is_agency,
      }));
  },
);

export interface TeamPerformanceSnapshot {
  snapshotDate: string;
  totalReach: number | null;
  totalEngagement: number | null;
  totalPublished: number | null;
  avgRoas: number | null;
  cronFailuresToday: number | null;
}

export const getLatestSnapshot = cache(
  async (teamId: string): Promise<TeamPerformanceSnapshot | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_performance_snapshots")
      .select("snapshot_date, total_reach, total_engagement, total_published, avg_roas, cron_failures_today")
      .eq("team_id", teamId)
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return {
      snapshotDate: data.snapshot_date,
      totalReach: data.total_reach,
      totalEngagement: data.total_engagement,
      totalPublished: data.total_published,
      avgRoas: data.avg_roas,
      cronFailuresToday: data.cron_failures_today,
    };
  },
);

export interface ClientHealthRow {
  clientId: string;
  clientSlug: string;
  clientName: string;
  contentLast7d: number;
  lastActivity: string | null;
}

// Cross-client health summary — one row per managed client
export const getClientHealth = cache(
  async (teamId: string): Promise<ClientHealthRow[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("team_client_health", {
      p_team_id: teamId,
    });
    // RPC may not exist yet — gracefully return empty if missing
    if (error || !data) return [];
    return data as ClientHealthRow[];
  },
);
