"use client";
import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Heart, Star, Tag, X, Check, ChevronRight, Truck, Percent } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStore } from "../context/StoreContext";

/* ─── Voucher definitions ────────────────────────────────── */
interface Voucher {
  code: string;
  label: string;
  description: string;
  type: "freeship" | "percent" | "fixed";
  value: number;       // % hoặc $ hoặc 0 (freeship)
  minOrder: number;    // đơn tối thiểu
  icon: string;
  color: string;
  bgColor: string;
}

const VOUCHERS: Voucher[] = [
  {
    code: "FREESHIP",
    label: "Free Shipping",
    description: "Free delivery for all orders",
    type: "freeship",
    value: 0,
    minOrder: 0,
    icon: "🚚",
    color: "#0d5c5c",
    bgColor: "#e8f5f0",
  },
  {
    code: "SAVE5",
    label: "5% OFF",
    description: "5% discount on orders from $50",
    type: "percent",
    value: 5,
    minOrder: 50,
    icon: "🏷️",
    color: "#7c3aed",
    bgColor: "#f3e8ff",
  },
  {
    code: "SAVE10",
    label: "10% OFF",
    description: "10% discount on orders from $100",
    type: "percent",
    value: 10,
    minOrder: 100,
    icon: "🎉",
    color: "#dc2626",
    bgColor: "#fef2f2",
  },
  {
    code: "SAVE20",
    label: "20% OFF",
    description: "20% discount on orders from $200",
    type: "percent",
    value: 20,
    minOrder: 200,
    icon: "🔥",
    color: "#ea580c",
    bgColor: "#fff7ed",
  },
  {
    code: "FLAT15",
    label: "$15 OFF",
    description: "Flat $15 discount on orders from $80",
    type: "fixed",
    value: 15,
    minOrder: 80,
    icon: "💰",
    color: "#0891b2",
    bgColor: "#ecfeff",
  },
];

/* ─── "People also bought" mock data ─────────────────────── */
const SUGGESTED = [
  { id: "pop-1", name: "Mid Century Modern T-Shirt", category: "Men-Cloths", price: 110, rating: 5.0, reviewCount: 18,  bg: "#2a2a2a" },
  { id: "pop-2", name: "Mid Century Modern T-Shirt", category: "Men-Cloths", price: 139, rating: 5.0, reviewCount: 28,  bg: "#c8453a" },
  { id: "pop-3", name: "Corporate Office Shoes",     category: "Men-Shoes",  price: 399, rating: 5.0, reviewCount: 102, bg: "#b8956a" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={11}
          fill={i <= Math.round(rating) ? "#f5c518" : "none"}
          stroke={i <= Math.round(rating) ? "#f5c518" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

function SuggestedCard({ product }: { product: typeof SUGGESTED[0] }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white" style={{ border: "1px solid #f0f0f0" }}>
      <Link href={`/products/${product.id}`} className="relative block" style={{ height: "200px", backgroundColor: product.bg }}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white text-sm opacity-50">Product Image</span>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs text-gray-400">{product.category}</span>
          <button onClick={() => toggleWishlist({ id: product.id, name: product.name, category: product.category, price: product.price, bgColor: product.bg })}
            style={{ color: wished ? "#dc2626" : "#d1d5db" }}>
            <Heart size={15} fill={wished ? "#dc2626" : "none"} stroke={wished ? "#dc2626" : "#d1d5db"} />
          </button>
        </div>
        <Link href={`/products/${product.id}`}>
          <p className="text-sm font-semibold text-gray-900 hover:text-[#0d5c5c] transition-colors mb-2">{product.name}</p>
        </Link>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-400">{product.rating.toFixed(1)} ({product.reviewCount})</span>
          </div>
          <span className="text-sm font-bold text-gray-900">${product.price}</span>
        </div>
        <button
          onClick={() => addToCart({ id: product.id, name: product.name, category: product.category, price: product.price, bgColor: product.bg })}
          className="w-full py-2 text-sm font-semibold rounded-lg transition-all hover:bg-[#0d5c5c] hover:text-white"
          style={{ border: "1.5px solid #0d5c5c", color: "#0d5c5c", backgroundColor: "transparent" }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ─── Voucher Modal ──────────────────────────────────────── */
function VoucherModal({
  cartTotal,
  appliedCode,
  onApply,
  onClose,
}: {
  cartTotal: number;
  appliedCode: string | null;
  onApply: (v: Voucher | null) => void;
  onClose: () => void;
}) {
  const [manualCode, setManualCode] = useState("");
  const [manualError, setManualError] = useState("");

  const handleManual = () => {
    const found = VOUCHERS.find((v) => v.code === manualCode.trim().toUpperCase());
    if (!found) { setManualError("Invalid voucher code."); return; }
    if (cartTotal < found.minOrder) {
      setManualError(`Min. order $${found.minOrder} required.`);
      return;
    }
    onApply(found);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        id="voucher-modal"
        className="fixed z-50 bg-white rounded-2xl overflow-hidden flex flex-col"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(500px, 94vw)",
          maxHeight: "85vh",
          boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
          <div className="flex items-center gap-2">
            <Tag size={18} style={{ color: "#0d5c5c" }} />
            <h2 className="text-base font-extrabold text-gray-900">Available Vouchers</h2>
          </div>
          <button
            id="voucher-close"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Manual code input */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid #f5f5f5", backgroundColor: "#fafafa" }}>
          <p className="text-xs text-gray-500 mb-2 font-medium">Have a code? Enter it here:</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. SAVE10"
              value={manualCode}
              onChange={(e) => { setManualCode(e.target.value.toUpperCase()); setManualError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleManual()}
              className="flex-1 px-3 py-2 text-sm rounded-lg outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontFamily: "monospace" }}
            />
            <button
              onClick={handleManual}
              className="px-4 py-2 text-sm font-bold text-white rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#0d5c5c" }}
            >
              Apply
            </button>
          </div>
          {manualError && <p className="text-xs text-red-500 mt-1.5">{manualError}</p>}
        </div>

        {/* Voucher list */}
        <div className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-3">
          {VOUCHERS.map((v) => {
            const eligible = cartTotal >= v.minOrder;
            const isApplied = appliedCode === v.code;
            return (
              <div
                key={v.code}
                id={`voucher-${v.code}`}
                className="flex items-center gap-4 p-4 rounded-xl transition-all"
                style={{
                  border: isApplied ? `2px solid ${v.color}` : "2px solid #f0f0f0",
                  backgroundColor: isApplied ? v.bgColor : eligible ? "white" : "#fafafa",
                  opacity: eligible ? 1 : 0.55,
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: v.bgColor }}
                >
                  {v.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold" style={{ color: v.color }}>{v.label}</span>
                    <code className="text-xs px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: v.bgColor, color: v.color }}>{v.code}</code>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{v.description}</p>
                  {v.minOrder > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: eligible ? "#0d5c5c" : "#9ca3af" }}>
                      {eligible ? "✓ Your order qualifies!" : `Min. order: $${v.minOrder} (need $${(v.minOrder - cartTotal).toFixed(2)} more)`}
                    </p>
                  )}
                </div>

                {/* Apply button */}
                <button
                  disabled={!eligible}
                  onClick={() => {
                    onApply(isApplied ? null : v);
                    if (!isApplied) onClose();
                  }}
                  className="flex-shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all"
                  style={{
                    backgroundColor: isApplied ? v.color : eligible ? v.bgColor : "#f5f5f5",
                    color: isApplied ? "white" : eligible ? v.color : "#9ca3af",
                    border: `1.5px solid ${isApplied ? v.color : eligible ? v.color : "#e5e7eb"}`,
                    cursor: eligible ? "pointer" : "not-allowed",
                  }}
                >
                  {isApplied ? (
                    <span className="flex items-center gap-1"><Check size={12} /> Applied</span>
                  ) : (
                    "Use"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Remove voucher */}
        {appliedCode && (
          <div className="px-6 py-3 flex justify-center" style={{ borderTop: "1px solid #f0f0f0" }}>
            <button
              onClick={() => { onApply(null); onClose(); }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              Remove applied voucher
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Cart Page ──────────────────────────────────────────── */
export default function CartPage() {
  const { cartItems, cartTotal, removeFromCart, updateQty, toggleWishlist } = useStore();
  const [voucherOpen, setVoucherOpen]       = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // Pricing calc
  const originalTotal = cartItems.reduce((s, i) => s + (i.originalPrice ?? i.price) * i.qty, 0);
  const savings       = originalTotal - cartTotal;

  // Voucher discount
  const voucherDiscount = (() => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.type === "freeship") return 0; // handled separately
    if (appliedVoucher.type === "percent")  return +(cartTotal * appliedVoucher.value / 100).toFixed(2);
    if (appliedVoucher.type === "fixed")    return Math.min(appliedVoucher.value, cartTotal);
    return 0;
  })();

  const shipping = (cartTotal >= 50 || appliedVoucher?.type === "freeship") ? 0 : 9.99;
  const afterVoucher   = Math.max(0, cartTotal - voucherDiscount);
  const estimatedTax   = +(afterVoucher * 0.08).toFixed(2);
  const orderTotal     = +(afterVoucher + shipping + estimatedTax).toFixed(2);

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />

      {/* Voucher modal */}
      {voucherOpen && (
        <VoucherModal
          cartTotal={cartTotal}
          appliedCode={appliedVoucher?.code ?? null}
          onApply={(v) => setAppliedVoucher(v)}
          onClose={() => setVoucherOpen(false)}
        />
      )}

      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="site-container pt-6 pb-2">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Shopping Cart</span>
          </nav>
        </div>

        <section className="site-container py-8">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: "#f5e6c8" }}>🛒</div>
              <div className="text-center">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-sm text-gray-400">Looks like you haven&apos;t added anything yet.</p>
              </div>
              <Link href="/" className="px-8 py-3 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: "#0d5c5c" }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 320px" }}>

              {/* ── Left: Items ── */}
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 mb-6">
                  Shopping cart ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})
                </h1>

                <div className="flex flex-col gap-0">
                  {cartItems.map((item, idx) => (
                    <div key={item.cartItemId}>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs font-semibold text-gray-400">Item {idx + 1}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 mr-1">Qty:</span>
                            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
                              <button onClick={() => updateQty(item.cartItemId, item.qty - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <Minus size={11} />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold">{item.qty}</span>
                              <button onClick={() => updateQty(item.cartItemId, item.qty + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleWishlist({ id: item.id, name: item.name, category: item.category, price: item.price, bgColor: item.bgColor })}
                            className="text-xs text-gray-400 hover:text-[#0d5c5c] transition-colors font-medium"
                          >
                            Save for later
                          </button>
                          <button
                            id={`cart-remove-${item.cartItemId}`}
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-5 py-4 mb-2" style={{ borderBottom: idx < cartItems.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <Link href={`/products/${item.id}`}>
                          <div className="rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity" style={{ width: "88px", height: "88px", backgroundColor: item.bgColor || "#f5e6c8" }}>
                            <span className="text-xs text-white opacity-40">Img</span>
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.id}`}>
                            <p className="text-sm font-semibold text-gray-900 hover:text-[#0d5c5c] transition-colors leading-snug">{item.name}</p>
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">Cart ID: 12345678{(idx + 910).toString()}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {item.originalPrice && <span className="text-xs text-gray-400 line-through">${item.originalPrice}</span>}
                            <span className="text-base font-bold" style={{ color: item.originalPrice ? "#dc2626" : "#111" }}>${item.price}</span>
                            {item.qty > 1 && <span className="text-xs text-gray-400">× {item.qty} = ${item.price * item.qty}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Voucher link + Continue */}
                <div className="mt-6 flex items-center justify-between">
                  <Link href="/" className="text-sm font-semibold transition-colors hover:opacity-80" style={{ color: "#0d5c5c" }}>
                    ← Continue Shopping
                  </Link>
                  <button
                    id="voucher-link"
                    onClick={() => setVoucherOpen(true)}
                    className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                    style={{ color: "#7c3aed" }}
                  >
                    <Tag size={14} />
                    Voucher
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* ── Right: Order Summary ── */}
              <div>
                <div className="rounded-2xl p-6 sticky top-24" style={{ border: "1px solid #e5e7eb", backgroundColor: "#fafafa" }}>
                  <h2 className="text-base font-extrabold text-gray-900 mb-5">Order Summary</h2>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Original Price</span>
                      <span className="font-medium text-gray-800">${originalTotal.toFixed(2)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Product Savings</span>
                        <span className="font-medium" style={{ color: "#dc2626" }}>-${savings.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Applied voucher */}
                    {appliedVoucher && (
                      <div
                        className="flex items-center justify-between p-2.5 rounded-lg"
                        style={{ backgroundColor: appliedVoucher.bgColor, border: `1px solid ${appliedVoucher.color}22` }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{appliedVoucher.icon}</span>
                          <div>
                            <span className="text-xs font-bold" style={{ color: appliedVoucher.color }}>{appliedVoucher.code}</span>
                            <p className="text-xs" style={{ color: appliedVoucher.color }}>
                              {appliedVoucher.type === "freeship" ? "Free Shipping applied" : `-$${voucherDiscount.toFixed(2)} off`}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => setAppliedVoucher(null)} className="hover:opacity-70 transition-opacity">
                          <X size={12} style={{ color: appliedVoucher.color }} />
                        </button>
                      </div>
                    )}

                    {/* Voucher button in summary */}
                    {!appliedVoucher && (
                      <button
                        onClick={() => setVoucherOpen(true)}
                        className="flex items-center justify-between w-full text-xs font-semibold py-2 px-3 rounded-lg transition-colors hover:bg-purple-50"
                        style={{ border: "1.5px dashed #c4b5fd", color: "#7c3aed" }}
                      >
                        <span className="flex items-center gap-1.5"><Tag size={12} /> Apply a voucher</span>
                        <ChevronRight size={12} />
                      </button>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      {shipping === 0
                        ? <span className="font-semibold flex items-center gap-1" style={{ color: "#0d5c5c" }}><Truck size={12} /> Free</span>
                        : <span className="font-medium text-gray-800">${shipping.toFixed(2)}</span>
                      }
                    </div>
                    {voucherDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Voucher Discount</span>
                        <span className="font-medium" style={{ color: "#7c3aed" }}>-${voucherDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Sales Tax</span>
                      <span className="font-medium text-gray-800">${estimatedTax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="my-5" style={{ height: "1px", backgroundColor: "#e5e7eb" }} />

                  <div className="flex justify-between items-center mb-5">
                    <span className="text-base font-extrabold text-gray-900">Total</span>
                    <div className="text-right">
                      {(savings > 0 || voucherDiscount > 0) && (
                        <p className="text-xs text-gray-400 line-through">${(originalTotal + (cartTotal >= 50 ? 0 : 9.99) + +(originalTotal * 0.08).toFixed(2)).toFixed(2)}</p>
                      )}
                      <span className="text-xl font-extrabold text-gray-900">${orderTotal}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    id="proceed-checkout-btn"
                    className="w-full py-3.5 text-sm font-bold text-center block rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#f5c518", color: "#111" }}
                  >
                    Proceed to Check Out
                  </Link>

                  <div className="flex items-center justify-center gap-3 mt-4">
                    {["🔒 Secure", "↩ Free Returns", "✓ Trusted"].map((b) => (
                      <span key={b} className="text-xs text-gray-400">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* People also bought */}
        <section className="py-12 border-t border-gray-100">
          <div className="site-container">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">People also bought</h2>
                <p className="text-sm text-gray-400 mt-1">Browse our most popular products and make your day more beautiful and glorious.</p>
              </div>
              <Link href="/category/all" className="px-5 py-2 text-sm font-semibold rounded-lg transition-all hover:bg-[#0d5c5c] hover:text-white" style={{ border: "1.5px solid #0d5c5c", color: "#0d5c5c" }}>
                Browse All
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {SUGGESTED.map((p) => <SuggestedCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
