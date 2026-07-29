"use client";
import { useState } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ─── Mock data ──────────────────────────────────────────── */
const FEATURED = [
  {
    id: "f1",
    title: "30 type of modern trendy fashion for women and men in 2022 worldwide",
    date: "July 1, 2022",
    author: "Warner",
    bg: "linear-gradient(135deg, #3a4a6b 0%, #5a6a8b 50%, #8a7a6b 100%)",
    tag: "Fashion",
  },
  {
    id: "f2",
    title: "Open-sourcing our photo layout for Swift UI",
    date: "Jun 1, 2022",
    author: "Warner",
    bg: "linear-gradient(135deg, #e8a040 0%, #d4b870 50%, #7ab8d8 100%)",
    tag: "Design",
  },
];

const POSTS = [
  { id: "p1",  title: "Win a Samsung Portable SSD T7 Shield",                   date: "July 7, 2022", author: "Warner", bg: "#2a4a7a", tag: "Tech" },
  { id: "p2",  title: "Open-sourcing our photo layout for Swift UI",             date: "July 7, 2022", author: "Warner", bg: "#c05a3a", tag: "Design" },
  { id: "p3",  title: "12 type of shirts that a girl can wear in any casual party", date: "July 1, 2022", author: "Warner", bg: "#3a7a5a", tag: "Fashion" },
  { id: "p4",  title: "Win a Samsung Portable SSD T7 Shield",                   date: "July 7, 2022", author: "Warner", bg: "#1a1a2a", tag: "Tech" },
  { id: "p5",  title: "Open-sourcing our photo layout for Swift UI",             date: "July 7, 2022", author: "Warner", bg: "#a07040", tag: "Design" },
  { id: "p6",  title: "12 type of shirts that a girl can wear in any casual party", date: "July 1, 2022", author: "Warner", bg: "#2a4a6a", tag: "Fashion" },
  { id: "p7",  title: "Win a Samsung Portable SSD T7 Shield",                   date: "July 7, 2022", author: "Warner", bg: "#6a3a5a", tag: "Tech" },
  { id: "p8",  title: "Open-sourcing our photo layout for Swift UI",             date: "July 7, 2022", author: "Warner", bg: "#8a6a3a", tag: "Design" },
  { id: "p9",  title: "12 type of shirts that a girl can wear in any casual party", date: "July 1, 2022", author: "Warner", bg: "#3a6a5a", tag: "Fashion" },
  { id: "p10", title: "Win a Samsung Portable SSD T7 Shield",                   date: "July 7, 2022", author: "Warner", bg: "#5a3a7a", tag: "Tech" },
  { id: "p11", title: "Open-sourcing our photo layout for Swift UI",             date: "July 7, 2022", author: "Warner", bg: "#4a5a3a", tag: "Design" },
  { id: "p12", title: "12 type of shirts that a girl can wear in any casual party", date: "July 1, 2022", author: "Warner", bg: "#7a4a3a", tag: "Fashion" },
];

const PAGE_SIZE = 9;

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Fashion: { bg: "#fef2f2", color: "#dc2626" },
  Design:  { bg: "#f3e8ff", color: "#7c3aed" },
  Tech:    { bg: "#eff6ff", color: "#2563eb" },
};

/* ─── Featured Card ──────────────────────────────────────── */
function FeaturedCard({ post }: { post: typeof FEATURED[0] }) {
  return (
    <Link
      href={`/blog/${post.id}`}
      id={`featured-${post.id}`}
      className="group flex flex-col rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
      style={{ border: "1px solid #f0f0f0" }}
    >
      {/* Image */}
      <div
        className="relative w-full"
        style={{ height: "260px", background: post.bg }}
      >
        {/* Tag */}
        <span
          className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: TAG_COLORS[post.tag].bg, color: TAG_COLORS[post.tag].color }}
        >
          {post.tag}
        </span>
        {/* Overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          style={{ backgroundColor: "rgba(13,92,92,0.15)" }}
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
            <ArrowRight size={16} style={{ color: "#0d5c5c" }} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-3 group-hover:text-[#0d5c5c] transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
          <span className="flex items-center gap-1"><User size={11} /> By {post.author}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Post Card ──────────────────────────────────────────── */
function PostCard({ post }: { post: typeof POSTS[0] }) {
  return (
    <Link
      href={`/blog/${post.id}`}
      id={`post-${post.id}`}
      className="group flex flex-col rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
      style={{ border: "1px solid #f0f0f0" }}
    >
      {/* Thumbnail */}
      <div className="relative" style={{ height: "180px", backgroundColor: post.bg }}>
        <span
          className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: TAG_COLORS[post.tag].bg, color: TAG_COLORS[post.tag].color }}
        >
          {post.tag}
        </span>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          style={{ backgroundColor: "rgba(13,92,92,0.2)" }}
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <ArrowRight size={13} style={{ color: "#0d5c5c" }} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-[#0d5c5c] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><User size={10} /> By {post.author}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function BlogPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = POSTS.slice(0, visibleCount);
  const hasMore = visibleCount < POSTS.length;

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />

      <main className="flex-1 w-full">
        {/* ── Hero banner ── */}
        <div style={{ backgroundColor: "#f5e6c8" }} className="w-full py-14">
          <div className="site-container text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Read our latest blog</h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              We provide actionable insights to help you stay on the cutting edge of ecommerce.
              Join our thought leadership community to get ecommerce tips right to your inbox.
            </p>
          </div>
        </div>

        {/* ── Featured ── */}
        <section className="site-container pt-12 pb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Featured</h2>
          <div className="grid grid-cols-2 gap-6">
            {FEATURED.map((post) => (
              <FeaturedCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* ── Latest from the team ── */}
        <section className="site-container pb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Latest from the team</h2>

          <div className="grid grid-cols-3 gap-5">
            {visible.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                id="blog-load-more"
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="px-10 py-3 text-sm font-bold text-white rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#0d5c5c" }}
              >
                Load More
              </button>
            </div>
          )}

          {!hasMore && POSTS.length > 0 && (
            <p className="text-center text-sm text-gray-400 mt-10">
              You&apos;ve read all {POSTS.length} articles
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
