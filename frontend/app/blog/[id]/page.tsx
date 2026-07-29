"use client";
import { use } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight, Share2 } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

/* ─── Blog post data ─────────────────────────────────────── */
const POSTS: Record<string, {
  id: string; title: string; date: string; author: string; avatar: string;
  tag: string; tagColor: string; tagBg: string; readTime: string;
  sections: Array<{ type: "text" | "heading" | "image" | "images2"; content: string; bg?: string; bg2?: string }>;
}> = {
  default: {
    id: "p1",
    title: "Win a Samsung Portable SSD T7 Shield",
    date: "July 7, 2022",
    author: "Warner",
    avatar: "W",
    tag: "Tech",
    tagColor: "#2563eb",
    tagBg: "#eff6ff",
    readTime: "5 min read",
    sections: [
      {
        type: "image",
        content: "Hero image – photographer in the field",
        bg: "#3a4a5a",
      },
      {
        type: "text",
        content:
          "With over 11k contributions, the Travel Topic on Unsplash gets a lot of traffic. It allows for Unsplash users to discover hidden wonders and inspiring destinations around the world from the comfort of their own homes. We are so thankful to those travel photographers for braving crazy heights, dark seas and stormy weather in the name of art. And we are grateful for all the reliable and durable devices that ensure those memories make it home safely.",
      },
      {
        type: "text",
        content:
          "Samsung Memory supports the superior performance and reliability that you can only get from the world's number one brand for flash memory since 2003. Samsung products are a perfect partner in any situation, from daily life to a tough environment.",
      },
      {
        type: "text",
        content:
          "So we are calling all travel photographers, who are confident in their gear, to submit your best Travel Images. The top three images, as chosen by the Samsung Memory team, have the chance to win a Samsung Portable SSD T7 Shield to help keep your photos safe on your next adventure.",
      },
      {
        type: "images2",
        content: "Fashion models with sunglasses",
        bg: "#c05a3a",
        bg2: "#e8a040",
      },
      {
        type: "images2",
        content: "Street style photography",
        bg: "#5a3a7a",
        bg2: "#3a6a5a",
      },
      {
        type: "heading",
        content: "Submit to the Travel Topic",
      },
      {
        type: "text",
        content:
          "Originally taken to create a time-lapse of the Milky Way rotating over the amazing flat Druipen mountains in Namibia, this series of 250 images taken over the course of an hour also produced this dramatic star trail image. By accident, the foreground has been lit by the occasional flash of a car headlight in the distance catching the hills. The nature of the southern skies produces a particularly rich spectrum of colour and this is really illustrated in this picture.",
      },
      {
        type: "text",
        content:
          "Taken using the amazing Sony A1 and equally fantastic Sony G 24mm f/2.8 GM lens and processed using DXO Photolab 5 for the individual images and Affinity Photo for image stacking.",
      },
      {
        type: "image",
        content: "Street photographer with wide-brimmed hat",
        bg: "#2a2a2a",
      },
      {
        type: "text",
        content:
          "With over 11k contributions, the Travel Topic on Unsplash gets a lot of traffic. It allows for Unsplash users to discover hidden wonders and inspiring destinations around the world from the comfort of their own homes. We are so thankful to those travel photographers for braving crazy heights, dark seas and stormy weather in the name of art. And we are grateful for all the reliable and durable devices that ensure those memories make it home safely.",
      },
      {
        type: "text",
        content:
          "Samsung Memory supports the superior performance and reliability that you can only get from the world's number one brand for flash memory since 2003. Samsung products are a perfect partner in any situation, from daily life to a tough environment.",
      },
      {
        type: "heading",
        content: "How do Topics work?",
      },
      {
        type: "text",
        content:
          "Topics work as a way to curate various images on our platform through a similar theme. From popular ones like aforementioned Travel Topic, to Current Events — curated topics have an increased chance of being featured, promoted, or seen on the site.",
      },
      {
        type: "text",
        content:
          "Curious to partner with us on a topic? Reach out, we'd love to make magic happen.",
      },
    ],
  },
};

const RELATED = [
  { id: "p1", title: "Win a Samsung Portable SSD T7 Shield", date: "July 7, 2022", excerpt: "With over 11k contributions, the Travel Topic on Unsplash gets a lot of traffic. It allows for Unsplash users to discover hidden wonders and inspiring destinations around the world.", bg: "#2a4a7a" },
  { id: "p2", title: "Open-sourcing our photo layout for Swift UI", date: "July 7, 2022", excerpt: "Samsung Memory supports the superior performance and reliability that you can only get from the world's number one brand for flash memory since 2003.", bg: "#c05a3a" },
  { id: "p3", title: "12 type of shirts that a girl can wear in any casual party", date: "July 1, 2022", excerpt: "So we are calling all travel photographers, who are confident in their gear, to submit your best Travel Images.", bg: "#3a7a5a" },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const post = POSTS[id] ?? POSTS.default;

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />

      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="site-container pt-6 pb-2">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate max-w-xs">{post.title}</span>
          </nav>
        </div>

        {/* ── Article ── */}
        <article className="site-container py-10">
          <div className="max-w-2xl mx-auto">
            {/* Tag */}
            <div className="flex justify-center mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: post.tagBg, color: post.tagColor }}>
                {post.tag}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-extrabold text-gray-900 text-center leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-6">
              <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><User size={11} /> By {post.author}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>

            {/* Author chip */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ border: "1.5px solid #e5e7eb" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #0d5c5c, #1a9090)" }}>
                  {post.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Natasha Brennan</p>
                  <p className="text-xs text-gray-400">Travel Photographer</p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-6">
              {post.sections.map((section, i) => {
                if (section.type === "image") {
                  return (
                    <div key={i} className="w-full rounded-2xl overflow-hidden flex items-center justify-center"
                      style={{ height: "380px", backgroundColor: section.bg ?? "#3a4a5a" }}>
                      <div className="text-center text-white opacity-40">
                        <div className="text-5xl mb-2">📷</div>
                        <p className="text-xs">{section.content}</p>
                      </div>
                    </div>
                  );
                }

                if (section.type === "images2") {
                  return (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      {[section.bg, section.bg2].map((bg, j) => (
                        <div key={j} className="rounded-xl overflow-hidden flex items-center justify-center"
                          style={{ height: "200px", backgroundColor: bg ?? "#aaa" }}>
                          <span className="text-4xl opacity-50">🖼️</span>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (section.type === "heading") {
                  return (
                    <h2 key={i} className="text-2xl font-extrabold text-gray-900 mt-4">
                      {section.content}
                    </h2>
                  );
                }

                return (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                );
              })}
            </div>

            {/* ── Share article ── */}
            <div className="mt-10 pt-8 flex flex-col items-center gap-4"
              style={{ borderTop: "1px solid #f0f0f0" }}>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                <Share2 size={15} />
                Share article
              </div>
              <div className="flex items-center gap-3">
                {[
                  // { icon: <Facebook size={16} />, color: "#1877F2", label: "Facebook" },
                  // { icon: <Twitter size={16} />, color: "#1DA1F2", label: "Twitter" },
                  {
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                    color: "#0A66C2", label: "LinkedIn",
                  },
                ].map((s) => (
                  <button key={s.label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg"
                    style={{ backgroundColor: s.color }}
                    title={`Share on ${s.label}`}>
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* ── Related posts ── */}
        <section style={{ borderTop: "1px solid #f5f5f5" }} className="py-12">
          <div className="site-container">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Related articles</h2>
            <div className="grid grid-cols-3 gap-6">
              {RELATED.map((r) => (
                <div key={r.id} className="flex flex-col" style={{ border: "1px solid #f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
                  {/* Thumbnail */}
                  <div className="w-full flex items-center justify-center" style={{ height: "180px", backgroundColor: r.bg }}>
                    <span className="text-white opacity-30 text-4xl">📷</span>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">{r.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3">{r.excerpt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={10} /> {r.date}
                      </span>
                      <Link href={`/blog/${r.id}`}
                        className="text-xs font-extrabold flex items-center gap-1 hover:opacity-80 transition-opacity"
                        style={{ color: "#0d5c5c" }}>
                        READ More <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
