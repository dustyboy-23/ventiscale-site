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
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { setActiveClient } from "@/app/actions/active-client";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content", label: "Content", icon: Calendar },
  { href: "/campaigns", label: "Email", icon: Mail },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/seo", label: "SEO Plan", icon: Search },
  { href: "/files", label: "Files", icon: FolderOpen },
];

export type SidebarMembership = {
  id: string;
  name: string;
  slug: string;
  isAgency: boolean;
};

export function Sidebar({
  clientName,
  ownerName,
  role = "Owner",
  memberships = [],
  activeClientId,
}: {
  clientName: string;
  ownerName: string;
  role?: string;
  memberships?: SidebarMembership[];
  activeClientId?: string;
}) {
  const pathname = usePathname();
  const canSwitch = memberships.length > 1;

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
        {canSwitch ? (
          <details className="group relative">
            <summary className="list-none rounded-xl bg-[var(--color-surface-muted)] px-3.5 py-3 border border-transparent hover:border-[var(--color-border)] transition-colors cursor-pointer">
              <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider mb-0.5">
                Workspace
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-[14px] font-semibold text-[var(--color-ink)] truncate">
                  {clientName}
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-[var(--color-ink-subtle)] shrink-0" />
              </div>
            </summary>
            <div className="absolute left-0 right-0 mt-1.5 z-20 rounded-xl bg-white border border-[var(--color-border)] shadow-lg overflow-hidden">
              <div className="px-3 pt-2.5 pb-1 text-[10px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-wider">
                Switch workspace
              </div>
              <ul className="py-1">
                {memberships.map((m) => {
                  const isActive = m.id === activeClientId;
                  return (
                    <li key={m.id}>
                      <form action={setActiveClient}>
                        <input type="hidden" name="clientId" value={m.id} />
                        <button
                          type="submit"
                          disabled={isActive}
                          className={cn(
                            "w-full text-left flex items-center justify-between gap-3 px-3 py-2 text-[13px] transition-colors",
                            isActive
                              ? "bg-[var(--color-surface-muted)] text-[var(--color-ink)] cursor-default"
                              : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]",
                          )}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="truncate font-medium">{m.name}</span>
                            {m.isAgency && (
                              <span className="text-[9px] uppercase tracking-wider text-[var(--color-ink-subtle)] shrink-0">
                                Agency
                              </span>
                            )}
                          </span>
                          {isActive && (
                            <Check className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" />
                          )}
                        </button>
                      </form>
                    </li>
                  );
                })}
              </ul>
            </div>
          </details>
        ) : (
          <div className="rounded-xl bg-[var(--color-surface-muted)] px-3.5 py-3 border border-transparent">
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
        )}
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
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-[12px] font-semibold">
            {ownerName.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-[var(--color-ink)] truncate">
              {ownerName}
            </div>
            <div className="text-[11px] text-[var(--color-ink-subtle)] truncate">{role}</div>
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
  );
}
