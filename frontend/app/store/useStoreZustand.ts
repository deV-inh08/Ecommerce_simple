import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createCartSlice, type CartSlice } from "./cartSlice";
import { createWishlistSlice, type WishlistSlice } from "./wishlistSlice";
import { createUISlice, type UISlice } from "./uiSlice";

/* Re-export types for consumers */
export type { StoreProduct, CartItem } from "./cartSlice";

/* ─── Combined Store ─────────────────────────────────────── */
type StoreState = CartSlice & WishlistSlice & UISlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createCartSlice(...a),
      ...createWishlistSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: "pursuit_store",
      /** Only persist data slices, not transient UI state */
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartCount: state.cartCount,
        cartTotal: state.cartTotal,
        wishlist: state.wishlist,
        wishlistCount: state.wishlistCount,
      }),
    }
  )
);
