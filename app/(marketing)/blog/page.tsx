import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

const SITE_URL = "https://www.ventiscale.com";

export const metadata = {
  title: "Blog",
  description:
    "Practical marketing advice for small businesses and online brands. Written by someone who does this every day.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <section>
      <div className="vs-container pt-10 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-[44em]">
          <h1 className="vs-h1">Marketing that works, written down.</h1>
          <p className="vs-lede mt-6">
            Practical advice for growing a business online. {posts.length} articles, newest first.
          </p>
        </div>

        <ul className="vs-ledger list-none p-0 m-0 mt-12 lg:mt-16">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-line">
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-1.5 py-6 sm:grid-cols-[8.5em_1fr] sm:gap-8"
              >
                <p className="vs-small pt-1 tabular-nums">
                  <time dateTime={post.updated ?? post.date}>{formatDate(post.updated ?? post.date)}</time>
                </p>
                <div>
                  <h2 className="vs-h3 group-hover:text-leaf-deep transition-colors">
                    {post.title}
                  </h2>
                  <p className="vs-body mt-2 text-[16px]">{post.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
