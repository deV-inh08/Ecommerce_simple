/**
 * Shared type definitions for API responses from the .NET backend.
 * Mirror the backend DTOs as closely as needed for the frontend.
 */

/* ── Identity ────────────────────────────────────────────── */
export interface AuthResponse {
  accessToken: string;
  expiresIn: number; // seconds
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: "Customer" | "Admin";
}

/* ── Catalog ─────────────────────────────────────────────── */
export interface CatalogProduct {
  id: string;          // MongoDB ObjectId
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  sku: string;         // must be carried separately from id
  imageUrl?: string;
  isActive: boolean;
}

/* ── Cart ────────────────────────────────────────────────── */
export interface CartItemDto {
  productId: string;
  sku: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface CartDto {
  userId: string;
  items: CartItemDto[];
}

export interface AddToCartBody {
  productId: string;
  sku: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

/* ── Order ───────────────────────────────────────────────── */
export type OrderStatus = "Pending" | "Confirmed" | "Cancelled";

export interface OrderItem {
  productId: string;
  sku: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  cancelledReason?: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

/* ── Inventory ───────────────────────────────────────────── */
export interface InventoryItem {
  sku: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
}
