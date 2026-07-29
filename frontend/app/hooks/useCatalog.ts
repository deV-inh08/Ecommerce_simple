"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api-client";
import type { CatalogProduct } from "../lib/types";

/* ── Query keys ─────────────────────────────────────────── */
export const catalogKeys = {
  all: ["products"] as const,
  list: (category?: string) => ["products", { category }] as const,
  detail: (id: string) => ["product", id] as const,
};

/* ── useProducts ─────────────────────────────────────────── */
/**
 * Fetches product list from BFF /api/catalog.
 * Optionally filters by category (forwarded to Catalog.API as ?category=).
 */
export function useProducts(category?: string) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  return useQuery<CatalogProduct[]>({
    queryKey: catalogKeys.list(category),
    queryFn: () => apiFetch<CatalogProduct[]>(`/api/catalog${qs}`),
    staleTime: 5 * 60 * 1000, // Catalog changes rarely — 5 min cache
  });
}

/* ── useProduct ─────────────────────────────────────────── */
/**
 * Fetches a single product by id.
 * .NET uses cache-aside (Redis) so repeated calls are cheap.
 */
export function useProduct(id: string) {
  return useQuery<CatalogProduct>({
    queryKey: catalogKeys.detail(id),
    queryFn: () => apiFetch<CatalogProduct>(`/api/catalog/${id}`),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}
