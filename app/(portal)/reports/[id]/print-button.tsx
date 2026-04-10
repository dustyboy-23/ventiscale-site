"use client";

import { Download } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink)] bg-white border border-[var(--color-border-strong)] hover:border-[var(--color-ink)] px-3 py-1.5 rounded-lg transition-colors"
    >
      <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
      Download PDF
    </button>
  );
}
