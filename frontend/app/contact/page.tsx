"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ─── Form data type ─────────────────────────────────────── */
interface ContactFormData {
  firstName: string;
  email: string;
  phone: string;
  message: string;
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ContactFormData>({ defaultValues: { firstName: "", email: "", phone: "", message: "" } });

  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />

      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="site-container pt-6 pb-2">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Contact</span>
          </nav>
        </div>

        <section className="site-container py-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Let&apos;s talk</h1>

          <div
            className="flex rounded-2xl overflow-hidden"
            style={{ border: "1px solid #e5e7eb", minHeight: "420px" }}
          >
            {/* ── Left panel — Contact info ── */}
            <div
              className="relative flex flex-col justify-between p-8 flex-shrink-0"
              style={{ width: "280px", backgroundColor: "#f5c518" }}
            >
              {/* Diagonal black accent shapes */}
              <div
                className="absolute bottom-0 right-0 pointer-events-none"
                style={{ width: "140px", height: "140px", overflow: "hidden" }}
              >
                <div
                  className="absolute"
                  style={{
                    width: "200px",
                    height: "200px",
                    backgroundColor: "#111",
                    borderRadius: "50%",
                    bottom: "-100px",
                    right: "-60px",
                  }}
                />
              </div>
              <div
                className="absolute"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "rgba(0,0,0,0.08)",
                  borderRadius: "50%",
                  bottom: "60px",
                  right: "30px",
                }}
              />

              <div className="relative z-10">
                <h2 className="text-lg font-extrabold text-gray-900 mb-2">Contact information</h2>
                <p className="text-xs text-gray-700 leading-relaxed mb-8">
                  Fill up the form and our team will get<br />back to you within 24 hours
                </p>

                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black bg-opacity-10 flex items-center justify-center flex-shrink-0">
                      <Phone size={14} style={{ color: "#111" }} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">(000) 012 345 678</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black bg-opacity-10 flex items-center justify-center flex-shrink-0">
                      <Mail size={14} style={{ color: "#111" }} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">youremail@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black bg-opacity-10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} style={{ color: "#111" }} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">your location</span>
                  </div>
                </div>
              </div>

              {/* Social icons at bottom */}
              <div className="relative z-10 flex items-center gap-3 mt-8">
                {[
                  { label: "F", color: "#1877F2" },
                  { label: "in", color: "#0A66C2" },
                  { label: "T", color: "#1DA1F2" },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right panel — Form ── */}
            <div className="flex-1 p-10 flex flex-col justify-center">
              {sent ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                  <CheckCircle size={48} style={{ color: "#0d5c5c" }} />
                  <div className="text-center">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1">Message Sent!</h3>
                    <p className="text-sm text-gray-400">Thank you, {getValues("firstName")}. We&apos;ll get back to you within 24 hours.</p>
                  </div>
                  <button
                    onClick={() => { setSent(false); reset(); }}
                    className="text-sm font-semibold" style={{ color: "#0d5c5c" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
                  <div>
                    <input
                      id="contact-name"
                      placeholder="Your first name"
                      {...register("firstName", { required: "First name is required" })}
                      className="w-full px-4 py-3 text-sm outline-none transition-all bg-white"
                      style={{ border: "none", borderBottom: `1.5px solid ${errors.firstName ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
                      onFocus={(e) => { if (!errors.firstName) e.target.style.borderBottomColor = "#0d5c5c"; }}
                      onBlur={(e) => { if (!errors.firstName) e.target.style.borderBottomColor = "#e5e7eb"; }}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="Your email address"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                      })}
                      className="w-full px-4 py-3 text-sm outline-none transition-all bg-white"
                      style={{ border: "none", borderBottom: `1.5px solid ${errors.email ? "#dc2626" : "#e5e7eb"}`, color: "#111" }}
                      onFocus={(e) => { if (!errors.email) e.target.style.borderBottomColor = "#0d5c5c"; }}
                      onBlur={(e) => { if (!errors.email) e.target.style.borderBottomColor = "#e5e7eb"; }}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="Your phone number"
                      {...register("phone")}
                      className="w-full px-4 py-3 text-sm outline-none transition-all bg-white"
                      style={{ border: "none", borderBottom: "1.5px solid #e5e7eb", color: "#111" }}
                      onFocus={(e) => { e.target.style.borderBottomColor = "#0d5c5c"; }}
                      onBlur={(e)  => { e.target.style.borderBottomColor = "#e5e7eb"; }}
                    />
                  </div>
                  <div>
                    <textarea
                      id="contact-message"
                      placeholder="Write your messages…"
                      {...register("message", { required: "Message is required" })}
                      rows={4}
                      className="w-full px-4 py-3 text-sm outline-none resize-none transition-all bg-white"
                      style={{ border: "none", borderBottom: `1.5px solid ${errors.message ? "#dc2626" : "#e5e7eb"}` }}
                      onFocus={(e) => { if (!errors.message) e.target.style.borderBottomColor = "#0d5c5c"; }}
                      onBlur={(e)  => { if (!errors.message) e.target.style.borderBottomColor = "#e5e7eb"; }}
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                  </div>
                  <div className="pt-1">
                    <button
                      id="send-message-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white rounded-xl transition-opacity hover:opacity-90 disabled:opacity-70"
                      style={{ backgroundColor: "#0d5c5c" }}
                    >
                      {isSubmitting ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={15} />
                      )}
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Map placeholder */}
          <div
            className="mt-8 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ height: "280px", backgroundColor: "#f0f4f4", border: "1px solid #e5e7eb" }}
          >
            <div className="text-center">
              <MapPin size={32} style={{ color: "#0d5c5c", margin: "0 auto 8px" }} />
              <p className="text-sm font-medium text-gray-400">Interactive map would appear here</p>
              <p className="text-xs text-gray-300 mt-1">Integrate Google Maps or Mapbox</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
