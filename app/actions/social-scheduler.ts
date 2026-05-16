"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTeamSession } from "@/lib/team-queries";

// Server actions for the social scheduler. Each one re-checks team membership
// before writing — we use the admin client (service-role) for mutations because
// social_accounts + scheduled_posts have deny-user-writes RLS policies.

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

// Create a new client (brand) row + link it to the current team.
export async function createBrand(formData: FormData): Promise<ActionResult> {
  const teamSlug = String(formData.get("team_slug") ?? "");
  const session = await getTeamSession(teamSlug);
  if (!session) return { ok: false, error: "not_authorized" };

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const brandColor = String(formData.get("brand_color") ?? "").trim() || null;

  if (!/^[a-z0-9-]{2,40}$/.test(slug)) {
    return { ok: false, error: "Slug must be 2-40 chars, lowercase letters/numbers/dashes only" };
  }
  if (!name) {
    return { ok: false, error: "Name required" };
  }

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "service unavailable" };

  const { data: brand, error: brandErr } = await admin
    .from("clients")
    .insert({ slug, name, brand_color: brandColor })
    .select("id")
    .single();

  if (brandErr) {
    if (brandErr.code === "23505") return { ok: false, error: "Slug already taken" };
    console.error("[createBrand] insert failed", brandErr);
    return { ok: false, error: "Could not create brand" };
  }

  const { error: linkErr } = await admin
    .from("team_clients")
    .insert({ team_id: session.team.id, client_id: brand.id });

  if (linkErr) {
    console.error("[createBrand] team_clients link failed", linkErr);
    // Brand created but link failed — surface but don't roll back; cron + retry would resolve
    return { ok: false, error: "Brand created but team link failed; contact ops" };
  }

  revalidatePath(`/${teamSlug}/social/accounts`);
  return { ok: true, id: brand.id };
}

// Create a new social account (channel) for a brand the team manages.
export async function createSocialAccount(formData: FormData): Promise<ActionResult> {
  const teamSlug = String(formData.get("team_slug") ?? "");
  const session = await getTeamSession(teamSlug);
  if (!session) return { ok: false, error: "not_authorized" };

  const clientId = String(formData.get("client_id") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const handle = String(formData.get("account_handle") ?? "").trim();
  const accountId = String(formData.get("account_id") ?? "").trim();
  const credsPath = String(formData.get("credentials_env_path") ?? "").trim();

  if (!["tiktok", "instagram", "facebook", "linkedin"].includes(platform)) {
    return { ok: false, error: "Invalid platform" };
  }
  if (!handle || !accountId || !credsPath) {
    return { ok: false, error: "Handle, account ID, and credentials path are all required" };
  }
  if (!credsPath.startsWith("~/.secure/") && !credsPath.startsWith("/home/")) {
    return { ok: false, error: "Credentials path must be under ~/.secure/ or absolute under /home/" };
  }

  // Re-verify team has access to this client
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "service unavailable" };

  const { data: linked } = await admin
    .from("team_clients")
    .select("client_id")
    .eq("team_id", session.team.id)
    .eq("client_id", clientId)
    .maybeSingle();

  if (!linked) return { ok: false, error: "Brand not managed by this team" };

  const { error } = await admin.from("social_accounts").insert({
    client_id: clientId,
    platform,
    account_handle: handle,
    account_id: accountId,
    credentials_env_path: credsPath,
  });

  if (error) {
    if (error.code === "23505") return { ok: false, error: "This account is already connected" };
    console.error("[createSocialAccount] insert failed", error);
    return { ok: false, error: "Could not save account" };
  }

  revalidatePath(`/${teamSlug}/social/accounts`);
  return { ok: true };
}

// Toggle account status (manual mark expired/disabled/active).
export async function setSocialAccountStatus(formData: FormData): Promise<ActionResult> {
  const teamSlug = String(formData.get("team_slug") ?? "");
  const session = await getTeamSession(teamSlug);
  if (!session) return { ok: false, error: "not_authorized" };

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["active", "expired", "disabled"].includes(status)) {
    return { ok: false, error: "Invalid status" };
  }

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "service unavailable" };

  const { error } = await admin
    .from("social_accounts")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[setSocialAccountStatus] update failed", error);
    return { ok: false, error: "Could not update status" };
  }

  revalidatePath(`/${teamSlug}/social/accounts`);
  return { ok: true };
}

// Create a scheduled post.
export async function createScheduledPost(formData: FormData): Promise<ActionResult> {
  const teamSlug = String(formData.get("team_slug") ?? "");
  const session = await getTeamSession(teamSlug);
  if (!session) return { ok: false, error: "not_authorized" };

  const clientId = String(formData.get("client_id") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  const scheduledFor = String(formData.get("scheduled_for") ?? "");
  const platforms = formData.getAll("platforms").map((p) => String(p));
  const mediaUrlsRaw = String(formData.get("media_r2_keys") ?? "").trim();
  const mediaKeys = mediaUrlsRaw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (!caption) return { ok: false, error: "Caption required" };
  if (!scheduledFor) return { ok: false, error: "Scheduled time required" };
  if (platforms.length === 0) return { ok: false, error: "Pick at least one platform" };
  if (mediaKeys.length === 0) return { ok: false, error: "At least one media URL or R2 key required" };

  const scheduledIso = new Date(scheduledFor).toISOString();
  if (new Date(scheduledIso).getTime() < Date.now() + 60_000) {
    return { ok: false, error: "Scheduled time must be at least 1 minute in the future" };
  }

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "service unavailable" };

  // Verify team has access to this client
  const { data: linked } = await admin
    .from("team_clients")
    .select("client_id")
    .eq("team_id", session.team.id)
    .eq("client_id", clientId)
    .maybeSingle();
  if (!linked) return { ok: false, error: "Brand not managed by this team" };

  // Grab the auth user for created_by
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const createdBy = authData?.user?.id ?? null;

  const { data: post, error } = await admin
    .from("scheduled_posts")
    .insert({
      client_id: clientId,
      caption,
      media_r2_keys: mediaKeys,
      scheduled_for: scheduledIso,
      platforms,
      created_by: createdBy,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[createScheduledPost] insert failed", error);
    return { ok: false, error: "Could not create post" };
  }

  revalidatePath(`/${teamSlug}/social`);
  return { ok: true, id: post.id };
}

// Cancel a queued post.
export async function cancelScheduledPost(formData: FormData): Promise<ActionResult> {
  const teamSlug = String(formData.get("team_slug") ?? "");
  const session = await getTeamSession(teamSlug);
  if (!session) return { ok: false, error: "not_authorized" };

  const id = String(formData.get("id") ?? "");

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "service unavailable" };

  const { error } = await admin
    .from("scheduled_posts")
    .update({ status: "canceled" })
    .eq("id", id)
    .eq("status", "queued");

  if (error) {
    console.error("[cancelScheduledPost] update failed", error);
    return { ok: false, error: "Could not cancel post" };
  }

  revalidatePath(`/${teamSlug}/social`);
  return { ok: true };
}
