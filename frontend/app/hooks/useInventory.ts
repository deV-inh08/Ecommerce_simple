"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api-client";
import type { InventoryItem } from "../lib/types";

/* ── Query keys ─────────────────────────────────────────── */
export const inventoryKeys = {
  all: ["inventory"] as const,
  detail: (sku: string) => ["inventory", sku] as const,
};

/* ── useInventoryItems ───────────────────────────────────── */
/** Public endpoint — reads from MongoDB CQRS read model */
export function useInventoryItems() {
  return useQuery<InventoryItem[]>({
    queryKey: inventoryKeys.all,
    queryFn: () => apiFetch<InventoryItem[]>("/api/inventory/items"),
    staleTime: 30 * 1000, // 30s — stock changes frequently
  });
}

/* ── useInventoryItem ────────────────────────────────────── */
/** Public endpoint — single SKU stock detail */
export function useInventoryItem(sku: string) {
  return useQuery<InventoryItem>({
    queryKey: inventoryKeys.detail(sku),
    queryFn: () => apiFetch<InventoryItem>(`/api/inventory/items/${sku}`),
    staleTime: 30 * 1000,
    enabled: !!sku,
  });
}
