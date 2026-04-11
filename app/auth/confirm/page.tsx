"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Click-through confirmation page for magic-link sign-in.
//
// The reason this exists: Gmail (and other mail providers) pre-scan every
// link in incoming mail for phishing. If the email link goes straight to
// Supabase's /verify endpoint, the scanner's GET burns the single-use OTP
// before the human ever clicks — they then see `otp_expired`. By sending
// the token_hash to this page instead and only verifying on user click,
// the scanner's GET is a harmless page load and the token stays valid.
function ConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"ready" | "verifying" | "error">("ready");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const tokenHash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "magiclink") as
    | "magiclink"
    | "email"
    | "recovery"
    | "invite"
    | "signup";
  // Same-origin redirect only: rejects `//evil.com`, `/\\evil.com`,
  // or anything not starting with a single `/`. Prevents the magic
  // link from being rewritten into an open redirect.
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.startsWith("/\\")
      ? rawNext
      : "/dashboard";

  async function handleConfirm() {
    if (!tokenHash) {
      setStatus("error");
      setErrorMsg("This sign-in link is incomplete. Request a new one below.");
      return;
    }
    setStatus("verifying");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });
      if (error) {
        console.error("[auth/confirm] verifyOtp failed", error.message);
        setStatus("error");
        setErrorMsg(
          error.message.toLowerCase().includes("expired")
            ? "That sign-in link has expired. Request a new one below."
            : "We couldn't complete sign-in. Request a new link below.",
        );
        return;
      }
      router.push(next);
    } catch (err) {
      console.error("[auth/confirm] verify threw", err);
      setStatus("error");
      setErrorMsg("Something went wrong on our end. Try again in a moment.");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-ink)] flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-tight">VS</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
            Venti Scale
          </span>
        </div>
        <a
          href="https://www.ventiscale.com"
          className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          Back to ventiscale.com →
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_4px_24px_rgba(10,14,31,0.06)] p-10">
            {status === "ready" && (
              <>
                <div className="text-[12px] font-medium text-[var(--color-accent)] uppercase tracking-[0.08em] mb-3">
                  Confirm sign-in
                </div>
                <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-ink)] leading-[1.15]">
                  One last click
                </h1>
                <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                  Tap the button below to finish signing in to your workspace.
                </p>

                <button
                  onClick={handleConfirm}
                  className="mt-7 w-full flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white text-[14px] font-semibold py-3 rounded-xl hover:bg-black transition-colors"
                >
                  Sign in to Venti Scale
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </button>

                <p className="text-[11px] text-[var(--color-ink-subtle)] mt-5 leading-relaxed">
                  This extra step stops automated email scanners from burning
                  your link before you arrive.
                </p>
              </>
            )}

            {status === "verifying" && (
              <div className="text-center py-4">
                <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center">
                  <Loader2
                    className="w-6 h-6 text-[var(--color-accent)] animate-spin"
                    strokeWidth={2.5}
                  />
                </div>
                <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
                  Signing you in…
                </h1>
                <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                  Hold tight.
                </p>
              </div>
            )}

            {status === "error" && (
              <>
                <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-3 mb-5">
                  <AlertCircle
                    className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                    strokeWidth={2.25}
                  />
                  <p className="text-[13px] text-red-700 leading-snug">
                    {errorMsg}
                  </p>
                </div>
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white text-[14px] font-semibold py-3 rounded-xl hover:bg-black transition-colors"
                >
                  Request a new link
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-[12px] text-[var(--color-ink-subtle)]">
              Need help?{" "}
              <Link
                href="mailto:hello@ventiscale.com"
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                hello@ventiscale.com
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="px-8 py-6 text-center">
        <p className="text-[11px] text-[var(--color-ink-subtle)]">
          © 2026 Venti Scale · Secured by magic-link auth
        </p>
      </footer>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmInner />
    </Suspense>
  );
}
