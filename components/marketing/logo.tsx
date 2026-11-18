// Venti Scale mark: a V drawn as a tick. The right arm runs long, the way a
// tick does when the job is done. Evergreen tile, white stroke.
// Used by the nav, footer, favicon (app/icon.tsx) and the OG image.

export const MARK_PATH = "M8.4 10.6 L14.6 22.4 L23.8 8.4";

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="9" fill="#0F2E20" />
      <path
        d={MARK_PATH}
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span
        style={{
          fontFamily: "var(--font-vs-display)",
          fontWeight: 700,
          fontSize: Math.round(size * 0.68),
          letterSpacing: "-0.035em",
          lineHeight: 1,
          color: "var(--color-evergreen)",
        }}
      >
        Venti Scale
      </span>
    </span>
  );
}
