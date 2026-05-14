"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function CallbackInner() {
  const sp = useSearchParams();
  const code = sp.get("code");
  const state = sp.get("state");
  const error = sp.get("error");
  const errorDescription = sp.get("error_description");
  const scopes = sp.get("scopes");

  const [copied, setCopied] = useState<string | null>(null);

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center px-6">
        <div className="w-full max-w-[520px] bg-white rounded-2xl border border-red-100 shadow-[0_4px_24px_rgba(10,14,31,0.06)] p-8">
          <div className="text-[11px] font-medium text-red-600 uppercase tracking-[0.12em]">
            TikTok OAuth — failed
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-ink)] mt-2">
            {error}
          </h1>
          {errorDescription && (
            <p className="text-[13px] text-[var(--color-ink-muted)] mt-3 leading-relaxed">
              {errorDescription}
            </p>
          )}
          <p className="text-[12px] text-[var(--color-ink-subtle)] mt-6">
            Close this tab. Re-run the bootstrap script.
          </p>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center px-6">
        <div className="w-full max-w-[520px] bg-white rounded-2xl border border-[var(--color-border)] p-8">
          <div className="text-[11px] font-medium text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
            TikTok OAuth — callback
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-ink)] mt-2">
            Waiting for code
          </h1>
          <p className="text-[13px] text-[var(--color-ink-muted)] mt-3 leading-relaxed">
            This page is the redirect target for TikTok dev app OAuth. It only
            shows useful content when TikTok appends a <code>?code=...</code> query
            param after the operator authorizes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center px-6">
      <div className="w-full max-w-[640px] bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_4px_24px_rgba(10,14,31,0.06)] p-8">
        <div className="text-[11px] font-medium text-[var(--color-accent)] uppercase tracking-[0.12em]">
          TikTok OAuth — code received
        </div>
        <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-ink)] mt-2 mb-1">
          Paste these back into the bootstrap terminal
        </h1>
        <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed mb-6">
          The bootstrap script is waiting for <code>code</code> and{" "}
          <code>state</code>. Confirm <code>state</code> matches the value the
          script printed before opening this URL.
        </p>

        <Field label="code" value={code} copied={copied} onCopy={copy} />
        {state && (
          <Field label="state" value={state} copied={copied} onCopy={copy} />
        )}
        {scopes && (
          <Field label="scopes" value={scopes} copied={copied} onCopy={copy} />
        )}

        <p className="text-[12px] text-[var(--color-ink-subtle)] mt-6 leading-relaxed">
          The <code>code</code> is single-use and expires in ~5 minutes. Don&apos;t
          screenshot or share. Close this tab after pasting.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: string | null;
  onCopy: (label: string, value: string) => void;
}) {
  const isCopied = copied === label;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
          {label}
        </span>
        <button
          onClick={() => onCopy(label, value)}
          className="text-[11px] font-medium text-[var(--color-accent)] hover:underline"
        >
          {isCopied ? "copied" : "copy"}
        </button>
      </div>
      <div className="font-mono text-[12px] text-[var(--color-ink)] bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 break-all">
        {value}
      </div>
    </div>
  );
}

export default function TikTokOAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
