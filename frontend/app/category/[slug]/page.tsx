"use client";
import { useState, useMemo, use, useRef, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown, Heart, Star, X } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

/* ─── Mock products ───────────────────────────────────────── */
const ALL_PRODUCTS = [
  { id: "pop-1", name: "Mid Century Modern T-Shirt", category: "Men-Cloths", price: 110, rating: 5.0, reviewCount: 18, badge: undefined, bgColor: "#f0f0f0" },
  { id: "pop-2", name: "Mid Century Modern T-Shirt", category: "Men-Cloths", price: 139, rating: 5.0, reviewCount: 28, badge: undefined, bgColor: "#e8d0d0" },
  { id: "pop-3", name: "Corporate Office Shoes", category: "Men-Shoes", price: 399, rating: 5.0, reviewCount: 102, badge: undefined, bgColor: "#d8c8b0" },
  { id: "bs-1", name: "Modern Black T-Shirt", category: "Men-Cloths", price: 59, rating: 5.0, reviewCount: 132, badge: "Best Seller", bgColor: "#2a2a2a" },
  { id: "bs-2", name: "Modern Stylish Shoes", category: "Women-Shoes", price: 199, rating: 5.0, reviewCount: 89, badge: "Best Seller", bgColor: "#c0c8d0" },
  { id: "bs-3", name: "Women Hand Bags", category: "Women-Fashion", price: 123, rating: 5.0, reviewCount: 39, badge: "Best Seller", bgColor: "#c8a870" },
  { id: "sale-2", name: "Modern Green Sweater", category: "Women-Cloths", price: 60, originalPrice: 120, rating: 5.0, reviewCount: 37, badge: undefined, bgColor: "#d0e0c0" },
  { id: "sale-3", name: "Modern Headphones", category: "Women-Fashion", price: 90, originalPrice: 180, rating: 5.0, reviewCount: 49, badge: undefined, bgColor: "#e8a0c0" },
  { id: "sale-4", name: "Modern Purse Bag", category: "Women-Fashion", price: 105, originalPrice: 210, rating: 5.0, reviewCount: 69, badge: undefined, bgColor: "#1a1a2e" },
  { id: "new-1", name: "Classic Polo Shirt", category: "Men-Cloths", price: 89, rating: 4.8, reviewCount: 55, badge: "New Product", bgColor: "#e8e0d8" },
  { id: "new-2", name: "Leather Loafers", category: "Men-Shoes", price: 249, rating: 4.9, reviewCount: 33, badge: "New Product", bgColor: "#b8956a" },
  { id: "new-3", name: "Floral Summer Dress", category: "Women-Cloths", price: 75, rating: 5.0, reviewCount: 61, badge: "New Product", bgColor: "#f5e0e8" },
];

const CATEGORIES = ["Men-Cloths", "Men-Shoes", "Women-Cloths", "Women-Shoes", "Women-Fashion"];

const PRICE_RANGES = [
  { label: "$0–$200", min: 0, max: 200 },
  { label: "$200–$400", min: 200, max: 400 },
  { label: "$400+", min: 400, max: Infinity },
];

const SORT_OPTIONS = ["Relevency", "Price: Low to High", "Price: High to Low", "Newest", "Best Rating"];
const PAGE_SIZE = 9;

/* ─── Star Rating ────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12}
          fill={i <= Math.round(rating) ? "#f5c518" : "none"}
          stroke={i <= Math.round(rating) ? "#f5c518" : "#d1d5db"} />
      ))}
    </div>
  );
}

/* ─── Product Card ───────────────────────────────────────── */
function ListingCard({ product }: { product: typeof ALL_PRODUCTS[0] }) {
  const [wished, setWished] = useState(false);
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white group"
      style={{ border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <Link href={`/products/${product.id}`} className="block relative" style={{ height: "220px", backgroundColor: product.bgColor }}>
        {product.badge && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded z-10"
            style={{ backgroundColor: "#111", color: "#fff" }}>{product.badge}</span>
        )}
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white text-sm font-medium opacity-60 group-hover:opacity-80 transition-opacity">Product Image</span>
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <span className="text-xs text-gray-400">{product.category}</span>
          <button onClick={() => setWished((w) => !w)} style={{ color: wished ? "#dc2626" : "#d1d5db" }}>
            <Heart size={15} fill={wished ? "#dc2626" : "none"} stroke={wished ? "#dc2626" : "#d1d5db"} />
          </button>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 hover:text-[#0d5c5c] transition-colors leading-snug">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-400">{product.rating.toFixed(1)} ({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            {"originalPrice" in product && product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
            )}
            <span className="text-sm font-bold"
              style={{ color: "originalPrice" in product && product.originalPrice ? "#dc2626" : "#111" }}>
              ${product.price}
            </span>
          </div>
        </div>
        <button className="w-full py-2 text-sm font-semibold rounded-lg mt-1 transition-all hover:bg-[#0d5c5c] hover:text-white"
          style={{ border: "1.5px solid #0d5c5c", color: "#0d5c5c", backgroundColor: "transparent" }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ─── Checkmark icon ─────────────────────────────────────── */
function CheckMark() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [sortBy, setSortBy] = useState("Relevency");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const slugLabel = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const activeFilterCount = [selectedPrice !== null, selectedRating !== null, selectedCats.length > 0].filter(Boolean).length;

  const clearFilters = () => { setSelectedPrice(null); setSelectedRating(null); setSelectedCats([]); };

  const toggleCat = (cat: string) =>
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  const filtered = useMemo(() => {
    let arr = [...ALL_PRODUCTS];
    if (slug !== "all") {
      const slugCat = slug.split("-")[0].toLowerCase();
      arr = arr.filter((p) => p.category.toLowerCase().startsWith(slugCat));
    }
    if (selectedCats.length > 0) arr = arr.filter((p) => selectedCats.includes(p.category));
    if (selectedPrice !== null) {
      const range = PRICE_RANGES[selectedPrice];
      arr = arr.filter((p) => p.price >= range.min && p.price < range.max);
    }
    if (selectedRating !== null) arr = arr.filter((p) => p.rating >= selectedRating);
    if (sortBy === "Price: Low to High") arr.sort((a, b) => a.price - b.price);
    else if (sortBy === "Price: High to Low") arr.sort((a, b) => b.price - a.price);
    else if (sortBy === "Best Rating") arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [slug, sortBy, selectedPrice, selectedRating, selectedCats]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />
      <main className="flex-1 w-full">
        <div className="site-container pt-6 pb-2">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{slugLabel}</span>
          </nav>
        </div>

        <section className="site-container py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Find something you love</h1>

          {/* ── Filter/Sort bar ── */}
          <div className="flex items-center justify-between mb-6 p-3 rounded-xl"
            style={{ border: "1px solid #f0f0f0", backgroundColor: "#fafafa" }}>

            {/* Filter trigger */}
            <div className="relative" ref={filterRef}>
              <button id="filter-btn"
                onClick={() => setShowFilter((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors hover:bg-gray-100"
                style={{ border: "1.5px solid #e5e7eb", backgroundColor: "white" }}>
                <SlidersHorizontal size={15} />
                All Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-xs text-white flex items-center justify-center font-bold"
                    style={{ backgroundColor: "#0d5c5c" }}>{activeFilterCount}</span>
                )}
              </button>

              {/* Filter dropdown */}
              {showFilter && (
                <div className="absolute top-full left-0 mt-2 rounded-xl z-30"
                  style={{ width: "300px", backgroundColor: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.15)", border: "1px solid #f0f0f0" }}>

                  {/* Dropdown header */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-3"
                    style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <span className="text-sm font-extrabold text-gray-800">Filters</span>
                    <div className="flex items-center gap-3">
                      {activeFilterCount > 0 && (
                        <button onClick={clearFilters}
                          className="text-xs font-semibold hover:opacity-80" style={{ color: "#dc2626" }}>
                          Clear all
                        </button>
                      )}
                      <button onClick={() => setShowFilter(false)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <X size={13} className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="px-5 py-4 flex flex-col gap-5">
                    {/* Category */}
                    <div>
                      <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">Category</p>
                      <div className="flex flex-col gap-2">
                        {CATEGORIES.map((cat) => (
                          <label key={cat}
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => toggleCat(cat)}>
                            <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                border: selectedCats.includes(cat) ? "none" : "1.5px solid #d1d5db",
                                backgroundColor: selectedCats.includes(cat) ? "#0d5c5c" : "white",
                              }}>
                              {selectedCats.includes(cat) && <CheckMark />}
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1 transition-colors">{cat}</span>
                            <span className="text-xs text-gray-400">
                              ({ALL_PRODUCTS.filter((p) => p.category === cat).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
                      <div className="flex items-center gap-2">
                        {PRICE_RANGES.map((range, idx) => (
                          <button key={range.label}
                            onClick={() => setSelectedPrice(selectedPrice === idx ? null : idx)}
                            className="text-xs font-semibold rounded-lg transition-all hover:opacity-90 flex-shrink-0"
                            style={{
                              padding: "5px 10px",
                              whiteSpace: "nowrap",
                              border: selectedPrice === idx ? "none" : "1.5px solid #e5e7eb",
                              backgroundColor: selectedPrice === idx ? "#0d5c5c" : "white",
                              color: selectedPrice === idx ? "white" : "#374151",
                            }}>
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">Rating</p>
                      <div className="flex flex-col gap-2">
                        {[5, 4, 3].map((r) => (
                          <label key={r} className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => setSelectedRating(selectedRating === r ? null : r)}>
                            <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                border: selectedRating === r ? "none" : "1.5px solid #d1d5db",
                                backgroundColor: selectedRating === r ? "#0d5c5c" : "white",
                              }}>
                              {selectedRating === r && <CheckMark />}
                            </div>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: r }).map((_, i) => (
                                <Star key={`f${i}`} size={13} fill="#f5c518" stroke="#f5c518" />
                              ))}
                              {Array.from({ length: 5 - r }).map((_, i) => (
                                <Star key={`e${i}`} size={13} fill="none" stroke="#d1d5db" />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">& up</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Count */}
            <span className="text-sm text-gray-400">
              Showing <strong className="text-gray-700">{visible.length}</strong> of{" "}
              <strong className="text-gray-700">{filtered.length}</strong> products
            </span>

            {/* Sort */}
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Sort By:</span>
                <button id="sort-btn"
                  onClick={() => setShowSort((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors hover:bg-gray-100"
                  style={{ border: "1.5px solid #e5e7eb", backgroundColor: "white", color: "#374151" }}>
                  {sortBy}<ChevronDown size={14} />
                </button>
              </div>
              {showSort && (
                <div className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden z-20"
                  style={{ minWidth: "200px", backgroundColor: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #f0f0f0" }}>
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt}
                      onClick={() => { setSortBy(opt); setShowSort(false); setPage(1); }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                      style={{ color: sortBy === opt ? "#0d5c5c" : "#374151", fontWeight: sortBy === opt ? 600 : 400 }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="text-xs text-gray-400">Active:</span>
              {selectedCats.map((cat) => (
                <button key={cat} onClick={() => toggleCat(cat)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#e8f5f0", color: "#0d5c5c" }}>
                  {cat} <X size={10} />
                </button>
              ))}
              {selectedPrice !== null && (
                <button onClick={() => setSelectedPrice(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#e8f5f0", color: "#0d5c5c" }}>
                  {PRICE_RANGES[selectedPrice].label} <X size={10} />
                </button>
              )}
              {selectedRating !== null && (
                <button onClick={() => setSelectedRating(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#e8f5f0", color: "#0d5c5c" }}>
                  {selectedRating}★ & up <X size={10} />
                </button>
              )}
              <button onClick={clearFilters} className="text-xs font-semibold hover:underline"
                style={{ color: "#dc2626" }}>Clear all</button>
            </div>
          )}

          {/* Grid or empty */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="text-5xl">🔍</div>
              <h3 className="text-lg font-bold text-gray-700">No products found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
              <button onClick={clearFilters}
                className="px-6 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#0d5c5c" }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {visible.map((product) => <ListingCard key={product.id} product={product} />)}
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-12">
              <button id="load-more-btn" onClick={() => setPage((p) => p + 1)}
                className="px-10 py-3 text-sm font-bold text-white rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#0d5c5c" }}>
                Load More
              </button>
            </div>
          )}
          {!hasMore && filtered.length > 0 && (
            <p className="text-center text-sm text-gray-400 mt-12">
              You&apos;ve seen all {filtered.length} products
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
