"use client";
import { useProducts } from "../hooks/useCatalog";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import BrowseAllButton from "./BrowseAllButton";
import type { Product } from "./ProductCard";
import type { CatalogProduct } from "../lib/types";

/* ── Map API response → ProductCard shape ──────────────── */
function toProductCard(p: CatalogProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    rating: 4.8,       // Catalog.API doesn't have ratings yet — placeholder
    reviewCount: 0,
    imageUrl: p.imageUrl,
  };
}

/* ── Section component ──────────────────────────────────── */
interface ProductSectionProps {
  id: string;
  title: string;
  subtitle: string;
  category?: string;
  /** href for the Browse All button — defaults to /category/all */
  browseHref?: string;
}

function ProductSection({ id, title, subtitle, category, browseHref }: ProductSectionProps) {
  const { data: products, isLoading, isError } = useProducts(category);

  return (
    <section id={id} className="py-16 bg-white">
      <div className="site-container">

        {/* ── Header row ── */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm mt-1.5 max-w-sm leading-relaxed" style={{ color: "#6b7280" }}>
              {subtitle}
            </p>
          </div>
          <BrowseAllButton
            href={browseHref ?? `/category/${category ?? "all"}`}
            id={`${id}-browse-all`}
          />
        </div>

        {/* ── Divider ── */}
        <div
          className="mb-8"
          style={{
            height: "2px",
            background: "linear-gradient(90deg, #111 180px, #e5e7eb 180px)",
          }}
        />

        {/* ── Error state ── */}
        {isError && (
          <p className="text-sm text-center py-8" style={{ color: "#f87171" }}>
            Failed to load products — make sure the backend is running.
          </p>
        )}

        {/* ── Grid ── */}
        <div className="grid grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : (products ?? []).slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={toProductCard(p)} />
              ))}
        </div>
      </div>
    </section>
  );
}

/* ── Page export ────────────────────────────────────────── */
export default function ProductSections() {
  return (
    <>
      <ProductSection
        id="popular-products"
        title="Our popular products"
        subtitle="Browse our most popular products and make your day more beautiful and glorious."
      />

      <div style={{ height: "1px", backgroundColor: "#e5e7eb" }} className="site-container" />

      <ProductSection
        id="new-products"
        title="Our New Products"
        subtitle="Browse our new products and make your day more beautiful and glorious."
        category="new"
      />

      <div style={{ height: "1px", backgroundColor: "#e5e7eb" }} className="site-container" />

      <ProductSection
        id="best-sellers"
        title="Meet our best sellers"
        subtitle="Browse our most popular products and make your day more beautiful and glorious."
        category="bestseller"
      />
    </>
  );
}
