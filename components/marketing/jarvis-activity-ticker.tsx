"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  PenLine,
  Megaphone,
  BarChart3,
  Search,
  Image as ImageIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Activity = {
  icon: LucideIcon;
  color: string; // tailwind text color class
  bg: string; // tailwind bg color class
  label: string;
  detail: string;
  time: string;
};

const FEED: Activity[] = [
  {
    icon: Mail,
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
    label: "Email flow shipped",
    detail: "Welcome series → Stoneline Apparel",
    time: "just now",
  },
  {
    icon: PenLine,
    color: "text-cyan-300",
    bg: "bg-cyan-400/10",
    label: "Content drafted",
    detail: "12 social posts → Pasture & Pine",
    time: "2m ago",
  },
  {
    icon: Megaphone,
    color: "text-amber-300",
    bg: "bg-amber-400/10",
    label: "Ad creative tested",
    detail: "Meta carousel v3 → Forge Fitness",
    time: "4m ago",
  },
  {
    icon: Search,
    color: "text-violet-300",
    bg: "bg-violet-400/10",
    label: "SEO sprint deployed",
    detail: "8 articles indexed → Stoneline",
    time: "7m ago",
  },
  {
    icon: BarChart3,
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
    label: "Weekly report generated",
    detail: "Revenue +34% → Pasture & Pine",
    time: "12m ago",
  },
  {
    icon: ImageIcon,
    color: "text-cyan-300",
    bg: "bg-cyan-400/10",
    label: "Landing page built",
    detail: "Spring drop → Forge Fitness",
    time: "18m ago",
  },
  {
    icon: Sparkles,
    color: "text-violet-300",
    bg: "bg-violet-400/10",
    label: "Strategy memo posted",
    detail: "Q2 plan → Stoneline Apparel",
    time: "23m ago",
  },
];

export function JarvisActivityTicker() {
  const [items, setItems] = useState<Activity[]>(FEED);

  // Cycle the feed every 3.2s for the "live" feel.
  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glow-card rounded-2xl p-5 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 dot-pulse" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-300">
            Live · Jarvis ops feed
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
          ventiscale.com
        </span>
      </div>

      <ul className="space-y-2.5 relative">
        {items.slice(0, 5).map((item, i) => {
          const Icon = item.icon;
          return (
            <li
              key={`${item.label}-${i}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 transition-all",
                i === 0 && "ring-1 ring-emerald-400/30 bg-emerald-400/[0.04]",
              )}
              style={{
                animation: i === 0 ? "fadeUp 0.5s ease-out" : undefined,
              }}
            >
              <div
                className={cn(
                  "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                  item.bg,
                )}
              >
                <Icon className={cn("w-4 h-4", item.color)} strokeWidth={2.25} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold text-white/95 truncate">
                  {item.label}
                </div>
                <div className="text-[11px] text-white/50 truncate font-mono">
                  {item.detail}
                </div>
              </div>
              <div className="text-[10px] font-mono text-white/40 shrink-0 tabular">
                {item.time}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
