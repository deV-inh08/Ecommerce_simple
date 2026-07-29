"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BLOG_CARDS = [
  {
    id: "b1",
    title: "How to set up an online store",
    excerpt: "Find insider tips and ideas for online operations from eCommerce experts to add superiority to their businesses.",
    bg: "#e8f0f8",
    emoji: "🛒",
    tag: "Getting Started",
  },
  {
    id: "b2",
    title: "Advantages of the best eCommerce websites to take your store to next level",
    excerpt: "Explore the key strategies and tools that top eCommerce platforms use to boost conversion and grow revenue.",
    bg: "#f0e8f8",
    emoji: "📈",
    tag: "Growth",
  },
  {
    id: "b3",
    title: "How to start a small business: an all-in-one step-by-step guide",
    excerpt: "Everything you need to launch and scale your business from scratch, with expert advice at every step.",
    bg: "#e8f8f0",
    emoji: "💡",
    tag: "Business",
  },
];

export default function BlogPreviewSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="w-full py-16" style={{ backgroundColor: "#fff" }}>
      <div className="site-container">
        <div className="grid gap-12" style={{ gridTemplateColumns: "280px 1fr" }}>
          {/* Left: Heading */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              Learn how to build and grow your online store
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Find insider tips and ideas for online operations from eCommerce experts to add
              superiority to their businesses.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-80"
              style={{ color: "#0d5c5c" }}
            >
              Browse all articles <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: Blog cards */}
          <div className="grid grid-cols-3 gap-5">
            {BLOG_CARDS.map((card) => (
              <Link
                key={card.id}
                href={`/blog/${card.id}`}
                id={`blog-preview-${card.id}`}
                className="group flex flex-col rounded-2xl overflow-hidden transition-all hover:shadow-lg"
                style={{ border: "1px solid #f0f0f0" }}
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image area */}
                <div
                  className="flex items-center justify-center relative overflow-hidden transition-all"
                  style={{
                    height: "160px",
                    backgroundColor: card.bg,
                    transform: hovered === card.id ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <span className="text-5xl">{card.emoji}</span>
                  <span
                    className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "white", color: "#0d5c5c" }}
                  >
                    {card.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#0d5c5c] transition-colors leading-snug line-clamp-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1">
                    {card.excerpt}
                  </p>
                  <div
                    className="flex items-center gap-1 text-xs font-bold mt-2 transition-colors group-hover:gap-2"
                    style={{ color: "#0d5c5c", transition: "gap 0.2s" }}
                  >
                    Read the blog <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
