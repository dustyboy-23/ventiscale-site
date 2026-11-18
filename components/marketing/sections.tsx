import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { enterDemo } from "@/app/actions/demo";
import { OpenFromHash } from "@/components/marketing/open-from-hash";
import { BUNDLES, SERVICES, money, planQuery, quote } from "@/lib/pricing";

const perChannel = (on?: boolean) => (on ? " per channel" : "");

/**
 * One line per service: what it gets you and what ships. Detail folds out on
 * tap. Prices only appear inside the fold, and only on /pricing (`withPrice`):
 * the homepage explains the work first and comes back to price at the bundles.
 */
export function ServiceRows({ withPrice = false }: { withPrice?: boolean }) {
  return (
    <>
      <OpenFromHash />
      <div className="vs-rows">
        {SERVICES.map((s) => (
          <details key={s.id} id={s.id} name="service" className="vs-row">
            <summary>
              <h3 className="vs-row-outcome">{s.outcome}</h3>
              <span className="vs-row-name">{s.name}</span>
              <span className="vs-row-count">{s.count}</span>
              <span className="vs-row-icon" aria-hidden="true" />
            </summary>

            <div className="vs-row-panel">
              <ul className="vs-checks">
                {s.includes.map((line) => (
                  <li key={line}>
                    <Check className="w-5 h-5" strokeWidth={2.4} aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div>
                <dl className="vs-row-facts">
                  {withPrice && (
                    <div>
                      <dt>Price</dt>
                      <dd>
                        <span className="vs-mark vs-num text-evergreen">{money(s.monthly)}</span> a
                        month{perChannel(s.perChannel)}, plus {money(s.setup)} setup
                        {perChannel(s.perChannel)}, one time.
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt>Setup covers</dt>
                    <dd>{s.setupCovers}</dd>
                  </div>
                  <div>
                    <dt>I need from you</dt>
                    <dd>{s.needs}</dd>
                  </div>
                  <div>
                    <dt>Not included</dt>
                    <dd>{s.notIncluded}</dd>
                  </div>
                </dl>
                {withPrice && (
                  <Link href={`/start${planQuery([s.id])}`} className="vs-btn-quiet vs-row-start">
                    Start with {s.name.toLowerCase().replace("seo", "SEO")}
                  </Link>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
      <p className="vs-small mt-4">Every service comes with one plain monthly report.</p>
    </>
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
                {b.recommended && <span className="vs-tag">Start here</span>}
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
                    <s>{money(q.listMonthly)}</s> separately. Save {money(q.saved)} a month.
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
                      {on && s.perChannel && " (1 channel)"}
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
              Next time someone needs what you sell, be the one they find.
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
          <p className="vs-month-name">
            {s.name}
            <span className="vs-month-total">{s.monthTotal}</span>
          </p>
          {s.weeks.map((w, i) => (
            <div key={i}>
              <span className="vs-month-marks" aria-hidden="true">
                {w.units === 0 ? (
                  <i className="vs-month-run" />
                ) : (
                  Array.from({ length: w.units }).map((_, k) => <i key={k} />)
                )}
              </span>
              <span className="sr-only">
                Week {i + 1}: {w.label}
              </span>
            </div>
          ))}
        </div>
      ))}
      <figcaption id="month-cap" className="vs-small mt-5">
        All five services: {total} pieces of work a month, plus one plain report. Dotted lines are
        automatic emails running on their own.
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
