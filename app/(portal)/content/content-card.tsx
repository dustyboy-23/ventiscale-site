"use client";

import { useMemo, useState, useTransition } from "react";
import { Card } from "@/components/card";
import { Check, X, MessageSquare, Loader2, Calendar, CornerDownRight } from "lucide-react";
import { reviewContent } from "./actions";
import type { ContentDraft } from "@/lib/sg-data";

const PLATFORM_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  facebook: { label: "Facebook", bg: "bg-blue-50", text: "text-blue-700" },
  linkedin: { label: "LinkedIn", bg: "bg-sky-50", text: "text-sky-700" },
  blog: { label: "Blog", bg: "bg-amber-50", text: "text-amber-700" },
  instagram: { label: "Instagram", bg: "bg-pink-50", text: "text-pink-700" },
  other: { label: "Social", bg: "bg-slate-100", text: "text-slate-700" },
};

const STATUS_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  approved: { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-700" },
  rejected: { label: "Needs changes", bg: "bg-red-50", text: "text-red-600" },
  published: { label: "Published", bg: "bg-slate-100", text: "text-slate-600" },
};

type Role = "owner" | "admin" | "viewer";

// Returns "YYYY-MM-DDTHH:mm" (no timezone) for use as a datetime-local value.
// Default: now + 1 hour, rounded up to the nearest 15 minutes.
function defaultScheduleValue(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  d.setSeconds(0, 0);
  const minutes = d.getMinutes();
  const rounded = Math.ceil(minutes / 15) * 15;
  if (rounded === 60) {
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
  } else {
    d.setMinutes(rounded);
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Convert an ISO timestamptz string from the server into a datetime-local
// value bound to the user's local timezone.
function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatScheduledFor(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function ContentCard({
  draft,
  role = "owner",
}: {
  draft: ContentDraft;
  role?: Role;
}) {
  const [status, setStatus] = useState(draft.status);
  const [scheduledAt, setScheduledAt] = useState<string | null>(draft.scheduledAt);
  const [notes, setNotes] = useState(draft.reviewerNotes || "");
  const [showNotes, setShowNotes] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [previewMode, setPreviewMode] = useState<"img" | "iframe">("img");
  const [scheduleValue, setScheduleValue] = useState<string>(() =>
    draft.scheduledAt ? isoToLocalInput(draft.scheduledAt) : defaultScheduleValue(),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const platform = PLATFORM_STYLES[draft.platform] || PLATFORM_STYLES.other;
  const badge = STATUS_BADGE[status];
  const canReview = (status === "draft" || status === "scheduled") && role !== "viewer";

  const approvedFor = useMemo(() => {
    if (status !== "approved" || !scheduledAt) return null;
    return formatScheduledFor(scheduledAt);
  }, [status, scheduledAt]);

  function handleApprove() {
    setError(null);
    if (!showSchedule) {
      setShowSchedule(true);
      return;
    }
    if (!scheduleValue) {
      setError("Pick a date and time first.");
      return;
    }
    const iso = new Date(scheduleValue).toISOString();
    startTransition(async () => {
      const res = await reviewContent(draft.id, "approved", notes || undefined, iso);
      if (res.ok) {
        setStatus("approved");
        setScheduledAt(iso);
        setShowSchedule(false);
      } else {
        setError(res.error);
      }
    });
  }

  function handleReject() {
    setError(null);
    if (!notes.trim()) {
      setShowNotes(true);
      return;
    }
    startTransition(async () => {
      const res = await reviewContent(draft.id, "rejected", notes);
      if (res.ok) {
        setStatus("rejected");
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <Card padding="md">
      {/* Header: platform + status */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${platform.bg} ${platform.text} px-2 py-1 rounded`}
        >
          {platform.label}
        </span>
        {badge && (
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider ${badge.bg} ${badge.text} px-2 py-1 rounded`}
          >
            {badge.label}
            {approvedFor ? ` · ${approvedFor}` : ""}
          </span>
        )}
        {draft.isProductPost && (
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2 py-1 rounded">
            Product
          </span>
        )}
      </div>

      {/* Title at the top of the card so it leads even when caption is long. */}
      <h3 className="text-[14px] font-semibold text-[var(--color-ink)] tracking-tight mb-2 leading-snug">
        {draft.topic}
      </h3>

      {/* Caption / description above the image so the writing leads
          and the visual supports it. Hidden for LinkedIn text posts
          since their preview block already shows the caption inline
          (avoid duplicating the same text twice on the card). */}
      {draft.caption && !(draft.platform === "linkedin" && !draft.driveFileId) && (
        <p className="text-[12.5px] text-[var(--color-ink-muted)] leading-relaxed whitespace-pre-line mb-3">
          {draft.caption}
        </p>
      )}

      {/* Drive asset preview.
            For images: try direct CDN <img>; on error fall back to iframe.
            For videos: skip the img attempt entirely and use the iframe
              player so Ken can press play on the card. lh3 only returns
              a still frame for videos which would block playback. */}
      {draft.driveFileId && (
        <div className="mb-3 -mx-1">
          {draft.mediaType === "video" ? (
            <iframe
              src={`https://drive.google.com/file/d/${draft.driveFileId}/preview`}
              className="w-full h-[380px] rounded-lg border border-[var(--color-border)] bg-black block"
              title="Video preview"
              loading="lazy"
              allow="autoplay"
            />
          ) : previewMode === "img" ? (
            <a
              href={`https://drive.google.com/file/d/${draft.driveFileId}/view`}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)]"
            >
              <img
                src={`https://lh3.googleusercontent.com/d/${draft.driveFileId}=w1200`}
                alt="Draft asset preview"
                className="w-full max-h-[380px] object-contain block bg-white"
                loading="lazy"
                onError={() => setPreviewMode("iframe")}
              />
            </a>
          ) : (
            <iframe
              src={`https://drive.google.com/file/d/${draft.driveFileId}/preview`}
              className="w-full h-[380px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] block"
              title="Asset preview"
              loading="lazy"
              allow="autoplay"
            />
          )}
        </div>
      )}

      {/* LinkedIn-styled preview for text-only posts (no Drive image
          attached). Same height as the photo preview area so the cards
          line up on /content. Renders the post in a LinkedIn-feed-style
          mockup so Ken sees what it'll look like on his profile. */}
      {!draft.driveFileId && draft.platform === "linkedin" && (
        <div className="mb-3 -mx-1">
          <div className="rounded-lg border border-[#0A66C2]/20 bg-gradient-to-br from-[#EFF4F9] to-white h-[520px] flex flex-col overflow-hidden">
            {/* Faux LinkedIn post header */}
            <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-3 border-b border-[#0A66C2]/10">
              <div className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-[#000000DE] truncate">
                  Ken Kwiatkowski
                </div>
                <div className="text-[11px] text-[#00000099]">
                  Founder, Sprinkler-Guard · LinkedIn post
                </div>
              </div>
            </div>

            {/* Post body excerpt (first ~6 lines) */}
            <div className="flex-1 px-4 py-3.5 overflow-hidden">
              <p className="text-[13px] text-[#000000DE] leading-relaxed whitespace-pre-line line-clamp-[20]">
                {draft.caption || "(no body)"}
              </p>
            </div>

            {/* Footer: faux engagement bar */}
            <div className="px-4 py-2.5 border-t border-[#0A66C2]/10 bg-white/40 flex items-center gap-4 text-[11px] text-[#00000099]">
              <span>👍 Like</span>
              <span>💬 Comment</span>
              <span>↗️ Share</span>
              <span className="ml-auto text-[10px] uppercase tracking-wider font-medium text-[#0A66C2]">
                Preview
              </span>
            </div>
          </div>
        </div>
      )}

      {/* First-comment / story-comment prompts. Shown below the image,
          stacked, indented with a corner-arrow so they read as
          replies-to-the-post. Hidden when there are none. */}
      {draft.comments && draft.comments.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {draft.comments.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-[12px] text-[var(--color-ink-muted)] leading-relaxed pl-1"
            >
              <CornerDownRight
                className="w-3 h-3 mt-1 text-[var(--color-ink-subtle)] shrink-0"
                strokeWidth={2.25}
              />
              <span className="whitespace-pre-line">{c}</span>
            </div>
          ))}
        </div>
      )}

      {/* Reviewer notes (if rejected) */}
      {status === "rejected" && draft.reviewerNotes && !showNotes && (
        <div className="mt-2 p-2.5 bg-red-50 rounded-lg">
          <p className="text-[12px] text-red-600 leading-relaxed">
            <span className="font-semibold">Note:</span> {draft.reviewerNotes}
          </p>
        </div>
      )}

      {/* Review actions */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        {canReview ? (
          <div className="space-y-3">
            {/* Schedule picker. Appears on first Approve click. */}
            {showSchedule && (
              <div className="p-3 bg-[var(--color-surface-muted)] rounded-lg space-y-2">
                <label className="flex items-center gap-2 text-[12px] font-medium text-[var(--color-ink-muted)]">
                  <Calendar className="w-3.5 h-3.5" />
                  When should this go out?
                </label>
                <input
                  type="datetime-local"
                  value={scheduleValue}
                  onChange={(e) => setScheduleValue(e.target.value)}
                  className="w-full text-[13px] p-2 rounded border border-[var(--color-border)] bg-white text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                />
                <p className="text-[11px] text-[var(--color-ink-subtle)]">
                  Local time. Click Approve again to confirm.
                </p>
              </div>
            )}

            {/* Notes input */}
            {showNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note (required for changes)..."
                className="w-full text-[13px] p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                rows={2}
              />
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleApprove}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                )}
                {showSchedule ? "Confirm approval" : "Approve"}
              </button>

              <button
                onClick={handleReject}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                )}
                Needs changes
              </button>

              {!showNotes && (
                <button
                  onClick={() => setShowNotes(true)}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-ink-subtle)] hover:text-[var(--color-ink-muted)] px-2 py-2 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Add note
                </button>
              )}
            </div>

            {error && (
              <p className="text-[12px] text-red-600">{error}</p>
            )}
          </div>
        ) : (
          <p className="text-[12px] text-[var(--color-ink-subtle)]">
            {status === "approved" &&
              (approvedFor
                ? `You approved this. Scheduled for ${approvedFor}.`
                : "You approved this post.")}
            {status === "rejected" && "Flagged for changes."}
            {status === "published" && "This post has been published."}
            {(status === "draft" || status === "scheduled") && role === "viewer" &&
              "Read-only access. Ask the workspace owner to review."}
          </p>
        )}
      </div>
    </Card>
  );
}
