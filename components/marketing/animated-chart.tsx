"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  data: number[];
  height?: number;
  className?: string;
  color?: string; // hex
  fillOpacity?: number;
};

/**
 * Compact area chart that draws its line on scroll-into-view.
 * Pure SVG, no chart library. The line uses a CSS keyframe to
 * trace itself; the fill fades in once the line is drawn.
 */
export function AnimatedChart({
  data,
  height = 140,
  className,
  color = "#22d36e",
  fillOpacity = 0.16,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(600);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [drawLength, setDrawLength] = useState(1000);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ro = new ResizeObserver(() => {
      setWidth(node.clientWidth || 600);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setDrawLength(length);
    }
  }, [width, data]);

  // Build path
  const padding = 8;
  const w = width;
  const h = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = (w - padding * 2) / (data.length - 1);
  const points = data.map((v, i) => ({
    x: padding + i * step,
    y: padding + (1 - (v - min) / range) * (h - padding * 2),
  }));
  // Smooth curve via Catmull-Rom-ish
  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x},${h} L ${points[0].x},${h} Z`;

  const gradId = `chart-grad-${color.replace("#", "")}`;

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 1.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={padding}
            x2={w - padding}
            y1={padding + p * (h - padding * 2)}
            y2={padding + p * (h - padding * 2)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill={`url(#${gradId})`}
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease-out 1.6s",
          }}
        />

        {/* Drawn line */}
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("draw-on", visible && "is-visible")}
          style={
            {
              "--draw-length": drawLength,
              filter: `drop-shadow(0 0 6px ${color}88)`,
            } as React.CSSProperties
          }
        />

        {/* End dot */}
        {visible && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={4}
            fill={color}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
              opacity: 0,
              animation: "fadeUp 0.5s ease-out 1.9s forwards",
            }}
          />
        )}
      </svg>
    </div>
  );
}
