"use client";

import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";

export function TopBar({
  isDemo,
  clientName,
  ownerName,
}: {
  isDemo: boolean;
  clientName: string;
  ownerName: string;
}) {
  return (
    <header className="sticky top-0 z-30 bg-[var(--color-canvas)]/85 backdrop-blur-md border-b border-[var(--color-border)]">
      {isDemo && (
        <div className="bg-[#1F3D2B] text-white text-[12px] font-medium px-6 py-2 flex items-center justify-center gap-2">
          <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>
            You&apos;re viewing a <strong>live demo</strong> of the Venti Scale client portal. Data is fictional.
          </span>
          <Link href="/" className="underline underline-offset-2 hover:opacity-80 ml-2">
            ← Back to site
          </Link>
        </div>
      )}
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between gap-4">
        {/* Left: mobile nav trigger + search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <MobileNav clientName={clientName} ownerName={ownerName} />
          <div className="hidden sm:flex items-center gap-2.5 max-w-[360px] flex-1 px-3.5 py-2 rounded-lg bg-white border border-[var(--color-border)] text-left">
            <Search
              className="w-4 h-4 text-[var(--color-ink-subtle)] shrink-0"
              strokeWidth={2}
            />
            <span className="text-[13px] text-[var(--color-ink-subtle)] flex-1 truncate">
              Search reports, content, posts...
            </span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-medium text-[var(--color-ink-subtle)] bg-[var(--color-surface-muted)] border border-[var(--color-border)] px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

      </div>
    </header>
  );
}
