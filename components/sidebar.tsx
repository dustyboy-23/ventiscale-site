"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Mail,
  FileText,
  FolderOpen,
  LogOut,
  Check,
  ChevronsUpDown,
  Loader2,
  Shield,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { enterDemo, exitDemo } from "@/app/actions/demo";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content", label: "Content", icon: Calendar },
  { href: "/campaigns", label: "Email", icon: Mail },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/files", label: "Files", icon: FolderOpen },
  { href: "/settings/data-handling", label: "Privacy", icon: Shield },
];

const REAL_CLIENT_NAV_HREFS = new Set([
  "/dashboard",
  "/content",
  "/reports",
  "/files",
  "/settings/data-handling",
]);

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
  realClientMode = false,
  canPreviewDemo = false,
  inDemoMode = false,
}: {
  clientName: string;
  ownerName: string;
  role?: string;
  memberships?: SidebarMembership[];
  activeClientId?: string;
  realClientMode?: boolean;
  canPreviewDemo?: boolean;
  inDemoMode?: boolean;
}) {
  const pathname = usePathname();
  // Switcher opens whenever there are multiple memberships OR the user
  // has a demo preview option (so even a solo agency owner gets the
  // dropdown to flip into demo).
  const canSwitch = memberships.length > 1 || canPreviewDemo;
  const visibleNav = realClientMode
    ? NAV.filter((item) => REAL_CLIENT_NAV_HREFS.has(item.href))
    : NAV;
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  async function handleSwitch(clientId: string) {
    if (switchingId) return;
    setSwitchingId(clientId);
    try {
      const res = await fetch("/api/portal/active-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      if (!res.ok) {
        console.error("[sidebar] switch failed", await res.text());
        setSwitchingId(null);
        return;
      }
      // Hard nav preserves middleware cookie writes; client-side router
      // navigation doesn't always pick up the new session state.
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("[sidebar] switch threw", err);
      setSwitchingId(null);
    }
  }

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
            <summary
              className={cn(
                "list-none rounded-xl px-3.5 py-3 border transition-colors cursor-pointer",
                inDemoMode
                  ? "bg-amber-50 border-amber-200 hover:border-amber-300"
                  : "bg-[var(--color-surface-muted)] border-transparent hover:border-[var(--color-border)]",
              )}
            >
              <div
                className={cn(
                  "text-[11px] font-medium uppercase tracking-wider mb-0.5 flex items-center gap-1.5",
                  inDemoMode ? "text-amber-700" : "text-[var(--color-ink-subtle)]",
                )}
              >
                {inDemoMode ? (
                  <>
                    <Eye className="w-3 h-3" /> Demo preview
                  </>
                ) : (
                  "Workspace"
                )}
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
                  const isActive = !inDemoMode && m.id === activeClientId;
                  const isSwitching = switchingId === m.id;
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => !isActive && handleSwitch(m.id)}
                        disabled={isActive || switchingId !== null}
                        className={cn(
                          "w-full text-left flex items-center justify-between gap-3 px-3 py-2 text-[13px] transition-colors",
                          isActive
                            ? "bg-[var(--color-surface-muted)] text-[var(--color-ink)] cursor-default"
                            : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]",
                          switchingId && !isSwitching && "opacity-50",
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
                        {isSwitching ? (
                          <Loader2 className="w-3.5 h-3.5 text-[var(--color-ink-subtle)] shrink-0 animate-spin" />
                        ) : isActive ? (
                          <Check className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Demo preview entry. Only shown to agency users; lets you
                  see the portal as a prospect would, without losing your
                  real session underneath. Form-based so the cookie set
                  happens server-side (httpOnly) before the redirect. */}
              {canPreviewDemo && !inDemoMode && (
                <>
                  <div className="border-t border-[var(--color-border)] mt-1" />
                  <form action={enterDemo} className="py-1">
                    <button
                      type="submit"
                      className="w-full text-left flex items-center justify-between gap-3 px-3 py-2 text-[13px] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)] transition-colors"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate font-medium">Preview demo workspace</span>
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[var(--color-ink-subtle)] shrink-0">
                        Stoneline
                      </span>
                    </button>
                  </form>
                </>
              )}

              {inDemoMode && (
                <>
                  <div className="border-t border-amber-200 mt-1" />
                  <form action={exitDemo} className="py-1">
                    <button
                      type="submit"
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                      Exit demo, back to my workspace
                    </button>
                  </form>
                </>
              )}
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
          {visibleNav.map((item) => {
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
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-[15px] h-[15px]" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
