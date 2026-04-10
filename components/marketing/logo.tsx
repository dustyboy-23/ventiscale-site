import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  /** "ink" (default) for cream canvas, "cream" for ink/dark canvas. */
  variant?: "ink" | "cream";
  /** When provided, wraps in a Link. Pass null to skip the link wrapper. */
  href?: string | null;
};

const SIZES = {
  sm: { mark: 26, text: "text-[16px]", gap: "gap-2.5", v: 26 },
  md: { mark: 32, text: "text-[20px]", gap: "gap-3", v: 26 },
  lg: { mark: 44, text: "text-[28px]", gap: "gap-3.5", v: 26 },
} as const;

/**
 * Venti Scale — Editorial monogram logo (v2 cream).
 *
 * Concept: a solid ink square with a serif italic "V" reversed out in cream.
 * One small corner tick reads as a measurement gradient — the "scale" mark.
 * The wordmark sits beside it in Fraunces, "Scale" italic to echo the V.
 * A single arterial-red dot separates the words — the only color on the logo.
 *
 * Reads from favicon to billboard. Ownable. Archetype-correct.
 */
export function Logo({
  className,
  size = "md",
  showWordmark = true,
  variant = "ink",
  href = "/",
}: Props) {
  const s = SIZES[size];
  const inkFill = variant === "ink" ? "#1B1B1B" : "#F6F1EA";
  const reverseFill = variant === "ink" ? "#F6F1EA" : "#1B1B1B";
  const wordColor = variant === "ink" ? "text-[#1B1B1B]" : "text-[#F6F1EA]";

  const mark = (
    <svg
      width={s.mark}
      height={s.mark}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <rect x="0" y="0" width="44" height="44" rx="3.5" fill={inkFill} />
      <text
        x="22"
        y="32"
        textAnchor="middle"
        fontFamily="Fraunces, Times New Roman, serif"
        fontStyle="italic"
        fontWeight="400"
        fontSize="28"
        fill={reverseFill}
        style={{ letterSpacing: "-0.02em" }}
      >
        V
      </text>
      {/* Tiny tick — the "scale" mark */}
      <line
        x1="34"
        y1="9"
        x2="38"
        y2="9"
        stroke={reverseFill}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );

  const wordmark = showWordmark && (
    <span
      className={cn(
        "font-display tracking-[-0.025em] leading-none font-normal",
        wordColor,
        s.text,
      )}
    >
      Venti
      <span className="inline-block align-middle mx-[0.22em] w-[3px] h-[3px] rounded-full bg-[#C8362B]" />
      <span className="italic">Scale</span>
    </span>
  );

  const inner = (
    <span className={cn("inline-flex items-center group", s.gap, className)}>
      {mark}
      {wordmark}
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} aria-label="Venti Scale home" className="inline-flex items-center">
      {inner}
    </Link>
  );
}
