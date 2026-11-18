"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { DEFAULT_PLAN, SERVICES, money, parsePlan, quote, type ServiceId } from "@/lib/pricing";

type Status = "idle" | "sending" | "sent" | "error";

export function StartForm() {
  const uid = useId();
  const [ids, setIds] = useState<ServiceId[]>(DEFAULT_PLAN);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const fromUrl = parsePlan(new URLSearchParams(window.location.search).get("plan"));
    if (fromUrl.length) setIds(fromUrl);
  }, []);

  const q = useMemo(() => quote(ids), [ids]);

  function toggle(id: ServiceId) {
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (ids.length === 0) {
      setStatus("error");
      setError("Pick at least one service.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business, email, url, notes, website, plan: ids.join(",") }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setStatus("error");
        setError(
          (data && typeof data.error === "string" && data.error) ||
            "That didn't go through. Try again, or email hello@ventiscale.com.",
        );
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("No connection. Check your internet and try again, or email hello@ventiscale.com.");
    }
  }

  if (status === "sent") {
    return (
      <div className="vs-sheet p-7 sm:p-9" role="status">
        <span className="grid place-items-center w-12 h-12 rounded-full bg-leaf text-paper">
          <Check className="w-6 h-6" strokeWidth={3} />
        </span>
        <h2 className="vs-h2 mt-5">Plan started.</h2>
        <p className="vs-lede mt-4">
          I have your request, {name.split(" ")[0] || "thanks"}. I&apos;ll email {email} within one
          business day with your setup steps and first invoice. Nothing is charged until you say go.
        </p>
        <div className="vs-rule mt-7 pt-6 grid gap-2">
          <div className="vs-leader-row">
            <span className="font-semibold">Monthly</span>
            <span className="vs-leader" />
            <span className="vs-num text-[20px]"><span className="vs-mark">{money(q.monthly)}</span></span>
          </div>
          <div className="vs-leader-row">
            <span className="vs-small">Setup, one time</span>
            <span className="vs-leader" />
            <span className="vs-num">{money(q.setup)}</span>
          </div>
          <p className="vs-small mt-2">{q.services.map((s) => s.name).join(", ")}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="vs-sheet" noValidate={false}>
      <fieldset className="p-6 sm:p-8">
        <legend className="vs-h3 float-left w-full mb-1">1. Your plan</legend>
        <p className="vs-small clear-both mb-4">Change anything. You can change it again later too.</p>
        <div className="grid gap-2.5">
          {SERVICES.map((s) => {
            const on = ids.includes(s.id);
            return (
              <label
                key={s.id}
                className="vs-line rounded-xl border border-line !py-3 !px-4"
                style={{ borderTopWidth: 1 }}
                data-on={on}
              >
                <input type="checkbox" checked={on} onChange={() => toggle(s.id)} />
                <span className="vs-box" aria-hidden="true">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </span>
                <span className="vs-line-name">{s.name}</span>
                <span className="vs-line-price vs-num">
                  <span className="vs-mark">{money(s.monthly)}</span>
                  <small>/mo</small>
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-5 grid gap-2" aria-live="polite">
          <div className="vs-leader-row">
            <span className="font-semibold">Monthly</span>
            <span className="vs-leader" />
            <span className="vs-num text-[22px]">
              {q.saved > 0 && <s className="text-[15px] font-medium text-moss mr-2">{money(q.listMonthly)}</s>}
              <span className="vs-mark">{money(q.monthly)}</span>
            </span>
          </div>
          <div className="vs-leader-row">
            <span className="vs-small">Setup, one time</span>
            <span className="vs-leader" />
            <span className="vs-num">{money(q.setup)}</span>
          </div>
        </div>
      </fieldset>

      <fieldset className="p-6 sm:p-8 vs-rule">
        <legend className="vs-h3 float-left w-full mb-5">2. Where to reach you</legend>
        <div className="clear-both grid gap-5 sm:grid-cols-2">
          <div className="vs-field">
            <label htmlFor={`${uid}-name`}>Your name</label>
            <input id={`${uid}-name`} className="vs-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={120} />
          </div>
          <div className="vs-field">
            <label htmlFor={`${uid}-biz`}>Business name</label>
            <input id={`${uid}-biz`} className="vs-input" value={business} onChange={(e) => setBusiness(e.target.value)} autoComplete="organization" required maxLength={160} />
          </div>
          <div className="vs-field">
            <label htmlFor={`${uid}-email`}>Email</label>
            <input id={`${uid}-email`} type="email" className="vs-input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required maxLength={200} />
          </div>
          <div className="vs-field">
            <label htmlFor={`${uid}-url`}>
              Website <span className="hint">(optional)</span>
            </label>
            <input id={`${uid}-url`} className="vs-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourbusiness.com" autoComplete="url" inputMode="url" maxLength={300} />
          </div>
          <div className="vs-field sm:col-span-2">
            <label htmlFor={`${uid}-notes`}>
              Anything I should know? <span className="hint">(optional)</span>
            </label>
            <textarea id={`${uid}-notes`} className="vs-input" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} placeholder="What you sell, who buys it, what you've tried." />
          </div>
          {/* Honeypot. Hidden from people, irresistible to bots. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor={`${uid}-hp`}>Leave this empty</label>
            <input id={`${uid}-hp`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
        </div>

        {status === "error" && (
          <p className="vs-error mt-5" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="vs-btn vs-btn-block mt-6" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Starting
            </>
          ) : (
            "Start my plan"
          )}
        </button>
        <p className="vs-small mt-3 text-center">
          Nothing is charged today. I reply personally within one business day.
        </p>
      </fieldset>
    </form>
  );
}
