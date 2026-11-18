import Link from "next/link";
import { LogoMark } from "@/components/marketing/logo";

export default function NotFound() {
  return (
    <div className="vs-site min-h-screen flex items-center px-6 py-20">
      <div className="max-w-[620px] w-full mx-auto">
        <Link href="/" aria-label="Venti Scale home" className="inline-block">
          <LogoMark size={40} />
        </Link>
        <h1 className="vs-h1 mt-8" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
          That page isn&apos;t here.
        </h1>
        <p className="vs-lede mt-5">
          The link is old or mistyped. The prices and the start form are one click away.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="vs-btn">
            Go to the homepage
          </Link>
          <Link href="/pricing" className="vs-btn-quiet">
            See pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
