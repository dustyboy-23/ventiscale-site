// Charts, comparison tables, step diagrams and the numbered source list for blog articles.
// All plain server-rendered HTML: sharp on phones, readable by Google, no image files to load.

export interface BlogSource {
  n: number;
  label: string;
  href: string;
}

type Nums = number | number[];
const asList = (n: Nums) => (Array.isArray(n) ? n : [n]);

/** A small numbered marker beside a figure. It jumps to the source list at the foot of the article. */
export function Cite({ n }: { n: Nums }) {
  return (
    <sup className="bv-cite">
      {asList(n).map((k, i) => (
        <span key={k}>
          {i > 0 && ", "}
          <a href={`#source-${k}`} aria-label={`Source ${k}`}>
            {k}
          </a>
        </span>
      ))}
    </sup>
  );
}

/** The only outside links in an article, so readers aren't pulled off the page mid-sentence. */
export function BlogSources({ items }: { items: BlogSource[] }) {
  return (
    <section className="bv-sources" aria-labelledby="sources-heading">
      <h2 id="sources-heading">Sources</h2>
      <ol>
        {items.map((s) => (
          <li key={s.n} id={`source-${s.n}`}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function BarChart({
  title,
  items,
  source,
  note,
}: {
  title: string;
  items: { label: string; value: number }[];
  source: Nums;
  note?: string;
}) {
  const top = Math.max(...items.map((i) => i.value));
  return (
    <figure className="bv-fig">
      <figcaption className="bv-title">{title}</figcaption>
      <ul className="bv-bars">
        {items.map((i) => (
          <li key={i.label} data-top={i.value === top}>
            <span className="bv-bar-label">{i.label}</span>
            <span className="bv-bar-value">{i.value}%</span>
            <span className="bv-bar-track" aria-hidden="true">
              <span className="bv-bar-fill" style={{ width: `${i.value}%` }} />
            </span>
          </li>
        ))}
      </ul>
      <p className="bv-note">
        {note}
        <Cite n={source} />
      </p>
    </figure>
  );
}

export function CompareTable({
  title,
  columns,
  rows,
  source,
}: {
  title: string;
  columns: string[];
  rows: string[][];
  source?: Nums;
}) {
  return (
    <figure className="bv-fig">
      <figcaption className="bv-title">
        {title}
        {source !== undefined && <Cite n={source} />}
      </figcaption>
      <table className="bv-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              <th scope="row">{row[0]}</th>
              {row.slice(1).map((cell, i) => (
                <td key={columns[i + 1]} data-label={columns[i + 1]}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function StepFlow({
  title,
  steps,
}: {
  title: string;
  steps: { title: string; body: string }[];
}) {
  return (
    <figure className="bv-fig">
      <figcaption className="bv-title">{title}</figcaption>
      <ol className="bv-steps">
        {steps.map((s) => (
          <li key={s.title}>
            <span className="bv-step-title">{s.title}</span>
            <span className="bv-step-body">{s.body}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
