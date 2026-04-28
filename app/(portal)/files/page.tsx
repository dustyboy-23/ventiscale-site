import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getClientMeta, getAssetLibrary, type AssetItem } from "@/lib/portal-data";
import {
  FolderOpen,
  ImageIcon,
  FileText,
  Video,
  Linkedin,
  Play,
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


function MediaTile({ item }: { item: AssetItem }) {
  const isVideo = item.kind === "video";
  const thumb = item.thumbnail_url;
  const updatedRel = relativeTime(item.updated_at);
  const sizeStr = formatBytes(item.size);
  const meta = [sizeStr, updatedRel].filter(Boolean).join(" · ");

  return (
    <a
      href={item.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-md transition-all"
    >
      <div className="relative aspect-[4/3] bg-[var(--color-surface-muted)] overflow-hidden">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isVideo ? (
              <Video className="w-8 h-8 text-[var(--color-ink-subtle)]" strokeWidth={1.5} />
            ) : (
              <ImageIcon className="w-8 h-8 text-[var(--color-ink-subtle)]" strokeWidth={1.5} />
            )}
          </div>
        )}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/70 transition-colors">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <ExternalLink className="w-3.5 h-3.5 text-[var(--color-ink)]" strokeWidth={2} />
          </div>
        </div>
        {item.source === "videos_posted" && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-accent)] text-white px-2 py-1 rounded">
              Posted
            </span>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5">
        <div className="text-[12.5px] font-medium text-[var(--color-ink)] truncate">
          {item.name.replace(/\.[a-z0-9]+$/i, "")}
        </div>
        {meta && (
          <div className="text-[11px] text-[var(--color-ink-subtle)] mt-0.5 truncate">
            {meta}
          </div>
        )}
      </div>
    </a>
  );
}


function MediaGrid({
  title,
  count,
  items,
  icon: Icon,
  emptyMessage,
}: {
  title: string;
  count: number;
  items: AssetItem[];
  icon: any;
  emptyMessage: string;
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
        <div className="px-5 py-10 text-center">
          <p className="text-[13px] text-[var(--color-ink-subtle)]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
          {items.map((item) => (
            <MediaTile key={`${item.source}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </Card>
  );
}


function PostRow({ item, icon: Icon }: { item: AssetItem; icon: any }) {
  const updatedStr = relativeTime(item.updated_at);

  const inner = (
    <div className="px-5 py-3.5 flex items-start gap-3 hover:bg-[var(--color-surface-muted)] transition-colors group">
      <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[var(--color-ink-muted)]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-[var(--color-ink)] line-clamp-1">
          {item.name}
        </div>
        {item.snippet && (
          <div className="text-[12.5px] text-[var(--color-ink-muted)] line-clamp-2 mt-0.5 leading-relaxed">
            {item.snippet}
          </div>
        )}
        {updatedStr && (
          <div className="text-[11px] text-[var(--color-ink-subtle)] mt-1">
            {updatedStr}
          </div>
        )}
      </div>
      {item.url && (
        <ExternalLink
          className="w-3.5 h-3.5 text-[var(--color-ink-subtle)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
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


function PostList({
  title,
  count,
  items,
  icon: Icon,
  emptyMessage,
}: {
  title: string;
  count: number;
  items: AssetItem[];
  icon: any;
  emptyMessage: string;
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
            <PostRow key={`${item.source}-${item.id}`} item={item} icon={Icon} />
          ))}
        </div>
      )}
    </Card>
  );
}


export default async function FilesPage() {
  const client = await getClientMeta();

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
      </>
    );
  }

  const lib = await getAssetLibrary();
  const refreshedRel = relativeTime(lib.refreshedAt);
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

  return (
    <>
      <PageHeader
        eyebrow="Files"
        title="Brand Assets"
        description="Videos, photos, LinkedIn posts, and blog articles, all in one place."
      />

      <div className="space-y-5">
        <MediaGrid
          title="Videos"
          count={lib.totals.videos}
          items={lib.videos}
          icon={Video}
          emptyMessage="No approved videos yet."
        />

        <MediaGrid
          title="Photos"
          count={lib.totals.photos}
          items={lib.photos}
          icon={ImageIcon}
          emptyMessage="No photo assets yet."
        />

        <PostList
          title="LinkedIn posts"
          count={lib.totals.linkedin}
          items={lib.linkedin}
          icon={Linkedin}
          emptyMessage="No LinkedIn posts published yet. They appear here after they go live."
        />

        <PostList
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
