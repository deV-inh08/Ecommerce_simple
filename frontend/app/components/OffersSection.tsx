import Image from "next/image";
import { ProductCard, Product } from "./ProductCard";
import banner_flashsale from "../../public/image/Banner.png";

const saleProducts: Product[] = [
  {
    id: "sale-1",
    name: "Modern Sports Shoes",
    category: "Men-Shoes",
    price: 110,
    originalPrice: 220,
    rating: 5.0,
    reviewCount: 72,
    badge: "Out of Stock",
    bgColor: "#e8f0f8",
  },
  {
    id: "sale-2",
    name: "Modern Green Sweater",
    category: "Women-Cloths",
    price: 60,
    originalPrice: 120,
    rating: 5.0,
    reviewCount: 37,
    bgColor: "#f5f5dc",
  },
  {
    id: "sale-3",
    name: "Modern Headphones",
    category: "Women-Fashion",
    price: 90,
    originalPrice: 180,
    rating: 5.0,
    reviewCount: 49,
    bgColor: "#fce8f0",
  },
  {
    id: "sale-4",
    name: "Modern Purse Bag",
    category: "Women-Fashion",
    price: 105,
    originalPrice: 210,
    rating: 5.0,
    reviewCount: 69,
    bgColor: "#f0e8f5",
  },
];

export default function OffersSection() {
  return (
    <section id="offers" className="py-16 bg-white">
      <div className="site-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Hurry, don&apos;t miss out
            </h2>
            <h2 className="text-3xl font-extrabold text-gray-900">
              on this offers
            </h2>
          </div>
          <a
            href="#"
            id="offers-browse-all"
            style={{ backgroundColor: "#0d5c5c" }}
            className="px-5 py-2 text-sm font-semibold text-white rounded hover:opacity-90 transition-opacity"
          >
            Browse All
          </a>
        </div>

        {/* Grid layout: 3 cols, 2 rows */}
        <div className="grid grid-cols-3 gap-4">
          {/* Row 1, Col 1-2: Black Friday banner */}
          <div className="col-span-2 rounded overflow-hidden">
            <Image src={banner_flashsale} alt="Black Friday Banner" width={770} height={518} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>

          {/* Row 1, Col 3: First product */}
          <div>
            <ProductCard product={saleProducts[0]} />
          </div>

          {/* Row 2, Col 1-2-3: 3 products, each 1 col */}
          {saleProducts.slice(1).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
