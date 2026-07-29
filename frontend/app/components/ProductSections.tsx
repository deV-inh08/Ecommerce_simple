import { ProductCard, Product } from "./ProductCard";

const popularProducts: Product[] = [
  {
    id: "pop-1",
    name: "Mid Century Modern T-Shirt",
    category: "Men-Cloths",
    price: 110,
    rating: 5.0,
    reviewCount: 18,
    bgColor: "#f5f5f5",
    addedToWishlist: true,
  },
  {
    id: "pop-2",
    name: "Mid Century Modern T-Shirt",
    category: "Men-Cloths",
    price: 139,
    rating: 5.0,
    reviewCount: 24,
    bgColor: "#e8f4f0",
  },
  {
    id: "pop-3",
    name: "Corporate Office Shoes",
    category: "Men-Shoes",
    price: 399,
    rating: 5.0,
    reviewCount: 102,
    bgColor: "#f0f5f5",
  },
];

const newProducts: Product[] = [
  {
    id: "new-1",
    name: "Modern Black T-Shirt",
    category: "Men-Cloths",
    price: 59,
    rating: 5.0,
    reviewCount: 132,
    badge: "New Product",
    bgColor: "#f5e6c8",
  },
  {
    id: "new-2",
    name: "Modern Stylish Shoes",
    category: "Women-Shoes",
    price: 199,
    rating: 5.0,
    reviewCount: 89,
    badge: "New Product",
    bgColor: "#e8f4ff",
  },
  {
    id: "new-3",
    name: "Women Hand Bags",
    category: "Women-Fashion",
    price: 123,
    rating: 5.0,
    reviewCount: 39,
    badge: "New Product",
    bgColor: "#e8f0f4",
  },
];

const bestSellers: Product[] = [
  {
    id: "bs-1",
    name: "Modern Black T-Shirt",
    category: "Men-Cloths",
    price: 59,
    rating: 5.0,
    reviewCount: 132,
    badge: "Best Seller",
    bgColor: "#f0f0f0",
  },
  {
    id: "bs-2",
    name: "Modern Stylish Shoes",
    category: "Women-Shoes",
    price: 199,
    rating: 5.0,
    reviewCount: 89,
    badge: "Best Seller",
    bgColor: "#dce8ec",
  },
  {
    id: "bs-3",
    name: "Women Hand Bags",
    category: "Women-Fashion",
    price: 123,
    rating: 5.0,
    reviewCount: 39,
    badge: "Best Seller",
    bgColor: "#f5e6c8",
  },
];

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
  showWishlistToast?: boolean;
}

function ProductSection({
  id,
  title,
  subtitle,
  products,
  showWishlistToast,
}: ProductSectionProps) {
  return (
    <section id={id} className="py-16 bg-white">
      <div className="site-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">{subtitle}</p>
          </div>
          <a
            href="#"
            id={`${id}-browse-all`}
            className="px-5 py-2 text-sm font-semibold rounded transition-all hover:bg-[#0d5c5c] hover:text-white"
            style={{
              border: "1.5px solid #0d5c5c",
              color: "#0d5c5c",
            }}
          >
            Browse All
          </a>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "2px",
            background: "linear-gradient(90deg, #111 180px, #e5e7eb 180px)",
            marginBottom: "32px",
          }}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showWishlistToast={showWishlistToast && product.addedToWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductSections() {
  return (
    <>
      <ProductSection
        id="popular-products"
        title="Our popular products"
        subtitle="Browse our most popular products and make your day more beautiful and glorious."
        products={popularProducts}
        showWishlistToast={true}
      />

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#e5e7eb" }} className="site-container" />

      <ProductSection
        id="new-products"
        title="Our New Products"
        subtitle="Browse our new products and make your day more beautiful and glorious."
        products={newProducts}
      />

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#e5e7eb" }} className="site-container" />

      <ProductSection
        id="best-sellers"
        title="Meet our best sellers"
        subtitle="Browse our most popular products and make your day more beautiful and glorious."
        products={bestSellers}
      />
    </>
  );
}
