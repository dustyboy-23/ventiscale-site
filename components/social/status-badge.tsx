import { cn } from "@/lib/utils";
import { Clock, Loader2, AlertTriangle, CheckCircle2, XCircle, Ban } from "lucide-react";
import type { ScheduledPostStatus } from "@/lib/social-queries";

const STYLES: Record<ScheduledPostStatus, { label: string; classes: string; Icon: typeof Clock }> = {
  queued:     { label: "Queued",     classes: "bg-blue-50 text-blue-700 border-blue-100",       Icon: Clock },
  processing: { label: "Processing", classes: "bg-amber-50 text-amber-700 border-amber-100",    Icon: Loader2 },
  partial:    { label: "Partial",    classes: "bg-orange-50 text-orange-700 border-orange-100", Icon: AlertTriangle },
  success:    { label: "Published",  classes: "bg-emerald-50 text-emerald-700 border-emerald-100", Icon: CheckCircle2 },
  failed:     { label: "Failed",     classes: "bg-rose-50 text-rose-700 border-rose-100",       Icon: XCircle },
  canceled:   { label: "Canceled",   classes: "bg-slate-50 text-slate-600 border-slate-200",    Icon: Ban },
};

export function StatusBadge({ status }: { status: ScheduledPostStatus }) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium",
        s.classes,
      )}
    >
      <s.Icon
        className={cn("w-3 h-3", status === "processing" && "animate-spin")}
        strokeWidth={2.5}
      />
      {s.label}
    </span>
  );
}
