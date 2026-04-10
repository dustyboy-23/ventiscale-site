"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  variant?: "hero" | "block";
};

export function AuditForm({ variant = "hero" }: Props) {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !business || !url || !email) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business, url, email, notes }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something broke on our end. Email hello@ventiscale.com and we'll fix it.");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`rounded-xl p-7 bg-[#11131B] border border-white/[0.08] flex items-start gap-4 ${
          variant === "hero" ? "" : "max-w-[560px] mx-auto"
        }`}
      >
        <div className="shrink-0 w-11 h-11 rounded-full bg-[#10E39A]/15 border border-[#10E39A]/30 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-[#10E39A]" strokeWidth={2.25} />
        </div>
        <div>
          <div className="font-display text-[22px] text-white leading-[1.2]">
            Audit queued.
          </div>
          <p className="text-[13.5px] text-white/65 mt-2 leading-[1.6]">
            Your AI audit for{" "}
            <span className="font-mono text-white">{url}</span> is running.
            You&apos;ll get a full growth plan at{" "}
            <span className="font-mono text-white">{email}</span> today. I read
            every one personally before we send it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-[#12141C] to-[#0D0F16] border border-white/[0.08] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
          <div className="group">
            <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 mb-2">
              Your name
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "loading"}
              className="w-full h-10 text-[14px] font-medium text-white placeholder:text-white/25 bg-transparent border-0 border-b border-white/[0.12] focus:border-[#10E39A]/60 outline-none transition-colors"
            />
          </div>
          <div className="group">
            <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 mb-2">
              Type of business
            </label>
            <input
              type="text"
              required
              autoComplete="organization"
              placeholder="Skincare brand, plumber, coach"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              disabled={status === "loading"}
              className="w-full h-10 text-[14px] font-medium text-white placeholder:text-white/25 bg-transparent border-0 border-b border-white/[0.12] focus:border-[#10E39A]/60 outline-none transition-colors"
            />
          </div>
          <div className="group">
            <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 mb-2">
              Website
            </label>
            <input
              type="url"
              required
              placeholder="yourbusiness.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={status === "loading"}
              className="w-full h-10 text-[14px] font-medium text-white placeholder:text-white/25 bg-transparent border-0 border-b border-white/[0.12] focus:border-[#10E39A]/60 outline-none transition-colors"
            />
          </div>
          <div className="group">
            <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 mb-2">
              Your email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@yourbusiness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="w-full h-10 text-[14px] font-medium text-white placeholder:text-white/25 bg-transparent border-0 border-b border-white/[0.12] focus:border-[#10E39A]/60 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/[0.06]">
          <div className="flex items-baseline justify-between mb-2">
            <label className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">
              Goals, questions, anything we should know{" "}
              <span className="text-white/25 normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <span className="font-mono text-[10px] text-white/30 tabular shrink-0">
              {notes.length} / 2000
            </span>
          </div>
          <textarea
            rows={4}
            placeholder="What are you trying to grow? What have you tried? Any questions for us? The more context you give us, the better your plan will be."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={status === "loading"}
            maxLength={2000}
            className="w-full px-4 py-3 text-[14px] text-white placeholder:text-white/25 bg-[#07080C] border border-white/[0.08] rounded-lg outline-none focus:border-[#10E39A]/50 transition-colors resize-none leading-[1.6]"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 h-12 rounded-lg text-[14px] font-semibold text-white bg-[#C8362B] hover:bg-[#E04A3E] disabled:opacity-60 transition-colors shadow-[0_10px_30px_-10px_rgba(200,54,43,0.55)]"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running your audit...
            </>
          ) : (
            <>
              Get my free AI audit
              <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.16em] text-white/40 text-center">
        Takes 60 seconds · Plan in your inbox today · No sales call required
      </p>
      {error && (
        <p className="mt-2 text-[12px] text-[#E04A3E] text-center">{error}</p>
      )}
    </form>
  );
}
