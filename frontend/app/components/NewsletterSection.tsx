"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface NewsletterData {
  email: string;
}

export default function NewsletterSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterData>({ defaultValues: { email: "" } });

  const [subbed, setSubbed] = useState(false);

  const onSubmit = async () => {
    setSubbed(true);
    reset();
    setTimeout(() => setSubbed(false), 4000);
  };

  return (
    <section className="w-full" style={{ backgroundColor: "#0d5c5c" }}>
      <div className="site-container py-16">
        <div className="grid items-center gap-10" style={{ gridTemplateColumns: "1fr 300px" }}>
          {/* Left: Content */}
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
              Subscribe our newsletter to get latest product updates
            </h2>
            <p className="text-sm text-white opacity-70 mb-8 max-w-sm">
              Join 50,000+ shoppers and get early access to new arrivals, exclusive deals, and style tips.
            </p>
            {subbed ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
              >
                🎉 You&apos;re subscribed! Thank you.
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1 max-w-md">
                <div className="flex gap-3">
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                    })}
                    className="flex-1 px-4 py-3 text-sm rounded-xl outline-none"
                    style={{ border: errors.email ? "2px solid #dc2626" : "none", minWidth: 0 }}
                  />
                  <button
                    type="submit"
                    id="newsletter-subscribe-btn"
                    className="px-6 py-3 text-sm font-bold rounded-xl transition-opacity hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: "#f5c518", color: "#111" }}
                  >
                    Subscribe
                  </button>
                </div>
                {errors.email && <p className="text-xs text-red-300 mt-1 ml-1">{errors.email.message}</p>}
              </form>
            )}
          </div>

          {/* Right: Product image */}
          <div className="flex items-center justify-center">
            <div
              className="rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                width: "260px",
                height: "220px",
                backgroundColor: "rgba(0,0,0,0.2)",
                border: "2px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="text-center">
                <span className="text-7xl">👜</span>
                <p className="text-xs text-white opacity-30 mt-2">Latest collection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
