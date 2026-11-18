import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { enterDemo } from "@/app/actions/demo";
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
            {s.sample && (
              <p className="mt-3">
                <Link href={s.sample.href} className="vs-link text-[15.5px]">
                  {s.sample.label}
                </Link>
              </p>
            )}
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
                {b.recommended && <span className="vs-tag">Good place to start</span>}
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

/**
 * A normal month, week by week. Every mark is one piece of work that ships,
 * so the picture can be counted: it is drawn from `weeks` in lib/pricing.ts.
 */
export function MonthView() {
  const total = SERVICES.reduce((t, s) => t + s.weeks.reduce((n, w) => n + w.units, 0), 0);
  return (
    <figure className="vs-month" aria-labelledby="month-cap">
      <div className="vs-month-head" aria-hidden="true">
        <span />
        {[1, 2, 3, 4].map((w) => (
          <span key={w}>Week {w}</span>
        ))}
      </div>
      {SERVICES.map((s) => (
        <div key={s.id} className="vs-month-row">
          <p className="vs-month-name">{s.name}</p>
          {s.weeks.map((w, i) => (
            <div key={i} className="vs-month-cell" data-idle={w.units === 0}>
              <span className="vs-month-marks" aria-hidden="true">
                {w.units === 0 ? (
                  <i className="vs-month-run" />
                ) : (
                  Array.from({ length: w.units }).map((_, k) => <i key={k} />)
                )}
              </span>
              <span className="vs-month-label">
                <span className="sr-only">Week {i + 1}: </span>
                {w.label}
              </span>
            </div>
          ))}
        </div>
      ))}
      <figcaption id="month-cap" className="vs-small mt-5">
        All five services together: {total} pieces of work in a month, then one plain report at
        the end of week 4. Take fewer services and you get fewer rows.
      </figcaption>
    </figure>
  );
}

/** The client dashboard, shown as it really is. The demo workspace is fictional and says so. */
export function DashboardProof() {
  return (
    <section className="vs-band">
      <div className="vs-container vs-section">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16 lg:items-center">
          <div>
            <h2 className="vs-h2">You get a dashboard, not a slide deck.</h2>
            <p className="vs-body mt-4 text-[17.5px]">
              Every client gets a login. What went out, what&apos;s scheduled and the numbers, in
              one place, any time you feel like looking.
            </p>
            <form action={enterDemo} className="mt-7">
              <button type="submit" className="vs-btn-quiet">
                Tour the demo dashboard
              </button>
            </form>
          </div>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo-dashboard.webp"
              alt="The Venti Scale client dashboard showing a demo workspace: sales figures for the last 28 days, top products, and the posts queued to go out."
              width={2000}
              height={1250}
              loading="lazy"
              className="vs-shot"
            />
            <figcaption className="vs-small mt-3">
              The real dashboard, open on the demo workspace. The brand and its numbers are
              made up.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
