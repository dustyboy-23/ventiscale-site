"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ventiscale] unhandled error", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080C] text-[#F5F6FA] px-6 py-20">
      <div className="max-w-[560px] w-full text-center">
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/55 mb-5">
          Error · something broke
        </div>
        <h1 className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-white">
          Well. That wasn&apos;t supposed to happen.
        </h1>
        <p className="mt-5 text-[15px] text-white/70 leading-[1.65]">
          Something on our end threw a wrench in the works. Give it another try,
          or email{" "}
          <a
            href="mailto:hello@ventiscale.com"
            className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            hello@ventiscale.com
          </a>{" "}
          and we&apos;ll sort it out today.
        </p>

        {error?.digest && (
          <div className="mt-6 inline-block font-mono text-[11px] text-white/45 bg-white/[0.04] border border-white/[0.08] rounded px-3 py-1.5">
            ref: {error.digest}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-[14px] font-semibold text-white bg-[#C8362B] hover:bg-[#E04A3E] transition-colors shadow-[0_10px_30px_-10px_rgba(200,54,43,0.55)]"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2.25} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-[14px] font-semibold text-white/85 hover:text-white border border-white/[0.14] hover:border-white/30 transition-colors"
          >
            Back to home
            <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
          </Link>
        </div>
      </div>
    </div>
  );
}
