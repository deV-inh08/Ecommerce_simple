"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api-client";
import { getToken } from "../lib/token-store";
import type { CartDto, AddToCartBody } from "../lib/types";

/* ── Query keys ─────────────────────────────────────────── */
export const cartKeys = {
  cart: ["cart"] as const,
};

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ── useCart ─────────────────────────────────────────────── */
/** Fetch server-side cart — only enabled when user is logged in */
export function useCart() {
  return useQuery<CartDto>({
    queryKey: cartKeys.cart,
    queryFn: () =>
      apiFetch<CartDto>("/api/cart", { headers: authHeaders() }),
    enabled: !!getToken(),
    staleTime: 30 * 1000, // 30s — cart changes frequently
  });
}

/* ── useAddToCartApi ─────────────────────────────────────── */
export function useAddToCartApi() {
  const queryClient = useQueryClient();
  return useMutation<CartDto, Error, AddToCartBody>({
    mutationFn: (body) =>
      apiFetch<CartDto>("/api/cart/items", {
        method: "POST",
        body: JSON.stringify(body),
        headers: authHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
  });
}

/* ── useUpdateCartItem ───────────────────────────────────── */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation<CartDto, Error, { productId: string; quantity: number }>({
    mutationFn: ({ productId, quantity }) =>
      apiFetch<CartDto>(`/api/cart/items/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
        headers: authHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
  });
}

/* ── useRemoveCartItem ───────────────────────────────────── */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (productId) =>
      apiFetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
  });
}

/* ── useClearCart ────────────────────────────────────────── */
export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () =>
      apiFetch("/api/cart", {
        method: "DELETE",
        headers: authHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
  });
}
