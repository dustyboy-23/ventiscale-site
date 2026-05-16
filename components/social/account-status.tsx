import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, Ban } from "lucide-react";

const STYLES = {
  active:   { label: "Active",   classes: "bg-emerald-50 text-emerald-700 border-emerald-100", Icon: CheckCircle2 },
  expired:  { label: "Expired",  classes: "bg-amber-50 text-amber-700 border-amber-100",       Icon: AlertTriangle },
  disabled: { label: "Disabled", classes: "bg-slate-50 text-slate-600 border-slate-200",       Icon: Ban },
} as const;

type AccountStatus = keyof typeof STYLES;

export function StatusBadge({ status }: { status: AccountStatus }) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium",
        s.classes,
      )}
    >
      <s.Icon className="w-3 h-3" strokeWidth={2.5} />
      {s.label}
    </span>
  );
}
