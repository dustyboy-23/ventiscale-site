"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#services", label: "What we do" },
  { href: "/#how", label: "How it works" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background,border,backdrop-filter] duration-300",
        scrolled
          ? "bg-[rgba(7,8,12,0.78)] backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-[64px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
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

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
          >
            Client login
          </Link>
          <a href="/#audit" className="btn-red-sm">
            Free AI audit
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[rgba(7,8,12,0.95)] backdrop-blur-xl">
          <nav className="max-w-[1240px] mx-auto px-6 py-4 flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-[16px] font-medium text-white py-3.5 border-b border-white/[0.06] last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-medium text-white/60 py-3"
            >
              Client login
            </Link>
            <a
              href="/#audit"
              onClick={() => setMobileOpen(false)}
              className="mt-3 text-center text-[14px] font-semibold text-white bg-[#C8362B] py-3.5 rounded-md"
            >
              Free AI audit
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
