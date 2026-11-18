import Link from "next/link";
import { LogoMark } from "@/components/marketing/logo";

type Props = {
  bioOverride?: string;
  lastUpdated?: string;
};

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogAuthorBio({ bioOverride, lastUpdated }: Props) {
  const bio =
    bioOverride ??
    "Founder of Venti Scale. I run marketing for small businesses and online stores, and I check every post here before it goes live.";
  return (
    <div className="blog-author">
      <LogoMark size={48} />
      <div>
        <div className="author-name">
          <Link href="/about" className="hover:underline">
            Dustin Gilmour
          </Link>
        </div>
        <div className="author-bio">{bio}</div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white/35 font-mono">
          <Link href="/about" className="hover:text-white/60 transition-colors">
            About
          </Link>
          <span aria-hidden>·</span>
          <a
            href="https://www.linkedin.com/in/dustingilmour/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            LinkedIn
          </a>
          <span aria-hidden>·</span>
          <a
            href="https://x.com/ai_dustingilmour"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            X
          </a>
          {lastUpdated && (
            <>
              <span aria-hidden>·</span>
              <span className="text-white/30">
                Updated {formatDate(lastUpdated)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
