"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ChevronDown, CreditCard, Check, Lock, Truck, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStore } from "../store/useStoreZustand";
import { useCheckout } from "../hooks/useOrders";
import { useOrder } from "../hooks/useOrders";

/* ─── Helpers ────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-gray-600 block mb-1">{children}</label>;
}

/* ─── Card form data ─────────────────────────────────────── */
interface CardFormData {
  cardNum: string;
  expiry: string;
  cvv: string;
  firstName: string;
  lastName: string;
  remember: boolean;
}

/* ─── Card form (collapsible) ────────────────────────────── */
function CardForm({
  open, onDone, onCancel,
}: { open: boolean; onDone: () => void; onCancel: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CardFormData>({
    defaultValues: { cardNum: "", expiry: "", cvv: "", firstName: "", lastName: "", remember: false },
  });

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  if (!open) return null;
  return (
    <form onSubmit={handleSubmit(() => onDone())} className="mt-4 flex flex-col gap-3">
      <div>
        <Label>Card number</Label>
        <input
          id="card-number" placeholder="1234 5678 9012 3456"
          {...register("cardNum", { required: "Card number is required" })}
          onChange={(e) => setValue("cardNum", formatCard(e.target.value))}
          className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
          style={{ border: `1.5px solid ${errors.cardNum ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
          onFocus={(e) => { if (!errors.cardNum) { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; } }}
          onBlur={(e)  => { if (!errors.cardNum) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; } }}
        />
        {errors.cardNum && <p className="text-xs text-red-500 mt-1">{errors.cardNum.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Expiration date</Label>
          <input
            id="card-expiry" placeholder="MM/YY"
            {...register("expiry", { required: "Required" })}
            onChange={(e) => setValue("expiry", formatExpiry(e.target.value))}
            className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
            style={{ border: `1.5px solid ${errors.expiry ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
            onFocus={(e) => { if (!errors.expiry) { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; } }}
            onBlur={(e)  => { if (!errors.expiry) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; } }}
          />
          {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry.message}</p>}
        </div>
        <div>
          <Label>Security code</Label>
          <input
            id="card-cvv" placeholder="CVV"
            {...register("cvv", { required: "Required" })}
            onChange={(e) => setValue("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
            style={{ border: `1.5px solid ${errors.cvv ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
            onFocus={(e) => { if (!errors.cvv) { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; } }}
            onBlur={(e)  => { if (!errors.cvv) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; } }}
          />
          {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>First name</Label>
          <input
            id="card-fname" placeholder="John"
            {...register("firstName", { required: "Required" })}
            className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
            style={{ border: `1.5px solid ${errors.firstName ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
            onFocus={(e) => { if (!errors.firstName) { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; } }}
            onBlur={(e)  => { if (!errors.firstName) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; } }}
          />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <Label>Last name</Label>
          <input
            id="card-lname" placeholder="Doe"
            {...register("lastName", { required: "Required" })}
            className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
            style={{ border: `1.5px solid ${errors.lastName ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
            onFocus={(e) => { if (!errors.lastName) { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; } }}
            onBlur={(e)  => { if (!errors.lastName) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; } }}
          />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" id="card-remember"
          {...register("remember")}
          className="w-3.5 h-3.5 rounded accent-[#0d5c5c]" />
        <span className="text-xs text-gray-500">Remember this card for future order</span>
      </label>
      <div className="flex gap-3 pt-1">
        <button id="card-done" type="submit"
          className="px-6 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#0d5c5c" }}>
          Done
        </button>
        <button id="card-cancel" type="button" onClick={onCancel}
          className="px-6 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ─── Billing form data ──────────────────────────────────── */
interface BillingFormData {
  email: string;
  deliverTo: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  note: string;
}

/* ─── Checkout Page ──────────────────────────────────────── */
export default function CheckoutPage() {
  const { cartItems, cartTotal } = useStore();

  // React Hook Form for billing
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BillingFormData>({
    defaultValues: {
      email: "", deliverTo: "Residence", country: "United States",
      firstName: "", lastName: "", address: "", city: "",
      state: "Select state", zip: "", phone: "", note: "",
    },
  });

  // Payment state
  const [payMethod, setPayMethod]     = useState<"card" | "paypal">("card");
  const [cardOpen, setCardOpen]       = useState(true);
  const [cardSaved, setCardSaved]     = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const checkoutMutation = useCheckout();
  // Poll order status while Pending (saga can take up to 30s)
  const { data: placedOrder } = useOrder(placedOrderId ?? "");

  const email = watch("email");
  const originalTotal  = cartItems.reduce((s, i) => s + (i.originalPrice ?? i.price) * i.qty, 0);
  const savings        = originalTotal - cartTotal;
  const shipping       = cartTotal >= 50 ? 0 : 9.99;
  const estimatedTax   = +(cartTotal * 0.08).toFixed(2);
  const orderTotal     = +(cartTotal + shipping + estimatedTax).toFixed(2);

  const onSubmitBilling = async () => {
    try {
      const order = await checkoutMutation.mutateAsync();
      setPlacedOrderId(order.id);
    } catch {
      // error handled below
    }
  };

  /* ── Order placed / polling screen ── */
  if (placedOrderId) {
    const status = placedOrder?.status;
    const isPending = !status || status === "Pending";
    const isConfirmed = status === "Confirmed";
    const isCancelled = status === "Cancelled";
    return (
      <div className="flex flex-col min-h-screen w-full bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center flex flex-col items-center gap-5 py-20">
            {isPending && (
              <>
                <span className="w-16 h-16 border-4 border-[#0d5c5c] border-t-transparent rounded-full animate-spin" />
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Processing your order…</h1>
                  <p className="text-sm text-gray-400">The checkout saga is reserving stock. This may take up to 30 seconds.</p>
                  <p className="text-xs text-gray-300 mt-1">Order ID: {placedOrderId}</p>
                </div>
              </>
            )}
            {isConfirmed && (
              <>
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e8f5f0" }}>
                  <Check size={36} style={{ color: "#0d5c5c" }} />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
                  <p className="text-sm text-gray-400">We&apos;ll send a confirmation to <strong>{email}</strong></p>
                  <p className="text-xs text-gray-300 mt-1">Order ID: {placedOrderId}</p>
                </div>
                <div className="flex gap-4">
                  <Link href="/" className="px-7 py-3 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: "#0d5c5c" }}>Continue Shopping</Link>
                </div>
              </>
            )}
            {isCancelled && (
              <>
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#fef2f2" }}>
                  <AlertCircle size={36} style={{ color: "#dc2626" }} />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Cancelled</h1>
                  <p className="text-sm text-gray-500">{placedOrder?.cancelledReason ?? "Stock could not be reserved."}</p>
                </div>
                <Link href="/cart" className="px-7 py-3 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors" style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}>Back to Cart</Link>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />

      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="site-container pt-6 pb-2">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-gray-600 transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Checkout</span>
          </nav>
        </div>

        <section className="site-container py-8">
          <div className="grid gap-10" style={{ gridTemplateColumns: "1fr 360px" }}>

            {/* ── Left: Billing details ── */}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Billing details</h1>

              <form id="billing-form" onSubmit={handleSubmit(onSubmitBilling)} className="flex flex-col gap-4">
                {/* Email */}
                <div>
                  <Label>Email address *</Label>
                  <input
                    id="checkout-email" type="email" placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                    })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{ border: `1.5px solid ${errors.email ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
                    onFocus={(e) => { if (!errors.email) { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; } }}
                    onBlur={(e)  => { if (!errors.email) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; } }}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                {/* Deliver to */}
                <div>
                  <Label>Deliver to</Label>
                  <div className="relative">
                    <select
                      id="deliver-to"
                      {...register("deliverTo")}
                      className="w-full px-3 py-2.5 text-sm rounded-xl outline-none appearance-none transition-all bg-white"
                      style={{ border: "1.5px solid #e5e7eb", color: "#111" }}
                      onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; }}
                    >
                      {["Residence", "Office / Business", "Hotel", "Other"].map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <Label>Country</Label>
                  <div className="relative">
                    <select
                      id="checkout-country"
                      {...register("country")}
                      className="w-full px-3 py-2.5 text-sm rounded-xl outline-none appearance-none transition-all bg-white"
                      style={{ border: "1.5px solid #e5e7eb", color: "#111" }}
                      onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; }}
                    >
                      {["United States", "United Kingdom", "Canada", "Australia", "Vietnam", "Germany", "France", "Japan"].map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Your first name *</Label>
                    <input
                      id="checkout-fname" placeholder="John"
                      {...register("firstName", { required: "First name is required" })}
                      className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                      style={{ border: `1.5px solid ${errors.firstName ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
                      onFocus={(e) => { if (!errors.firstName) { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; } }}
                      onBlur={(e)  => { if (!errors.firstName) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; } }}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <Label>Your last name *</Label>
                    <input
                      id="checkout-lname" placeholder="Doe"
                      {...register("lastName", { required: "Last name is required" })}
                      className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                      style={{ border: `1.5px solid ${errors.lastName ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
                      onFocus={(e) => { if (!errors.lastName) { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; } }}
                      onBlur={(e)  => { if (!errors.lastName) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; } }}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label>Your address *</Label>
                  <input
                    id="checkout-address" placeholder="123 Main Street, Apt 4B"
                    {...register("address", { required: "Address is required" })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{ border: `1.5px solid ${errors.address ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
                    onFocus={(e) => { if (!errors.address) { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; } }}
                    onBlur={(e)  => { if (!errors.address) { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; } }}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                </div>

                {/* City / State / Zip */}
                <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 120px" }}>
                  <div>
                    <Label>City</Label>
                    <input
                      id="checkout-city" placeholder="New York"
                      {...register("city")}
                      className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                      style={{ border: "1.5px solid #e5e7eb", color: "#111" }}
                      onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <div className="relative">
                      <select
                        id="checkout-state"
                        {...register("state")}
                        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none appearance-none transition-all bg-white"
                        style={{ border: "1.5px solid #e5e7eb", color: "#111" }}
                        onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; }}
                        onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; }}
                      >
                        {["Select state","Alabama","Alaska","Arizona","California","Colorado","Florida","Georgia","Illinois","New York","Texas","Washington"].map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <Label>Zip code</Label>
                    <input
                      id="checkout-zip" placeholder="10001"
                      {...register("zip")}
                      onChange={(e) => setValue("zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                      className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                      style={{ border: "1.5px solid #e5e7eb", color: "#111" }}
                      onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label>Your phone number</Label>
                  <input
                    id="checkout-phone" type="tel" placeholder="+1 (555) 000-0000"
                    {...register("phone")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{ border: "1.5px solid #e5e7eb", color: "#111" }}
                    onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Note */}
                <div>
                  <Label>Note <span className="font-normal text-gray-400">(optional)</span></Label>
                  <textarea
                    id="checkout-note"
                    placeholder="Tell us what do you think…"
                    {...register("note")}
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none resize-none transition-all"
                    style={{ border: "1.5px solid #e5e7eb" }}
                    onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </form>
            </div>

            {/* ── Right: Order Summary + Payment ── */}
            <div className="flex flex-col gap-6">

              {/* Order Summary */}
              <div className="rounded-2xl p-6" style={{ border: "1px solid #e5e7eb", backgroundColor: "#fafafa" }}>
                <h2 className="text-base font-extrabold text-gray-900 mb-4">Your order</h2>

                {/* Item list (compact) */}
                {cartItems.length > 0 && (
                  <div className="flex flex-col gap-2 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.cartItemId} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: item.bgColor || "#f5e6c8" }}>
                          <span className="text-xs text-white opacity-50">Img</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">× {item.qty}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-800">${item.price * item.qty}</span>
                      </div>
                    ))}
                    <div className="mt-2" style={{ height: "1px", backgroundColor: "#e5e7eb" }} />
                  </div>
                )}

                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Original Price</span>
                    <span className="font-medium">${originalTotal.toFixed(2)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Savings</span>
                      <span className="font-medium" style={{ color: "#dc2626" }}>-${savings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    {shipping === 0
                      ? <span className="font-semibold flex items-center gap-1" style={{ color: "#0d5c5c" }}><Truck size={12} /> FREE</span>
                      : <span className="font-medium">${shipping.toFixed(2)}</span>
                    }
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Sales Tax</span>
                    <span className="font-medium">${estimatedTax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="my-4" style={{ height: "1px", backgroundColor: "#e5e7eb" }} />

                <div className="flex justify-between items-center">
                  <span className="text-base font-extrabold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-gray-900">${orderTotal}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl p-6" style={{ border: "1px solid #e5e7eb" }}>
                <h2 className="text-base font-extrabold text-gray-900 mb-4">Pay with</h2>

                <div className="flex flex-col gap-3">
                  {/* Card option */}
                  <div
                    className="rounded-xl p-4 transition-all"
                    style={{
                      border: payMethod === "card" ? "2px solid #0d5c5c" : "2px solid #e5e7eb",
                      backgroundColor: payMethod === "card" ? "#f7fdfc" : "white",
                    }}
                  >
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          id="pay-card"
                          type="radio"
                          name="payment"
                          checked={payMethod === "card"}
                          onChange={() => { setPayMethod("card"); setCardOpen(true); setCardSaved(false); }}
                          className="accent-[#0d5c5c]"
                        />
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-gray-600" />
                          <span className="text-sm font-semibold text-gray-800">Card</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/* VISA */}
                        <span className="px-2 py-0.5 rounded text-xs font-extrabold" style={{ backgroundColor: "#1a1f71", color: "white" }}>VISA</span>
                        {/* Mastercard circles */}
                        <div className="flex">
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#eb001b", marginRight: "-6px", zIndex: 1 }} />
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#f79e1b", opacity: 0.95 }} />
                        </div>
                      </div>
                    </label>

                    {/* Card saved state */}
                    {payMethod === "card" && cardSaved && (
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Check size={14} style={{ color: "#0d5c5c" }} />
                          Card ending in •••• 3456
                        </div>
                        <button onClick={() => { setCardOpen(true); setCardSaved(false); }}
                          className="text-xs font-semibold" style={{ color: "#0d5c5c" }}>
                          Edit
                        </button>
                      </div>
                    )}

                    <CardForm
                      open={payMethod === "card" && cardOpen}
                      onDone={() => { setCardSaved(true); setCardOpen(false); }}
                      onCancel={() => setCardOpen(false)}
                    />
                  </div>

                  {/* PayPal option */}
                  <div
                    className="rounded-xl p-4 transition-all"
                    style={{
                      border: payMethod === "paypal" ? "2px solid #0d5c5c" : "2px solid #e5e7eb",
                      backgroundColor: payMethod === "paypal" ? "#f7fdfc" : "white",
                    }}
                  >
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          id="pay-paypal"
                          type="radio"
                          name="payment"
                          checked={payMethod === "paypal"}
                          onChange={() => { setPayMethod("paypal"); setCardOpen(false); }}
                          className="accent-[#0d5c5c]"
                        />
                        <span className="text-sm font-semibold text-gray-800">Paypal</span>
                      </div>
                      {/* PayPal logo */}
                      <span className="text-sm font-extrabold" style={{ color: "#003087" }}>
                        Pay<span style={{ color: "#009cde" }}>Pal</span>
                      </span>
                    </label>
                    {payMethod === "paypal" && (
                      <p className="text-xs text-gray-400 mt-2 ml-6">You will be redirected to PayPal to complete your payment.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Lock size={12} />
                Your payment information is encrypted and secure.
              </div>

              {/* Checkout error */}
              {checkoutMutation.isError && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl" style={{ border: "1px solid #fecaca" }}>
                  <AlertCircle size={13} />
                  {checkoutMutation.error?.message ?? "Checkout failed — try again"}
                </div>
              )}

              {/* Place Order */}
              <button
                id="place-order-btn"
                type="submit"
                form="billing-form"
                disabled={checkoutMutation.isPending}
                className="w-full py-4 text-sm font-extrabold rounded-xl transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ backgroundColor: "#f5c518", color: "#111" }}
              >
                {checkoutMutation.isPending
                  ? <><span className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" /> Placing order…</>
                  : <>Place Order — ${orderTotal}</>
                }
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
