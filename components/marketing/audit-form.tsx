"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Editorial cream audit form. Two fields, one button. Hairline border.
 * The button is the only color on the page that isn't ink.
 */
export function AuditForm() {
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !url) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, url }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Email hello@ventiscale.com and we'll fix it.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg p-7 bg-[#FAF6EF] border border-[rgba(27,27,27,0.10)] flex items-start gap-4">
        <div className="shrink-0 w-11 h-11 rounded-full bg-[#1B1B1B] flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-[#F6F1EA]" strokeWidth={2.25} />
        </div>
        <div>
          <div
            className="text-[20px] text-[#1B1B1B] tracking-tight"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
          >
            On it.
          </div>
          <p className="text-[14px] text-[#1B1B1B]/65 mt-1.5 leading-relaxed">
            Your audit will land in <span className="font-mono text-[#1B1B1B]">{email}</span> in
            under a minute. If you don&apos;t see it, check your promotions tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="rounded-lg p-2 flex flex-col sm:flex-row gap-2 bg-[#FAF6EF] border border-[rgba(27,27,27,0.10)]">
        <input
          type="url"
          required
          placeholder="yourbrand.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={status === "loading"}
          className="flex-1 sm:max-w-[200px] px-4 h-12 rounded-md text-[14px] font-medium text-[#1B1B1B] placeholder:text-[#1B1B1B]/35 bg-transparent outline-none focus:bg-[#F1EBDF] transition-colors"
        />
        <input
          type="email"
          required
          placeholder="you@yourbrand.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1 px-4 h-12 rounded-md text-[14px] font-medium text-[#1B1B1B] placeholder:text-[#1B1B1B]/35 bg-transparent outline-none focus:bg-[#F1EBDF] transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 h-12 rounded-md text-[14px] font-semibold text-white bg-[#C8362B] hover:bg-[#A82A20] disabled:opacity-60 transition-colors"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running
            </>
          ) : (
            <>
              Run my audit
              <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </>
          )}
        </button>
      </div>
      <p className="text-[11px] font-mono uppercase tracking-[0.14em] mt-3.5 text-[#1B1B1B]/45">
        Under a minute · No call · No spam
      </p>
      {error && <p className="text-[12px] text-[#C8362B] mt-2">{error}</p>}
    </form>
  );
}
