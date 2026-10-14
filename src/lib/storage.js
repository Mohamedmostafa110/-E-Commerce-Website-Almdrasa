// Tiny, crash-proof wrapper around localStorage (private mode / quota safe).
export const KEYS = {
  cart: "exclusive:cart",
  wishlist: "exclusive:wishlist",
  coupon: "exclusive:coupon",
  orders: "exclusive:orders",
  users: "exclusive:users",
  session: "exclusive:session",
  reviews: "exclusive:reviews",
  billing: "exclusive:billing",
  lang: "exclusive:lang",
  flashEnd: "exclusive:flash-end",
  bannerEnd: "exclusive:banner-end",
};

export const store = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
