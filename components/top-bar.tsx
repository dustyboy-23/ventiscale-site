"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  Calendar as CalIcon,
  ChevronDown,
  Eye,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";

// Keep in sync with PERIOD_META in lib/sg-data.ts and the CHECK constraint
// on public.client_metrics.period — the puller only writes 7d/28d/90d, so
// any extra option would render empty.
const PERIODS: { key: string; label: string }[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "28d", label: "Last 28 days" },
  { key: "90d", label: "Last 90 days" },
];

export function TopBar({
  isDemo,
  clientName,
  ownerName,
}: {
  isDemo: boolean;
  clientName: string;
  ownerName: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentKey = searchParams.get("period") || "28d";
  const current =
    PERIODS.find((p) => p.key === currentKey) || PERIODS[1];

  function pickPeriod(key: string) {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (key === "28d") params.delete("period");
    else params.set("period", key);
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    startTransition(() => {
      router.replace(href, { scroll: false });
      // Force Server Components to re-fetch with the new period param.
      // Without this, router.replace can serve a cached RSC payload and
      // the KPI cards stay on the previous period's numbers.
      router.refresh();
    });
  }

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

        {/* Right: period picker */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[13px] font-medium text-[var(--color-ink)] transition-colors disabled:opacity-70"
            >
              {isPending ? (
                <Loader2
                  className="w-3.5 h-3.5 text-[var(--color-ink-muted)] animate-spin"
                  strokeWidth={2}
                />
              ) : (
                <CalIcon
                  className="w-3.5 h-3.5 text-[var(--color-ink-muted)]"
                  strokeWidth={2}
                />
              )}
              <span className="hidden sm:inline">{current.label}</span>
              <ChevronDown
                className="w-3.5 h-3.5 text-[var(--color-ink-muted)]"
                strokeWidth={2}
              />
            </button>
            {open && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-[180px] bg-white rounded-xl border border-[var(--color-border)] shadow-[0_8px_32px_rgba(10,14,31,0.12)] py-1.5 z-50">
                  {PERIODS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => pickPeriod(p.key)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-[13px] hover:bg-[var(--color-surface-muted)] transition-colors",
                        current.key === p.key
                          ? "text-[var(--color-ink)] font-medium"
                          : "text-[var(--color-ink-muted)]",
                      )}
                    >
                      {p.label}
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
