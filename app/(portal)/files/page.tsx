import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getClientMeta, getAssetLibrary, type AssetItem } from "@/lib/portal-data";
import {
  FolderOpen,
  ImageIcon,
  FileText,
  Video,
  Linkedin,
  ExternalLink,
} from "lucide-react";

const DEMO_FILES = [
  { name: "Heritage tee, product shots (12 images)", type: "images", icon: ImageIcon, size: "48 MB", updated: "2 days ago" },
  { name: "Spring 2026 lookbook.pdf", type: "pdf", icon: FileText, size: "12 MB", updated: "5 days ago" },
  { name: "Field jacket, hero video (4K).mp4", type: "video", icon: Video, size: "340 MB", updated: "1 week ago" },
  { name: "Brand voice guidelines v3.pdf", type: "pdf", icon: FileText, size: "2.4 MB", updated: "2 weeks ago" },
  { name: "Selvedge denim, social carousel (6 images)", type: "images", icon: ImageIcon, size: "22 MB", updated: "2 weeks ago" },
  { name: "Customer photos, Q1 2026 (18 images)", type: "images", icon: ImageIcon, size: "86 MB", updated: "3 weeks ago" },
  { name: "Logo pack, all formats.zip", type: "other", icon: FileText, size: "8 MB", updated: "1 month ago" },
  { name: "Founder story, Marcus interview.mp4", type: "video", icon: Video, size: "180 MB", updated: "1 month ago" },
];


function formatBytes(n: number | null): string {
  if (!n || n <= 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "";
  const diff = Date.now() - then;
  const day = 24 * 60 * 60 * 1000;
  if (diff < day) {
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 1) return "just now";
    return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
  }
  const days = Math.floor(diff / day);
  if (days < 7) return days === 1 ? "yesterday" : `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}


function AssetRow({ item, icon: Icon, badge }: { item: AssetItem; icon: any; badge?: string }) {
  const sizeStr = formatBytes(item.size);
  const updatedStr = relativeTime(item.updated_at);
  const meta = [sizeStr, updatedStr ? `updated ${updatedStr}` : ""].filter(Boolean).join(" · ");

  const inner = (
    <div className="px-5 py-3.5 flex items-center gap-3 hover:bg-[var(--color-surface-muted)] transition-colors group">
      <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[var(--color-ink-muted)]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-[var(--color-ink)] truncate">
          {item.name}
        </div>
        {item.snippet && (
          <div className="text-[12.5px] text-[var(--color-ink-muted)] line-clamp-1 mt-0.5">
            {item.snippet}
          </div>
        )}
        {meta && (
          <div className="text-[11px] text-[var(--color-ink-subtle)] mt-0.5">
            {meta}
          </div>
        )}
      </div>
      {badge && (
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink-subtle)] shrink-0 mr-2">
          {badge}
        </span>
      )}
      {item.url && (
        <ExternalLink
          className="w-3.5 h-3.5 text-[var(--color-ink-subtle)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          strokeWidth={2}
        />
      )}
    </div>
  );

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}


function Section({
  title,
  count,
  items,
  icon: Icon,
  emptyMessage,
  badgeFor,
}: {
  title: string;
  count: number;
  items: AssetItem[];
  icon: any;
  emptyMessage: string;
  badgeFor?: (item: AssetItem) => string | undefined;
}) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-3 bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] flex items-center gap-2">
        <Icon className="w-4 h-4 text-[var(--color-ink-muted)]" strokeWidth={2} />
        <span className="text-[13px] font-medium text-[var(--color-ink)]">{title}</span>
        <span className="ml-auto text-[11px] font-medium text-[var(--color-ink-subtle)]">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-[13px] text-[var(--color-ink-subtle)]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {items.map((item) => (
            <AssetRow
              key={`${item.source}-${item.id}`}
              item={item}
              icon={Icon}
              badge={badgeFor ? badgeFor(item) : undefined}
            />
          ))}
        </div>
      )}
    </Card>
  );
}


export default async function FilesPage() {
  const client = await getClientMeta();

  // Demo client keeps the prior fixture
  if (client.isDemo) {
    return (
      <>
        <PageHeader
          eyebrow="Files"
          title="Brand Assets"
          description="Every creative, image, video, and document for your campaigns, synced live from Google Drive."
        />

        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-3 bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[var(--color-ink-muted)]" strokeWidth={2} />
            <span className="text-[13px] font-medium text-[var(--color-ink)]">
              {client.name} / Brand Assets
            </span>
            <span className="ml-auto text-[11px] font-medium text-[var(--color-ink-subtle)]">
              {DEMO_FILES.length} files
            </span>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {DEMO_FILES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.name}
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[var(--color-ink-muted)]" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-[var(--color-ink)] truncate">
                      {f.name}
                    </div>
                    <div className="text-[11px] text-[var(--color-ink-subtle)] mt-0.5">
                      {f.size} · updated {f.updated}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 text-center">
          In a live workspace this is a Google Drive mirror. Every asset Jarvis
          ships lands here automatically, synced in real time.
        </p>
      </>
    );
  }

  const lib = await getAssetLibrary();
  const refreshedRel = relativeTime(lib.refreshedAt);

  // Empty state when nothing has been pulled yet (cache not seeded)
  const totalAll = lib.totals.videos + lib.totals.photos + lib.totals.linkedin + lib.totals.blog;
  if (totalAll === 0) {
    return (
      <>
        <PageHeader
          eyebrow="Files"
          title="Brand Assets"
          description="Videos, photos, LinkedIn posts, and blog articles, all in one place."
        />
        <Card padding="lg">
          <div className="text-center py-10 max-w-[460px] mx-auto">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-[var(--color-ink-muted)]" strokeWidth={2} />
            </div>
            <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">
              Your asset library is loading
            </h3>
            <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
              We pull your videos, photos, LinkedIn posts, and blog articles every few hours.
              First sync is in progress.
            </p>
          </div>
        </Card>
      </>
    );
  }

  // Approved/posted badge on videos, source folder hint
  const videoBadge = (item: AssetItem) =>
    item.source === "videos_posted" ? "Posted" : "Approved";

  return (
    <>
      <PageHeader
        eyebrow="Files"
        title="Brand Assets"
        description="Videos, photos, LinkedIn posts, and blog articles, all in one place."
      />

      <div className="space-y-5">
        <Section
          title="Videos"
          count={lib.totals.videos}
          items={lib.videos}
          icon={Video}
          emptyMessage="No approved videos yet."
          badgeFor={videoBadge}
        />

        <Section
          title="Photos"
          count={lib.totals.photos}
          items={lib.photos}
          icon={ImageIcon}
          emptyMessage="No photo assets yet."
        />

        <Section
          title="LinkedIn posts"
          count={lib.totals.linkedin}
          items={lib.linkedin}
          icon={Linkedin}
          emptyMessage="No LinkedIn posts published yet. They appear here after they go live."
        />

        <Section
          title="Blog posts"
          count={lib.totals.blog}
          items={lib.blog}
          icon={FileText}
          emptyMessage="No blog posts published yet."
        />
      </div>

      {refreshedRel && (
        <p className="text-[12px] text-[var(--color-ink-subtle)] mt-4 text-center">
          Library refreshed {refreshedRel}. Updates roughly every 6 hours.
        </p>
      )}
    </>
  );
}
