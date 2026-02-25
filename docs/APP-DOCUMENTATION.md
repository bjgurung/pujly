# Pujly (PujariSewa) — Complete App Documentation

A cross-platform mobile application for booking Hindu religious services (pujas, ceremonies), connecting users with verified Pandits, and purchasing puja-related products. Built with React Native (Expo) and a serverless backend.

---

## Table of Contents

1. [App Overview](#app-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Database Schema](#database-schema)
8. [API Routes (tRPC)](#api-routes-trpc)
9. [State Management](#state-management)
10. [Authentication Flow](#authentication-flow)
11. [Payment Flow](#payment-flow)
12. [Deployment](#deployment)
13. [End-to-End Workflow](#end-to-end-workflow)
14. [Development Guide](#development-guide)

---

## App Overview

**Pujly** is a marketplace that connects devotees with Pandits (Hindu priests) for religious ceremonies and services. It also features an e-commerce store for puja essentials. The app supports three user roles: **User**, **Pandit**, and **Admin**.

- **Users** can browse services, book pandits, shop for products, chat, and manage orders.
- **Pandits** can onboard, manage their portfolio/services, view earnings, and handle bookings.
- **Admins** can oversee the platform via an admin panel.

---

## Features

### For Users (Devotees)
- **Home Feed** — Discover services, featured pandits, panchang (daily Hindu calendar), occasions, and categories
- **Service Browsing** — Browse puja services by category (Home Ceremonies, Wedding, Child Ceremonies, Vastu, Astrology, Festival Pujas)
- **Pandit Profiles** — View detailed pandit profiles with ratings, reviews, experience, languages, and specializations
- **Service Booking** — Book a pandit for a specific date, time, and location with Stripe-powered payments
- **Product Store** — Shop for puja kits, ritual items, festival essentials, digital items, subscriptions, and spiritual gifts
- **Shopping Cart** — Add/remove products, adjust quantities, persistent cart across sessions
- **Checkout & Payments** — Stripe Checkout Sessions for secure payments (products and bookings)
- **Order Tracking** — View order history, statuses (pending, processing, shipped, delivered, cancelled)
- **Wishlist** — Save favorite products for later
- **Chat/Messaging** — In-app messaging with pandits
- **Search** — Global search across services, pandits, and products
- **Notifications** — In-app notification center
- **Address Management** — Save and manage multiple delivery addresses
- **Profile Management** — Edit personal info, payment methods, privacy settings

### For Pandits (Priests)
- **Pandit Onboarding** — Multi-step registration with specialization, languages, and bio
- **Service Management** — Add, edit, and manage offered services
- **Schedule Management** — View and manage booking schedule
- **Earnings Dashboard** — Track earnings and payment history
- **Profile Management** — Manage pandit-specific profile and portfolio

### For Admins
- **Admin Panel** — Platform oversight and management dashboard

### General
- **Google Sign-In** — OAuth2 authentication via Google
- **Email/Password Auth** — Traditional email registration and login
- **Guest Browsing** — Browse the app without logging in; login prompted only when needed
- **Error Boundaries** — Graceful error handling with retry options
- **Cross-Platform** — Runs on iOS, Android, and Web (React Native Web)
- **Persistent State** — Cart, auth, bookings, and orders persist across app restarts via AsyncStorage
- **Haptic Feedback** — Native haptic feedback on interactions

---

## Architecture

```
+-------------------+       +--------------------+       +------------------+
|   Mobile App      |       |   Backend (Hono)   |       |   Supabase       |
|   (Expo/RN)       | <---> |   + tRPC Router    | <---> |   (PostgreSQL)   |
|                   |       |                    |       |   + Auth         |
|   - React Native  |       |   Routes:          |       |   + RLS Policies |
|   - Expo Router   |       |   - auth           |       |                  |
|   - Zustand       |       |   - payments       |       +------------------+
|   - React Query   |       |   - data           |
|   - tRPC Client   |       |                    |       +------------------+
+-------------------+       |   Deployed on      |       |   Stripe         |
                            |   Vercel           |       |   (Payments)     |
                            +--------------------+       +------------------+
```

### Data Flow
1. **Client** sends requests via tRPC client (HTTP + SuperJSON serialization)
2. **Backend** (Hono + tRPC) processes requests, validates with Zod schemas
3. **Supabase** handles data storage (PostgreSQL) and user authentication
4. **Stripe** handles payment processing via Checkout Sessions
5. **Client** receives typed responses and updates local state (Zustand stores)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React Native 0.81** | Cross-platform mobile UI framework |
| **Expo SDK 54** | Managed workflow, build tooling, native APIs |
| **Expo Router v6** | File-based routing (similar to Next.js Pages) |
| **TypeScript 5.9** | Type safety with strict mode enabled |
| **Zustand 5** | Client-side state management with persistence |
| **React Query (TanStack) 5** | Server state management and caching |
| **tRPC Client 11** | End-to-end typesafe API client |
| **Lucide React Native** | Icon library |
| **React Native Web** | Web platform support |
| **Expo Image** | Optimized image component |
| **Expo Haptics** | Native haptic feedback |
| **Expo Auth Session** | OAuth authentication flows |
| **Expo Web Browser** | In-app browser for payment redirects |
| **React Native Gesture Handler** | Gesture handling |
| **React Native Safe Area Context** | Safe area insets management |
| **React Native Screens** | Native navigation screens |
| **React Native SVG** | SVG rendering |
| **AsyncStorage** | Persistent local storage |
| **SuperJSON** | JSON serialization (dates, BigInt, etc.) |

### Backend
| Technology | Purpose |
|---|---|
| **Hono** | Lightweight web framework (serverless-optimized) |
| **tRPC Server 11** | End-to-end typesafe API server |
| **@hono/trpc-server** | tRPC adapter for Hono |
| **Zod 3.23** | Runtime schema validation |
| **Supabase JS 2** | Database client and auth |
| **SuperJSON** | Consistent serialization with client |

### Infrastructure
| Service | Purpose |
|---|---|
| **Supabase** | PostgreSQL database, Auth (email + OAuth), Row Level Security |
| **Stripe** | Payment processing (Checkout Sessions) |
| **Vercel** | Serverless backend deployment |
| **Rork Platform** | App building, preview, and deployment |

### Dev Tools
| Tool | Purpose |
|---|---|
| **Bun** | Package manager and runtime |
| **Babel** | JavaScript transpilation (with `babel-preset-expo`) |
| **Metro** | React Native bundler (with Rork metro plugin) |
| **ESLint** | Code linting (expo config) |

---

## Project Structure

```
pujly/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx               # Root layout (QueryClient, Stack navigator, auth guard)
│   ├── (auth)/                   # Authentication screens (login, register, etc.)
│   ├── (tabs)/                   # Tab navigator
│   │   ├── _layout.tsx           # Tab bar config (Home, Store, Bookings, Chats, Profile)
│   │   ├── (home)/               # Home tab (inner stack)
│   │   │   ├── _layout.tsx       # Home stack layout
│   │   │   └── index.tsx         # Home screen (hero, categories, pandits, panchang)
│   │   ├── store.tsx             # Product store tab
│   │   ├── bookings.tsx          # Bookings list tab
│   │   ├── chats.tsx             # Chat list tab
│   │   ├── profile.tsx           # User profile tab
│   │   └── search.tsx            # Search screen (hidden tab)
│   ├── address/                  # Address management screens
│   ├── admin/                    # Admin panel screens
│   ├── booking/                  # Booking detail & flow screens
│   ├── category/                 # Category listing screens
│   ├── chat/                     # Chat conversation screens
│   ├── order/                    # Order detail screens
│   ├── pandit/                   # Pandit profile screens
│   ├── pandit-onboarding/        # Pandit registration flow
│   ├── product/                  # Product detail screens
│   ├── service/                  # Service detail screens
│   ├── store/                    # Store sub-screens
│   ├── cart.tsx                  # Shopping cart
│   ├── checkout.tsx              # Checkout flow with Stripe
│   ├── order-success.tsx         # Order confirmation
│   ├── orders.tsx                # Order history
│   ├── wishlist.tsx              # Saved products
│   ├── pandit-profile.tsx        # Pandit's own profile management
│   ├── pandit-services.tsx       # Pandit's service management
│   ├── pandit-service-edit.tsx   # Edit individual service
│   ├── pandit-schedule.tsx       # Pandit's schedule management
│   ├── pandit-earnings.tsx       # Pandit's earnings dashboard
│   ├── edit-profile.tsx          # Edit user profile
│   ├── personal-info.tsx         # Personal information
│   ├── payment-methods.tsx       # Payment methods
│   ├── notifications.tsx         # Notification center
│   ├── help-support.tsx          # Help & support
│   ├── privacy-policy.tsx        # Privacy policy
│   ├── terms-of-service.tsx      # Terms of service
│   └── error-boundary.tsx        # Global error boundary
│
├── backend/                      # Serverless backend (Hono + tRPC)
│   ├── hono.ts                   # Hono app entry (CORS, routes, payment callbacks)
│   ├── trpc/
│   │   ├── app-router.ts         # tRPC root router (auth, payments, data)
│   │   ├── create-context.ts     # tRPC context (token extraction, SuperJSON)
│   │   └── routes/
│   │       ├── auth.ts           # Auth routes (Google, email login/register, profile)
│   │       ├── payments.ts       # Stripe payment routes (checkout, booking payments)
│   │       └── data.ts           # Data CRUD routes (services, pandits, products, bookings, orders)
│   ├── lib/
│   │   └── supabase.ts           # Supabase admin client
│   └── supabase-migration.sql    # Database schema + seed data
│
├── components/                   # Reusable UI components
│   ├── Avatar.tsx                # User avatar component
│   ├── BookingCard.tsx           # Booking list item card
│   ├── Button.tsx                # Styled button with variants
│   ├── Card.tsx                  # Generic card wrapper
│   ├── CategoryCard.tsx          # Category display card
│   ├── Input.tsx                 # Styled text input with labels
│   ├── OccasionCard.tsx          # Occasion/event card
│   ├── PackageCard.tsx           # Service package card
│   ├── PanchangCard.tsx          # Daily panchang (Hindu calendar) card
│   ├── PanditCard.tsx            # Pandit profile card
│   ├── ProductCard.tsx           # Product display card
│   ├── Rating.tsx                # Star rating component
│   └── ServiceCard.tsx           # Service display card
│
├── constants/
│   ├── colors.ts                 # App color palette (saffron primary, green secondary)
│   └── typography.ts             # Typography styles and font weights
│
├── store/                        # Zustand state stores (persisted via AsyncStorage)
│   ├── auth-store.ts             # Authentication state (user, token, login/register/logout)
│   ├── bookings-store.ts         # Bookings state (CRUD, sync with backend)
│   ├── cart-store.ts             # Shopping cart state (add/remove/quantity)
│   ├── order-store.ts            # Order state (create, track, history)
│   ├── services-store.ts         # Services state for pandit management
│   └── wishlist-store.ts         # Wishlist state for saved products
│
├── mocks/                        # Fallback/seed data for offline mode
│   ├── bookings.ts               # Sample bookings data
│   ├── categories.ts             # Service categories
│   ├── fallback-data.ts          # Fallback data when API unavailable
│   ├── packages.ts               # Service packages
│   ├── panchang.ts               # Daily panchang data
│   ├── pandits.ts                # Sample pandit profiles
│   ├── products.ts               # Product catalog
│   └── services.ts               # Service listings
│
├── lib/
│   └── trpc.ts                   # tRPC client configuration (SuperJSON, auth headers)
│
├── assets/images/                # App icons and splash screen
├── app.json                      # Expo configuration
├── babel.config.js               # Babel config (expo preset)
├── metro.config.js               # Metro bundler config (with Rork plugin)
├── tsconfig.json                 # TypeScript config (strict, path aliases)
├── vercel.json                   # Vercel deployment config
└── package.json                  # Dependencies and scripts
```

---

## Environment Variables

| Variable | Location | Purpose |
|---|---|---|
| `SUPABASE_URL` | Backend | Supabase project URL |
| `SUPABASE_ROLE_KEY` | Backend | Supabase service role key (admin access) |
| `SUPABASE_ANON_KEY` | Backend | Supabase anonymous key |
| `STRIPE_SECRET_KEY` | Backend | Stripe secret key for payment processing |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Frontend | Google OAuth client ID for sign-in |
| `EXPO_PUBLIC_RORK_API_BASE_URL` | System | Auto-configured API base URL |
| `EXPO_PUBLIC_RORK_DB_ENDPOINT` | System | Auto-configured DB endpoint |
| `EXPO_PUBLIC_RORK_DB_NAMESPACE` | System | Auto-configured DB namespace |
| `EXPO_PUBLIC_RORK_DB_TOKEN` | System | Auto-configured DB token |
| `EXPO_PUBLIC_TOOLKIT_URL` | System | Auto-configured toolkit URL |
| `EXPO_PUBLIC_PROJECT_ID` | System | Auto-configured project ID |
| `EXPO_PUBLIC_TEAM_ID` | System | Auto-configured team ID |

---

## Database Schema

All tables are hosted on **Supabase (PostgreSQL)** with **Row Level Security** enabled.

### Tables

| Table | Description | Key Fields |
|---|---|---|
| `users` | User accounts (extends Supabase Auth) | id, email, name, phone, avatar, role, provider, google_id, bio, location, languages, verified |
| `categories` | Service categories | id, title, description, image_url, count |
| `pandits` | Pandit profiles | id, name, specialization, about, location, image_url, languages, rating, review_count, verified, experience, user_id |
| `services` | Puja services offered | id, title, description, price, duration, location, image_url, rating, pandit_id, category_id |
| `products` | Store products | id, name, description, price, discounted_price, images, rating, category, tags, stock, featured, details |
| `product_categories` | Product category groups | id, name, description, image, featured |
| `bookings` | Service bookings | id, service_id, pandit_id, user_id, date, time, duration, location, price, status, payment_status |
| `orders` | Product orders | id, user_id, items (JSONB), total, address (JSONB), payment_method, status, stripe_session_id |

### User Roles
- **user** — Regular devotee/customer
- **pandit** — Hindu priest offering services
- **admin** — Platform administrator

### Booking Statuses
`pending` → `confirmed` → `completed` | `cancelled`

### Order Statuses
`pending` → `processing` → `shipped` → `delivered` | `cancelled`

### Payment Statuses
`pending` → `paid` | `refunded` | `failed`

---

## API Routes (tRPC)

All API endpoints are type-safe via tRPC with Zod validation.

### Auth Router (`auth.*`)
| Endpoint | Type | Description |
|---|---|---|
| `auth.googleSignIn` | Mutation | Google OAuth sign-in (verifies token with Google API, creates/finds user in Supabase) |
| `auth.emailLogin` | Mutation | Email + password login via Supabase Auth |
| `auth.emailRegister` | Mutation | New user registration (creates Supabase Auth user + public.users row) |
| `auth.getProfile` | Query | Fetch current user profile by token |
| `auth.updateProfile` | Mutation | Update user profile fields (name, phone, avatar, bio, location, languages) |

### Payments Router (`payments.*`)
| Endpoint | Type | Description |
|---|---|---|
| `payments.createCheckoutSession` | Mutation | Create Stripe Checkout Session for product orders |
| `payments.getPaymentStatus` | Query | Check payment status by Stripe session ID |
| `payments.createBookingPayment` | Mutation | Create Stripe Checkout Session for service bookings |

### Data Router (`data.*`)
| Endpoint | Type | Description |
|---|---|---|
| `data.getServices` | Query | Fetch all services |
| `data.getServiceById` | Query | Fetch single service by ID |
| `data.getPandits` | Query | Fetch all pandits (sorted by rating) |
| `data.getPanditById` | Query | Fetch single pandit by ID |
| `data.getCategories` | Query | Fetch all service categories |
| `data.getProducts` | Query | Fetch products (with optional category, featured, search filters) |
| `data.getProductById` | Query | Fetch single product by ID |
| `data.getProductCategories` | Query | Fetch product category groups |
| `data.getBookings` | Query | Fetch bookings for a user |
| `data.createBooking` | Mutation | Create a new booking |
| `data.updateBookingStatus` | Mutation | Update booking status |
| `data.getOrders` | Query | Fetch orders for a user |
| `data.createOrder` | Mutation | Create a new order |
| `data.updateOrderStatus` | Mutation | Update order status |
| `data.searchAll` | Query | Global search across services, pandits, and products |

### Non-tRPC Endpoints (Hono)
| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Health check — returns `{ status: "ok" }` |
| `/payment-success` | GET | Stripe payment success callback page (HTML) |
| `/payment-cancel` | GET | Stripe payment cancel callback page (HTML) |

---

## State Management

The app uses a hybrid state management approach:

### Zustand Stores (Persisted via AsyncStorage)
| Store | File | Purpose |
|---|---|---|
| `useAuthStore` | `store/auth-store.ts` | User auth state, login/register/logout, token management |
| `useCartStore` | `store/cart-store.ts` | Shopping cart (add, remove, quantity, totals) |
| `useBookingsStore` | `store/bookings-store.ts` | Booking CRUD with backend sync |
| `useOrderStore` | `store/order-store.ts` | Order creation, tracking, history |
| `useServicesStore` | `store/services-store.ts` | Service management for pandits |
| `useWishlistStore` | `store/wishlist-store.ts` | Saved/favorite products |

### React Query
- Used as the top-level provider (`QueryClientProvider` in root layout)
- Handles server state caching, background refetching, and loading states

### Data Persistence
- Auth state (user, token) persisted via Zustand + AsyncStorage
- Cart items persisted via Zustand + AsyncStorage
- Bookings and orders persisted locally and synced with Supabase backend

---

## Authentication Flow

```
1. App Opens
   └── Guest browsing enabled (no login required for Home, Store, Search)

2. Login Required (booking a pandit, managing profile, etc.)
   ├── Email/Password
   │   ├── Register: auth.emailRegister → Supabase Auth createUser + public.users insert
   │   └── Login: auth.emailLogin → Supabase Auth signInWithPassword
   │
   └── Google Sign-In
       ├── Expo Auth Session → Google OAuth → Access Token
       └── auth.googleSignIn → Verify with Google API → Find/Create user in Supabase

3. Token Management
   ├── Token stored in Zustand (persisted via AsyncStorage)
   ├── Token sent as Bearer header on all tRPC requests
   └── Auth guard in _layout.tsx redirects authenticated users away from (auth) screens

4. Logout
   └── Clears Zustand state (user, token, isAuthenticated)
```

---

## Payment Flow

### Product Checkout
```
1. User adds products to cart (useCartStore)
2. User navigates to Checkout screen
3. User selects/enters delivery address
4. User selects payment method
5. App calls payments.createCheckoutSession with cart items
6. Stripe returns Checkout Session URL
7. App opens Stripe Checkout in WebBrowser (expo-web-browser)
8. User completes payment on Stripe's hosted page
9. Stripe redirects to /payment-success or /payment-cancel
10. App creates order via data.createOrder
11. Cart is cleared, user sees Order Success screen
```

### Booking Payment
```
1. User selects service and pandit
2. User picks date, time, and location
3. App calls payments.createBookingPayment
4. Stripe returns Checkout Session URL
5. User completes payment
6. App creates booking via data.createBooking with payment_status: 'paid'
```

---

## Deployment

### Backend Deployment (Vercel)

The backend is deployed as a serverless function on Vercel.

**Configuration (`vercel.json`):**
```json
{
  "buildCommand": "expo export -p web",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    { "source": "/:path*", "destination": "/" }
  ]
}
```

**Steps:**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY`
3. Deploy — Vercel automatically builds and deploys on push

### Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**
3. Run the migration script: `backend/supabase-migration.sql`
   - Creates all tables (users, categories, pandits, services, products, bookings, orders, product_categories)
   - Enables Row Level Security on all tables
   - Creates RLS policies for service role access
   - Seeds initial categories and product categories
4. Copy your project URL and keys to environment variables

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your **Secret Key** from the Stripe Dashboard (Developers > API Keys)
3. Set `STRIPE_SECRET_KEY` in your environment
4. Payment flows use Stripe Checkout Sessions (hosted payment page)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (Web application type)
3. Add authorized redirect URIs for your app
4. Set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` in your environment

### Mobile App (Expo)

The app runs via Expo Go for development and can be built for production.

**Development:**
```bash
bun install
bun start
```

**Web Preview:**
```bash
bun run start-web
```

---

## End-to-End Workflow

### Development Workflow

```
1. Clone repository
2. Install dependencies: bun install
3. Set up environment variables (Supabase, Stripe, Google OAuth)
4. Run Supabase migration (backend/supabase-migration.sql)
5. Start development server: bun start
6. Scan QR code with Expo Go (mobile) or open web preview
7. Make changes — hot reload updates instantly
8. Test on iOS, Android, and Web
```

### User Journey: Booking a Puja

```
1. User opens app → Home screen (guest browsing)
2. Browses categories → Selects "Home Ceremonies"
3. Views available services → Selects "Griha Pravesh Puja"
4. Views service details (price, duration, description)
5. Selects a pandit from available pandits
6. Prompted to login/register (if not authenticated)
7. Picks date, time, and location
8. Proceeds to payment → Stripe Checkout
9. Completes payment → Booking confirmed
10. Views booking in "Bookings" tab
11. Chats with pandit for coordination
12. Pandit performs the service
13. Booking marked as completed
```

### User Journey: Purchasing Products

```
1. User navigates to "Store" tab
2. Browses product categories (Puja Kits, Ritual Items, etc.)
3. Searches for specific items
4. Views product details (images, price, description, reviews)
5. Adds items to cart (persisted across sessions)
6. Opens cart → Reviews items and total
7. Proceeds to checkout
8. Enters/selects delivery address
9. Completes Stripe payment
10. Order confirmed → Tracks order status
11. Order delivered
```

### Pandit Onboarding Journey

```
1. Pandit opens app → Navigates to Profile
2. Selects "Become a Pandit" / Pandit registration
3. Goes through onboarding flow (name, specialization, languages, bio, etc.)
4. Profile created with role: 'pandit'
5. Adds services with pricing and duration
6. Manages schedule and availability
7. Receives bookings from users
8. Tracks earnings in dashboard
```

---

## Development Guide

### Package Manager
Always use **Bun** (never npm or yarn):
```bash
bun install          # Install all dependencies
bun add <package>    # Add a new package
bun remove <package> # Remove a package
```

### Path Aliases
Use `@/` for imports from the project root:
```typescript
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
```

### Color Palette
| Color | Hex | Usage |
|---|---|---|
| Primary (Saffron) | `#E85D2C` | Main brand color, CTAs, active tabs |
| Primary Dark | `#C94A1E` | Pressed states |
| Primary Light | `#FFF0EB` | Subtle backgrounds |
| Secondary (Green) | `#2D6A4F` | Secondary actions, success states |
| Secondary Dark | `#1B4332` | Pressed states |
| Secondary Light | `#E8F5EE` | Subtle backgrounds |
| Accent (Gold) | `#D4A017` | Highlights, badges, premium features |
| Accent Light | `#FFF8E1` | Subtle backgrounds |
| Background | `#FAFAF8` | Page backgrounds |
| Text | `#1A1A2E` | Primary text |
| Text Light | `#6B7280` | Secondary text |
| Text Muted | `#9CA3AF` | Placeholder, disabled text |
| Border | `#E5E7EB` | Dividers, borders |
| Success | `#34C759` | Success states |
| Warning | `#FF9500` | Warning states |
| Error | `#FF3B30` | Error states |
| Info | `#3B82F6` | Informational states |

### Configuration Files
| File | Purpose |
|---|---|
| `app.json` | Expo app config (name: "Pujly", slug: "pujari-sewa", scheme: "pujari-sewa", new arch enabled, typed routes) |
| `tsconfig.json` | TypeScript strict mode, `@/*` path alias, extends `expo/tsconfig.base` |
| `babel.config.js` | Babel preset expo with `unstable_transformImportMeta` enabled |
| `metro.config.js` | Metro config with Rork metro plugin (`withRorkMetro`) |
| `vercel.json` | Vercel deployment: web export, SPA rewrites, clean URLs |

### Key Conventions
- **TypeScript strict mode** enabled — all types must be explicit
- **Expo Router** for file-based navigation
- **Zustand** for client state with AsyncStorage persistence
- **tRPC** for type-safe API communication
- **Zod** for runtime validation on both client and server
- **SuperJSON** for serialization across the wire
- **Lucide icons** for all iconography
- **StyleSheet** from React Native for all styling (no styled-components, no Tailwind)

### Navigation Structure
- **5 Tabs**: Home, Store, Bookings, Chats, Profile
- **Stack screens** overlay tabs for detail views (cart, checkout, pandit profiles, etc.)
- **Auth screens** in `(auth)` group — only shown when login is required
- **Admin screens** in `admin/` group — accessible to admin role users
- **Pandit screens** for service/schedule/earnings management
- **Guest browsing** enabled — users can explore without authentication
