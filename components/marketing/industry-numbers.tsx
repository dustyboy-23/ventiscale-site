import type { IndustryNumber } from "@/lib/industry-numbers";

export function IndustryNumbers({
  items,
  heading = "What the industry numbers say.",
}: {
  items: IndustryNumber[];
  heading?: string;
}) {
  const cols = items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <section>
      <div className="vs-container vs-section">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="vs-h2">{heading}</h2>
            <p className="vs-body mt-4">
              Published industry figures, with the source under each one. They aren&apos;t a promise
              of your results.
            </p>
          </div>
          <ul className={`grid gap-9 list-none p-0 m-0 ${cols}`}>
            {items.map((n) => (
              <li key={n.figure + n.source}>
                <p className="vs-num text-[42px] leading-none">{n.figure}</p>
                <p className="vs-body mt-3">{n.text}</p>
                <a
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vs-link inline-block mt-2 text-[14.5px]"
                >
                  {n.source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
