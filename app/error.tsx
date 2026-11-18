"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/marketing/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ventiscale] unhandled error", error);
  }, [error]);

  return (
    <div className="vs-site min-h-screen flex items-center px-6 py-20">
      <div className="max-w-[620px] w-full mx-auto">
        <Link href="/" aria-label="Venti Scale home" className="inline-block">
          <LogoMark size={40} />
        </Link>
        <h1 className="vs-h1 mt-8" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
          This page failed to load.
        </h1>
        <p className="vs-lede mt-5">
          The problem is on my side, not yours. Try again. If it keeps happening, email{" "}
          <a href="mailto:hello@ventiscale.com" className="vs-link">
            hello@ventiscale.com
          </a>{" "}
          and I&apos;ll fix it.
        </p>

        {error?.digest && (
          <p className="vs-small mt-5">Reference: {error.digest}</p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="vs-btn">
            Try again
          </button>
          <Link href="/" className="vs-btn-quiet">
            Go to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
