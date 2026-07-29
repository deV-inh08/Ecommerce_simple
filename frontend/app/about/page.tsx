"use client";
import { useState } from "react";
import Link from "next/link";
import { Play, Truck, Clock, Store, Shield, ChevronRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ─── Stats data ─────────────────────────────────────────── */
const STATS = [
  { value: "45K+",  label: "Clients worldwide" },
  { value: "50+",   label: "Stores worldwide" },
  { value: "#01",   label: "eCommerce platform" },
  { value: "$10M+", label: "Total revenue worldwide" },
];

/* ─── Services data ──────────────────────────────────────── */
const SERVICES = [
  {
    icon: <Truck size={28} style={{ color: "#0d5c5c" }} />,
    title: "Same Day Delivery",
    desc: "We are providing same day delivery with a minimum cost at anytime, anywhere.",
  },
  {
    icon: <Clock size={28} style={{ color: "#0d5c5c" }} />,
    title: "Next Day Delivery",
    desc: "We are providing next day delivery without any minimum cost at anytime, anywhere.",
  },
  {
    icon: <Store size={28} style={{ color: "#0d5c5c" }} />,
    title: "Multiple Store",
    desc: "We have multiple store around the country and soon we will launch more stores.",
  },
  {
    icon: <Shield size={28} style={{ color: "#0d5c5c" }} />,
    title: "Trusted Platform",
    desc: "Our clients love us so much. We are providing the best and bringing the best to the clients.",
  },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function AboutPage() {
  const [email, setEmail]   = useState("");
  const [subbed, setSubbed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubbed(true);
    setTimeout(() => setSubbed(false), 3000);
    setEmail("");
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />

      <main className="flex-1 w-full">
        {/* ── Section 1: Hero ── */}
        <section style={{ backgroundColor: "#f5e6c8" }} className="w-full py-16">
          <div className="site-container">
            <div className="grid items-center gap-10" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {/* Left */}
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                  We connect people and create economic opportunity for all.
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-sm">
                  We create pathways to connect millions of sellers and buyers in more than 130 markets
                  around the world. Our technology empowers our customers, providing everyone the
                  opportunity to grow and thrive.
                </p>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: "#0d5c5c" }}
                >
                  <Play size={16} fill="white" className="text-white ml-0.5" />
                </button>
              </div>

              {/* Right — decorative image block */}
              <div className="relative flex items-center justify-center">
                {/* Yellow accent top-left */}
                <div
                  className="absolute top-0 left-8 w-24 h-24 rounded-xl z-0"
                  style={{ backgroundColor: "#f5c518", transform: "rotate(-12deg)" }}
                />
                {/* Black accent bottom-right */}
                <div
                  className="absolute bottom-0 right-8 w-16 h-16 rounded-xl z-0"
                  style={{ backgroundColor: "#111", transform: "rotate(8deg)" }}
                />
                {/* Main image placeholder */}
                <div
                  className="relative z-10 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ width: "320px", height: "260px", backgroundColor: "#d4c5a0" }}
                >
                  {/* Person illustration placeholder */}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
                      style={{ backgroundColor: "#f5c518" }}>
                      👤
                    </div>
                    <p className="text-xs text-gray-500">Company photo</p>
                  </div>
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                      <Play size={18} fill="#0d5c5c" style={{ color: "#0d5c5c", marginLeft: "2px" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Building the next level ── */}
        <section className="site-container py-16">
          <div className="grid gap-12" style={{ gridTemplateColumns: "280px 1fr" }}>
            {/* Left: heading */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Building the next level of eCommerce
              </h2>
              <Link
                href="/category/all"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ color: "#0d5c5c" }}
              >
                Shop now <ChevronRight size={14} />
              </Link>
            </div>

            {/* Right: 2 image cards */}
            <div className="grid grid-cols-2 gap-5">
              {[
                {
                  title: "Empowering creativity.",
                  desc: "Every day, our customers share their inspiring stories with us. We've learned that DIY enriches people's lives in countless ways. It's a creative outlet.",
                  bg: "#3a4a5a",
                  emoji: "💻",
                },
                {
                  title: "The heart of Pursuit",
                  desc: "Our people are the heart and soul of our little company. We are passionate about creating amazing products that make our customers happy.",
                  bg: "#6a5a4a",
                  emoji: "👥",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #f0f0f0" }}>
                  <div
                    className="w-full flex items-center justify-center"
                    style={{ height: "200px", backgroundColor: card.bg }}
                  >
                    <span className="text-6xl">{card.emoji}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{card.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Stats ── */}
        <section style={{ backgroundColor: "#f5e6c8" }} className="py-14">
          <div className="site-container">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Global scale and reach</h2>
            <div className="grid grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div
                  key={s.value}
                  className="flex flex-col items-center text-center py-6 px-4 rounded-2xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <span className="text-3xl font-extrabold text-gray-900 mb-1">{s.value}</span>
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: Services ── */}
        <section style={{ backgroundColor: "#f5c518" }} className="py-14">
          <div className="site-container">
            <div className="grid grid-cols-4 gap-5">
              {SERVICES.map((s) => (
                <div
                  key={s.title}
                  className="flex flex-col gap-3 p-6 rounded-2xl"
                  style={{ backgroundColor: "white" }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e8f5f0" }}>
                    {s.icon}
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-900">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5: Newsletter ── */}
        <section style={{ backgroundColor: "#0d5c5c" }} className="py-16">
          <div className="site-container">
            <div className="grid items-center gap-12" style={{ gridTemplateColumns: "1fr 320px" }}>
              {/* Left */}
              <div>
                <h2 className="text-3xl font-extrabold text-white leading-tight mb-8">
                  Subscribe our newsletter to get latest product updates
                </h2>
                <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 text-sm rounded-xl outline-none"
                    style={{ border: "none" }}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-bold rounded-xl transition-opacity hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: "#f5c518", color: "#111" }}
                  >
                    {subbed ? "✓ Subscribed!" : "Subscribe"}
                  </button>
                </form>
                {subbed && (
                  <p className="text-xs text-green-300 mt-3">🎉 You&apos;re subscribed! Thank you.</p>
                )}
              </div>

              {/* Right — product image */}
              <div className="flex items-center justify-center">
                <div
                  className="rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ width: "260px", height: "220px", backgroundColor: "#0a4a4a", border: "2px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="text-center">
                    <span className="text-7xl">👜</span>
                    <p className="text-xs text-white opacity-40 mt-2">Latest collection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
