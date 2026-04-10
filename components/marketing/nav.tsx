"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "/security", label: "Trust" },
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
        "sticky top-0 z-50 transition-[background,border,backdrop-filter] duration-400",
        scrolled
          ? "bg-[rgba(246,241,234,0.82)] backdrop-blur-xl border-b border-[rgba(27,27,27,0.08)]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10 h-[76px] flex items-center justify-between">
        <Logo size="sm" variant="ink" />

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-[#1B1B1B]/65 hover:text-[#1B1B1B] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[13px] font-medium text-[#1B1B1B]/65 hover:text-[#1B1B1B] transition-colors"
          >
            Client login
          </Link>
          <a
            href="#audit"
            className="text-[13px] font-semibold text-white bg-[#1F3D2B] hover:bg-[#15291D] px-5 h-10 rounded-md inline-flex items-center transition-colors"
          >
            Run my audit
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center text-[#1B1B1B]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(27,27,27,0.08)] bg-[#F6F1EA]/96 backdrop-blur-xl">
          <nav className="max-w-[1180px] mx-auto px-6 py-4 flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-[16px] font-medium text-[#1B1B1B] py-3.5 border-b border-[rgba(27,27,27,0.08)] last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-medium text-[#1B1B1B]/65 py-3"
            >
              Client login
            </Link>
            <a
              href="#audit"
              onClick={() => setMobileOpen(false)}
              className="mt-3 text-center text-[14px] font-semibold text-white bg-[#1F3D2B] py-3.5 rounded-md"
            >
              Run my audit
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
