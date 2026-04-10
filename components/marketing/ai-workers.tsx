"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  PenLine,
  Facebook,
  Megaphone,
  Search,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Worker = {
  id: string;
  name: string;
  tag: string;
  icon: LucideIcon;
  ring: string;
  iconColor: string;
  iconBg: string;
  tasks: string[];
  duration: number;
  offset: number;
};

const WORKERS: Worker[] = [
  {
    id: "email",
    name: "Email Marketing",
    tag: "01 / AGENT",
    icon: Mail,
    ring: "ring-emerald-400/30",
    iconColor: "text-emerald-300",
    iconBg: "bg-emerald-400/10 border-emerald-400/25",
    tasks: [
      "Writing welcome series",
      "Testing subject lines",
      "Scheduling cart abandon",
      "Segmenting VIP list",
    ],
    duration: 4200,
    offset: 0,
  },
  {
    id: "creative",
    name: "Creative Writing",
    tag: "02 / AGENT",
    icon: PenLine,
    ring: "ring-cyan-400/30",
    iconColor: "text-cyan-300",
    iconBg: "bg-cyan-400/10 border-cyan-400/25",
    tasks: [
      "Drafting '10 spring tips'",
      "Writing landing page copy",
      "Adding internal links",
      "Polishing tone of voice",
    ],
    duration: 5400,
    offset: 700,
  },
  {
    id: "social",
    name: "Social Media",
    tag: "03 / AGENT",
    icon: Facebook,
    ring: "ring-blue-400/30",
    iconColor: "text-blue-300",
    iconBg: "bg-blue-400/10 border-blue-400/25",
    tasks: [
      "Scheduling 3 posts",
      "Writing captions",
      "Tagging locations",
      "Boosting top post",
    ],
    duration: 3800,
    offset: 1400,
  },
  {
    id: "advertising",
    name: "Advertising",
    tag: "04 / AGENT",
    icon: Megaphone,
    ring: "ring-amber-400/30",
    iconColor: "text-amber-300",
    iconBg: "bg-amber-400/10 border-amber-400/25",
    tasks: [
      "Generating carousel",
      "Testing ad variants",
      "Pausing losers",
      "Scaling winners +20%",
    ],
    duration: 4600,
    offset: 2100,
  },
  {
    id: "research",
    name: "Research",
    tag: "05 / AGENT",
    icon: Search,
    ring: "ring-violet-400/30",
    iconColor: "text-violet-300",
    iconBg: "bg-violet-400/10 border-violet-400/25",
    tasks: [
      "Scanning competitor ads",
      "Finding ranking keywords",
      "Tracking local rivals",
      "Pulling market trends",
    ],
    duration: 5000,
    offset: 2800,
  },
  {
    id: "analyst",
    name: "Analyst",
    tag: "06 / AGENT",
    icon: BarChart3,
    ring: "ring-pink-400/30",
    iconColor: "text-pink-300",
    iconBg: "bg-pink-400/10 border-pink-400/25",
    tasks: [
      "Compiling metrics",
      "Highlighting wins",
      "Flagging anomalies",
      "Weekly summary ready",
    ],
    duration: 4400,
    offset: 3500,
  },
];

function WorkerCard({ worker }: { worker: Worker }) {
  const [taskIdx, setTaskIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let interval: ReturnType<typeof setInterval> | null = null;
    const STEP_MS = 80;
    const INCREMENT = (100 / worker.duration) * STEP_MS;

    const start = setTimeout(() => {
      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setTaskIdx((i) => (i + 1) % worker.tasks.length);
            return 0;
          }
          return Math.min(100, p + INCREMENT);
        });
      }, STEP_MS);
    }, worker.offset);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [mounted, worker.duration, worker.offset, worker.tasks.length]);

  const Icon = worker.icon;
  const done = progress >= 99;

  return (
    <div
      className={cn(
        "relative rounded-xl bg-white/[0.02] border border-white/[0.08] p-4 h-[148px] flex flex-col",
        "transition-all duration-300",
        done && "ring-1 ring-inset",
        done && worker.ring,
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg border flex items-center justify-center shrink-0",
            worker.iconBg,
          )}
        >
          <Icon className={cn("w-4 h-4", worker.iconColor)} strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/45">
            {worker.tag}
          </div>
          <div className="text-[13px] font-semibold text-white truncate leading-tight mt-0.5">
            {worker.name}
          </div>
        </div>
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            "bg-[#10E39A]",
            !done && "dot-pulse",
          )}
        />
      </div>

      <div className="flex-1 min-h-0 flex items-start">
        <div
          key={taskIdx}
          className="text-[12.5px] text-white/75 leading-[1.45]"
          style={{ animation: "fadeUp 0.4s ease-out" }}
        >
          {worker.tasks[taskIdx]}
        </div>
      </div>

      <div className="mt-3">
        <div className="h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#10E39A] via-[#5280FF] to-[#C8362B] transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-mono text-[9px] tracking-wider text-white/40 uppercase">
            {done ? "shipped" : "working"}
          </span>
          <span className="font-mono text-[9px] text-white/40 tabular">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function AiWorkers() {
  return (
    <div className="glow-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#10E39A] opacity-60 dot-pulse" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10E39A]" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#10E39A]">
          Jarvis (AI) · Live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {WORKERS.map((w) => (
          <WorkerCard key={w.id} worker={w} />
        ))}
      </div>
    </div>
  );
}
