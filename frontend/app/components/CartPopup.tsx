"use client";
import { useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { useStore } from "../store/useStoreZustand";

export default function CartPopup() {
  const { cartItems, cartCount, cartTotal, cartOpen, closeCart, removeFromCart, updateQty } = useStore();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  if (!cartOpen) return null;

  const hasFreeShipping = cartTotal >= 50;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
        onClick={closeCart}
      />

      {/* Modal */}
      <div
        id="cart-popup"
        className="fixed z-50 bg-white rounded-2xl overflow-hidden"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(820px, 95vw)",
          maxHeight: "90vh",
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Close button */}
        <button
          id="cart-close-btn"
          onClick={closeCart}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <X size={15} />
        </button>

        <div className="flex h-full" style={{ maxHeight: "90vh" }}>
          {/* Left — item list */}
          <div className="flex-1 overflow-y-auto p-6" style={{ borderRight: "1px solid #f0f0f0" }}>
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <ShoppingBag size={18} />
              Your Cart
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#0d5c5c", color: "white" }}
              >
                {cartCount}
              </span>
            </h2>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <ShoppingBag size={48} className="text-gray-200" />
                <p className="text-sm text-gray-400">Your cart is empty</p>
                <button
                  onClick={closeCart}
                  className="text-sm font-semibold px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#0d5c5c", color: "white" }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {cartItems.map((item, idx) => (
                  <div key={item.cartItemId}>
                    <p className="text-xs text-gray-400 mb-2">Item {idx + 1}</p>
                    <div className="flex gap-4 pb-5" style={{ borderBottom: "1px solid #f5f5f5" }}>
                      {/* Thumbnail */}
                      <div
                        className="flex-shrink-0 rounded-xl flex items-center justify-center"
                        style={{ width: "80px", height: "80px", backgroundColor: item.bgColor || "#f5e6c8" }}
                      >
                        <span className="text-xs text-white opacity-50">Img</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Cart ID: 123456789{idx + 10}</p>
                        <p className="text-sm font-bold mt-1" style={{ color: "#0d5c5c" }}>${item.price}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end justify-between gap-2">
                        {/* Qty */}
                        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
                          <button
                            onClick={() => updateQty(item.cartItemId, item.qty - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.cartItemId, item.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — summary */}
          <div className="flex flex-col p-6" style={{ width: "280px", backgroundColor: "#fafafa" }}>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-sm font-bold text-gray-700">Cart order total ({cartCount})</h3>
              <span className="text-lg font-extrabold text-gray-900">${cartTotal}</span>
            </div>

            <div style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "16px 0" }} />

            {/* Free shipping */}
            <div
              className="flex items-start gap-3 p-3 rounded-xl mb-6"
              style={{ backgroundColor: hasFreeShipping ? "#e8f5f0" : "#fff8e8", border: `1px solid ${hasFreeShipping ? "#a7e0cb" : "#f5c518"}` }}
            >
              <Truck size={16} style={{ color: hasFreeShipping ? "#0d5c5c" : "#d4a804", flexShrink: 0, marginTop: "1px" }} />
              <div>
                {hasFreeShipping ? (
                  <p className="text-xs font-semibold" style={{ color: "#0d5c5c" }}>🎉 Congrats! You get Free Shipping</p>
                ) : (
                  <p className="text-xs font-semibold text-gray-700">
                    Add ${50 - cartTotal} more for <strong style={{ color: "#0d5c5c" }}>Free Shipping</strong>
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Excludes furniture, mattresses & other exclusions apply.</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mt-auto">
              <Link
                href="/cart"
                id="view-cart-btn"
                onClick={closeCart}
                className="w-full py-3 text-sm font-bold text-white text-center rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#0d5c5c" }}
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                id="checkout-popup-btn"
                onClick={closeCart}
                className="w-full py-3 text-sm font-bold text-center rounded-xl transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#f5c518", color: "#111" }}
              >
                Check Out
              </Link>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              Secure checkout · Free returns
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
