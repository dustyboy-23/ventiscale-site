import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080C] text-[#F5F6FA] px-6 py-20">
      <div className="max-w-[560px] w-full text-center">
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/55 mb-5">
          404 · page not found
        </div>
        <h1 className="font-display text-[44px] sm:text-[60px] leading-[1.05] tracking-[-0.02em] text-white">
          This page is off the map.
        </h1>
        <p className="mt-5 text-[15px] text-white/70 leading-[1.65]">
          The link you followed is dead, moved, or never existed in the first
          place. No big deal. Head back to the homepage and we&apos;ll get you
          sorted.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-[14px] font-semibold text-white bg-[#C8362B] hover:bg-[#E04A3E] transition-colors shadow-[0_10px_30px_-10px_rgba(200,54,43,0.55)]"
          >
            Back to home
            <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
          </Link>
          <a
            href="mailto:hello@ventiscale.com"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-[14px] font-semibold text-white/85 hover:text-white border border-white/[0.14] hover:border-white/30 transition-colors"
          >
            Email us
          </a>
        </div>
      </div>
    </div>
  );
}
