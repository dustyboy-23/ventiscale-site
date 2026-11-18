"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/marketing/logo";

const LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/blog", label: "Blog" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="vs-nav" data-scrolled={scrolled || open}>
      <div className="vs-container h-[68px] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Venti Scale home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="vs-nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <Link href="/login" className="vs-nav-link">
            Client login
          </Link>
          <Link href="/start" className="vs-btn vs-btn-sm">
            Start my plan
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-11 h-11 -mr-2 grid place-items-center text-evergreen"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-paper">
          <nav aria-label="Mobile" className="vs-container py-3 flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3.5 text-[18px] font-semibold text-evergreen border-b border-line"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-3.5 text-[17px] font-medium text-moss"
            >
              Client login
            </Link>
            <Link
              href="/start"
              onClick={() => setOpen(false)}
              className="vs-btn vs-btn-block mt-2 mb-3"
            >
              Start my plan
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
