"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ─── FAQ data ───────────────────────────────────────────── */
const FAQS = [
  {
    id: 1,
    question: "Is the program 100% online?",
    answer:
      "Yes, the program is completely online. You can access all course materials, lectures, and resources from anywhere in the world. All you need is a stable internet connection and a device to study on.",
  },
  {
    id: 2,
    question: "Do I get a certificate at the end?",
    answer:
      "Absolutely! Upon successful completion of the program, you will receive an accredited certificate that you can share with employers and add to your professional profiles such as LinkedIn.",
  },
  {
    id: 3,
    question: "What kind of job can I get after the program?",
    answer:
      "Our graduates have gone on to work in a wide range of roles including software development, UX/UI design, data analysis, digital marketing, and e-commerce management. The skills you gain are highly transferable.",
  },
  {
    id: 4,
    question: "How long does the program take to complete?",
    answer:
      "The program is flexibly-paced within a 7-month duration. There are three deadlines along the way that we've put in place to help keep you on track for graduation.\n\nExpect to devote a minimum of 15–20 hours per week to graduate within that maximum time frame. This is considered part-time study, and matches the default pacing of the program. If you'd like to graduate in as little as three months, you can devote 30–40 hours per week to reach that goal.",
  },
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. Payment plans are also available — contact our support team for details.",
  },
  {
    id: 6,
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied within the first 30 days of your enrollment, contact us and we'll process a full refund — no questions asked.",
  },
  {
    id: 7,
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking number via email. You can use this number on our website or the courier's website to track your shipment in real time.",
  },
  {
    id: 8,
    question: "What is your return and exchange policy?",
    answer:
      "We accept returns within 30 days of delivery. Items must be in their original condition with tags attached. To initiate a return, visit the My Orders section of your account or contact our customer service team.",
  },
];

/* ─── Accordion item ─────────────────────────────────────── */
function AccordionItem({ faq, isOpen, onToggle }: {
  faq: typeof FAQS[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        border: "2px solid #0d5c5c",
        backgroundColor: isOpen ? "#f7fdfc" : "white",
      }}
    >
      <button
        id={`faq-${faq.id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-opacity-80"
      >
        <span className="text-sm font-semibold text-gray-800 pr-4 leading-snug">
          {faq.question}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            backgroundColor: isOpen ? "#0d5c5c" : "white",
            border: isOpen ? "none" : "1.5px solid #e5e7eb",
          }}
        >
          {isOpen
            ? <Minus size={14} className="text-white" />
            : <Plus size={14} style={{ color: "#0d5c5c" }} />
          }
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          <div style={{ height: "1px", backgroundColor: "#e5e7eb", marginBottom: "16px" }} />
          {faq.answer.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm text-gray-600 leading-relaxed mb-3 last:mb-0">{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(4); // 4th open by default

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />

      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="site-container pt-6 pb-2">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">FAQ</span>
          </nav>
        </div>

        <section className="site-container py-10">
          {/* Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Most asked<br />questions about us
            </h1>
          </div>

          {/* Accordion */}
          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            {FAQS.map((faq) => (
              <AccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </div>

          {/* Still have questions CTA */}
          <div
            className="mt-12 flex items-center justify-between p-8 rounded-2xl max-w-3xl mx-auto"
            style={{ background: "linear-gradient(135deg, #0d5c5c 0%, #1a8080 100%)" }}
          >
            <div>
              <h3 className="text-lg font-extrabold text-white mb-1">Still have questions?</h3>
              <p className="text-sm text-white opacity-75">Our support team is happy to help you.</p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 text-sm font-bold rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ backgroundColor: "#f5c518", color: "#111" }}
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
