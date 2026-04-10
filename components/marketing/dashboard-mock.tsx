import {
  LayoutDashboard,
  Calendar,
  Mail,
  FileText,
  Search,
  FolderOpen,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Content", icon: Calendar },
  { label: "Email", icon: Mail },
  { label: "Reports", icon: FileText },
  { label: "SEO Plan", icon: Search },
  { label: "Files", icon: FolderOpen },
];

const KPIS = [
  { label: "Revenue", value: "$48,290", hint: "+34% MoM", highlight: true, icon: DollarSign },
  { label: "Orders", value: "312", hint: "$154 avg", icon: ShoppingBag },
  { label: "Customers", value: "247", hint: "26% repeat", icon: Users },
  { label: "Conversion", value: "3.8%", hint: "8.2k sessions", icon: TrendingUp },
];

const PRODUCTS = [
  { name: "Heritage tee bundle", revenue: 18420, pct: 100 },
  { name: "Selvedge denim", revenue: 12800, pct: 70 },
  { name: "Field jacket", revenue: 9650, pct: 53 },
  { name: "Daily oxford shirt", revenue: 7420, pct: 41 },
];

/**
 * Cream editorial dashboard mock — used as the hero "real product" image.
 *
 * Looks like a real working portal screenshot. Cream/ivory chrome, hairline
 * borders, near-black ink, one arterial-red accent on the live KPI tile.
 * No glow. No gradients. No motion. The product as still life.
 */
export function DashboardMock() {
  return (
    <div className="flex bg-[#FAF6EF] h-[540px] text-left relative overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:flex w-[180px] shrink-0 flex-col bg-[#F1EBDF] border-r border-[rgba(27,27,27,0.08)] p-3">
        <div className="flex items-center gap-2 px-2 py-2 mb-3">
          <div className="w-6 h-6 rounded-[3px] bg-[#1B1B1B] flex items-center justify-center">
            <span
              className="text-[14px] leading-none italic text-[#FAF6EF]"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              V
            </span>
          </div>
          <div>
            <div
              className="text-[10px] font-normal text-[#1B1B1B] leading-none"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Venti<span className="text-[#1F3D2B]">·</span>
              <span className="italic">Scale</span>
            </div>
            <div className="text-[7.5px] text-[#1B1B1B]/40 leading-none mt-0.5 font-mono uppercase tracking-wider">
              Client Portal
            </div>
          </div>
        </div>

        <div className="rounded-md bg-[#FAF6EF] border border-[rgba(27,27,27,0.08)] px-2.5 py-2 mb-3">
          <div className="text-[7px] font-mono text-[#1B1B1B]/40 uppercase tracking-wider">
            Workspace
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <div className="text-[10px] font-semibold text-[#1B1B1B]">Stoneline Apparel</div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#1F3D2B]" />
          </div>
        </div>

        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <div
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px]",
                    item.active
                      ? "bg-[#1B1B1B] text-[#FAF6EF] font-semibold"
                      : "text-[#1B1B1B]/55",
                  )}
                >
                  <Icon className="w-3 h-3" strokeWidth={item.active ? 2.25 : 2} />
                  <span>{item.label}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-3 border-t border-[rgba(27,27,27,0.08)]">
          <div className="flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-wider text-[#1B1B1B]/55">
            <span className="w-1 h-1 rounded-full bg-[#1F3D2B]" />
            Jarvis online
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="h-9 border-b border-[rgba(27,27,27,0.08)] bg-[#FAF6EF] flex items-center px-4 justify-between">
          <div className="text-[9px] text-[#1B1B1B]/40 font-mono">
            ⌘K · Search reports, content...
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[9px] text-[#1B1B1B]/55 bg-[#F1EBDF] border border-[rgba(27,27,27,0.08)] rounded px-2 py-0.5 font-mono">
              Last 28 days
            </div>
            <div className="w-5 h-5 rounded bg-[#F1EBDF] border border-[rgba(27,27,27,0.08)]" />
          </div>
        </div>

        <div className="p-4 overflow-hidden">
          {/* Header */}
          <div className="mb-3">
            <div className="text-[8px] font-mono text-[#1B1B1B]/50 uppercase tracking-[0.14em]">
              Premium menswear · Built to last
            </div>
            <div
              className="text-[18px] text-[#1B1B1B] tracking-tight mt-1 leading-tight"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 360 }}
            >
              Good morning, Marcus
            </div>
            <div className="text-[9px] text-[#1B1B1B]/45 mt-0.5">
              Here&apos;s how Stoneline is performing this month.
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {KPIS.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.label}
                  className={cn(
                    "rounded-md border p-2.5",
                    k.highlight
                      ? "bg-[#1B1B1B] border-[#1B1B1B]"
                      : "bg-[#FAF6EF] border-[rgba(27,27,27,0.08)]",
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={cn(
                        "text-[7px] font-mono uppercase tracking-wider",
                        k.highlight ? "text-[#FAF6EF]/65" : "text-[#1B1B1B]/40",
                      )}
                    >
                      {k.label}
                    </div>
                    <Icon
                      className={cn(
                        "w-2.5 h-2.5",
                        k.highlight ? "text-[#FAF6EF]/85" : "text-[#1B1B1B]/40",
                      )}
                      strokeWidth={2}
                    />
                  </div>
                  <div
                    className={cn(
                      "text-[15px] font-bold tabular leading-none",
                      k.highlight ? "text-[#FAF6EF]" : "text-[#1B1B1B]",
                    )}
                    style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                  >
                    {k.value}
                  </div>
                  <div
                    className={cn(
                      "text-[8px] mt-1 flex items-center gap-0.5",
                      k.highlight ? "text-[#1F3D2B]" : "text-[#1B1B1B]/45",
                    )}
                  >
                    {k.highlight && <ArrowUpRight className="w-2 h-2" strokeWidth={2.5} />}
                    {k.hint}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Body grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Products */}
            <div className="col-span-2 bg-[#FAF6EF] rounded-md border border-[rgba(27,27,27,0.08)] p-3">
              <div className="flex items-baseline justify-between mb-2.5">
                <div className="text-[10px] font-semibold text-[#1B1B1B] tracking-tight">
                  Product performance
                </div>
                <div className="text-[8px] text-[#1B1B1B]/40 font-mono uppercase tracking-wider">
                  Top sellers
                </div>
              </div>
              <div className="space-y-2">
                {PRODUCTS.map((p, i) => (
                  <div key={p.name}>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[7px] tabular text-[#1B1B1B]/40 font-mono">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] font-medium text-[#1B1B1B] truncate">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-[9px] tabular font-semibold text-[#1B1B1B] shrink-0 ml-2">
                        ${p.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1 bg-[#F1EBDF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1B1B1B] rounded-full"
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO snapshot */}
            <div className="bg-[#FAF6EF] rounded-md border border-[rgba(27,27,27,0.08)] p-3">
              <div className="text-[10px] font-semibold text-[#1B1B1B] tracking-tight mb-2">
                SEO snapshot
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Clicks", value: "1,284" },
                  { label: "Impr", value: "42k" },
                  { label: "CTR", value: "3.1%" },
                  { label: "Pos", value: "14.2" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded bg-[#F1EBDF] border border-[rgba(27,27,27,0.06)] p-1.5"
                  >
                    <div className="text-[6.5px] text-[#1B1B1B]/40 uppercase tracking-wider font-mono">
                      {s.label}
                    </div>
                    <div
                      className="text-[12px] font-bold tabular text-[#1B1B1B] mt-0.5"
                      style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1 text-[7px] font-mono text-[#1F3D2B]">
                <Sparkles className="w-2 h-2" strokeWidth={2.5} />
                Organic +28%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
