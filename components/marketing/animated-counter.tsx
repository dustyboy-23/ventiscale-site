"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number; // ms
  className?: string;
  format?: "number" | "currency" | "compact";
};

/**
 * Counts up from 0 to `value` the first time it scrolls into view.
 * Uses requestAnimationFrame with an ease-out curve so the
 * last few hundred ms feel deliberate, not janky.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1800,
  className,
  format = "number",
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
              setDisplay(value * eased);
              if (t < 1) requestAnimationFrame(tick);
              else setDisplay(value);
            };
            requestAnimationFrame(tick);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [value, duration]);

  const formatted = (() => {
    if (format === "compact") {
      if (display >= 1_000_000) return (display / 1_000_000).toFixed(decimals || 1) + "M";
      if (display >= 1_000) return (display / 1_000).toFixed(decimals || 1) + "k";
      return display.toFixed(decimals);
    }
    if (format === "currency") {
      return display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return display.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  })();

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
