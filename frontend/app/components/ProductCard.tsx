"use client";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useStore } from "../context/StoreContext";

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
  addedToWishlist?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          fill={i <= Math.round(rating) ? "#f5c518" : "none"}
          stroke={i <= Math.round(rating) ? "#f5c518" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

export function ProductCard({
  product,
  showWishlistToast = false,
}: {
  product: Product;
  showWishlistToast?: boolean;
}) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);
  return (
    <Link
      href={`/products/${product.id}`}
      id={`product-${product.id}`}
      className="product-card bg-white rounded overflow-hidden block"
      style={{ border: "1px solid #f3f4f6", textDecoration: "none", color: "inherit" }}
    >
      {/* Image Area */}
      <div
        className="relative w-full"
        style={{
          height: "240px",
          backgroundColor: product.bgColor || "#f5e6c8",
        }}
      >
        {/* Badge */}
        {product.badge && product.badge !== "Out of Stock" && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: "#111",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "2px",
              zIndex: 2,
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Out of Stock Overlay */}
        {product.badge === "Out of Stock" && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#f5c518",
              color: "#111",
              fontSize: "12px",
              fontWeight: 700,
              textAlign: "center",
              padding: "8px",
              letterSpacing: "0.05em",
              zIndex: 2,
            }}
          >
            OUT OF STOCK
          </div>
        )}

        {/* Wishlist Toast */}
        {showWishlistToast && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              right: "12px",
              backgroundColor: "rgba(17,17,17,0.85)",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 10px",
              zIndex: 3,
            }}
          >
            <span style={{ color: "#fff", fontSize: "12px" }}>
              Added to Wish List
            </span>
            <div className="flex items-center gap-2">
              <button
                style={{
                  color: "#f5c518",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View
              </button>
              <button
                style={{
                  color: "#fff",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  lineHeight: 1,
                  fontSize: "14px",
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Placeholder image area */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="text-sm text-gray-400">Product Image</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>
            {product.category}
          </span>
          <button
            id={`wishlist-${product.id}`}
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className="transition-colors"
            style={{ color: wished ? "#dc2626" : "#d1d5db" }}
          >
            <Heart size={16} fill={wished ? "#dc2626" : "none"} stroke={wished ? "#dc2626" : "#d1d5db"} />
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-snug">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} />
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span
                style={{
                  fontSize: "13px",
                  color: "#9ca3af",
                  textDecoration: "line-through",
                }}
              >
                ${product.originalPrice}
              </span>
            )}
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: product.originalPrice ? "#dc2626" : "#111",
              }}
            >
              ${product.price}
            </span>
          </div>
        </div>

        <button
          id={`add-to-cart-${product.id}`}
          onClick={(e) => { e.preventDefault(); addToCart(product); }}
          className="w-full py-2 text-sm font-semibold rounded transition-all hover:bg-[#0d5c5c] hover:text-white"
          style={{
            border: "1.5px solid #0d5c5c",
            color: "#0d5c5c",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
