"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; color?: string }
  | { kind: "ok"; text: string }
  | { kind: "info"; text: string };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "jarvis run --client stoneline --task email-flow" },
  { kind: "info", text: "→ Analyzing 47 customer segments..." },
  { kind: "info", text: "→ Drafting welcome series (5 emails)..." },
  { kind: "ok", text: "✓ Subject lines tested across 12 variants" },
  { kind: "ok", text: "✓ Flow deployed to Klaviyo · 3 segments live" },
  { kind: "out", text: "  Est. lift: +$8,400/mo · ETA first send: 2h" },
  { kind: "cmd", text: "jarvis run --client pasture-pine --task ad-creative" },
  { kind: "info", text: "→ Pulling top-performing UGC from drive..." },
  { kind: "ok", text: "✓ 6 carousels generated · uploaded to Meta" },
  { kind: "ok", text: "✓ Ad set duplicated · budget split $40/$60" },
  { kind: "out", text: "  Last 7d ROAS: 4.2× · CPA -28%" },
  { kind: "cmd", text: "jarvis run --client forge-fitness --task seo-sprint" },
  { kind: "info", text: "→ 24 keyword candidates ranked..." },
  { kind: "ok", text: "✓ 8 articles drafted · on-page optimized" },
  { kind: "ok", text: "✓ Internal links updated · sitemap pinged" },
  { kind: "out", text: "  Est. organic traffic: +2,400 sessions/mo" },
  { kind: "info", text: "→ All clients up-to-date. Standing by." },
];

export function LiveOpsTerminal() {
  const [visibleLines, setVisibleLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisibleLines(SCRIPT);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            runScript();
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  async function runScript() {
    for (let i = 0; i < SCRIPT.length; i++) {
      const line = SCRIPT[i];
      if (line.kind === "cmd") {
        // Type the command character by character
        for (let c = 0; c <= line.text.length; c++) {
          setTyping(line.text.slice(0, c));
          await sleep(22);
        }
        setTyping("");
        setVisibleLines((prev) => [...prev, line]);
        await sleep(280);
      } else {
        setVisibleLines((prev) => [...prev, line]);
        await sleep(line.kind === "ok" ? 240 : 180);
      }
    }
  }

  return (
    <div
      ref={ref}
      className="glow-card rounded-2xl overflow-hidden font-mono text-[12.5px] leading-[1.7]"
    >
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="flex-1 text-center text-[10px] uppercase tracking-[0.18em] text-white/40">
          jarvis@ventiscale ~ live
        </div>
        <div className="text-[10px] text-emerald-300/80 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dot-pulse" />
          ACTIVE
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 max-h-[440px] overflow-hidden bg-[#04060c]">
        {visibleLines.map((line, i) => (
          <TerminalLine key={i} line={line} />
        ))}
        {typing && (
          <div className="text-emerald-300">
            <span className="text-white/40">$ </span>
            {typing}
            <span className="cursor-blink">▍</span>
          </div>
        )}
        {!typing && visibleLines.length === SCRIPT.length && (
          <div className="text-emerald-300">
            <span className="text-white/40">$ </span>
            <span className="cursor-blink">▍</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TerminalLine({ line }: { line: Line }) {
  if (line.kind === "cmd") {
    return (
      <div className="text-emerald-300">
        <span className="text-white/40">$ </span>
        {line.text}
      </div>
    );
  }
  if (line.kind === "ok") {
    return <div className="text-emerald-400/90">{line.text}</div>;
  }
  if (line.kind === "info") {
    return <div className="text-cyan-300/85">{line.text}</div>;
  }
  return <div className="text-white/55">{line.text}</div>;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
