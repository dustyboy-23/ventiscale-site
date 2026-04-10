import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="relative bg-[#07080C] border-t border-white/[0.06]">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-md bg-gradient-to-br from-[#10E39A] via-[#5280FF] to-[#C8362B] p-[1px]">
              <div className="w-full h-full rounded-[5px] bg-[#07080C] flex items-center justify-center">
                <span className="font-display text-[14px] font-bold text-white leading-none">
                  V
                </span>
              </div>
            </div>
            <span className="font-display text-[17px] font-semibold tracking-tight text-white">
              Venti Scale
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/#services"
              className="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
            >
              What we do
            </Link>
            <Link
              href="/#how"
              className="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/login"
              className="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
            >
              Client login
            </Link>
            <Link
              href="/security"
              className="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
            >
              Trust
            </Link>
            <a
              href="mailto:hello@ventiscale.com"
              className="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
            >
              hello@ventiscale.com
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/40">
            © 2026 Venti Scale. Built with AI and kept honest by a human.
          </p>
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span className="mx-2">·</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span className="mx-2">·</span>
            <Link href="/data-deletion" className="hover:text-white transition-colors">
              Data deletion
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
