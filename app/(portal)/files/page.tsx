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

// Demo asset library for Stoneline. Pulls from the public Stoneline Drive
// folder (15l9MjbFo_qw4i-Jga8RNBCEZ-z3boda1) so prospects see real photos
// served by Drive's CDN — no Google sign-in required because the folder is
// shared with anyone-with-link.
const DRIVE_THUMB = (id: string) =>
  `https://lh3.googleusercontent.com/d/${id}=w1200`;
const DRIVE_VIEW = (id: string) =>
  `https://drive.google.com/file/d/${id}/view`;
const DEMO_DRIVE_FOLDER = "15l9MjbFo_qw4i-Jga8RNBCEZ-z3boda1";

type DemoAsset = {
  name: string;
  category: "Product Shots" | "Lookbook" | "Sale Graphics" | "Lifestyle" | "Video";
  driveFileId: string;
  size: string;
  updated: string;
  badge?: string;
  isVideo?: boolean;
};

const DEMO_ASSETS: DemoAsset[] = [
  // Product Shots — campaign-ready editorial
  { name: "Spring '26 — Hero 01",       category: "Product Shots", driveFileId: "11hhCdsaAhC_Z6Tbd0OTBTqDMDAjN6AeJ", size: "8.4 MB", updated: "2 hours ago", badge: "New" },
  { name: "Spring '26 — Hero 02",       category: "Product Shots", driveFileId: "143TwLhvtptq-qFk_wTSghItXlg0DYthL", size: "7.2 MB", updated: "yesterday" },
  { name: "Spring '26 — Detail 03",     category: "Product Shots", driveFileId: "1Sk1aAa3KZhhJilgSkN7RIO5MpjrAby8r", size: "6.1 MB", updated: "yesterday" },
  { name: "Spring '26 — Detail 04",     category: "Product Shots", driveFileId: "1NDfrWWsFHPBYlhGc2spSzvJiL9mgsAyp", size: "4.7 MB", updated: "1 week ago" },
  { name: "Studio shoot — Frame 05",    category: "Product Shots", driveFileId: "1p-vRiK2BpfMSGFNIs4ysWyPWZX_tyGUU", size: "4.9 MB", updated: "3 days ago" },
  { name: "Studio shoot — Frame 06",    category: "Product Shots", driveFileId: "1tP4Q9AwDE9GkBetMZyYTisgZ_aT8SV-G", size: "5.8 MB", updated: "3 days ago" },
  { name: "Studio shoot — Frame 07",    category: "Product Shots", driveFileId: "1uhF80HFcUmfo0EHybb1ASp5fVARq_Mt4", size: "9.3 MB", updated: "5 days ago" },
  { name: "Studio shoot — Frame 08",    category: "Product Shots", driveFileId: "1jCwAOdnLD9i25XPM5EMQ-6wt3VfHh4N-", size: "5.4 MB", updated: "5 days ago" },
  { name: "Studio shoot — Frame 09",    category: "Product Shots", driveFileId: "1OtRipFlS4kgnKwteTGpG87dy60rcQZpE", size: "4.1 MB", updated: "1 week ago" },
  { name: "Studio shoot — Frame 10",    category: "Product Shots", driveFileId: "1M_Vv_OnLUAPm0B-TOLPTHBGQ_a20RIys", size: "5.0 MB", updated: "1 week ago" },

  // Lookbook — editorial frames
  { name: "Spring '26 Lookbook — Cover",        category: "Lookbook", driveFileId: "1kqeggByr7xpLKxZBqFXdr0_v9pozBMCi", size: "6.6 MB", updated: "yesterday", badge: "Featured" },
  { name: "Spring '26 Lookbook — Frame 12",     category: "Lookbook", driveFileId: "1SeF8xYcXZIHiod1a438j6c1rp2Cm0Dch", size: "5.9 MB", updated: "yesterday" },
  { name: "Spring '26 Lookbook — Frame 13",     category: "Lookbook", driveFileId: "17VQrrZpsX0nNMGJpmuE1PSSXO-sGi13n", size: "7.0 MB", updated: "2 days ago" },
  { name: "Spring '26 Lookbook — Frame 14",     category: "Lookbook", driveFileId: "1DV-g-6KXflipVKjTkWXPXw6zAbCVOQ4t", size: "6.4 MB", updated: "4 days ago" },
  { name: "Spring '26 Lookbook — Frame 15",     category: "Lookbook", driveFileId: "18cR1TiLgMi1OcAtLyKjHuUdog6zJn3Jx", size: "8.2 MB", updated: "4 days ago" },
  { name: "Spring '26 Lookbook — Frame 16",     category: "Lookbook", driveFileId: "14R75fBe_Z9OyRoeLs8bsrKN49cYQX3Vy", size: "7.7 MB", updated: "1 week ago" },
  { name: "Spring '26 Lookbook — Frame 17",     category: "Lookbook", driveFileId: "1-Bv9uoPVa4t4k8lEOoKcOfkgNwj2TOFO", size: "4.8 MB", updated: "2 weeks ago" },
  { name: "Spring '26 Lookbook — Frame 18",     category: "Lookbook", driveFileId: "1KS-SdzTsMGauza3mHyx3HVCpHJPyCZ59", size: "5.3 MB", updated: "1 week ago" },

  // Sale Graphics — designed by Venti Scale, accurate names
  { name: "Spring Sale 30% OFF — social tile",   category: "Sale Graphics", driveFileId: "1JmO6dPn91cDPKnhVQ7yY_1zkV7qMic4l", size: "2.1 MB", updated: "today", badge: "Live" },
  { name: "Heritage Drop — launch flyer",        category: "Sale Graphics", driveFileId: "1I1pszQB0OFjwMtI1_C-z3DoWb6St3Jfr", size: "1.8 MB", updated: "yesterday" },
  { name: "Free Shipping Weekend — promo banner", category: "Sale Graphics", driveFileId: "16p9bNjem3lFPriNWeQNS0akryTqD9_qJ", size: "2.6 MB", updated: "2 days ago" },
  { name: "Bestseller of the Week — IG callout", category: "Sale Graphics", driveFileId: "1-jbFJimt4yhkWuqnQnucci8hcUVjvucp", size: "1.4 MB", updated: "3 days ago" },
  { name: "Flash Sale Today Only — story graphic", category: "Sale Graphics", driveFileId: "13ErmzT5YqpxedyLOl-lhasaoUjTjvkjN", size: "1.6 MB", updated: "today",  badge: "Live" },
  { name: "Email Header — Dispatch No. 12",      category: "Sale Graphics", driveFileId: "1udPKcdZHqB2IdutmkBIwAZUrY4oY39T3", size: "1.2 MB", updated: "yesterday" },
  { name: "Member Exclusive — early access tile", category: "Sale Graphics", driveFileId: "1_F0qzKKmtQ7k8TyNgEnbhhG0xXMPBR9t", size: "1.5 MB", updated: "2 days ago" },

  // Lifestyle frames
  { name: "Lifestyle — Frame 19", category: "Lifestyle", driveFileId: "1-HQ7yGH9-o66ttivyVkL3Drr25cu5JGl", size: "3.2 MB", updated: "yesterday" },
  { name: "Lifestyle — Frame 20", category: "Lifestyle", driveFileId: "1YYjOGg-P3rhyr3P-UDF8h6-s3ShbZ-Lh", size: "3.7 MB", updated: "2 days ago" },
  { name: "Lifestyle — Frame 21", category: "Lifestyle", driveFileId: "1VtN74apimp45zcWn5YAlV0KjVLe7jX51", size: "4.5 MB", updated: "5 days ago" },
  { name: "Lifestyle — Frame 22", category: "Lifestyle", driveFileId: "1ypgkRdgFKd6XpPAbq9oGY3ib6gxqnJlE", size: "3.9 MB", updated: "1 week ago" },
  { name: "Lifestyle — Frame 23", category: "Lifestyle", driveFileId: "1JhQady-YP0LlVsOjABRT67YMtTby2DEF", size: "3.6 MB", updated: "1 week ago" },
  { name: "Lifestyle — Frame 24", category: "Lifestyle", driveFileId: "13YaV4Q6cV10IrCtMjQs1ct3zHSSFANMm", size: "3.1 MB", updated: "2 weeks ago" },
  { name: "Lifestyle — Frame 25", category: "Lifestyle", driveFileId: "1zvyv9sOZNnaDbyEXhY64vdpt0rm8zQJL", size: "2.9 MB", updated: "2 weeks ago" },

  // Video covers
  { name: "Spring '26 — Hero film (4K)",      category: "Video", driveFileId: "11hhCdsaAhC_Z6Tbd0OTBTqDMDAjN6AeJ", size: "340 MB", updated: "yesterday",   isVideo: true, badge: "Featured" },
  { name: "Founder story — interview cut",    category: "Video", driveFileId: "17VQrrZpsX0nNMGJpmuE1PSSXO-sGi13n", size: "180 MB", updated: "1 week ago",  isVideo: true },
  { name: "Spring '26 lookbook reveal — 30s", category: "Video", driveFileId: "1kqeggByr7xpLKxZBqFXdr0_v9pozBMCi", size: "92 MB",  updated: "3 days ago",  isVideo: true },
  { name: "Behind-the-scenes — production",   category: "Video", driveFileId: "1Sk1aAa3KZhhJilgSkN7RIO5MpjrAby8r", size: "210 MB", updated: "1 week ago",  isVideo: true },
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
                    <a
                      key={item.name}
                      href={DRIVE_VIEW(item.driveFileId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl overflow-hidden bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[4/3] bg-[var(--color-surface-muted)] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={DRIVE_THUMB(item.driveFileId)}
                          alt={item.name}
                          referrerPolicy="no-referrer"
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
                    </a>
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
