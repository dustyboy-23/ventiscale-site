import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { BUNDLES, SERVICES, money, planQuery, quote } from "@/lib/pricing";

/** Services as a ledger: what it is, what you get, what it costs. */
export function ServiceLedger({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="vs-ledger">
      {SERVICES.map((s) => (
        <article key={s.id} id={s.id} className="vs-ledger-row">
          <div>
            <h3 className="vs-h3">{s.name}</h3>
            <p className="vs-body mt-2.5">{s.blurb}</p>
            {detailed && (
              <dl className="mt-5 grid gap-3 text-[15.5px] leading-[1.5]">
                <div>
                  <dt className="font-semibold">Setup covers</dt>
                  <dd className="text-moss">{s.setupCovers}</dd>
                </div>
                <div>
                  <dt className="font-semibold">I need from you</dt>
                  <dd className="text-moss">{s.needs}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Not included</dt>
                  <dd className="text-moss">{s.notIncluded}</dd>
                </div>
              </dl>
            )}
          </div>

          <ul className="vs-checks">
            {s.includes.map((line) => (
              <li key={line}>
                <Check className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
            {!detailed && (
              <li data-off="true">
                <Minus className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                <span>Not included: {s.notIncluded.charAt(0).toLowerCase() + s.notIncluded.slice(1)}</span>
              </li>
            )}
          </ul>

          <div className="lg:text-right">
            <p className="vs-num text-[30px] leading-none">
              <span className="vs-mark">{money(s.monthly)}</span>
              <span className="text-[15px] font-medium text-moss tracking-normal" style={{ fontFamily: "var(--font-vs-body)" }}>
                {" "}
                /mo
              </span>
            </p>
            <p className="vs-small mt-2.5">plus {money(s.setup)} setup, one time</p>
            <Link href={`/start${planQuery([s.id])}`} className="vs-link inline-block mt-3.5 text-[15.5px]">
              Start with {s.name.toLowerCase().replace("seo", "SEO")}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

/** Three ready-made bundles, joined as one table. */
export function BundleTable() {
  return (
    <div className="vs-bundles">
      {BUNDLES.map((b) => {
        const q = quote(b.ids);
        return (
          <section key={b.id} className="vs-bundle" data-pick={b.recommended ? "true" : "false"}>
            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="vs-h3">{b.name}</h3>
                {b.recommended && <span className="vs-tag">Most pick this</span>}
              </div>
              <p className="vs-small mt-2 min-h-[2.9em]">{b.forWho}</p>
            </div>

            <div>
              <p className="vs-num text-[44px] leading-none">
                <span className="vs-mark">{money(q.monthly)}</span>
                <span className="text-[16px] font-medium text-moss tracking-normal" style={{ fontFamily: "var(--font-vs-body)" }}>
                  {" "}
                  /mo
                </span>
              </p>
              <p className="vs-small mt-3">
                {q.saved > 0 && (
                  <>
                    <s>{money(q.listMonthly)}</s> separately. You save {money(q.saved)} a month.
                    <br />
                  </>
                )}
                Plus {money(q.setup)} setup, one time.
              </p>
            </div>

            <ul className="vs-checks">
              {SERVICES.map((s) => {
                const on = b.ids.includes(s.id);
                return (
                  <li key={s.id} data-off={on ? "false" : "true"}>
                    {on ? (
                      <Check className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                    ) : (
                      <Minus className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                    )}
                    <span>
                      {s.name}
                      {!on && <span className="sr-only"> (not in this bundle)</span>}
                    </span>
                  </li>
                );
              })}
            </ul>

            <Link
              href={`/start${planQuery(b.ids)}`}
              className={`${b.recommended ? "vs-btn" : "vs-btn-quiet"} vs-btn-block mt-auto`}
            >
              Start my plan
            </Link>
          </section>
        );
      })}
    </div>
  );
}

export const STEPS = [
  {
    title: "Pick your plan",
    body: "Tick the services you want on this page and send the form. Two minutes. No sales call.",
  },
  {
    title: "Setup week",
    body: "You fill in a short form and share access. I learn your business, connect everything and plan your first months.",
  },
  {
    title: "Work goes out",
    body: "Articles, posts, emails, ads and videos ship every week. Approve them first or let them run. Your choice.",
  },
  {
    title: "Monthly report",
    body: "One plain page: what went out, what it did, what's next. Change or cancel your plan any month.",
  },
];

export function Steps() {
  return (
    <ol className="vs-steps list-none p-0 m-0">
      {STEPS.map((s) => (
        <li key={s.title} className="vs-step">
          <h3 className="vs-h3">{s.title}</h3>
          <p className="vs-small mt-2 text-[16px]">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Closing band. Also the landing spot for the old /#audit links. */
export function ClosingCta({ id }: { id?: string }) {
  return (
    <section className="vs-band" id={id}>
      <div className="vs-container vs-section">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <h2 className="vs-h1" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
              Pick your services. See your price. Start this week.
            </h2>
            <p className="vs-lede mt-5">
              Two minutes to send. I reply personally within one business day. Nothing is charged
              until you say go.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/start" className="vs-btn">
              Start my plan
            </Link>
            <Link href="/pricing" className="vs-btn-quiet">
              See all pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
