import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type SocialPlatform = "tiktok" | "instagram" | "facebook" | "linkedin";

export type ScheduledPostStatus =
  | "queued"
  | "processing"
  | "partial"
  | "success"
  | "failed"
  | "canceled";

export interface ScheduledPostRow {
  id: string;
  clientId: string;
  clientSlug: string;
  clientName: string;
  caption: string;
  mediaR2Keys: string[];
  scheduledFor: string;
  platforms: SocialPlatform[];
  status: ScheduledPostStatus;
  createdAt: string;
}

export interface SocialKpis {
  scheduledThisWeek: number;
  publishedLast7d: number;
  failedLast7d: number;
}

export interface SocialAccountRow {
  id: string;
  clientId: string;
  clientSlug: string;
  clientName: string;
  platform: SocialPlatform;
  accountHandle: string;
  accountId: string;
  credentialsEnvPath: string;
  status: "active" | "expired" | "disabled";
  lastUsedAt: string | null;
  createdAt: string;
}

// Lists scheduled_posts visible to the authed user for the given team's
// managed clients. RLS handles the access filtering — we just join clients
// in for display name/slug.
export const getScheduledPostsForTeam = cache(
  async (teamId: string, limit = 100): Promise<ScheduledPostRow[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("scheduled_posts")
      .select(`
        id, client_id, caption, media_r2_keys, scheduled_for, platforms,
        status, created_at,
        clients!inner(slug, name),
        team_clients:clients!inner(team_clients!inner(team_id))
      `)
      .eq("clients.team_clients.team_id", teamId)
      .order("scheduled_for", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    type Row = {
      id: string;
      client_id: string;
      caption: string;
      media_r2_keys: string[];
      scheduled_for: string;
      platforms: string[];
      status: ScheduledPostStatus;
      created_at: string;
      clients: { slug: string; name: string } | null;
    };

    return (data as unknown as Row[])
      .filter((r) => r.clients !== null)
      .map((r) => ({
        id: r.id,
        clientId: r.client_id,
        clientSlug: r.clients!.slug,
        clientName: r.clients!.name,
        caption: r.caption,
        mediaR2Keys: r.media_r2_keys,
        scheduledFor: r.scheduled_for,
        platforms: r.platforms as SocialPlatform[],
        status: r.status,
        createdAt: r.created_at,
      }));
  },
);

// KPIs at the top of the queue page. Single query — three filtered counts.
export const getSocialKpis = cache(
  async (teamId: string): Promise<SocialKpis> => {
    const supabase = await createClient();

    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Three counts via parallel queries. Counts are cheap with the partial
    // status index; the RLS subquery + team filter handle visibility.
    const [scheduled, published, failed] = await Promise.all([
      supabase
        .from("scheduled_posts")
        .select("id, clients!inner(team_clients!inner(team_id))", {
          count: "exact",
          head: true,
        })
        .eq("status", "queued")
        .gte("scheduled_for", now.toISOString())
        .lte("scheduled_for", weekFromNow.toISOString())
        .eq("clients.team_clients.team_id", teamId),
      supabase
        .from("scheduled_posts")
        .select("id, clients!inner(team_clients!inner(team_id))", {
          count: "exact",
          head: true,
        })
        .eq("status", "success")
        .gte("scheduled_for", weekAgo.toISOString())
        .eq("clients.team_clients.team_id", teamId),
      supabase
        .from("scheduled_posts")
        .select("id, clients!inner(team_clients!inner(team_id))", {
          count: "exact",
          head: true,
        })
        .in("status", ["failed", "partial"])
        .gte("scheduled_for", weekAgo.toISOString())
        .eq("clients.team_clients.team_id", teamId),
    ]);

    return {
      scheduledThisWeek: scheduled.count ?? 0,
      publishedLast7d: published.count ?? 0,
      failedLast7d: failed.count ?? 0,
    };
  },
);

export const getScheduledPostById = cache(
  async (postId: string): Promise<ScheduledPostRow | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("scheduled_posts")
      .select(`
        id, client_id, caption, media_r2_keys, scheduled_for, platforms,
        status, created_at,
        clients!inner(slug, name)
      `)
      .eq("id", postId)
      .maybeSingle();

    if (error || !data) return null;
    type Row = {
      id: string;
      client_id: string;
      caption: string;
      media_r2_keys: string[];
      scheduled_for: string;
      platforms: string[];
      status: ScheduledPostStatus;
      created_at: string;
      clients: { slug: string; name: string } | null;
    };
    const r = data as unknown as Row;
    if (!r.clients) return null;
    return {
      id: r.id,
      clientId: r.client_id,
      clientSlug: r.clients.slug,
      clientName: r.clients.name,
      caption: r.caption,
      mediaR2Keys: r.media_r2_keys,
      scheduledFor: r.scheduled_for,
      platforms: r.platforms as SocialPlatform[],
      status: r.status,
      createdAt: r.created_at,
    };
  },
);

export interface PostAttemptRow {
  id: string;
  scheduledPostId: string;
  platform: SocialPlatform;
  socialAccountId: string | null;
  attemptedAt: string;
  status: "success" | "failed";
  platformPostId: string | null;
  platformPostUrl: string | null;
  errorMessage: string | null;
}

export const getPostAttempts = cache(
  async (scheduledPostId: string): Promise<PostAttemptRow[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("post_attempts")
      .select(`
        id, scheduled_post_id, platform, social_account_id, attempted_at,
        status, platform_post_id, platform_post_url, error_message
      `)
      .eq("scheduled_post_id", scheduledPostId)
      .order("attempted_at", { ascending: false });

    if (error || !data) return [];
    type Row = {
      id: string;
      scheduled_post_id: string;
      platform: string;
      social_account_id: string | null;
      attempted_at: string;
      status: "success" | "failed";
      platform_post_id: string | null;
      platform_post_url: string | null;
      error_message: string | null;
    };
    return (data as Row[]).map((r) => ({
      id: r.id,
      scheduledPostId: r.scheduled_post_id,
      platform: r.platform as SocialPlatform,
      socialAccountId: r.social_account_id,
      attemptedAt: r.attempted_at,
      status: r.status,
      platformPostId: r.platform_post_id,
      platformPostUrl: r.platform_post_url,
      errorMessage: r.error_message,
    }));
  },
);

export const getSocialAccountsForTeam = cache(
  async (teamId: string): Promise<SocialAccountRow[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("social_accounts")
      .select(`
        id, client_id, platform, account_handle, account_id,
        credentials_env_path, status, last_used_at, created_at,
        clients!inner(slug, name, team_clients!inner(team_id))
      `)
      .eq("clients.team_clients.team_id", teamId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    type Row = {
      id: string;
      client_id: string;
      platform: string;
      account_handle: string;
      account_id: string;
      credentials_env_path: string;
      status: "active" | "expired" | "disabled";
      last_used_at: string | null;
      created_at: string;
      clients: { slug: string; name: string } | null;
    };
    return (data as unknown as Row[])
      .filter((r) => r.clients !== null)
      .map((r) => ({
        id: r.id,
        clientId: r.client_id,
        clientSlug: r.clients!.slug,
        clientName: r.clients!.name,
        platform: r.platform as SocialPlatform,
        accountHandle: r.account_handle,
        accountId: r.account_id,
        credentialsEnvPath: r.credentials_env_path,
        status: r.status,
        lastUsedAt: r.last_used_at,
        createdAt: r.created_at,
      }));
  },
);
