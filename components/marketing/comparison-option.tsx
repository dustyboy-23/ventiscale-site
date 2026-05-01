type Props = {
  name: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  idealUseCase: string;
  accent?: "primary" | "neutral";
};

export function ComparisonOption({
  name,
  bestFor,
  pros,
  cons,
  idealUseCase,
  accent = "primary",
}: Props) {
  return (
    <div className={`comparison-option comparison-option-${accent}`}>
      <div className="comparison-header">
        <div className="comparison-name">{name}</div>
        <div className="comparison-best-for">
          <span className="best-for-label">Best for</span>
          <span className="best-for-value">{bestFor}</span>
        </div>
      </div>

      <div className="comparison-grid">
        <div className="comparison-pros">
          <div className="comparison-section-label">Pros</div>
          <ul>
            {pros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="comparison-cons">
          <div className="comparison-section-label">Cons</div>
          <ul>
            {cons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="comparison-ideal">
        <span className="ideal-label">When to choose this</span>
        <p>{idealUseCase}</p>
      </div>
    </div>
  );
}

type MethodologyProps = {
  intro: string;
  criteria: string[];
  experience?: string;
};

export function ComparisonMethodology({
  intro,
  criteria,
  experience,
}: MethodologyProps) {
  return (
    <div className="comparison-methodology">
      <div className="callout-label">How I evaluated this</div>
      <p>{intro}</p>
      <ul>
        {criteria.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      {experience && <p className="methodology-experience">{experience}</p>}
    </div>
  );
}
