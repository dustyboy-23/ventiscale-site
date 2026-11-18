"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Mail,
  FileText,
  FolderOpen,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content", label: "Content", icon: Calendar },
  { href: "/campaigns", label: "Email", icon: Mail },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/files", label: "Files", icon: FolderOpen },
];

const FOOTER_NAV = [
  { href: "/settings/data-handling", label: "Privacy", icon: Shield },
];

export function MobileNav({
  clientName,
  ownerName,
}: {
  clientName: string;
  ownerName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4 text-[var(--color-ink-muted)]" strokeWidth={2} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-[var(--color-border)] flex flex-col animate-in slide-in-from-left duration-200">
            {/* Brand + close */}
            <div className="px-6 pt-6 pb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect width="32" height="32" rx="9" fill="#0F2E20" />
                  <path d="M8.4 10.6 L14.6 22.4 L23.8 8.4" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <div className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)] leading-none">
                    Venti Scale
                  </div>
                  <div className="text-[11px] text-[var(--color-ink-subtle)] leading-none mt-1">
                    Client Portal
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-muted)] transition-colors"
                aria-label="Close menu"
              >
                <X
                  className="w-4 h-4 text-[var(--color-ink-muted)]"
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Client block */}
            <div className="px-4 pb-4">
              <div className="rounded-xl bg-[var(--color-surface-muted)] px-3.5 py-3">
                <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider mb-0.5">
                  Workspace
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[14px] font-semibold text-[var(--color-ink)]">
                    {clientName}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="px-3 flex-1 overflow-y-auto">
              <ul className="space-y-0.5">
                {NAV.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors",
                          active
                            ? "bg-[var(--color-ink)] text-white font-medium"
                            : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]",
                        )}
                      >
                        <Icon
                          className="w-[17px] h-[17px]"
                          strokeWidth={active ? 2.25 : 2}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer nav (Privacy) — visually separated */}
            <nav className="px-3 pt-2 pb-2 border-t border-[var(--color-border)]">
              <ul className="space-y-0.5">
                {FOOTER_NAV.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors",
                          active
                            ? "bg-[var(--color-ink)] text-white font-medium"
                            : "text-[var(--color-ink-subtle)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]",
                        )}
                      >
                        <Icon className="w-[15px] h-[15px]" strokeWidth={active ? 2.25 : 2} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* User block */}
            <div className="px-3 pb-5 pt-3 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-[12px] font-semibold">
                  {ownerName.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[var(--color-ink)] truncate">
                    {ownerName}
                  </div>
                  <div className="text-[11px] text-[var(--color-ink-subtle)] truncate">
                    Owner
                  </div>
                </div>
                <Link
                  href="/auth/signout"
                  className="text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-[15px] h-[15px]" />
                </Link>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
