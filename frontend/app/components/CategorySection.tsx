"use client";
import Link from "next/link";

const categories = [
  { id: "men",      label: "Men Fashion" },
  { id: "women",    label: "Women Fashion" },
  { id: "kids",     label: "Kids Fashion" },
  { id: "baby",     label: "Baby Fashion" },
  { id: "mobile",   label: "Mobile Device" },
  { id: "computer", label: "Computer Device" },
  { id: "beauty",   label: "Beauty Products" },
  { id: "furniture",label: "Furniture" },
  { id: "watch",    label: "Smart Watch" },
  { id: "shoes",    label: "Modern Shoes" },
  { id: "jewelry",  label: "Beautiful Jewelry" },
  { id: "home",     label: "Home Products" },
];

function CategoryCard({ id, label }: { id: string; label: string }) {
  return (
    <Link
      href={`/category/${id}`}
      id={`category-${id}`}
      className="category-card flex flex-col items-center gap-3 p-4 rounded"
      style={{
        backgroundColor: "#f5e6c8",
        border: "2px solid transparent",
        width: "100%",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: "100%",
          height: "110px",
          backgroundColor: "rgba(0,0,0,0.03)",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px dashed #d1c4a0",
        }}
      >
        <span className="text-xs text-gray-400">Image</span>
      </div>
      <span
        style={{
          color: "#111",
          fontWeight: 500,
          fontSize: "13px",
        }}
      >
        {label}
      </span>
    </Link>
  );
}

export default function CategorySection() {
  return (
    <section id="categories" className="py-16 bg-white">
      <div className="site-container">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
          Explore, find exactly
        </h2>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10">
          what you need
        </h2>

        <div className="grid grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              label={cat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
