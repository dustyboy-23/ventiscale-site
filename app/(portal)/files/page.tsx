import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/card";
import { CLIENT } from "@/lib/sg-data";
import { ExternalLink, FolderOpen } from "lucide-react";

export default function FilesPage() {
  const driveEmbed = `https://drive.google.com/embeddedfolderview?id=${CLIENT.driveFolderId}#grid`;
  const driveOpen = `https://drive.google.com/drive/folders/${CLIENT.driveFolderId}`;

  return (
    <>
      <PageHeader
        eyebrow="Files"
        title="Brand Assets"
        description="Every creative, image, video, and document for your campaigns — synced from Google Drive."
        actions={
          <a
            href={driveOpen}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink)] bg-white border border-[var(--color-border-strong)] hover:border-[var(--color-ink)] px-3.5 py-2 rounded-lg transition-colors"
          >
            Open in Drive
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
          </a>
        }
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
