import Link from "next/link";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Venti Scale",
  description:
    "Practical marketing advice for ecommerce brands, coaches, and local businesses. No fluff. Just what works.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="max-w-[820px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <Eyebrow>BLOG</Eyebrow>
      <h1 className="font-display text-[40px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-white mt-4 mb-4">
        Marketing that works
      </h1>
      <p className="text-[16px] leading-relaxed text-white/55 mb-14 max-w-[520px]">
        Practical advice for growing your business online. Written by someone
        who actually does this every day.
      </p>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-white/[0.04] bg-white/[0.015] overflow-hidden transition-all hover:border-white/[0.08] hover:bg-white/[0.03]"
          >
            {post.image && (
              <div className="w-full aspect-[1200/500] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            )}
            <div className="px-6 py-5">
              <div className="flex flex-wrap items-center gap-3 mb-2.5">
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
                  {post.date}
                </span>
                <span className="text-white/15">&middot;</span>
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/35">
                  {post.readTime} read
                </span>
              </div>
              <h2 className="text-[20px] lg:text-[22px] font-display font-medium leading-snug text-white/90 group-hover:text-white transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-[14px] leading-relaxed text-white/45 group-hover:text-white/55 transition-colors">
                {post.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
