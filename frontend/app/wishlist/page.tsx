"use client";
import Link from "next/link";
import { X, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStore } from "../context/StoreContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useStore();

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />

      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="site-container pt-6 pb-2">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Wish List</span>
          </nav>
        </div>

        <section className="site-container py-10">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Wish List</h1>
            <p className="text-sm text-gray-400">
              {wishlist.length === 0
                ? "Your wishlist is empty"
                : `${wishlist.length} item${wishlist.length > 1 ? "s" : ""} in your wishlist`}
            </p>
          </div>

          {wishlist.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#f5e6c8" }}
              >
                <span className="text-3xl">🤍</span>
              </div>
              <p className="text-gray-400 text-sm">No items saved yet. Browse products and click the heart icon!</p>
              <Link
                href="/"
                className="px-8 py-3 text-sm font-bold text-white rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#0d5c5c" }}
              >
                Browse Products
              </Link>
            </div>
          ) : (
            /* Wishlist table */
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #e5e7eb" }}
            >
              {/* Table header */}
              <div
                className="grid items-center px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"
                style={{
                  gridTemplateColumns: "40px 1fr 140px 140px 140px",
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <span />
                <span>Product Name</span>
                <span className="text-center">Unit Price</span>
                <span className="text-center">Stock Status</span>
                <span />
              </div>

              {/* Rows */}
              {wishlist.map((item, idx) => (
                <div
                  key={item.id}
                  id={`wishlist-row-${item.id}`}
                  className="grid items-center px-6 py-4 transition-colors hover:bg-gray-50"
                  style={{
                    gridTemplateColumns: "40px 1fr 140px 140px 140px",
                    borderBottom: idx < wishlist.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  {/* Remove */}
                  <button
                    id={`remove-wish-${item.id}`}
                    onClick={() => removeFromWishlist(item.id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    style={{ border: "1px solid #e5e7eb" }}
                  >
                    <X size={12} />
                  </button>

                  {/* Product */}
                  <div className="flex items-center gap-4">
                    <Link href={`/products/${item.id}`}>
                      <div
                        className="rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
                        style={{ width: "72px", height: "72px", backgroundColor: item.bgColor || "#f5e6c8" }}
                      >
                        <span className="text-xs text-white opacity-50">Img</span>
                      </div>
                    </Link>
                    <div>
                      <Link href={`/products/${item.id}`}>
                        <p className="text-sm font-semibold text-gray-900 hover:text-[#0d5c5c] transition-colors">{item.name}</p>
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center">
                    {item.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">${item.originalPrice}</p>
                    )}
                    <p
                      className="text-sm font-bold"
                      style={{ color: item.originalPrice ? "#dc2626" : "#111" }}
                    >
                      ${item.price}
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="text-center">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "#e8f5f0", color: "#0d5c5c" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      In Stock
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <div className="flex justify-end">
                    <button
                      id={`wish-to-cart-${item.id}`}
                      onClick={() => moveToCart(item.id)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-lg transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#0d5c5c" }}
                    >
                      <ShoppingCart size={13} />
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
