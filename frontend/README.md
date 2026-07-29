# SimpleStore — Frontend

Ứng dụng e-commerce hiện đại xây dựng bằng **Next.js 16 (App Router)**, kết nối đến hệ thống microservices .NET qua kiến trúc **BFF (Backend For Frontend)**. Giao diện được thiết kế theo phong cách premium với dark accents, glass morphism, và micro-animations.

---

## Mục lục

1. [Kiến trúc tổng quan](#1-kiến-trúc-tổng-quan)
2. [Tech Stack](#2-tech-stack)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Tính năng](#4-tính-năng)
5. [Quản lý State — Zustand](#5-quản-lý-state--zustand)
6. [Data Fetching — React Query + BFF](#6-data-fetching--react-query--bff)
7. [Quản lý Form — React Hook Form](#7-quản-lý-form--react-hook-form)
8. [Các trang và Routes](#8-các-trang-và-routes)
9. [Cài đặt và chạy local](#9-cài-đặt-và-chạy-local)
10. [Biến môi trường](#10-biến-môi-trường)

---

## 1. Kiến trúc tổng quan

```
Browser (React)
    │  useQuery / useMutation
    ▼
Next.js Server (BFF — Route Handlers)     ← app/api/**
    │  gatewayFetch + JWT forwarding
    ▼
.NET API Gateway (port 5223)
    │  YARP + JWT validation
    ▼
Microservices (Identity / Catalog / Cart / Order / Inventory)
```

**Tại sao BFF?**
- Ẩn URL và port của backend khỏi browser
- Quản lý `refreshToken` trong `httpOnly cookie` — không thể bị XSS đọc
- Một điểm duy nhất để thêm middleware (logging, rate-limit, response transform)

---

## 2. Tech Stack

| Layer | Công nghệ | Phiên bản | Mục đích |
|---|---|---|---|
| Framework | **Next.js** (App Router) | 16.x | SSR, routing, API route handlers (BFF) |
| Language | **TypeScript** | 5.x | Type safety toàn bộ codebase |
| Styling | **Tailwind CSS** | 3.x | Utility-first, design token |
| Data Fetching | **TanStack React Query** | 5.x | Server state, caching, background refetch |
| State Management | **Zustand** | 5.x | Client-side global state (cart, wishlist, UI) |
| Form Management | **React Hook Form** | 7.x | Uncontrolled inputs, validation, ít re-render |
| Icons | **lucide-react** | latest | SVG icon set nhất quán |
| Font | **Inter** (Google Fonts via `next/font`) | — | Typography chính |

---

## 3. Cấu trúc thư mục

```
frontend/
├── app/
│   ├── api/                        # BFF — Next.js Route Handlers
│   │   ├── auth/me/                # GET profile (forward JWT → Identity.API)
│   │   ├── catalog/                # GET products, GET product/:id
│   │   ├── cart/                   # GET/DELETE cart, POST/PUT/DELETE items
│   │   ├── identity/               # POST login/register/refresh/logout
│   │   ├── inventory/items/        # GET inventory list, GET /:sku
│   │   └── orders/                 # GET list, POST checkout, GET /:id
│   │
│   ├── components/                 # Shared UI components
│   │   ├── AuthModal.tsx           # Modal đăng nhập / đăng ký
│   │   ├── AuthModalWrapper.tsx    # Client wrapper inject vào layout
│   │   ├── BlogPreviewSection.tsx  # Section bài blog trang chủ
│   │   ├── BrandsSection.tsx       # Carousel thương hiệu
│   │   ├── CartPopup.tsx           # Slide-in cart drawer
│   │   ├── CategorySection.tsx     # Grid danh mục
│   │   ├── Footer.tsx              # Footer toàn trang
│   │   ├── Header.tsx              # Navigation header + cart badge + auth
│   │   ├── HeroSection.tsx         # Hero slider 3 slides
│   │   ├── NewsletterSection.tsx   # Newsletter subscription form
│   │   ├── OffersSection.tsx       # Sale / offer banner
│   │   ├── ProductCard.tsx         # Card sản phẩm dùng chung
│   │   ├── ProductSections.tsx     # Popular / New / Best Sellers sections
│   │   ├── ServicesSection.tsx     # Dịch vụ nổi bật (ship, return, ...)
│   │   └── TickerBanner.tsx        # Scrolling promotional ticker
│   │
│   ├── hooks/                      # React Query hooks
│   │   ├── useCatalog.ts           # useProducts, useProduct
│   │   ├── useCart.ts              # useCart, useAddToCartApi, ...
│   │   ├── useIdentity.ts          # useLogin, useRegister, useLogout, useMe
│   │   ├── useInventory.ts         # useInventoryItems, useInventoryItem
│   │   └── useOrders.ts            # useOrders, useOrder (polling), useCheckout
│   │
│   ├── lib/                        # Utilities / infrastructure
│   │   ├── api-client.ts           # gatewayFetch (BFF→.NET) + apiFetch (client→BFF)
│   │   ├── query-client.ts         # Singleton QueryClient
│   │   ├── token-store.ts          # In-memory accessToken store
│   │   └── types.ts                # TypeScript DTOs (mirror .NET response shapes)
│   │
│   ├── providers/
│   │   └── QueryProvider.tsx       # QueryClientProvider + ReactQueryDevtools
│   │
│   ├── store/                      # Zustand store (slices pattern)
│   │   ├── cartSlice.ts            # Cart state + actions
│   │   ├── wishlistSlice.ts        # Wishlist state + actions
│   │   ├── uiSlice.ts              # Cart popup, auth modal, currentUser
│   │   └── useStoreZustand.ts      # Combined store với persist middleware
│   │
│   ├── about/page.tsx
│   ├── blog/page.tsx & [id]/
│   ├── cart/page.tsx
│   ├── category/[slug]/page.tsx
│   ├── checkout/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   ├── products/[id]/page.tsx
│   ├── wishlist/page.tsx
│   ├── layout.tsx                  # Root layout — QueryProvider + CartPopup + AuthModal
│   └── page.tsx                    # Trang chủ
│
└── public/
```

---

## 4. Tính năng

### 4.1 Trang chủ (`/`)
- **Hero Slider** — 3 slides tự chuyển, mỗi slide có màu nền riêng và CTA
- **Category Grid** — 6 danh mục sản phẩm dạng card
- **Product Sections** — 3 section: Popular / New Products / Best Sellers, data từ Catalog.API (skeleton loading khi fetch)
- **Ticker Banner** — Promotional text scrolling animation
- **Offers Section** — Sale banners với countdown/badge
- **Brands Carousel** — Logo các thương hiệu
- **Blog Preview** — 3 bài viết mới nhất
- **Newsletter** — Subscribe form (React Hook Form + email validation)

### 4.2 Danh mục sản phẩm (`/category/[slug]`)
- Filter nâng cao: **Category**, **Price Range**, **Rating** — kết hợp được
- Sort: Relevancy / Price Low-High / Price High-Low / Newest / Best Rating
- **Active filter chips** — xóa từng filter riêng lẻ hoặc Clear All
- Load More (pagination client-side)
- Mỗi sản phẩm có Add to Cart và Wishlist button

### 4.3 Chi tiết sản phẩm (`/products/[id]`)
- Fetch real data từ **Catalog.API** qua `useProduct(id)`
- Gallery 4 thumbnails với prev/next navigation
- Chọn màu sắc, kích cỡ, số lượng
- **Add to Cart** — hybrid logic:
  - Đã đăng nhập → gọi **Cart.API** (`useAddToCartApi`)
  - Chưa đăng nhập → lưu vào **Zustand local cart** (vẫn hoạt động offline)
- Related products từ cùng category (filter bỏ sản phẩm hiện tại)
- Tab: Description / Additional Information / Reviews

### 4.4 Giỏ hàng (`/cart`)
- Zustand local cart (không cần đăng nhập)
- Thêm/xóa item, cập nhật số lượng
- Voucher / discount code logic
- Tính toán: subtotal, savings, shipping (free ≥ $50), tax, total
- Cart Popup (`CartPopup.tsx`) — slide-in drawer, accessible từ mọi trang

### 4.5 Checkout (`/checkout`)
- **Billing form** — 11 fields (React Hook Form, validation: email, firstName, lastName, address required)
- **Card form** — 5 fields trong `CardForm` component riêng (validation tất cả required)
  - Format tự động: card number (XXXX XXXX XXXX XXXX), expiry (MM/YY), CVV
- **Place Order** → gọi `useCheckout()`:
  - POST đến Order.API → trigger **Checkout Saga** (.NET MassTransit)
  - Hiển thị **spinner polling** mỗi 3 giây (`useOrder` refetchInterval)
  - Saga có thể mất tới 30s để reserve stock
  - Kết quả: `Confirmed` (✅ success screen) hoặc `Cancelled` (❌ với lý do)

### 4.6 Xác thực (`AuthModal`)
- Modal overlay với **tab Login / Sign Up** (switch không reload)
- **Login**: email + password → POST Identity.API → lưu `accessToken` in-memory + `refreshToken` httpOnly cookie
- **Sign Up**: email + name + password + confirm → tự tách firstName/lastName
- Social login buttons (UI placeholder: Facebook, Google, Apple)
- Password show/hide toggle
- Remember me checkbox
- Inline API error từ backend (hiển thị đúng message từ .NET)

### 4.7 Wishlist (`/wishlist`)
- Lưu Zustand + persist localStorage
- Move to Cart button
- Xóa từng item

### 4.8 Trang tĩnh
- `/about` — Giới thiệu thương hiệu
- `/blog` — Danh sách bài viết + `/blog/[id]` — Chi tiết
- `/contact` — Contact form + map placeholder
- `/faq` — Accordion FAQ

---

## 5. Quản lý State — Zustand

Store được tách thành **3 slices** kết hợp qua `create()` với `persist` middleware:

```
useStoreZustand.ts
├── cartSlice.ts       → cartItems, cartCount, cartTotal
│                         addToCart, removeFromCart, updateQty, clearCart
├── wishlistSlice.ts   → wishlist, wishlistCount
│                         isWishlisted, toggleWishlist, removeFromWishlist, moveToCart
└── uiSlice.ts         → cartOpen, authOpen, authMode, currentUser
                          openCart, closeCart, openAuth, closeAuth, setCurrentUser
```

**Persist strategy**: Chỉ persist `cartItems`, `cartTotal`, `cartCount`, `wishlist`, `wishlistCount` vào localStorage key `pursuit_store`. UI state (modal open/close) **không** persist.

```ts
// Dùng trong bất kỳ client component nào — không cần Provider
import { useStore } from "@/store/useStoreZustand";

const cartCount = useStore((s) => s.cartCount);
const addToCart = useStore((s) => s.addToCart);
```

---

## 6. Data Fetching — React Query + BFF

### Luồng request

```
Client Component
  │  apiFetch("/api/catalog")           ← Next.js BFF route
  ▼
app/api/catalog/route.ts               ← Route Handler (server)
  │  gatewayFetch("/api/v1/catalog/products")
  ▼
.NET Gateway :5223                     ← YARP proxy
  ▼
Catalog.API :5003                      ← MongoDB + Redis cache-aside
```

### Hooks và staleTime

| Hook | Endpoint | staleTime | Ghi chú |
|---|---|---|---|
| `useProducts(category?)` | `GET /api/catalog` | 5 phút | Catalog ít thay đổi |
| `useProduct(id)` | `GET /api/catalog/:id` | 5 phút | Redis cache-aside ở backend |
| `useCart()` | `GET /api/cart` | 30 giây | Enabled khi có token |
| `useOrders()` | `GET /api/orders` | 30 giây | Enabled khi có token |
| `useOrder(id)` | `GET /api/orders/:id` | 0 | Poll 3s khi `Pending` |
| `useInventoryItems()` | `GET /api/inventory/items` | 30 giây | CQRS read model |
| `useInventoryItem(sku)` | `GET /api/inventory/items/:sku` | 30 giây | — |
| `useMe()` | `GET /api/auth/me` | 5 phút | Enabled khi có token |

### Mutations và invalidation

| Mutation | Endpoint | onSuccess |
|---|---|---|
| `useLogin()` | `POST /api/identity?action=login` | setToken + setCurrentUser + seed `['me']` cache |
| `useRegister()` | `POST /api/identity?action=register` | setToken + setCurrentUser |
| `useLogout()` | `POST /api/identity?action=logout` | clearToken + xóa `['me']`, `['cart']`, `['orders']` |
| `useAddToCartApi()` | `POST /api/cart/items` | invalidate `['cart']` |
| `useUpdateCartItem()` | `PUT /api/cart/items/:id` | invalidate `['cart']` |
| `useRemoveCartItem()` | `DELETE /api/cart/items/:id` | invalidate `['cart']` |
| `useClearCart()` | `DELETE /api/cart` | invalidate `['cart']` |
| `useCheckout()` | `POST /api/orders` | seed `['orders', id]` + invalidate `['cart']`, `['orders']` |

### Auth token strategy

```
Login response
  ├── accessToken  → in-memory (token-store.ts) — volatile on refresh
  └── refreshToken → httpOnly cookie (BFF set-cookie) — survives refresh, không XSS được
```

`accessToken` được đính vào mọi request authenticated qua header `Authorization: Bearer <token>`. Khi hết hạn (15 phút), gọi `useRefreshToken()` để lấy token mới từ cookie.

---

## 7. Quản lý Form — React Hook Form

Tất cả form dùng `useForm<T>()` với uncontrolled inputs (`register()`), tránh re-render mỗi keystroke.

| Form | File | Fields | Validation |
|---|---|---|---|
| **Contact** | `contact/page.tsx` | firstName, email, phone, message | firstName required, email pattern, message required |
| **Checkout Billing** | `checkout/page.tsx` | email, deliverTo, country, firstName, lastName, address, city, state, zip, phone, note | email pattern, firstName/lastName/address required |
| **Checkout Card** | `checkout/page.tsx` (`CardForm`) | cardNum, expiry, cvv, firstName, lastName, remember | tất cả required; auto-format card/expiry |
| **Auth Modal** | `components/AuthModal.tsx` | email, name, password, confirm, remember | email pattern, password min 6, confirm match (cross-field), name required khi signup |
| **Newsletter** | `components/NewsletterSection.tsx` | email | email pattern required |

**Error display**: Mỗi field hiển thị inline error ngay bên dưới input. API error hiển thị ở alert box riêng phía trên submit button.

---

## 8. Các trang và Routes

| Route | Type | Mô tả |
|---|---|---|
| `/` | Static | Trang chủ |
| `/category/[slug]` | Dynamic | Danh sách sản phẩm theo danh mục |
| `/products/[id]` | Dynamic | Chi tiết sản phẩm |
| `/cart` | Static | Giỏ hàng |
| `/checkout` | Static | Thanh toán |
| `/wishlist` | Static | Danh sách yêu thích |
| `/contact` | Static | Liên hệ |
| `/about` | Static | Giới thiệu |
| `/faq` | Static | Câu hỏi thường gặp |
| `/blog` | Static | Danh sách blog |
| `/blog/[id]` | Dynamic | Chi tiết bài viết |
| **`/api/identity`** | BFF Route | `POST ?action=login\|register\|refresh\|logout` |
| **`/api/auth/me`** | BFF Route | `GET` profile |
| **`/api/catalog`** | BFF Route | `GET ?category=` |
| **`/api/catalog/[id]`** | BFF Route | `GET` detail |
| **`/api/cart`** | BFF Route | `GET`, `DELETE` (clear) |
| **`/api/cart/items`** | BFF Route | `POST` add item |
| **`/api/cart/items/[productId]`** | BFF Route | `PUT` qty, `DELETE` remove |
| **`/api/orders`** | BFF Route | `GET` list, `POST` checkout |
| **`/api/orders/[id]`** | BFF Route | `GET` detail + status |
| **`/api/inventory/items`** | BFF Route | `GET` list |
| **`/api/inventory/items/[sku]`** | BFF Route | `GET` by SKU |

---

## 9. Cài đặt và chạy local

### Yêu cầu
- Node.js ≥ 20
- Backend microservices đang chạy (xem README backend)

### Cài dependencies

```bash
npm install
```

### Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Build production

```bash
npm run build
npm start
```

---

## 10. Biến môi trường

Tạo file `.env.local` tại thư mục `frontend/`:

```env
# URL của .NET API Gateway — BFF dùng để forward request server-side
# Mặc định: http://localhost:5223 (không cần set nếu chạy local với port mặc định)
GATEWAY_URL=http://localhost:5223
```

> **Lưu ý**: Biến `GATEWAY_URL` chỉ dùng ở **server-side** (BFF Route Handlers), không expose ra browser. Client-side code luôn gọi `/api/...` (Next.js routes nội bộ).

---

## Tài khoản test

| Email | Password | Role |
|---|---|---|
| test@test.com | Test123! | Admin |

*(Tài khoản được tạo trực tiếp trong database IdentityDb của backend)*
