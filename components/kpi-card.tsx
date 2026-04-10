import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  format?: "currency" | "number" | "percent";
  delta?: number;
  icon?: LucideIcon;
  hint?: string;
  highlight?: boolean;
}

export function KpiCard({
  label,
  value,
  format = "number",
  delta,
  icon: Icon,
  hint,
  highlight = false,
}: KpiCardProps) {
  const display =
    format === "currency"
      ? formatCurrency(value)
      : format === "percent"
        ? `${value.toFixed(2)}%`
        : formatNumber(value);

  const positive = (delta ?? 0) >= 0;

  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 transition-all border",
        highlight
          ? "bg-[var(--color-ink)] border-[var(--color-ink)] text-white"
          : "bg-white border-[var(--color-border)] shadow-[0_1px_2px_rgba(10,14,31,0.04)] hover:border-[var(--color-border-strong)]",
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={cn(
            "text-[12px] font-medium uppercase tracking-wider",
            highlight ? "text-white/60" : "text-[var(--color-ink-subtle)]",
          )}
        >
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              highlight ? "bg-white/10" : "bg-[var(--color-surface-muted)]",
            )}
          >
            <Icon
              className={cn("w-4 h-4", highlight ? "text-white/80" : "text-[var(--color-ink-muted)]")}
              strokeWidth={2}
            />
          </div>
        )}
      </div>

      <div className="tabular text-[34px] font-bold tracking-tight leading-none">{display}</div>

      <div className="mt-3 flex items-center gap-2 min-h-[18px]">
        {delta !== undefined && (
          <div
            className={cn(
              "inline-flex items-center gap-1 text-[12px] font-medium px-1.5 py-0.5 rounded-md",
              positive
                ? highlight
                  ? "bg-white/10 text-emerald-300"
                  : "bg-emerald-50 text-emerald-700"
                : highlight
                  ? "bg-white/10 text-rose-300"
                  : "bg-rose-50 text-rose-700",
            )}
          >
            {positive ? (
              <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
            ) : (
              <ArrowDownRight className="w-3 h-3" strokeWidth={2.5} />
            )}
            {Math.abs(delta).toFixed(1)}%
          </div>
        )}
        {hint && (
          <span
            className={cn(
              "text-[12px]",
              highlight ? "text-white/50" : "text-[var(--color-ink-subtle)]",
            )}
          >
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}
