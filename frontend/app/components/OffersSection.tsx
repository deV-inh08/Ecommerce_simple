import { ProductCard, Product } from "./ProductCard";

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

        {/* Grid layout matching Figma */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left – Black Friday banner (spans 2 rows) */}
          <div
            className="row-span-2 rounded overflow-hidden flex flex-col items-center justify-center relative"
            style={{
              backgroundColor: "#f5e6c8",
              minHeight: "360px",
              border: "2px solid #0d5c5c",
            }}
          >
            {/* Black Friday Banner Placeholder */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: "#333",
                  textTransform: "uppercase",
                }}
              >
                Limited Time Only
              </span>
              <div
                style={{
                  backgroundColor: "#e05c2e",
                  padding: "6px 24px",
                  transform: "skew(-5deg)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "20px",
                    letterSpacing: "0.05em",
                  }}
                >
                  BLACK FRIDAY
                </span>
              </div>
              <div
                style={{
                  backgroundColor: "#0d3d5c",
                  padding: "6px 24px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "28px",
                    letterSpacing: "0.05em",
                  }}
                >
                  SALE
                </span>
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#333",
                  marginTop: "8px",
                }}
              >
                GET UPTO 50% OFF
              </span>
            </div>
          </div>

          {/* Top right – Out of Stock product */}
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <ProductCard product={saleProducts[0]} />
            </div>
          </div>

          {/* Bottom row – 3 products */}
          <div className="col-span-2 grid grid-cols-3 gap-4">
            {saleProducts.slice(1).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
