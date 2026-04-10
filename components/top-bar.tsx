"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar as CalIcon, ChevronDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";

const PERIODS = ["Last 7 days", "Last 28 days", "This month", "Last 90 days"];

export function TopBar({
  isDemo,
  clientName,
  ownerName,
}: {
  isDemo: boolean;
  clientName: string;
  ownerName: string;
}) {
  const [period, setPeriod] = useState("Last 28 days");
  const [periodOpen, setPeriodOpen] = useState(false);

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

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Period picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPeriodOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[13px] font-medium text-[var(--color-ink)] transition-colors"
            >
              <CalIcon className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" strokeWidth={2} />
              <span className="hidden sm:inline">{period}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" strokeWidth={2} />
            </button>
            {periodOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setPeriodOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-[180px] bg-white rounded-xl border border-[var(--color-border)] shadow-[0_8px_32px_rgba(10,14,31,0.12)] py-1.5 z-50">
                  {PERIODS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPeriod(p);
                        setPeriodOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-[13px] hover:bg-[var(--color-surface-muted)] transition-colors",
                        period === p
                          ? "text-[var(--color-ink)] font-medium"
                          : "text-[var(--color-ink-muted)]",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
