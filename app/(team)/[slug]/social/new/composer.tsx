"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CalendarClock, Tag } from "lucide-react";
import { Card } from "@/components/card";
import { PlatformIcon, getPlatformLabel } from "@/components/social/platform-icons";
import { createScheduledPost } from "@/app/actions/social-scheduler";
import type { SocialAccountRow, SocialPlatform } from "@/lib/social-queries";

interface BrandWithChannels {
  id: string;
  slug: string;
  name: string;
  channels: SocialAccountRow[];
}

const CHAR_LIMITS: Record<SocialPlatform, number> = {
  tiktok: 2200,
  instagram: 2200,
  facebook: 63206,
  linkedin: 3000,
};

export function ComposerForm({
  teamSlug,
  brandsWithChannels,
}: {
  teamSlug: string;
  brandsWithChannels: BrandWithChannels[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState(brandsWithChannels[0]?.id ?? "");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialPlatform>>(new Set());
  const [caption, setCaption] = useState("");

  const selectedBrand = useMemo(
    () => brandsWithChannels.find((b) => b.id === selectedBrandId),
    [brandsWithChannels, selectedBrandId],
  );

  // Reset platforms when brand changes
  function onBrandChange(id: string) {
    setSelectedBrandId(id);
    setSelectedPlatforms(new Set());
  }

  function togglePlatform(p: SocialPlatform) {
    const next = new Set(selectedPlatforms);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setSelectedPlatforms(next);
  }

  // Default scheduled-for: 1 hour from now, rounded to next quarter hour
  const defaultSchedule = useMemo(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
    d.setSeconds(0);
    d.setMilliseconds(0);
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, []);

  return (
    <form
      action={(formData) => {
        formData.set("team_slug", teamSlug);
        formData.set("client_id", selectedBrandId);
        // platforms: append once per selected
        Array.from(selectedPlatforms).forEach((p) => formData.append("platforms", p));
        startTransition(async () => {
          setError(null);
          const res = await createScheduledPost(formData);
          if (res.ok) {
            router.push(`/${teamSlug}/social`);
          } else {
            setError(res.error);
          }
        });
      }}
      className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"
    >
      {/* Left column — main form */}
      <div className="space-y-6">
        <Card>
          <FieldLabel icon={Tag} label="Brand" />
          <select
            value={selectedBrandId}
            onChange={(e) => onBrandChange(e.target.value)}
            className="composer-input"
          >
            {brandsWithChannels.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {selectedBrand && (
            <>
              <div className="mt-5 text-[12px] font-medium text-[var(--color-ink)] mb-2">
                Channels for {selectedBrand.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedBrand.channels.map((ch) => {
                  const active = selectedPlatforms.has(ch.platform);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => togglePlatform(ch.platform)}
                      className={
                        active
                          ? "inline-flex items-center gap-1.5 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-ink)] px-2.5 py-1.5 text-[12px] font-medium text-white"
                          : "inline-flex items-center gap-1.5 rounded-lg border-2 border-[var(--color-border)] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[var(--color-ink-muted)] hover:border-[var(--color-ink)]/40"
                      }
                    >
                      <PlatformIcon platform={ch.platform} />
                      <span>{getPlatformLabel(ch.platform)}</span>
                      <span className="opacity-60 font-mono text-[11px]">{ch.accountHandle}</span>
                    </button>
                  );
                })}
              </div>
              {selectedPlatforms.size === 0 && (
                <p className="mt-3 text-[11px] text-[var(--color-ink-subtle)]">
                  Click chips to select where this post fires.
                </p>
              )}
            </>
          )}
        </Card>

        <Card>
          <FieldLabel label="Caption" />
          <textarea
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write the post caption…"
            rows={8}
            required
            className="composer-input resize-y min-h-[160px]"
          />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--color-ink-subtle)]">
            {Array.from(selectedPlatforms).map((p) => {
              const limit = CHAR_LIMITS[p];
              const over = caption.length > limit;
              return (
                <span key={p} className={over ? "text-rose-600 font-medium" : ""}>
                  {getPlatformLabel(p)}: {caption.length}/{limit}
                </span>
              );
            })}
            {selectedPlatforms.size === 0 && (
              <span>Pick a platform to see character limits.</span>
            )}
          </div>
        </Card>

        <Card>
          <FieldLabel label="Media" />
          <textarea
            name="media_r2_keys"
            placeholder={`R2 object key or public URL — one per line.\n\nExamples:\nsteel-shape/video14/output.mp4\nhttps://example.com/clip.mp4`}
            rows={3}
            required
            className="composer-input font-mono text-[12px] resize-y min-h-[88px]"
          />
          <p className="mt-2 text-[11px] text-[var(--color-ink-subtle)]">
            Phase 1: paste R2 keys or public URLs. Use existing tiktok-poster
            scripts to upload to R2; the worker resolves these to signed URLs
            at fire time. Browser-side drag-drop upload comes later.
          </p>
        </Card>

        <Card>
          <FieldLabel icon={CalendarClock} label="Scheduled for" />
          <input
            type="datetime-local"
            name="scheduled_for"
            defaultValue={defaultSchedule}
            required
            className="composer-input"
          />
          <p className="mt-2 text-[11px] text-[var(--color-ink-subtle)]">
            Local browser time. Worker checks the queue once a minute; post
            fires within ~60 seconds of the scheduled time. Must be at least
            1 minute in the future.
          </p>
        </Card>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" strokeWidth={2.25} />
            <p className="text-[13px] text-rose-700">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending || selectedPlatforms.size === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-ink)] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />}
            Schedule post
          </button>
          <a
            href={`/${teamSlug}/social`}
            className="text-[13px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            Cancel
          </a>
        </div>
      </div>

      {/* Right column — preview */}
      <div>
        <Card padding="md" className="sticky top-6">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-subtle)] mb-3">
            Preview
          </div>
          {selectedBrand ? (
            <div className="space-y-2">
              <div className="text-[14px] font-semibold text-[var(--color-ink)]">
                {selectedBrand.name}
              </div>
              <div className="text-[12px] text-[var(--color-ink-muted)]">
                {selectedPlatforms.size === 0
                  ? "No channels selected"
                  : Array.from(selectedPlatforms).map(getPlatformLabel).join(" · ")}
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--color-border)] text-[13px] text-[var(--color-ink)] whitespace-pre-wrap min-h-[80px]">
                {caption || (
                  <span className="text-[var(--color-ink-subtle)] italic">
                    Caption preview will appear here…
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-[var(--color-ink-subtle)]">
              Pick a brand to start the preview.
            </p>
          )}
        </Card>
      </div>

      <style jsx>{`
        :global(.composer-input) {
          width: 100%;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 0.625rem;
          padding: 0.6rem 0.85rem;
          font-size: 13px;
          color: var(--color-ink);
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        :global(.composer-input:focus) {
          border-color: var(--color-accent);
        }
      `}</style>
    </form>
  );
}

function FieldLabel({
  label,
  icon: Icon,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-ink)] mb-2">
      {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />}
      {label}
    </div>
  );
}
