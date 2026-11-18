"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  AD_CHANNELS,
  BUNDLES,
  BUNDLE_DISCOUNT,
  DEFAULT_CHANNELS,
  DEFAULT_PLAN,
  SERVICES,
  SETUP_CAP,
  money,
  parsePlan,
  planQuery,
  quote,
  unitsFor,
  type AdChannelId,
  type ServiceId,
} from "@/lib/pricing";

function sameSet(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((x) => b.includes(x));
}

type Props = {
  /** Heading text. The sheet is the hero on the homepage. */
  title?: string;
  /** Run the one-time highlighter swipe on load (homepage hero only). */
  animate?: boolean;
};

export function PlanBuilder({ title = "Your plan", animate = false }: Props) {
  const [ids, setIds] = useState<ServiceId[]>(DEFAULT_PLAN);
  const [channels, setChannels] = useState<AdChannelId[]>(DEFAULT_CHANNELS);

  // Deep links: /pricing?plan=seo,ads-meta,ads-google opens with that plan ticked.
  useEffect(() => {
    const fromUrl = parsePlan(new URLSearchParams(window.location.search).get("plan"));
    if (fromUrl.ids.length) {
      setIds(fromUrl.ids);
      if (fromUrl.channels.length) setChannels(fromUrl.channels);
    }
  }, []);

  const q = useMemo(() => quote(ids, channels), [ids, channels]);

  // Phones: the sheet's own button sits a scroll and a half down, so a slim
  // bar keeps the running total and the button on screen until it is in view.
  const ctaRef = useRef<HTMLDivElement>(null);
  const [ctaInView, setCtaInView] = useState(true);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setCtaInView(e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function toggle(id: ServiceId) {
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function toggleChannel(id: AdChannelId) {
    setChannels((cur) => {
      if (cur.includes(id)) return cur.length > 1 ? cur.filter((x) => x !== id) : cur; // keep at least one
      return AD_CHANNELS.map((c) => c.id).filter((c) => c === id || cur.includes(c));
    });
  }

  const startHref = `/start${planQuery(q.ids, q.channels)}`;

  const nextHint =
    ids.length === 0
      ? "Tick a service to see your price."
      : ids.length === 1
        ? `Add a second service and the monthly drops ${BUNDLE_DISCOUNT[2] * 100}%.`
        : ids.length === 2
          ? `One more service: ${BUNDLE_DISCOUNT[3] * 100}% off, and setup is capped at ${money(SETUP_CAP)}.`
          : `${BUNDLE_DISCOUNT[3] * 100}% off the monthly. Setup capped at ${money(SETUP_CAP)}.`;

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
          const units = on ? unitsFor(s, channels) : 1;
          return (
            <div key={s.id} className="vs-line-wrap">
              <label className="vs-line" data-on={on}>
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
                    {money(s.monthly * units)}
                  </span>
                  <small>/mo</small>
                  {s.perChannel && !on && <span className="vs-line-note">per channel</span>}
                </span>
              </label>

              {s.perChannel && on && (
                <div className="vs-chan" role="group" aria-label="Ad channels">
                  <span className="vs-chan-label">{money(s.monthly)} each:</span>
                  {AD_CHANNELS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="vs-preset vs-chan-chip"
                      aria-pressed={channels.includes(c.id)}
                      onClick={() => toggleChannel(c.id)}
                      title={c.detail}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
          <span className="vs-num text-[18px]">
            {q.setup < q.setupList && (
              <s className="text-[14.5px] font-medium text-moss mr-2">{money(q.setupList)}</s>
            )}
            {money(q.setup)}
          </span>
        </div>
        <p className="vs-small mt-3">{nextHint}</p>

        <div ref={ctaRef}>
          {ids.length > 0 ? (
            <Link href={startHref} className="vs-btn vs-btn-block mt-4">
              Start my plan
            </Link>
          ) : (
            <span className="vs-btn vs-btn-block mt-4" aria-disabled="true" style={{ opacity: 0.5 }}>
              Start my plan
            </span>
          )}
        </div>
        <p className="vs-small mt-3 text-center">
          No contract. Nothing is charged today. First month refunded if you&apos;re not happy.
        </p>
      </div>

      <div className="vs-sticky" data-show={!ctaInView && ids.length > 0}>
        <p className="leading-tight">
          <span className="vs-small block">
            Your plan, {ids.length} {ids.length === 1 ? "service" : "services"}
          </span>
          <span className="vs-num text-[20px]">
            {money(q.monthly)}
            <span className="text-[13.5px] font-medium text-moss" style={{ fontFamily: "var(--font-vs-body)" }}>
              {" "}
              /mo
            </span>
          </span>
        </p>
        <Link href={startHref} className="vs-btn vs-btn-sm" tabIndex={ctaInView ? -1 : 0}>
          Start my plan
        </Link>
      </div>
    </div>
  );
}
