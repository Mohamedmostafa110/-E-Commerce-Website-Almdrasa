<div align="center">

# 🛍️ Exclusive — E-Commerce Website

**A modern, fully responsive, multilingual online store built with React, Tailwind CSS and Firebase.**
Almdrasa graduation project · pixel-faithful implementation of the "Exclusive" Figma design.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20AR%20%7C%20FR-DB4444)

</div>

---

## 🌐 Live Demo

> **👉 Live site: [https://YOUR-LIVE-DEMO-LINK-HERE](https://YOUR-LIVE-DEMO-LINK-HERE)**
>
> _(Replace the link above with your Vercel / Netlify / GitHub Pages URL — it must start with `https://`.)_

**Repository:** <https://github.com/Mohamedmostafa110/-E-Commerce-Website-Almdrasa>

---

## ✨ Features

| Area | What you get |
| --- | --- |
| 🏠 **Home** | Auto-playing hero slider with dots, department sidebar with fly-out menus, flash sales with live countdown, browse-by-category, best sellers, promo banner with countdown, paged "Explore" grid, new-arrival tiles, services, back-to-top button |
| 🔐 **Authentication** | Sign up, log in, log out (Firebase Authentication, with an automatic local fallback so the demo never breaks). Email **or** phone number sign-in, Google sign-up button, profile editing, password change |
| ❤️ **Wishlist** | Toggle from any product card, dedicated page, "Move all to bag", "Just for you" suggestions |
| 🛒 **Cart** | Live cart counter, quantity stepper, remove items, coupon codes, free-shipping rule (orders ≥ $140), persistent between visits |
| 💳 **Checkout** | Billing form with validation, cash on delivery or test-card payment (no real payment), saved billing details, order confirmation, order history & cancellation in *My Account* |
| 🔎 **Search** | Press **Enter** in the header search to see only the matching products |
| ⭐ **Reviews** | Star rating + comment on every product page; new reviews appear instantly and are saved |
| 🌍 **Multi-language** | English, العربية (full **RTL** layout) and Français through a language switcher; choice is remembered |
| 📱 **Responsive** | Designed for phones, tablets and large screens — no horizontal scrolling from 320 px up |
| ♿ **Accessibility** | Semantic landmarks, labelled controls, visible keyboard focus, reduced-motion support, `aria-live` notifications |

### Pages

`/` · `/about` · `/contact` · `/cart` · `/wishlist` · `/checkout` · `/account` · `/signup` · `/login` · `/product/:id` · `/shop` · `/search?q=` · custom **404**

Both URL styles work: `/cart` **and** `/#/cart`.

---

## 🧰 Tech Stack

- **React 18** + **React Router 6** (Vite 6 build)
- **Tailwind CSS 4** (design tokens in `src/index.css`)
- **Firebase Authentication** (optional, env-driven)
- **i18next / react-i18next** (EN · AR · FR, RTL aware)
- **lucide-react** icons
- State via React Context + `localStorage` persistence

---

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/Mohamedmostafa110/-E-Commerce-Website-Almdrasa.git E-Commerce-Website-Almdrasa
cd E-Commerce-Website-Almdrasa

# 2. Install
npm install

# 3. Run locally → http://localhost:5173
npm run dev

# 4. Production build
npm run build && npm run preview
```

### 🔥 Firebase (optional)

The app works out of the box. To use real Firebase Authentication:

1. Create a project at the [Firebase console](https://console.firebase.google.com/) and add a **Web app**.
2. Enable **Authentication → Sign-in method → Email/Password** (and **Google** if you want the Google button).
3. Copy `.env.example` to `.env` and fill in the values:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

4. When deploying, add the same four variables in your host's *Environment Variables* settings and add your site's domain under **Authentication → Settings → Authorized domains**.

> If the variables are missing (or Firebase is unreachable) accounts are stored locally in the browser instead, so signing up and logging in always works.

---

## ☁️ Deployment

| Host | Steps |
| --- | --- |
| **Vercel** | Import the repo → framework *Vite* → Deploy. `vercel.json` already handles SPA routing. |
| **Netlify** | Import the repo → build `npm run build`, publish `dist`. `netlify.toml` and `public/_redirects` are included. |
| **GitHub Pages** | Build, publish `dist`, and use the `/#/route` URLs (supported). |

---

## 🎟️ Demo Data

- **Coupons:** `EXCLUSIVE10` (10 % off) · `ALMDRASA20` (20 % off)
- **Payments:** no real payment is ever taken — use any sample card data.
- **Products:** 23 products across gaming, computers, phones, audio, fashion, home, beauty and more.

---

## 🧪 Test Identifiers (`data-testid`)

| Element | `data-testid` |
| --- | --- |
| Product card · link · add to cart · add to wishlist | `product-card` · `product-link` · `add-to-cart` · `add-to-wishlist` |
| Search field (Enter to search) | `search-input` |
| Cart counter | `cart-count` |
| Cart row · remove button | `cart-item` · `remove-from-cart` |
| Wishlist row | `wishlist-item` |
| Checkout form · place order · success message | `checkout-form` · `place-order` · `order-success` |
| Sign-up form · login form · logout (visible only when signed in) | `signup-form` · `login-form` · `logout` |
| Product details | `product-details` |
| Review field · submit · each review | `review-text` · `review-submit` · `review` |
| Language switcher (EN / AR / FR) | `lang-switch` |

---

## 📁 Project Structure

```text
├── public/               # favicon, images, SPA redirects
├── src/
│   ├── components/       # Header, Footer, ProductCard, Stars, …
│   ├── context/          # AuthContext, ShopContext (cart, wishlist, orders)
│   ├── data/             # products & seeded reviews
│   ├── i18n/             # i18next setup + en / ar / fr locales
│   ├── lib/              # Firebase init, storage & format helpers
│   ├── pages/            # Home, Cart, Checkout, Account, …
│   ├── services/         # auth service (Firebase + local fallback)
│   ├── App.jsx           # routes
│   └── main.jsx
├── netlify.toml · vercel.json · .env.example
└── package.json
```

---

## 👤 Author

**Mohamed Mostafa** — Full-Stack Engineer · [GitHub @Mohamedmostafa110](https://github.com/Mohamedmostafa110)

Built as the Almdrasa graduation project, based on the *Exclusive* e-commerce Figma design.
