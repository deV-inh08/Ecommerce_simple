"use client";
import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useStore } from "../store/useStoreZustand";

/* ─── Types ──────────────────────────────────────────────── */
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "New Product" | "Best Seller" | "Out of Stock";
  bgColor?: string;
  imageUrl?: string;
}

/* ─── Star Rating ────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          fill={i <= Math.round(rating) ? "#f5c518" : "none"}
          stroke={i <= Math.round(rating) ? "#f5c518" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

/* ─── Badge ──────────────────────────────────────────────── */
const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  "New Product": { bg: "#005D63", color: "#fff" },
  "Best Seller": { bg: "#111",    color: "#fff" },
};

/* ─── Product Card ───────────────────────────────────────── */
export interface ProductCardProps {
  product: Product;
  /** Show skeleton-style loading state */
  loading?: boolean;
}

export function ProductCard({ product, loading }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);

  /* discount % */
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  if (loading) return <ProductCardSkeleton />;

  return (
    <div className="product-card flex flex-col bg-white rounded-xl overflow-hidden">

      {/* ── Image area ── */}
      <Link href={`/products/${product.id}`} id={`product-${product.id}`}
        className="relative block flex-shrink-0 overflow-hidden"
        style={{ height: "240px", backgroundColor: product.bgColor ?? "#f0f4f4" }}>

        {/* Badges */}
        {product.badge && product.badge !== "Out of Stock" && (
          <span className="absolute top-3 left-3 z-10 text-xs font-semibold px-2.5 py-1 rounded-sm"
            style={BADGE_STYLES[product.badge]}>
            {product.badge}
          </span>
        )}

        {/* Discount pill */}
        {discount !== null && (
          <span className="absolute top-3 right-3 z-10 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
            -{discount}%
          </span>
        )}

        {/* Out of Stock overlay */}
        {product.badge === "Out of Stock" && (
          <div className="absolute inset-x-0 bottom-0 z-10 py-2 text-center text-xs font-bold tracking-widest uppercase"
            style={{ backgroundColor: "#f5c518", color: "#111" }}>
            Out of Stock
          </div>
        )}

        {/* Wishlist heart — top-right when no discount */}
        <button
          id={`wishlist-${product.id}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            top: discount !== null ? "auto" : "12px",
            bottom: discount !== null ? "12px" : "auto",
            right: "12px",
            backgroundColor: wished ? "#fef2f2" : "rgba(255,255,255,0.85)",
            backdropFilter: "blur(4px)",
            border: "1px solid",
            borderColor: wished ? "#fecaca" : "rgba(0,0,0,0.06)",
          }}
        >
          <Heart
            size={15}
            fill={wished ? "#dc2626" : "none"}
            stroke={wished ? "#dc2626" : "#9ca3af"}
          />
        </button>

        {/* Product image placeholder */}
        <div className="w-full h-full flex items-center justify-center">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            : <span className="text-sm font-medium" style={{ color: "#c1ccd0" }}>Product Image</span>
          }
        </div>
      </Link>

      {/* ── Info area ── */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* Category */}
        <span className="text-xs tracking-wide uppercase"
          style={{ color: "#9ca3af", fontWeight: 500 }}>
          {product.category}
        </span>

        {/* Name */}
        <Link href={`/products/${product.id}`}
          className="font-heading text-sm font-semibold text-gray-900 leading-snug hover:text-[#005D63] transition-colors line-clamp-2">
          {product.name}
        </Link>

        {/* Rating row */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs" style={{ color: "#9ca3af" }}>
            {product.rating.toFixed(1)}
            {product.reviewCount > 0 && ` (${product.reviewCount})`}
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-base font-bold"
            style={{ color: product.originalPrice ? "#dc2626" : "#111" }}>
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm line-through" style={{ color: "#b0b8be" }}>
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={(e) => { e.preventDefault(); addToCart(product); }}
          disabled={product.badge === "Out of Stock"}
          className="btn-add-to-cart mt-1"
        >
          <ShoppingCart size={14} strokeWidth={2} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────── */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden animate-pulse">
      <div style={{ height: "240px", backgroundColor: "#f3f4f6" }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-2.5 rounded-full bg-gray-200 w-1/3" />
        <div className="h-4 rounded bg-gray-200 w-4/5" />
        <div className="h-3 rounded bg-gray-200 w-1/2" />
        <div className="h-4 rounded bg-gray-200 w-1/4 mt-1" />
        <div className="h-9 rounded-md bg-gray-100 w-full mt-1" />
      </div>
    </div>
  );
}

/* ─── Default export for convenience ────────────────────── */
export default ProductCard;
