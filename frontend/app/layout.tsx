import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./context/StoreContext";
import CartPopup from "./components/CartPopup";
import AuthModalWrapper from "./components/AuthModalWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased w-full">
        <StoreProvider>
          {children}
          <CartPopup />
          <AuthModalWrapper />
        </StoreProvider>
      </body>
    </html>
  );
}
