"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, AlertCircle, Mail, Loader2 } from "lucide-react";
import { enterDemo } from "@/app/actions/demo";
import { requestMagicLink } from "@/app/actions/request-login";
import { createClient } from "@/lib/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Your sign-in link was incomplete. Try signing in again.",
  exchange_failed: "That sign-in link has expired. Try signing in again.",
  server_error: "Something went wrong on our end. Try again in a moment.",
  send_failed:
    "Email sign-in is paused right now. Use Sign in with Google or email Dusty for a link.",
  supabase_misconfigured:
    "Sign-in isn't fully configured yet. Email dustin@ventiscale.com and we'll get you in.",
  rate_limit: "Too many sign-in attempts. Wait a few minutes, then try again.",
  invalid_email: "That doesn't look like a valid email. Double-check it and try again.",
  oauth_failed: "Couldn't reach Google for sign-in. Try again or email Dusty for a fallback link.",
};

const MAILTO =
  "mailto:dustin@ventiscale.com?subject=Portal%20sign-in%20link%20please" +
  "&body=Hey%20Dusty%2C%20can%20you%20send%20me%20my%20sign-in%20link%3F";

// Inline Google "G" mark. Trademark-correct colors. Standard Google Identity
// guidelines say to render their actual mark next to "Sign in with Google."
function GoogleMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function StubLogin({
  errorKey,
  setErrorKey,
}: {
  errorKey: string | null;
  setErrorKey: (k: string | null) => void;
}) {
  const [oauthLoading, setOauthLoading] = useState(false);

  async function handleGoogle() {
    setErrorKey(null);
    setOauthLoading(true);
    try {
      const supabase = createClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "https://www.ventiscale.com";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("[login] google oauth failed", error.message);
        setErrorKey("oauth_failed");
        setOauthLoading(false);
      }
      // On success the browser is being redirected, no further state to set.
    } catch (err) {
      console.error("[login] google oauth threw", err);
      setErrorKey("oauth_failed");
      setOauthLoading(false);
    }
  }

  return (
    <>
      <div className="text-[12px] font-medium text-[var(--color-accent)] uppercase tracking-[0.08em] mb-3">
        Client Portal
      </div>
      <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-ink)] leading-[1.15]">
        Sign in to your workspace
      </h1>
      <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
        Use the Google account I sent your invite to. One click, no password.
      </p>

      {errorKey && (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" strokeWidth={2.25} />
          <p className="text-[13px] text-red-700 leading-snug">
            {ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.server_error}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogle}
        disabled={oauthLoading}
        className="mt-7 w-full flex items-center justify-center gap-3 bg-white border border-[var(--color-border-strong)] text-[var(--color-ink)] text-[14px] font-semibold py-3 rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors disabled:opacity-60"
      >
        {oauthLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <GoogleMark className="w-4 h-4" />
        )}
        {oauthLoading ? "Redirecting…" : "Sign in with Google"}
      </button>

      <div className="mt-6 pt-6 border-t border-[var(--color-border)] space-y-4">
        <div>
          <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-[0.08em] mb-2">
            Don&apos;t use Google?
          </div>
          <a
            href={MAILTO}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-accent)] hover:underline transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Email Dusty for a one-time link
          </a>
          <p className="text-[11px] text-[var(--color-ink-subtle)] mt-1.5 leading-relaxed">
            Real human, real reply. Usually inside an hour during business hours.
          </p>
        </div>

        <div>
          <div className="text-[11px] font-medium text-[var(--color-ink-subtle)] uppercase tracking-[0.08em] mb-2">
            Not a client yet?
          </div>
          <form action={enterDemo}>
            <button
              type="submit"
              className="text-[13px] font-medium text-[var(--color-accent)] hover:underline transition-colors"
            >
              Tour the live demo portal →
            </button>
          </form>
          <p className="text-[11px] text-[var(--color-ink-subtle)] mt-1.5 leading-relaxed">
            See exactly what the portal looks like. Fictional brand, real interface.
          </p>
        </div>
      </div>
    </>
  );
}

function ManualLoginForm({
  errorKey,
  setErrorKey,
}: {
  errorKey: string | null;
  setErrorKey: (k: string | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorKey(null);

    try {
      const result = await requestMagicLink(email);
      if (!result.ok) {
        setErrorKey(result.error);
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      console.error("[login] requestMagicLink threw", err);
      setErrorKey("server_error");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
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
    );
  }

  return (
    <>
      <div className="text-[12px] font-medium text-[var(--color-accent)] uppercase tracking-[0.08em] mb-3">
        Manual sign-in (admin)
      </div>
      <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-ink)] leading-[1.15]">
        Sign in to your workspace
      </h1>
      <p className="text-[14px] text-[var(--color-ink-muted)] mt-2 leading-relaxed">
        Email-based sign-in is paused while we swap providers. Use this form only if a new provider
        is wired up.
      </p>

      {errorKey && (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" strokeWidth={2.25} />
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
    </>
  );
}

function LoginPageInner() {
  const searchParams = useSearchParams();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const isManual = searchParams.get("manual") === "1";

  // Surface ?error=... from the callback handler
  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setErrorKey(err);
  }, [searchParams]);

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
          href="https://www.ventiscale.com"
          className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          Back to ventiscale.com →
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_4px_24px_rgba(10,14,31,0.06)] p-10 animate-in">
            {isManual ? (
              <ManualLoginForm errorKey={errorKey} setErrorKey={setErrorKey} />
            ) : (
              <StubLogin errorKey={errorKey} setErrorKey={setErrorKey} />
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-[12px] text-[var(--color-ink-subtle)]">
              Need help?{" "}
              <Link
                href="mailto:dustin@ventiscale.com"
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                dustin@ventiscale.com
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
