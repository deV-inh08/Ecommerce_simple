import type { Metadata } from "next";
import { Manrope, Roboto_Slab } from "next/font/google";
import "./globals.css";
import CartPopup from "./components/CartPopup";
import AuthModalWrapper from "./components/AuthModalWrapper";
import QueryProvider from "./providers/QueryProvider";

/* ─── Fonts ──────────────────────────────────────────────── */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pursuit – Find the Best Styles of Modern Fashion",
  description:
    "Pursuit is your one-stop e-commerce destination for modern fashion, shoes, electronics, and lifestyle products. Explore the best brands at unbeatable prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${robotoSlab.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased w-full">
        <QueryProvider>
          {children}
          <CartPopup />
          <AuthModalWrapper />
        </QueryProvider>
      </body>
    </html>
  );
}
