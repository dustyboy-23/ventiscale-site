"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Mail,
  FileText,
  Search,
  FolderOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content", label: "Content", icon: Calendar },
  { href: "/campaigns", label: "Email", icon: Mail },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/seo", label: "SEO Plan", icon: Search },
  { href: "/files", label: "Files", icon: FolderOpen },
];

export function Sidebar({ clientName, ownerName }: { clientName: string; ownerName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 h-screen sticky top-0 flex-col bg-white border-r border-[var(--color-border)]">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-ink)] flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-tight">VS</span>
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)] leading-none">
              Venti Scale
            </div>
            <div className="text-[11px] text-[var(--color-ink-subtle)] leading-none mt-1">
              Client Portal
            </div>
          </div>
        </div>
      </div>

      {/* Client switcher */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-[var(--color-surface-muted)] px-3.5 py-3 border border-transparent hover:border-[var(--color-border)] transition-colors cursor-default">
          <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider mb-0.5">
            Workspace
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-semibold text-[var(--color-ink)]">{clientName}</div>
            <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1">
        <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider px-3 mb-2">
          Workspace
        </div>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition-colors",
                    active
                      ? "bg-[var(--color-ink)] text-white font-medium"
                      : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]",
                  )}
                >
                  <Icon className="w-[17px] h-[17px]" strokeWidth={active ? 2.25 : 2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User block */}
      <div className="px-3 pb-5 pt-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-surface-muted)] cursor-default">
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-[12px] font-semibold">
            {ownerName.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-[var(--color-ink)] truncate">
              {ownerName}
            </div>
            <div className="text-[11px] text-[var(--color-ink-subtle)] truncate">Owner</div>
          </div>
          <button
            className="text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-[15px] h-[15px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
