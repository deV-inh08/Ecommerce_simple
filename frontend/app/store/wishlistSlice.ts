import type { StateCreator } from "zustand";
import type { StoreProduct } from "./cartSlice";
import type { CartSlice } from "./cartSlice";

/* ─── Slice ──────────────────────────────────────────────── */
export interface WishlistSlice {
  wishlist: StoreProduct[];
  wishlistCount: number;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: StoreProduct) => void;
  removeFromWishlist: (id: string) => void;
  moveToCart: (id: string) => void;
}

export const createWishlistSlice: StateCreator<
  WishlistSlice & CartSlice,
  [],
  [],
  WishlistSlice
> = (set, get) => ({
  wishlist: [],
  wishlistCount: 0,

  isWishlisted: (id) => get().wishlist.some((w) => w.id === id),

  toggleWishlist: (product) =>
    set((state) => {
      const exists = state.wishlist.some((w) => w.id === product.id);
      const wishlist = exists
        ? state.wishlist.filter((w) => w.id !== product.id)
        : [...state.wishlist, product];
      return { wishlist, wishlistCount: wishlist.length };
    }),

  removeFromWishlist: (id) =>
    set((state) => {
      const wishlist = state.wishlist.filter((w) => w.id !== id);
      return { wishlist, wishlistCount: wishlist.length };
    }),

  moveToCart: (id) => {
    const { wishlist, addToCart, removeFromWishlist } = get();
    const item = wishlist.find((w) => w.id === id);
    if (item) {
      addToCart(item);
      removeFromWishlist(id);
    }
  },
});
