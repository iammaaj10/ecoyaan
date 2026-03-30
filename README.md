# Ecoyaan Checkout Flow

A take-home assignment built for Ecoyaan's frontend engineering interview. The task was to build a simplified checkout flow — cart, address form, payment confirmation, and a success screen.

Live demo: [ecoyaan-checkout.vercel.app](https://ecoyaan-checkout.vercel.app)

---

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- React Context API

---

## Running locally

```bash
npm install
npm run dev
```

---

## How it works

The app has four pages:

**`/`** — Cart page. Fetches cart data server-side via an internal API route (`/api/cart`) using a Next.js Server Component with `cache: "no-store"`, so it's always fresh on each request. Shows items, subtotal, shipping, and a breakdown.

**`/checkout`** — Address form. Client component with inline validation (required fields, email format, 10-digit phone, 6-digit PIN). Errors show per-field on submit, and clear as soon as you start correcting them. On success, the address gets saved to context and the user is pushed to the next step.

**`/payment`** — Shows the saved address, order items again, and three payment method options (UPI, card, COD). The pay button is disabled if no address is in context — so if someone navigates here directly, it won't let them through.

**`/success`** — Confirmation screen with an animated check, a generated order ID, and an estimated delivery window.

State (cart + address) is kept in a `CheckoutContext` that wraps the whole app in `layout.tsx`. Nothing fancy — just `useState` under the hood since the scope is small enough that it didn't need anything heavier.

---

## File structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx               # Cart (SSR)
│   ├── checkout/page.tsx
│   ├── payment/page.tsx
│   ├── success/page.tsx
│   └── api/cart/route.ts
├── components/
│   ├── Nav.tsx
│   ├── CartItem.tsx
│   └── OrderSummary.tsx
├── context/
│   └── CheckoutContext.tsx
├── data/
│   └── cartData.ts
└── types/
    ├── cart.ts
    └── address.ts
```

---

## A few decisions worth mentioning

**Why a local API route instead of importing the data directly in the Server Component?**
The brief asked for SSR data fetching, and hitting an API route (even an internal one) felt closer to how this would actually work with a real backend. Easy to swap the URL for a real endpoint later.

**Why Context API and not Zustand/Redux?**
Three pages, two pieces of state. Bringing in an external state library would've been overkill.

**Why SVG product images?**
The mock data had placeholder URLs. I generated local SVGs instead so the images actually load and look intentional, without depending on an external service.
