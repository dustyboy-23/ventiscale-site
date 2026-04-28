"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPortalSession } from "@/lib/current-client";
import { revalidatePath } from "next/cache";

export type ReviewResult = { ok: true } | { ok: false; error: string };

const PLATFORM_LABEL: Record<string, string> = {
  facebook: "Facebook",
  linkedin: "LinkedIn",
  blog: "Blog",
  instagram: "Instagram",
  other: "Social",
};

export async function reviewContent(
  id: string,
  action: "approved" | "rejected",
  notes?: string,
  scheduledAt?: string,
): Promise<ReviewResult> {
  const session = await getPortalSession();
  if (!session || session.mode !== "real") {
    return { ok: false, error: "Not authorized" };
  }

  if (session.role !== "owner" && session.role !== "admin") {
    return { ok: false, error: "Insufficient permissions" };
  }

  if (action === "approved" && !scheduledAt) {
    return { ok: false, error: "Pick a date and time before approving" };
  }

  const supabase = await createClient();

  const update: {
    status: typeof action;
    reviewed_at: string;
    reviewer_notes: string | null;
    scheduled_at?: string;
  } = {
    status: action,
    reviewed_at: new Date().toISOString(),
    reviewer_notes: notes || null,
  };
  if (action === "approved" && scheduledAt) {
    update.scheduled_at = scheduledAt;
  }

  const { data: updated, error } = await supabase
    .from("content_items")
    .update(update)
    .eq("id", id)
    .eq("client_id", session.client.id)
    .select("id, platform, title")
    .single();

  if (error || !updated) {
    console.error("[content] review update failed", error?.message);
    return { ok: false, error: "Update failed" };
  }

  // Audit trail. Best-effort: a failed activity_log insert must not
  // mask the successful approval. The user already saw the status flip.
  try {
    const admin = createAdminClient();
    if (admin) {
      const platformLabel = PLATFORM_LABEL[updated.platform] || "Post";
      const title = `${platformLabel}: ${updated.title}`.slice(0, 200);
      await admin.from("activity_log").insert({
        client_id: session.client.id,
        type: action === "approved" ? "content_approved" : "content_rejected",
        title,
        detail: JSON.stringify({
          content_id: updated.id,
          reviewer_email: session.userEmail,
          reviewer_role: session.role,
          scheduled_at: scheduledAt || null,
          notes: notes || null,
        }),
      });
    }
  } catch (logErr) {
    console.warn("[content] activity_log insert failed (non-fatal)");
  }

  revalidatePath("/content");
  return { ok: true };
}
