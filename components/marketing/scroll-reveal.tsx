"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  as?: "div" | "section" | "li" | "span" | "header";
  threshold?: number;
  once?: boolean;
};

/**
 * IntersectionObserver wrapper that triggers a CSS reveal animation
 * the first time the element enters the viewport. The animation itself
 * lives in globals.css under .reveal / .reveal.is-visible.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  threshold = 0.15,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

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
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold, once]);

  // Type-safe element render — avoids the "complex JSX" issue with dynamic Tag
  const Element = Tag as any;
  return (
    <Element
      ref={ref as any}
      className={cn("reveal", visible && "is-visible", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Element>
  );
}
