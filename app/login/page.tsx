"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Your sign-in link was incomplete. Request a new one below.",
  exchange_failed: "That sign-in link has expired. Request a new one below.",
  server_error: "Something went wrong on our end. Try again in a moment.",
  send_failed: "We couldn't send the sign-in email. Try again in a moment.",
  supabase_misconfigured:
    "Sign-in isn't fully configured yet. Email hello@ventiscale.com and we'll get you in.",
};

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  // Surface ?error=... from the callback handler
  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setErrorKey(err);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorKey(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("[login] signInWithOtp failed", error.message);
        setErrorKey("send_failed");
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      console.error("[login] init/send threw", err);
      setErrorKey("supabase_misconfigured");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col">
      {/* Top bar */}
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
          href="https://ventiscale.com"
          className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          Back to ventiscale.com →
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[440px]">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_4px_24px_rgba(10,14,31,0.06)] p-10 animate-in">
            {!submitted ? (
              <>
                <div className="text-[12px] font-medium text-[var(--color-accent)] uppercase tracking-[0.08em] mb-3">
                  Client Portal
                </div>
                <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-ink)] leading-[1.15]">
                  Sign in to your workspace
                </h1>
                <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                  Enter your email and we&apos;ll send you a secure sign-in link. No password required.
                </p>

                {errorKey && (
                  <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-3">
                    <AlertCircle
                      className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                      strokeWidth={2.25}
                    />
                    <p className="text-[13px] text-red-700 leading-snug">
                      {ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.server_error}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-3">
                  <div>
                    <label
                      htmlFor="email"
                      className="text-[12px] font-medium text-[var(--color-ink)] mb-1.5 block"
                    >
                      Work email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourbrand.com"
                      className="w-full px-3.5 py-3 rounded-xl border border-[var(--color-border-strong)] bg-white text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] outline-none focus:border-[var(--color-ink)] focus:ring-4 focus:ring-[var(--color-ink)]/5 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white text-[14px] font-semibold py-3 rounded-xl hover:bg-black transition-colors disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send sign-in link"}
                    {!loading && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                  <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-[0.08em] mb-2">
                    Not a client yet?
                  </div>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="text-[13px] font-medium text-[var(--color-accent)] hover:underline transition-colors"
                  >
                    Tour the live demo portal →
                  </button>
                  <p className="text-[11px] text-[var(--color-ink-subtle)] mt-1.5 leading-relaxed">
                    See exactly what your portal will look like. Fictional brand, real interface.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center">
                  <Check className="w-6 h-6 text-[var(--color-accent)]" strokeWidth={2.5} />
                </div>
                <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
                  Check your inbox
                </h1>
                <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
                  We sent a sign-in link to <br />
                  <span className="text-[var(--color-ink)] font-medium">{email}</span>
                </p>
                <p className="text-[12px] text-[var(--color-ink-subtle)] mt-5">
                  The link expires in 1 hour. Check spam if it doesn&apos;t arrive.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setErrorKey(null);
                  }}
                  className="mt-4 text-[12px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                  Use a different email
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-[12px] text-[var(--color-ink-subtle)]">
              Need help?{" "}
              <Link href="mailto:hello@ventiscale.com" className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors">
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
