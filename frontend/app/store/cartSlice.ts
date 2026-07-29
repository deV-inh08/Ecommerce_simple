import type { StateCreator } from "zustand";

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
  cartItemId: string;
}

/* ─── Slice ──────────────────────────────────────────────── */
export interface CartSlice {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: StoreProduct) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
}

/** Recompute derived cart values */
function computeDerived(items: CartItem[]) {
  return {
    cartCount: items.reduce((sum, i) => sum + i.qty, 0),
    cartTotal: items.reduce((sum, i) => sum + i.price * i.qty, 0),
  };
}

export const createCartSlice: StateCreator<CartSlice, [], [], CartSlice> = (set) => ({
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,

  addToCart: (product) =>
    set((state) => {
      const existing = state.cartItems.find((i) => i.id === product.id);
      const cartItems = existing
        ? state.cartItems.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [
            ...state.cartItems,
            { ...product, qty: 1, cartItemId: `${product.id}-${Date.now()}` },
          ];
      return { cartItems, ...computeDerived(cartItems) };
    }),

  removeFromCart: (cartItemId) =>
    set((state) => {
      const cartItems = state.cartItems.filter(
        (i) => i.cartItemId !== cartItemId
      );
      return { cartItems, ...computeDerived(cartItems) };
    }),

  updateQty: (cartItemId, qty) =>
    set((state) => {
      if (qty < 1) return state;
      const cartItems = state.cartItems.map((i) =>
        i.cartItemId === cartItemId ? { ...i, qty } : i
      );
      return { cartItems, ...computeDerived(cartItems) };
    }),

  clearCart: () => set({ cartItems: [], cartCount: 0, cartTotal: 0 }),
});
