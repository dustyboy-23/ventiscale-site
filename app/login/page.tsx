"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Placeholder — Supabase magic link wires here
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
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
                      placeholder="ken@sprinkler-guard.com"
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
                  The link expires in 1 hour.
                </p>
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
