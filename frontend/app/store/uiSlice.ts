import type { StateCreator } from "zustand";

/* ─── Slice ──────────────────────────────────────────────── */
export interface UISlice {
  // Cart popup
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Auth modal
  authOpen: boolean;
  authMode: "login" | "signup";
  openAuth: (mode?: "login" | "signup") => void;
  closeAuth: () => void;
  // User
  currentUser: { name: string; email: string } | null;
  setCurrentUser: (user: { name: string; email: string } | null) => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),

  authOpen: false,
  authMode: "login",
  openAuth: (mode = "login") => set({ authOpen: true, authMode: mode }),
  closeAuth: () => set({ authOpen: false }),

  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
});
