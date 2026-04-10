interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-6 mb-8 animate-in">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[12px] font-medium text-[var(--color-accent)] uppercase tracking-[0.08em] mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-ink)] leading-[1.15]">
          {title}
        </h1>
        {description && (
          <p className="text-[15px] text-[var(--color-ink-muted)] mt-2 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
