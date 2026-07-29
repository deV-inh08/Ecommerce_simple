"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api-client";
import { getToken } from "../lib/token-store";
import type { Order } from "../lib/types";

/* ── Query keys ─────────────────────────────────────────── */
export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: string) => ["orders", id] as const,
};

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ── useOrders ───────────────────────────────────────────── */
export function useOrders() {
  return useQuery<Order[]>({
    queryKey: orderKeys.all,
    queryFn: () => apiFetch<Order[]>("/api/orders", { headers: authHeaders() }),
    enabled: !!getToken(),
    staleTime: 30 * 1000,
  });
}

/* ── useOrder ────────────────────────────────────────────── */
/**
 * Poll a single order until it reaches a terminal state.
 * The Checkout Saga can take up to 30s to confirm/cancel an order,
 * so we refetch every 3s while status is "Pending".
 */
export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: orderKeys.detail(id),
    queryFn: () =>
      apiFetch<Order>(`/api/orders/${id}`, { headers: authHeaders() }),
    enabled: !!id && !!getToken(),
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Keep polling while Pending; stop when Confirmed or Cancelled
      return status === "Pending" ? 3000 : false;
    },
  });
}

/* ── useCheckout ─────────────────────────────────────────── */
/**
 * Triggers the Checkout Saga:
 * POST /api/orders → Order.API creates order + publishes OrderSubmittedEvent
 * Returns the created order (status: Pending initially)
 */
export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, void>({
    mutationFn: () =>
      apiFetch<Order>("/api/orders", {
        method: "POST",
        headers: authHeaders(),
      }),
    onSuccess: (order) => {
      // Seed the detail cache immediately
      queryClient.setQueryData(orderKeys.detail(order.id), order);
      // Invalidate list and cart (cart cleared by Order.API)
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
