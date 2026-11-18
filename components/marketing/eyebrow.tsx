// Small category label. Used on blog posts and guide pages, where it names
// the topic of the page. Not for decoration above ordinary headings.
export function Eyebrow({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent";
}) {
  return (
    <span
      className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase"
      style={{ color: variant === "accent" ? "var(--color-leaf-deep)" : "var(--color-moss)" }}
    >
      {children}
    </span>
  );
}
