"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CreditCard, Check, Lock, Truck } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStore } from "../context/StoreContext";

/* ─── Helpers ────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-gray-600 block mb-1">{children}</label>;
}

function Input({
  id, placeholder, type = "text", value, onChange, className = "",
}: {
  id: string; placeholder: string; type?: string;
  value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <input
      id={id} type={type} placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all ${className}`}
      style={{ border: "1.5px solid #e5e7eb", color: "#111" }}
      onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; }}
      onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
    />
  );
}

function Select({
  id, value, onChange, options,
}: {
  id: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="relative">
      <select
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none appearance-none transition-all bg-white"
        style={{ border: "1.5px solid #e5e7eb", color: value ? "#111" : "#9ca3af" }}
        onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; }}
        onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

/* ─── Card form (collapsible) ────────────────────────────── */
function CardForm({
  open, onDone, onCancel,
}: { open: boolean; onDone: () => void; onCancel: () => void }) {
  const [cardNum, setCardNum]       = useState("");
  const [expiry, setExpiry]         = useState("");
  const [cvv, setCvv]               = useState("");
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [remember, setRemember]     = useState(false);

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  if (!open) return null;
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div>
        <Label>Card number</Label>
        <Input id="card-number" placeholder="1234 5678 9012 3456" value={cardNum}
          onChange={(v) => setCardNum(formatCard(v))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Expiration date</Label>
          <Input id="card-expiry" placeholder="MM/YY" value={expiry}
            onChange={(v) => setExpiry(formatExpiry(v))} />
        </div>
        <div>
          <Label>Security code</Label>
          <Input id="card-cvv" placeholder="CVV" value={cvv}
            onChange={(v) => setCvv(v.replace(/\D/g,"").slice(0,4))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>First name</Label>
          <Input id="card-fname" placeholder="John" value={firstName} onChange={setFirstName} />
        </div>
        <div>
          <Label>Last name</Label>
          <Input id="card-lname" placeholder="Doe" value={lastName} onChange={setLastName} />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" id="card-remember" checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="w-3.5 h-3.5 rounded accent-[#0d5c5c]" />
        <span className="text-xs text-gray-500">Remember this card for future order</span>
      </label>
      <div className="flex gap-3 pt-1">
        <button id="card-done" onClick={onDone}
          className="px-6 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#0d5c5c" }}>
          Done
        </button>
        <button id="card-cancel" onClick={onCancel}
          className="px-6 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Checkout Page ──────────────────────────────────────── */
export default function CheckoutPage() {
  const { cartItems, cartTotal } = useStore();

  // Billing state
  const [email, setEmail]         = useState("");
  const [deliverTo, setDeliverTo] = useState("Residence");
  const [country, setCountry]     = useState("United States");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [address, setAddress]     = useState("");
  const [city, setCity]           = useState("");
  const [state, setState]         = useState("Select state");
  const [zip, setZip]             = useState("");
  const [phone, setPhone]         = useState("");
  const [note, setNote]           = useState("");

  // Payment state
  const [payMethod, setPayMethod]     = useState<"card" | "paypal">("card");
  const [cardOpen, setCardOpen]       = useState(true);
  const [cardSaved, setCardSaved]     = useState(false);
  const [placed, setPlaced]           = useState(false);

  // Pricing
  const originalTotal  = cartItems.reduce((s, i) => s + (i.originalPrice ?? i.price) * i.qty, 0);
  const savings        = originalTotal - cartTotal;
  const shipping       = cartTotal >= 50 ? 0 : 9.99;
  const estimatedTax   = +(cartTotal * 0.08).toFixed(2);
  const orderTotal     = +(cartTotal + shipping + estimatedTax).toFixed(2);

  const handlePlaceOrder = () => {
    if (!email || !firstName || !lastName || !address) return;
    setPlaced(true);
  };

  /* ── Order placed screen ── */
  if (placed) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center flex flex-col items-center gap-5 py-20">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e8f5f0" }}>
              <Check size={36} style={{ color: "#0d5c5c" }} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed! 🎉</h1>
              <p className="text-sm text-gray-400">Thank you for your purchase. We&apos;ll send a confirmation to <strong>{email}</strong></p>
            </div>
            <div className="flex gap-4">
              <Link href="/"
                className="px-7 py-3 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#0d5c5c" }}>
                Continue Shopping
              </Link>
              <Link href="/wishlist"
                className="px-7 py-3 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors"
                style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}>
                View Wishlist
              </Link>
            </div>
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

              <div className="flex flex-col gap-4">
                {/* Email */}
                <div>
                  <Label>Email address *</Label>
                  <Input id="checkout-email" placeholder="you@example.com" type="email" value={email} onChange={setEmail} />
                </div>

                {/* Deliver to */}
                <div>
                  <Label>Deliver to</Label>
                  <Select id="deliver-to" value={deliverTo} onChange={setDeliverTo}
                    options={["Residence", "Office / Business", "Hotel", "Other"]} />
                </div>

                {/* Country */}
                <div>
                  <Label>Country</Label>
                  <Select id="checkout-country" value={country} onChange={setCountry}
                    options={["United States", "United Kingdom", "Canada", "Australia", "Vietnam", "Germany", "France", "Japan"]} />
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Your first name *</Label>
                    <Input id="checkout-fname" placeholder="John" value={firstName} onChange={setFirstName} />
                  </div>
                  <div>
                    <Label>Your last name *</Label>
                    <Input id="checkout-lname" placeholder="Doe" value={lastName} onChange={setLastName} />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label>Your address *</Label>
                  <Input id="checkout-address" placeholder="123 Main Street, Apt 4B" value={address} onChange={setAddress} />
                </div>

                {/* City / State / Zip */}
                <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 120px" }}>
                  <div>
                    <Label>City</Label>
                    <Input id="checkout-city" placeholder="New York" value={city} onChange={setCity} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Select id="checkout-state" value={state} onChange={setState}
                      options={["Select state","Alabama","Alaska","Arizona","California","Colorado","Florida","Georgia","Illinois","New York","Texas","Washington"]} />
                  </div>
                  <div>
                    <Label>Zip code</Label>
                    <Input id="checkout-zip" placeholder="10001" value={zip}
                      onChange={(v) => setZip(v.replace(/\D/g,"").slice(0,5))} />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label>Your phone number</Label>
                  <Input id="checkout-phone" placeholder="+1 (555) 000-0000" type="tel" value={phone} onChange={setPhone} />
                </div>

                {/* Note */}
                <div>
                  <Label>Note <span className="font-normal text-gray-400">(optional)</span></Label>
                  <textarea
                    id="checkout-note"
                    placeholder="Tell us what do you think…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none resize-none transition-all"
                    style={{ border: "1.5px solid #e5e7eb" }}
                    onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
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

              {/* Place Order */}
              <button
                id="place-order-btn"
                onClick={handlePlaceOrder}
                className="w-full py-4 text-sm font-extrabold rounded-xl transition-opacity hover:opacity-90 active:scale-[0.99]"
                style={{ backgroundColor: "#f5c518", color: "#111" }}
              >
                Place Order — ${orderTotal}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
