"use client";
import { useState } from "react";

const brands = [
  { id: "dell", label: "Dell Brand", initial: "DELL" },
  { id: "hp", label: "HP Brand", initial: "HP" },
  { id: "nike", label: "Nike Brand", initial: "NIKE" },
  { id: "lv", label: "Louis Vuitton", initial: "LV" },
  { id: "apple", label: "Apple Brand", initial: "APPLE" },
  { id: "samsung", label: "Samsung Brand", initial: "SAMSUNG" },
];

export default function BrandsSection() {
  const [activeBrand, setActiveBrand] = useState("nike");

  return (
    <section id="brands" className="py-16 bg-white">
      <div className="site-container">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Explore from popular
        </h2>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10">brands</h2>

        <div className="grid grid-cols-6 gap-4">
          {brands.map((brand) => (
            <button
              key={brand.id}
              id={`brand-${brand.id}`}
              onClick={() => setActiveBrand(brand.id)}
              className="brand-card flex flex-col items-center gap-3 p-5 rounded"
              style={{
                backgroundColor: "#f5e6c8",
                border:
                  activeBrand === brand.id
                    ? "2px solid #0d5c5c"
                    : "2px solid transparent",
              }}
            >
              {/* Brand logo placeholder */}
              <div
                style={{
                  width: "64px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: activeBrand === brand.id ? "#0d5c5c" : "#555",
                    letterSpacing: "0.05em",
                  }}
                >
                  {brand.initial}
                </span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: activeBrand === brand.id ? "#0d5c5c" : "#374151",
                }}
              >
                {brand.label}
              </span>
            </button>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex gap-1">
          <div style={{ width: "180px", height: "2px", backgroundColor: "#111" }} />
          <div style={{ flex: 1, height: "2px", backgroundColor: "#e5e7eb" }} />
        </div>
      </div>
    </section>
  );
}
