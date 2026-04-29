import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { getClientMeta } from "@/lib/portal-data";
import {
  FolderOpen,
  ImageIcon,
  FileText,
  Video,
  Play,
  ExternalLink,
} from "lucide-react";

// Demo asset library for Stoneline (the demo brand prospects see).
// Mix of product shots, lookbook, lifestyle, sale graphics, video covers —
// every tile renders an actual photo so prospects can imagine their brand here.
const UNSPLASH = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

type DemoAsset = {
  name: string;
  category: "Product Shots" | "Lookbook" | "Sale Graphics" | "Lifestyle" | "Video";
  thumb: string;
  size: string;
  updated: string;
  badge?: string;
  isVideo?: boolean;
};

const DEMO_ASSETS: DemoAsset[] = [
  // Product Shots — hero campaign-ready
  { name: "Heritage Field Jacket — Hero shot",                     category: "Product Shots", thumb: UNSPLASH("1542272604-787c3835535d"), size: "8.4 MB", updated: "2 hours ago",  badge: "New" },
  { name: "Selvedge denim — detail close-up",                       category: "Product Shots", thumb: UNSPLASH("1604644401890-0bd678c83788"), size: "6.1 MB", updated: "yesterday" },
  { name: "Leather jacket — hero",                                  category: "Product Shots", thumb: UNSPLASH("1490578474895-699cd4e2cf59"), size: "7.2 MB", updated: "yesterday" },
  { name: "Black tee rack — product shoot",                         category: "Product Shots", thumb: UNSPLASH("1579338559194-a162d19bf842"), size: "5.8 MB", updated: "3 days ago" },
  { name: "Studio garment — hanging",                               category: "Product Shots", thumb: UNSPLASH("1503342394128-c104d54dba01"), size: "4.9 MB", updated: "3 days ago" },
  { name: "Outerwear capsule — outdoor shot",                       category: "Product Shots", thumb: UNSPLASH("1473496169904-658ba7c44d8a"), size: "9.3 MB", updated: "5 days ago" },
  { name: "Boot leather — macro",                                   category: "Product Shots", thumb: UNSPLASH("1559827260-dc66d52bef19"), size: "5.4 MB", updated: "5 days ago" },
  { name: "Tee mockup — flat-lay",                                  category: "Product Shots", thumb: UNSPLASH("1611652022419-a9419f74343d"), size: "4.1 MB", updated: "1 week ago" },
  { name: "Classic crewneck — sleeve detail",                       category: "Product Shots", thumb: UNSPLASH("1544006659-f0b21884ce1d"), size: "5.0 MB", updated: "1 week ago" },
  { name: "Selvedge jeans — pocket detail",                         category: "Product Shots", thumb: UNSPLASH("1521577352947-9bb58764b69a"), size: "4.7 MB", updated: "1 week ago" },

  // Lookbook — editorial
  { name: "Spring '26 Lookbook — page 1 cover",                     category: "Lookbook",      thumb: UNSPLASH("1591047139829-d91aecb6caea"), size: "6.6 MB", updated: "yesterday",   badge: "Featured" },
  { name: "Spring '26 Lookbook — model portrait",                   category: "Lookbook",      thumb: UNSPLASH("1521572163474-6864f9cf17ab"), size: "5.9 MB", updated: "yesterday" },
  { name: "Editorial — studio model",                                category: "Lookbook",      thumb: UNSPLASH("1525507119028-ed4c629a60a3"), size: "7.0 MB", updated: "2 days ago" },
  { name: "Editorial — cafe portrait",                               category: "Lookbook",      thumb: UNSPLASH("1517245386807-bb43f82c33c4"), size: "6.4 MB", updated: "4 days ago" },
  { name: "Editorial — walking the city",                            category: "Lookbook",      thumb: UNSPLASH("1490481651871-ab68de25d43d"), size: "8.2 MB", updated: "4 days ago" },
  { name: "Tweed capsule — heritage spread",                         category: "Lookbook",      thumb: UNSPLASH("1463100099107-aa0980c362e6"), size: "7.7 MB", updated: "1 week ago" },
  { name: "Editorial — model lookbook frame",                        category: "Lookbook",      thumb: UNSPLASH("1483985988355-763728e1935b"), size: "5.3 MB", updated: "1 week ago" },
  { name: "Retail window — campaign reveal",                         category: "Lookbook",      thumb: UNSPLASH("1620799140408-edc6dcb6d633"), size: "4.8 MB", updated: "2 weeks ago" },

  // Sale Graphics + social
  { name: "Spring Sale 30% — IG carousel (hero)",                   category: "Sale Graphics", thumb: UNSPLASH("1507003211169-0a1dd7228f2d"), size: "2.1 MB", updated: "today",      badge: "Live" },
  { name: "Heritage Drop — launch flyer",                            category: "Sale Graphics", thumb: UNSPLASH("1592878904946-b3cd8ae243d0"), size: "1.8 MB", updated: "yesterday" },
  { name: "Memorial Day weekend — promo banner",                     category: "Sale Graphics", thumb: UNSPLASH("1556905055-8f358a7a47b2"), size: "2.6 MB", updated: "2 days ago" },
  { name: "Black tee bundle — bundle savings tile",                  category: "Sale Graphics", thumb: UNSPLASH("1593030761757-71fae45fa0e7"), size: "1.4 MB", updated: "3 days ago" },

  // Lifestyle / accessories / styling content
  { name: "Daily-carry flat-lay — wallet + watch",                   category: "Lifestyle",     thumb: UNSPLASH("1578932750355-5eb30ece487a"), size: "3.2 MB", updated: "yesterday" },
  { name: "Boot styling — leather flatlay",                          category: "Lifestyle",     thumb: UNSPLASH("1617137984095-74e4e5e3613f"), size: "3.7 MB", updated: "2 days ago" },
  { name: "Sneaker drop — on-figure walking shot",                   category: "Lifestyle",     thumb: UNSPLASH("1566150905458-1bf1fc113f0d"), size: "4.5 MB", updated: "5 days ago" },
  { name: "Travel essentials — backpack styling",                    category: "Lifestyle",     thumb: UNSPLASH("1580927752452-89d86da3fa0a"), size: "3.9 MB", updated: "1 week ago" },

  // Video covers
  { name: "Heritage Field Jacket — hero film (4K)",                  category: "Video",         thumb: UNSPLASH("1542272604-787c3835535d"), size: "340 MB",  updated: "yesterday",   isVideo: true, badge: "Featured" },
  { name: "Founder story — Marcus interview",                         category: "Video",         thumb: UNSPLASH("1525507119028-ed4c629a60a3"), size: "180 MB", updated: "1 week ago",  isVideo: true },
  { name: "Spring '26 lookbook reveal — 30s cut",                    category: "Video",         thumb: UNSPLASH("1591047139829-d91aecb6caea"), size: "92 MB",  updated: "3 days ago",  isVideo: true },
  { name: "Behind-the-scenes — denim shoot",                          category: "Video",         thumb: UNSPLASH("1604644401890-0bd678c83788"), size: "210 MB", updated: "1 week ago",  isVideo: true },
];

const CATEGORY_ORDER: DemoAsset["category"][] = [
  "Product Shots",
  "Lookbook",
  "Sale Graphics",
  "Lifestyle",
  "Video",
];

const CATEGORY_ICON: Record<DemoAsset["category"], any> = {
  "Product Shots": ImageIcon,
  "Lookbook": ImageIcon,
  "Sale Graphics": FileText,
  "Lifestyle": ImageIcon,
  "Video": Video,
};

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

        <div className="space-y-5">
          {CATEGORY_ORDER.map((cat) => {
            const items = DEMO_ASSETS.filter((a) => a.category === cat);
            if (items.length === 0) return null;
            const Icon = CATEGORY_ICON[cat];
            return (
              <Card key={cat} padding="none" className="overflow-hidden">
                <div className="px-5 py-3 bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[var(--color-ink-muted)]" strokeWidth={2} />
                  <span className="text-[13px] font-medium text-[var(--color-ink)]">{cat}</span>
                  <span className="ml-auto text-[11px] font-medium text-[var(--color-ink-subtle)]">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="group block rounded-xl overflow-hidden bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] bg-[var(--color-surface-muted)] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumb}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/70 transition-colors">
                              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        )}
                        {item.badge && (
                          <div className="absolute top-2 left-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-accent)] text-white px-2 py-1 rounded">
                              {item.badge}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                            <ExternalLink className="w-3.5 h-3.5 text-[var(--color-ink)]" strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-2.5">
                        <div className="text-[12.5px] font-medium text-[var(--color-ink)] line-clamp-1">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[var(--color-ink-subtle)] mt-0.5">
                          {item.size} · updated {item.updated}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <p className="text-[12px] text-[var(--color-ink-subtle)] mt-4 text-center max-w-xl mx-auto leading-relaxed">
          This is what a real workspace looks like. Every product shot, lookbook spread, sale graphic, and brand video your team ships lives here, synced live from your Google Drive.
        </p>
      </>
    );
  }

  if (client.driveFolderId) {
    const driveEmbed = `https://drive.google.com/embeddedfolderview?id=${client.driveFolderId}#grid`;
    const driveOpen = `https://drive.google.com/drive/folders/${client.driveFolderId}`;
    return (
      <>
        <PageHeader
          eyebrow="Files"
          title="Brand Assets"
          description="Every creative, image, video, and document for your campaigns, synced from Google Drive."
        />

        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-3 bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <FolderOpen className="w-4 h-4 text-[var(--color-ink-muted)] shrink-0" strokeWidth={2} />
              <span className="text-[13px] font-medium text-[var(--color-ink)] truncate">
                {client.name} / Brand Assets
              </span>
            </div>
            <a
              href={driveOpen}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-[var(--color-accent)] hover:underline shrink-0"
            >
              Open in Google Drive →
            </a>
          </div>
          <iframe
            src={driveEmbed}
            title="Brand assets"
            className="w-full block border-0 bg-white"
            style={{ height: "calc(100vh - 240px)", minHeight: "600px" }}
          />
        </Card>

        <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 text-center">
          Files load directly from Google Drive. You may need to be signed into your Google account
          to view private items.
        </p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Files"
        title="Brand Assets"
        description="Every creative, image, video, and document for your campaigns, synced live from Google Drive."
      />

      <Card padding="lg">
        <div className="text-center py-10 max-w-[460px] mx-auto">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
            <FolderOpen
              className="w-5 h-5 text-[var(--color-ink-muted)]"
              strokeWidth={2}
            />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">
            Your brand assets workspace
          </h3>
          <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
            Once your Google Drive folder is connected, every creative Jarvis
            ships (images, videos, PDFs, brand guides) shows up here in real
            time.
          </p>
        </div>
      </Card>
    </>
  );
}
