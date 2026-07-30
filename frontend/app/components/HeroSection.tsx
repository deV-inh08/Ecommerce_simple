"use client";
import Image from "next/image";
import { useState } from "react";
import section from "../../public/image/section/section.svg"
import shape_section from "../../public/image/section/shape-section.svg"
import star from "../../public/image/section/Star_section.svg"



const slides = [
  {
    id: 0,
    tag: "TRENDING",
    title: "Find the best\nstyles of modern\nshoes",
    desc: "The most wanted styles is waiting for you. Find the best styles of modern shoes here.",
    ctaText: "Explore Product",
    bgColor: "#f5e6c8",
    accentColor: "#e05c2e",
  },
  {
    id: 1,
    tag: "NEW ARRIVAL",
    title: "Discover the\nlatest fashion\ncollection",
    desc: "Explore thousands of styles that match your lifestyle. Shop new arrivals every week.",
    ctaText: "Shop Now",
    bgColor: "#e8f4f4",
    accentColor: "#0d5c5c",
  },
  {
    id: 2,
    tag: "BEST SELLER",
    title: "Premium quality\nat affordable\nprices",
    desc: "Get the best deals on top brands. Quality you can trust, at prices you'll love.",
    ctaText: "Browse All",
    bgColor: "#fef9ec",
    accentColor: "#f5c518",
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="hero"
      style={{ backgroundColor: slides[active].bgColor, minHeight: "420px" }}
      className="w-full py-16 transition-colors duration-500 relative overflow-hidden"
    >
      <div className="site-container flex items-center gap-8 min-h-[420px]">
        {/* Left Content */}
        <div className="flex-1 z-10">
          <span
            style={{ color: slides[active].accentColor }}
            className="text-xs font-bold tracking-widest uppercase mb-3 block"
          >
            {slides[active].tag}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-4 whitespace-pre-line">
            {slides[active].title}
          </h1>
          <p className="text-sm text-gray-600 max-w-xs mb-8 leading-relaxed">
            {slides[active].desc}
          </p>
          <a
            href="#"
            id="hero-cta"
            style={{ backgroundColor: "#0d5c5c" }}
            className="inline-block px-7 py-3 text-white text-sm font-semibold rounded hover:opacity-90 transition-opacity"
          >
            {slides[active].ctaText}
          </a>

          {/* Dots */}
          <div className="flex items-center gap-2 mt-10">
            {slides.map((s) => (
              <button
                key={s.id}
                id={`hero-dot-${s.id}`}
                onClick={() => setActive(s.id)}
                className="transition-all duration-300"
                style={{
                  width: active === s.id ? "32px" : "16px",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor:
                    active === s.id ? "#111" : "#d1d5db",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Image Area */}
        <div className="flex-1 flex justify-start items-center relative">
          <Image src={star} alt="" className="absolute top-20 -left-12"></Image>
          <Image src={section} alt="Hero section" />
          <Image
            src={shape_section}
            alt=""
            className="absolute bottom-0 right-0"
          />
        </div>
      </div>
    </section >
  );
}
