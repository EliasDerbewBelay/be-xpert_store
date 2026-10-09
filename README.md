# E-Commerce Capstone Project — Next.js + EscuelaJS API

A clean, production-quality, responsive e-commerce web application built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **next-themes**, powered by the real **EscuelaJS API**.

---

## 1. Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router architecture)
- **Language**: [TypeScript](https://www.typescriptlang.org) (strict types, no `any`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (mobile-first, restrained clean design)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) primitives (Buttons, Inputs, Cards, Sheets, Dropdowns, Skeletons, Badges)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) (Light mode, Dark mode, System preference)
- **Icons**: [Lucide React](https://lucide.dev)
- **Backend API**: [EscuelaJS REST API](https://api.escuelajs.co/api/v1)

---

## 2. Project Architecture

```text
src/
├── app/
│   ├── page.tsx                     # Home Page (curated hero, categories, featured items)
│   ├── layout.tsx                   # Root Layout with Theme, Auth, Cart, and Toast providers
│   ├── loading.tsx                  # Global Suspense skeleton loading state
│   ├── error.tsx                    # Global error boundary with retry
│   ├── not-found.tsx                # 404 Page Not Found with redirect
│   ├── products/
│   │   ├── page.tsx                 # Product catalog (search, filter, sort, pagination)
│   │   └── [id]/
│   │       ├── page.tsx             # Product details & related items
│   │       └── not-found.tsx        # Product-specific 404 page
│   ├── categories/
│   │   ├── page.tsx                 # Categories overview
│   │   └── [slug]/
│   │       └── page.tsx             # Category details & filtered products
│   ├── cart/
│   │   └── page.tsx                 # Shopping cart with persistence
│   ├── checkout/
│   │   ├── page.tsx                 # Checkout form & order summary
│   │   └── success/
│   │       └── page.tsx             # Simulated order confirmation
│   ├── login/
│   │   └── page.tsx                 # Authentication login
│   ├── register/
│   │   └── page.tsx                 # User registration
│   └── profile/
│       └── page.tsx                 # Authenticated user profile
│
├── components/
│   ├── layout/                      # Header, MobileMenu (Sheet drawer), Footer
│   ├── products/                    # ProductCard, ProductGrid, ProductFilters, ProductSort, ProductSearch, Gallery, Actions
│   ├── categories/                  # CategoryCard, CategorySkeleton
│   ├── cart/                        # CartItemRow, CartSummary, CartEmpty
│   ├── auth/                        # LoginForm, RegisterForm, AuthGuard
│   ├── checkout/                    # CheckoutClient, CheckoutSuccessClient
│   ├── profile/                     # ProfileClient
│   ├── theme/                       # ThemeProvider, ThemeToggle
│   └── ui/                          # shadcn primitives (button, input, card, sheet, select, etc.)
│
├── lib/
│   ├── api/                         # client.ts, products.ts, categories.ts, users.ts, auth.ts
│   ├── auth/                        # auth-context.tsx, tokens.ts
│   ├── cart/                        # cart-context.tsx
│   ├── toast/                       # toast-context.tsx
│   └── utils.ts                     # cn(), formatPrice(), sanitizeImageUrl(), sanitizeImageUrls()
│
└── types/
    └── index.ts                     # TypeScript interfaces (Product, Category, User, CartItem, etc.)
```

---

## 3. Implemented Routes

| Route | Description |
|---|---|
| `/` | Homepage with hero, popular categories, and featured products |
| `/products` | Catalog with search, category filtering, price filtering, sorting, and pagination |
| `/products/[id]` | Product details with gallery, quantity selector, add-to-cart, and related products |
| `/categories` | Complete categories list |
| `/categories/[slug]` | Category details and products belonging to that category |
| `/cart` | Interactive shopping cart (quantity controls, remove item, subtotal, clear cart) |
| `/checkout` | Simulated checkout form (validation, address details, order summary) |
| `/checkout/success` | Order confirmation screen with order reference number |
| `/login` | User login (stores JWT tokens, includes demo account helper) |
| `/register` | User registration (name, email, password, confirm password) |
| `/profile` | Authenticated profile (protected route with `AuthGuard`) |
| `/admin` | Professional Admin Dashboard (protected by `AdminGuard`, live product CRUD, stats, filters) |

---

## 4. API Endpoints Used

- **Products**:
  - `GET /products` (supports `limit`, `offset`, `title`, `categoryId`, `price_min`, `price_max`)
  - `GET /products/{id}`
  - `GET /products/{id}/related`
- **Categories**:
  - `GET /categories`
  - `GET /categories/{id}`
  - `GET /categories/slug/{slug}`
  - `GET /categories/{id}/products`
- **Authentication & Users**:
  - `POST /auth/login`
  - `GET /auth/profile`
  - `POST /auth/refresh-token`
  - `POST /users`
  - `POST /users/is-available`

---

## 5. Key Architectural Decisions

1. **Service Layer Abstraction (`src/lib/api/`)**: Components never make raw `fetch` calls. All requests route through a centralized API service layer with clean typing and unified error handling.
2. **Resilient Remote Image Handling**: EscuelaJS is a public sandbox where user-uploaded image URLs can be invalid, malformed, or broken. The `ProductImage` component sanitizes bracketed/escaped URLs and seamlessly falls back to a clean SVG placeholder without breaking layout.
3. **Cart State & Local Persistence**: Managed by `CartProvider` using `localStorage` under `escuela_cart_items_v1`. Adding duplicate items increments quantity; line items can be adjusted or removed, and subtotal is dynamically computed.
4. **Token Management & Graceful Refresh**: Access and refresh tokens are stored in `localStorage`. If an access token expires when accessing `/auth/profile`, the system automatically attempts token refresh before falling back to logout.
5. **Route Protection (`AuthGuard`)**: `/profile` verifies the user session and gracefully redirects unauthenticated visitors to `/login?redirect=/profile`.

---

## 6. How to Run Locally

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm, pnpm, or yarn

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local` (already created in workspace):
```env
NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 7. Testing Accounts

You can test authentication by:
- Creating a new account on `/register`.
- Or using the pre-seeded EscuelaJS demo user:
  - **Email**: `john@mail.com`
  - **Password**: `changeme`
