"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import {
  BUNDLES,
  BUNDLE_DISCOUNT,
  DEFAULT_PLAN,
  SERVICES,
  money,
  parsePlan,
  planQuery,
  quote,
  type ServiceId,
} from "@/lib/pricing";

function sameSet(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((x) => b.includes(x));
}

type Props = {
  /** Heading level text. The sheet is the hero on the homepage. */
  title?: string;
  /** Run the one-time highlighter swipe on load (homepage hero only). */
  animate?: boolean;
};

export function PlanBuilder({ title = "Your plan", animate = false }: Props) {
  const [ids, setIds] = useState<ServiceId[]>(DEFAULT_PLAN);

  // Deep links: /pricing?plan=seo,email opens with that plan ticked.
  useEffect(() => {
    const fromUrl = parsePlan(new URLSearchParams(window.location.search).get("plan"));
    if (fromUrl.length) setIds(fromUrl);
  }, []);

  const q = useMemo(() => quote(ids), [ids]);

  function toggle(id: ServiceId) {
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  const nextHint =
    ids.length === 0
      ? "Tick a service to see your price."
      : ids.length === 1
        ? `Add a second service and the monthly drops ${BUNDLE_DISCOUNT[2] * 100}%.`
        : ids.length === 2
          ? `One more service takes the discount to ${BUNDLE_DISCOUNT[3] * 100}%.`
          : `${BUNDLE_DISCOUNT[3] * 100}% bundle discount applied.`;

  return (
    <div className="vs-sheet" id="plan">
      <div className="vs-sheet-head">
        <h2 className="vs-h3">{title}</h2>
        <p className="vs-small">Tick what you want handled</p>
      </div>

      <div className="vs-presets" role="group" aria-label="Ready-made bundles">
        {BUNDLES.map((b) => (
          <button
            key={b.id}
            type="button"
            className="vs-preset"
            aria-pressed={sameSet(ids, b.ids)}
            onClick={() => setIds(b.ids)}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div>
        {SERVICES.map((s, i) => {
          const on = ids.includes(s.id);
          return (
            <label key={s.id} className="vs-line" data-on={on}>
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggle(s.id)}
                aria-describedby={`plan-sub-${s.id}`}
              />
              <span className="vs-box" aria-hidden="true">
                <Check className="w-4 h-4" strokeWidth={3} />
              </span>
              <span>
                <span className="vs-line-name block">{s.name}</span>
                <span className="vs-line-sub block" id={`plan-sub-${s.id}`}>
                  {s.short}
                </span>
              </span>
              <span className="vs-line-price vs-num">
                <span
                  className={`vs-mark${animate ? " vs-mark-in" : ""}`}
                  style={animate ? ({ "--i": i } as React.CSSProperties) : undefined}
                >
                  {money(s.monthly)}
                </span>
                <small>/mo</small>
              </span>
            </label>
          );
        })}
      </div>

      <div className="vs-total">
        <div className="vs-total-row">
          <span className="text-[16px] font-semibold">Monthly</span>
          <span className="vs-num vs-total-big" aria-live="polite">
            {q.saved > 0 && (
              <s className="text-[18px] font-medium text-moss mr-2.5 align-middle">
                {money(q.listMonthly)}
              </s>
            )}
            <span className="vs-mark">{money(q.monthly)}</span>
          </span>
        </div>
        <div className="vs-total-row">
          <span className="vs-small">Setup, one time</span>
          <span className="vs-num text-[18px]">{money(q.setup)}</span>
        </div>
        <p className="vs-small mt-3">{nextHint}</p>

        {ids.length > 0 ? (
          <Link href={`/start${planQuery(q.ids)}`} className="vs-btn vs-btn-block mt-4">
            Start my plan
          </Link>
        ) : (
          <span className="vs-btn vs-btn-block mt-4" aria-disabled="true" style={{ opacity: 0.5 }}>
            Start my plan
          </span>
        )}
        <p className="vs-small mt-3 text-center">
          No contract. Cancel any month. Nothing is charged today.
        </p>
      </div>
    </div>
  );
}
