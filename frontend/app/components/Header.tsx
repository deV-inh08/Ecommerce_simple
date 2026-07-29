"use client";
import { useState } from "react";
import { Search, User, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useStore } from "../context/StoreContext";

const navLinks = [
  { label: "Category", href: "/category/all", hasDropdown: true },
  { label: "Brand", href: "#", hasDropdown: true },
  { label: "Trending", href: "/category/all", hasDropdown: false },
  { label: "Shop", href: "/category/all", hasDropdown: false },
  { label: "About", href: "/about", hasDropdown: false },
  { label: "Blog", href: "/blog", hasDropdown: false },
  { label: "Contact", href: "/contact", hasDropdown: false },
  { label: "FAQ", href: "/faq", hasDropdown: false },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, wishlistCount, openCart, openAuth, currentUser, setCurrentUser } = useStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Bar */}
      <div style={{ backgroundColor: "#0d5c5c" }} className="py-3">
        <div className="site-container flex items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-bold text-xl mr-6 flex-shrink-0"
          >
            Pursuit
          </Link>

          {/* Search Bar */}
          <div className="flex flex-1 max-w-2xl">
            <input
              type="text"
              id="header-search"
              placeholder="Search for anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white border-none outline-none rounded-l"
            />
            <button
              id="search-btn"
              style={{ backgroundColor: "#f5c518" }}
              className="px-4 py-2 rounded-r flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Search size={18} className="text-gray-800" />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5 ml-auto flex-shrink-0">
            {/* User */}
            <div className="relative">
              {currentUser ? (
                <>
                  <button
                    id="account-btn"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: "#f5c518", color: "#111" }}
                    >
                      {currentUser.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{currentUser.name.split(" ")[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div
                      className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden z-50"
                      style={{ width: "180px", backgroundColor: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.15)", border: "1px solid #f0f0f0" }}
                    >
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid #f5f5f5" }}>
                        <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                        <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                      </div>
                      {[["My Orders", "/orders"], ["My Profile", "/profile"], ["Settings", "/settings"]].map(([label, href]) => (
                        <a key={label} href={href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">{label}</a>
                      ))}
                      <button
                        onClick={() => { setCurrentUser(null); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-red-50"
                        style={{ color: "#dc2626", borderTop: "1px solid #f5f5f5" }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  id="account-btn"
                  onClick={() => openAuth("login")}
                  className="text-white hover:opacity-80 transition-opacity"
                  title="Sign In"
                >
                  <User size={20} />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              id="wishlist-btn"
              className="relative text-white hover:opacity-80 transition-opacity"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  style={{ backgroundColor: "#f5c518" }}
                  className="absolute -top-2 -right-2 text-xs text-gray-900 font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              id="cart-btn"
              onClick={openCart}
              className="relative text-white hover:opacity-80 transition-opacity"
              title="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  style={{ backgroundColor: "#f5c518" }}
                  className="absolute -top-2 -right-2 text-xs text-gray-900 font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav
        style={{ backgroundColor: "#083d3d", borderTop: "1px solid rgba(255,255,255,0.1)" }}
        className="py-2"
      >
        <div className="site-container flex items-center justify-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              id={`nav-${link.label.toLowerCase()}`}
              className="flex items-center gap-1 text-white text-sm font-medium hover:opacity-80 transition-opacity py-1 whitespace-nowrap"
            >
              {link.label}
              {link.hasDropdown && <ChevronDown size={13} />}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
