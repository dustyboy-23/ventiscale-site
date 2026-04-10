export function Eyebrow({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent";
}) {
  const color = variant === "accent" ? "text-[#10E39A]" : "text-white/45";
  return (
    <span
      className={`inline-block font-mono text-[11px] tracking-[0.18em] uppercase ${color}`}
    >
      {children}
    </span>
  );
}
