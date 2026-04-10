import Link from "next/link";
import { Logo } from "./logo";

export function MarketingFooter() {
  return (
    <footer className="relative bg-[#F6F1EA] border-t border-[rgba(27,27,27,0.08)]">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Logo size="sm" variant="ink" />

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="#work"
              className="text-[13px] font-medium text-[#1B1B1B]/70 hover:text-[#1B1B1B] transition-colors"
            >
              Work
            </Link>
            <Link
              href="#pricing"
              className="text-[13px] font-medium text-[#1B1B1B]/70 hover:text-[#1B1B1B] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/security"
              className="text-[13px] font-medium text-[#1B1B1B]/70 hover:text-[#1B1B1B] transition-colors"
            >
              Trust
            </Link>
            <a
              href="mailto:hello@ventiscale.com"
              className="text-[13px] font-medium text-[#1B1B1B]/70 hover:text-[#1B1B1B] transition-colors"
            >
              hello@ventiscale.com
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(27,27,27,0.06)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#1B1B1B]/45">
            © 2026 Venti Scale. Built in the United States.
          </p>
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#1B1B1B]/45">
            <Link href="/security" className="hover:text-[#1B1B1B] transition-colors">
              Privacy
            </Link>
            <span className="mx-2">·</span>
            <Link href="/security" className="hover:text-[#1B1B1B] transition-colors">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
