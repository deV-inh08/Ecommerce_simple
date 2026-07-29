"use client";
import { useState, use } from "react";
import Link from "next/link";
import { Star, Heart, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useProduct, useProducts } from "../../hooks/useCatalog";
import { useAddToCartApi } from "../../hooks/useCart";
import { useStore } from "../../store/useStoreZustand";
import { getToken } from "../../lib/token-store";

/* ─── Static display data ────────────────────────────────── */
const COLORS = [
  { id: "green", hex: "#7aab5e" },
  { id: "black", hex: "#111111" },
  { id: "pink",  hex: "#e8a0b0" },
  { id: "white", hex: "#f5f5f5" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const THUMBNAILS = [
  { id: 0, bg: "#e8f0d8" },
  { id: 1, bg: "#111111" },
  { id: 2, bg: "#f2d0d8" },
  { id: 3, bg: "#f0f0f0" },
];

const REVIEWS = [
  { id: 1, author: "Alice M.", rating: 5, date: "Jan 12, 2025", body: "Absolutely love this product! The quality is top-notch and it fits perfectly." },
  { id: 2, author: "James K.", rating: 4, date: "Feb 3, 2025",  body: "Great value for the price. Shipping was fast and packaging was solid." },
  { id: 3, author: "Sara L.",  rating: 5, date: "Mar 18, 2025", body: "Exceeded my expectations. Will definitely be ordering again soon!" },
];

/* ─── Sub-components ─────────────────────────────────────── */
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size}
          fill={i <= Math.round(rating) ? "#f5c518" : "none"}
          stroke={i <= Math.round(rating) ? "#f5c518" : "#d1d5db"} />
      ))}
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────── */
function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-16 animate-pulse">
      <div className="rounded-xl" style={{ height: "420px", backgroundColor: "#f3f4f6" }} />
      <div className="flex flex-col gap-4 pt-2">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded w-full mt-4" />
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: product, isLoading, isError } = useProduct(id);
  const { data: related } = useProducts(product?.category);

  const addToCartApi = useAddToCartApi();
  const addToCartLocal = useStore((s) => s.addToCart);
  const openAuth = useStore((s) => s.openAuth);

  const [activeThumb, setActiveThumb] = useState(0);
  const [activeColor, setActiveColor] = useState("green");
  const [activeSize, setActiveSize]   = useState("L");
  const [qty, setQty]                 = useState(1);
  const [activeTab, setActiveTab]     = useState<"desc" | "info" | "reviews">("desc");
  const [wishlist, setWishlist]       = useState(false);
  const [addedMsg, setAddedMsg]       = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!product) return;

    if (getToken()) {
      // Logged in → use Cart.API
      try {
        await addToCartApi.mutateAsync({
          productId: product.id,
          sku: product.sku,
          productName: product.name,
          unitPrice: product.price,
          quantity: qty,
        });
        setAddedMsg("Added to cart!");
      } catch {
        setAddedMsg("Failed to add — try again");
      }
    } else {
      // Not logged in → optimistic local cart (Zustand)
      addToCartLocal({ ...product, bgColor: THUMBNAILS[0].bg });
      setAddedMsg("Added to cart!");
    }
    setTimeout(() => setAddedMsg(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />

      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="site-container py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/category/${product?.category ?? "all"}`} className="hover:text-gray-600 transition-colors">
              {product?.category ?? "…"}
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{product?.name ?? "…"}</span>
          </nav>
        </div>

        {/* Product hero */}
        <section className="site-container pb-16">
          {isLoading && <ProductDetailSkeleton />}
          {isError && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span className="text-5xl">⚠️</span>
              <p className="text-base font-bold text-gray-700">Product not found</p>
              <Link href="/category/all"
                className="px-6 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90"
                style={{ backgroundColor: "#0d5c5c" }}>
                Browse All
              </Link>
            </div>
          )}

          {product && (
            <div className="grid grid-cols-2 gap-16 items-start">
              {/* Left — Image gallery */}
              <div className="flex flex-col gap-4">
                <div className="relative w-full rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ height: "420px", backgroundColor: THUMBNAILS[activeThumb].bg }}>
                  <button onClick={() => setActiveThumb((p) => (p - 1 + THUMBNAILS.length) % THUMBNAILS.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                    id="gallery-prev">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-gray-400 text-sm font-medium">Product Image</span>
                  <button onClick={() => setActiveThumb((p) => (p + 1) % THUMBNAILS.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                    id="gallery-next">
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveThumb((p) => (p - 1 + THUMBNAILS.length) % THUMBNAILS.length)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors flex-shrink-0">
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex gap-3 flex-1">
                    {THUMBNAILS.map((t) => (
                      <button key={t.id} id={`thumb-${t.id}`} onClick={() => setActiveThumb(t.id)}
                        className="flex-1 rounded-lg overflow-hidden transition-all"
                        style={{ height: "80px", backgroundColor: t.bg,
                          border: activeThumb === t.id ? "2px solid #0d5c5c" : "2px solid transparent",
                          boxShadow: activeThumb === t.id ? "0 0 0 1px #0d5c5c" : "none" }} />
                    ))}
                  </div>
                  <button onClick={() => setActiveThumb((p) => (p + 1) % THUMBNAILS.length)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors flex-shrink-0">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Right — Product info */}
              <div className="flex flex-col gap-5 pt-2">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{product.category}</p>
                  <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                  )}
                  <span className="text-2xl font-bold" style={{ color: product.originalPrice ? "#dc2626" : "#111" }}>
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs font-bold px-2 py-1 rounded"
                      style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* SKU */}
                <p className="text-xs text-gray-400">SKU: <span className="font-medium text-gray-600">{product.sku}</span></p>

                <div style={{ height: "1px", backgroundColor: "#f3f4f6" }} />

                {/* Color */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700 w-16">Color:</span>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button key={c.id} id={`color-${c.id}`} onClick={() => setActiveColor(c.id)}
                        className="w-7 h-7 rounded transition-all"
                        style={{ backgroundColor: c.hex,
                          border: activeColor === c.id ? "2px solid #0d5c5c" : "2px solid transparent",
                          outline: activeColor === c.id ? "2px solid #0d5c5c" : "2px solid #e5e7eb",
                          outlineOffset: "1px" }}
                        title={c.id} />
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700 w-16">Size:</span>
                  <div className="flex gap-2">
                    {SIZES.map((s) => (
                      <button key={s} id={`size-${s}`} onClick={() => setActiveSize(s)}
                        className="px-3 py-1.5 text-xs font-semibold rounded transition-all"
                        style={{ border: activeSize === s ? "1.5px solid #0d5c5c" : "1.5px solid #e5e7eb",
                          backgroundColor: activeSize === s ? "#0d5c5c" : "white",
                          color: activeSize === s ? "white" : "#374151" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700 w-16">Qty:</span>
                  <div className="flex items-center" style={{ border: "1.5px solid #e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
                    <button id="qty-decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      style={{ borderRight: "1.5px solid #e5e7eb" }}>
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                    <button id="qty-increase" onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      style={{ borderLeft: "1.5px solid #e5e7eb" }}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ height: "1px", backgroundColor: "#f3f4f6" }} />

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  {addedMsg && (
                    <div className="text-xs font-semibold text-center py-2 rounded-lg"
                      style={{ backgroundColor: "#e8f5f0", color: "#0d5c5c" }}>
                      {addedMsg}
                    </div>
                  )}
                  <button id="add-to-cart-detail"
                    onClick={handleAddToCart}
                    disabled={addToCartApi.isPending}
                    className="w-full py-3.5 text-sm font-bold text-white rounded-lg flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-70"
                    style={{ backgroundColor: "#0d5c5c" }}>
                    {addToCartApi.isPending
                      ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <ShoppingBag size={16} />}
                    Add to Cart
                  </button>
                  <Link id="checkout-detail" href="/checkout"
                    className="w-full py-3.5 text-sm font-bold rounded-lg transition-opacity hover:opacity-90 text-center block"
                    style={{ backgroundColor: "#f5c518", color: "#111" }}>
                    Check Out
                  </Link>
                  <button id="wishlist-detail" onClick={() => setWishlist((w) => !w)}
                    className="flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                    style={{ color: wishlist ? "#dc2626" : "#6b7280" }}>
                    <Heart size={16} fill={wishlist ? "#dc2626" : "none"} stroke={wishlist ? "#dc2626" : "#6b7280"} />
                    {wishlist ? "Saved to Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Tabs */}
        {product && (
          <section className="border-t border-gray-100">
            <div className="site-container">
              <div className="flex gap-0 border-b border-gray-200">
                {(["desc", "info", "reviews"] as const).map((tab) => {
                  const labels = { desc: "Description", info: "Additional Information", reviews: `Reviews (${REVIEWS.length})` };
                  return (
                    <button key={tab} id={`tab-${tab}`} onClick={() => setActiveTab(tab)}
                      className="px-6 py-4 text-sm font-semibold transition-colors relative"
                      style={{ color: activeTab === tab ? "#0d5c5c" : "#6b7280" }}>
                      {labels[tab]}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "#0d5c5c" }} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="py-8">
                {activeTab === "desc" && (
                  <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                    {product.description || "No description available."}
                  </p>
                )}
                {activeTab === "info" && (
                  <table className="text-sm border-collapse">
                    <tbody>
                      {[["SKU", product.sku], ["Category", product.category], ["Price", `$${product.price}`]].map(([k, v]) => (
                        <tr key={k} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td className="py-3 pr-12 font-semibold text-gray-700 w-48">{k}</td>
                          <td className="py-3 text-gray-500">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {activeTab === "reviews" && (
                  <div className="flex flex-col gap-6 max-w-2xl">
                    {REVIEWS.map((r) => (
                      <div key={r.id} className="flex flex-col gap-2 pb-6" style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: "#0d5c5c" }}>
                              {r.author[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{r.author}</p>
                              <p className="text-xs text-gray-400">{r.date}</p>
                            </div>
                          </div>
                          <StarRating rating={r.rating} size={13} />
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-12">{r.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Related Products */}
        {(related?.length ?? 0) > 0 && (
          <section className="py-16 border-t border-gray-100">
            <div className="site-container">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Related Products</h2>
              <div className="grid grid-cols-4 gap-6">
                {(related ?? []).filter((p) => p.id !== id).slice(0, 4).map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} id={`related-${p.id}`}
                    className="group flex flex-col rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    style={{ border: "1px solid #f3f4f6" }}>
                    <div className="w-full flex items-center justify-center" style={{ height: "200px", backgroundColor: "#f5f5f5" }}>
                      <span className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors">Product Image</span>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-gray-800 mb-1">{p.name}</p>
                      <p className="text-sm font-bold" style={{ color: "#0d5c5c" }}>${p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
