import { cn } from "@/lib/utils";

export function BrowserFrame({
  url = "ventiscale.com/dashboard",
  children,
  className,
  shadow = "md",
  variant = "cream",
}: {
  url?: string;
  children: React.ReactNode;
  className?: string;
  shadow?: "sm" | "md" | "xl";
  variant?: "cream" | "dark" | "light";
}) {
  const shadowClass = {
    sm: "shadow-[0_4px_20px_rgba(27,27,27,0.06)]",
    md: "shadow-[0_24px_60px_-20px_rgba(27,27,27,0.18),0_4px_12px_-4px_rgba(27,27,27,0.08)]",
    xl: "shadow-[0_50px_120px_-30px_rgba(27,27,27,0.22),0_16px_40px_-12px_rgba(27,27,27,0.12)]",
  }[shadow];

  // Cream editorial — the v2 default
  if (variant === "cream") {
    return (
      <div
        className={cn(
          "rounded-xl border border-[rgba(27,27,27,0.10)] bg-[#FAF6EF] overflow-hidden",
          shadowClass,
          className,
        )}
      >
        <div className="h-10 bg-[#F1EBDF] border-b border-[rgba(27,27,27,0.08)] flex items-center px-4 gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1B1B1B]/15" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1B1B1B]/15" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#C8362B]/70" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-[#FAF6EF] border border-[rgba(27,27,27,0.08)] rounded px-3 py-1 text-[10.5px] text-[#1B1B1B]/55 font-mono tabular max-w-[320px] truncate">
              {url}
            </div>
          </div>
          <div className="w-12 flex justify-end">
            <div className="text-[9px] font-mono uppercase tracking-wider text-[#1B1B1B]/55 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#C8362B]" />
              Live
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  if (variant === "light") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden",
          shadowClass,
          className,
        )}
      >
        <div className="h-9 bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] flex items-center px-4 gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white border border-[var(--color-border)] rounded-md px-3 py-0.5 text-[10.5px] text-[var(--color-ink-subtle)] font-medium tabular max-w-[280px] truncate">
              {url}
            </div>
          </div>
          <div className="w-12" />
        </div>
        {children}
      </div>
    );
  }

  // Dark variant — preserved for compatibility
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/[0.10] overflow-hidden bg-[#0a0e1a]",
        "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]",
        className,
      )}
    >
      <div className="relative h-10 border-b border-white/[0.08] flex items-center px-4 gap-3 bg-[rgba(255,255,255,0.02)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-1 text-[10.5px] text-white/55 font-mono tabular max-w-[320px] truncate">
            {url}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
