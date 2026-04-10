import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { CLIENT } from "@/lib/sg-data";
import { FolderOpen, ImageIcon, FileText, Video, File as FileIcon } from "lucide-react";

const DEMO_FILES = [
  { name: "Heritage tee — product shots (12 images)", type: "images", icon: ImageIcon, size: "48 MB", updated: "2 days ago" },
  { name: "Spring 2026 lookbook.pdf", type: "pdf", icon: FileText, size: "12 MB", updated: "5 days ago" },
  { name: "Field jacket — hero video (4K).mp4", type: "video", icon: Video, size: "340 MB", updated: "1 week ago" },
  { name: "Brand voice guidelines — v3.pdf", type: "pdf", icon: FileText, size: "2.4 MB", updated: "2 weeks ago" },
  { name: "Selvedge denim — social carousel (6 images)", type: "images", icon: ImageIcon, size: "22 MB", updated: "2 weeks ago" },
  { name: "Customer photos — Q1 2026 (18 images)", type: "images", icon: ImageIcon, size: "86 MB", updated: "3 weeks ago" },
  { name: "Logo pack — all formats.zip", type: "other", icon: FileIcon, size: "8 MB", updated: "1 month ago" },
  { name: "Founder story — Marcus interview.mp4", type: "video", icon: Video, size: "180 MB", updated: "1 month ago" },
];

export default function FilesPage() {
  const hasDriveFolder = CLIENT.driveFolderId && CLIENT.driveFolderId.length > 0;

  if (!hasDriveFolder) {
    return (
      <>
        <PageHeader
          eyebrow="Files"
          title="Brand Assets"
          description="Every creative, image, video, and document for your campaigns — synced live from Google Drive."
        />

        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-3 bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[var(--color-ink-muted)]" strokeWidth={2} />
            <span className="text-[13px] font-medium text-[var(--color-ink)]">
              {CLIENT.name} / Brand Assets
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
          In a live workspace this is a Google Drive mirror — every asset Jarvis ships lands here
          automatically, synced in real time.
        </p>
      </>
    );
  }

  const driveEmbed = `https://drive.google.com/embeddedfolderview?id=${CLIENT.driveFolderId}#grid`;

  return (
    <>
      <PageHeader
        eyebrow="Files"
        title="Brand Assets"
        description="Every creative, image, video, and document for your campaigns — synced from Google Drive."
      />

      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-3 bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[var(--color-ink-muted)]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-[var(--color-ink)]">
            {CLIENT.name} / Brand Assets
          </span>
        </div>
        <iframe
          src={driveEmbed}
          title="Brand assets"
          className="w-full block border-0 bg-white"
          style={{ height: "calc(100vh - 240px)", minHeight: "600px" }}
        />
      </Card>

      <p className="text-[12px] text-[var(--color-ink-subtle)] mt-3 text-center">
        Files are synced live from Google Drive. You may need to be signed into your Google account
        to view private items.
      </p>
    </>
  );
}
