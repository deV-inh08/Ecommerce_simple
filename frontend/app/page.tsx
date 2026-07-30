import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CategorySection from "./components/CategorySection";
import ProductSections from "./components/ProductSections";
import TickerBanner from "./components/TickerBanner";
import OffersSection from "./components/OffersSection";
import BrandsSection from "./components/BrandsSection";
import ServicesSection from "./components/ServicesSection";
import BlogPreviewSection from "./components/BlogPreviewSection";
import NewsletterSection from "./components/NewsletterSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header with navigation */}
      <Header />

      {/* Main content */}
      <main className="flex-1 w-full">
        {/* 1. Hero Slider */}
        <HeroSection />

        {/* 2. Category Grid */}
        <CategorySection />

        {/* 3. Popular / New / Best Sellers */}
        <ProductSections />

        {/* 4. Scrolling Promotional Ticker */}
        <TickerBanner />

        {/* 5. Sale / Offers Section */}
        <OffersSection />

        {/* 6. Brands Carousel */}
        <BrandsSection />

        {/* 7. Services Section (yellow background) */}
        <ServicesSection />

        {/* 8. Blog Preview — Learn & Grow */}
        <BlogPreviewSection />


      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
