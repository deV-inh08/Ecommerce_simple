"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/* ─── Types ──────────────────────────────────────────────── */
export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  bgColor?: string;
}

export interface CartItem extends StoreProduct {
  qty: number;
  cartItemId: string; // unique per cart entry
}

/* ─── Context ────────────────────────────────────────────── */
interface StoreCtx {
  // Cart
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: StoreProduct) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  // Wishlist
  wishlist: StoreProduct[];
  wishlistCount: number;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: StoreProduct) => void;
  removeFromWishlist: (id: string) => void;
  moveToCart: (id: string) => void;
  // Cart popup
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Auth
  authOpen: boolean;
  authMode: "login" | "signup";
  openAuth: (mode?: "login" | "signup") => void;
  closeAuth: () => void;
  currentUser: { name: string; email: string } | null;
  setCurrentUser: (user: { name: string; email: string } | null) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);

/* ─── Provider ───────────────────────────────────────────── */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist]   = useState<StoreProduct[]>([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [authOpen, setAuthOpen]   = useState(false);
  const [authMode, setAuthMode]   = useState<"login" | "signup">("login");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Persist to localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("pursuit_cart");
    const savedWish = localStorage.getItem("pursuit_wish");
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedWish) setWishlist(JSON.parse(savedWish));
  }, []);

  useEffect(() => {
    localStorage.setItem("pursuit_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("pursuit_wish", JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const addToCart = useCallback((product: StoreProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1, cartItemId: `${product.id}-${Date.now()}` }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  }, []);

  const updateQty = useCallback((cartItemId: string, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) => prev.map((i) => i.cartItemId === cartItemId ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  // Wishlist
  const wishlistCount = wishlist.length;
  const isWishlisted  = useCallback((id: string) => wishlist.some((w) => w.id === id), [wishlist]);

  const toggleWishlist = useCallback((product: StoreProduct) => {
    setWishlist((prev) =>
      prev.some((w) => w.id === product.id)
        ? prev.filter((w) => w.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const moveToCart = useCallback((id: string) => {
    const item = wishlist.find((w) => w.id === id);
    if (item) {
      addToCart(item);
      removeFromWishlist(id);
    }
  }, [wishlist, addToCart, removeFromWishlist]);

  const openAuth = useCallback((mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  return (
    <StoreContext.Provider value={{
      cartItems, cartCount, cartTotal,
      addToCart, removeFromCart, updateQty, clearCart,
      wishlist, wishlistCount, isWishlisted, toggleWishlist, removeFromWishlist, moveToCart,
      cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
      authOpen, authMode, openAuth, closeAuth: () => setAuthOpen(false),
      currentUser, setCurrentUser,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────── */
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
