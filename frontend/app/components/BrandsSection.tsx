"use client";
import { useState } from "react";
import Image from "next/image";
import { type StaticImageData } from "next/image";
import dell_img from "../../public/image/brand/dell.svg";
import hp_img from "../../public/image/brand/hp.svg";
import nike_img from "../../public/image/brand/nkie.svg";
import lv_img from "../../public/image/brand/louis.svg";

const brands: { id: string; label: string; img?: StaticImageData; initial?: string }[] = [
  { id: "dell", label: "Dell Brand", img: dell_img },
  { id: "hp", label: "HP Brand", img: hp_img },
  { id: "nike", label: "Nike Brand", img: nike_img },
  { id: "lv", label: "Louis Vuitton", img: lv_img },
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

        <div className="flex gap-4 flex-wrap">
          {brands.map((brand) => (
            <button
              key={brand.id}
              id={`brand-${brand.id}`}
              onClick={() => setActiveBrand(brand.id)}
              className="brand-card flex flex-col items-center gap-3"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              {/* Nền beige chứa ảnh */}
              <div
                style={{
                  width: "270px",
                  height: "210px",
                  backgroundColor: "#f5e6c8",
                  borderRadius: "8px",
                  border: activeBrand === brand.id ? "2px solid #0d5c5c" : "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "124px", height: "150px", position: "relative" }}>
                  {brand.img ? (
                    <Image
                      src={brand.img}
                      alt={brand.label}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <span className="font-bold">{brand.initial}</span>
                  )}
                </div>
              </div>

              {/* Chữ bên dưới nền */}
              <span
                className="font-bold text-sm"
                style={{ color: activeBrand === brand.id ? "#0d5c5c" : "#111" }}
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

