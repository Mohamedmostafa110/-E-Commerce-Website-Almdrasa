import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { KEYS, store } from "../lib/storage";
import { getProduct } from "../data/products";

const ShopContext = createContext(null);
export const useShop = () => useContext(ShopContext);

// Demo coupon codes (percentage off the subtotal).
export const COUPONS = { EXCLUSIVE10: 10, ALMDRASA20: 20 };
const FREE_SHIPPING_FROM = 140;
const SHIPPING_FEE = 15;
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

export function ShopProvider({ children }) {
  const { t } = useTranslation();
  const [cart, setCart] = useState(() => store.get(KEYS.cart, []));
  const [wishlist, setWishlist] = useState(() => store.get(KEYS.wishlist, []));
  const [coupon, setCoupon] = useState(() => store.get(KEYS.coupon, null));
  const [orders, setOrders] = useState(() => store.get(KEYS.orders, []));
  const [toast, setToast] = useState(null);

  useEffect(() => store.set(KEYS.cart, cart), [cart]);
  useEffect(() => store.set(KEYS.wishlist, wishlist), [wishlist]);
  useEffect(() => (coupon ? store.set(KEYS.coupon, coupon) : store.remove(KEYS.coupon)), [coupon]);
  useEffect(() => store.set(KEYS.orders, orders), [orders]);
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const notify = useCallback((message, type = "success") => setToast({ message, type, id: Date.now() }), []);

  /* ----- cart ----- */
  const addToCart = useCallback(
    (id, qty = 1, { silent = false } = {}) => {
      setCart((prev) =>
        prev.some((i) => i.id === id) ? prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + qty) } : i)) : [...prev, { id, qty }]
      );
      if (!silent) notify(t("toast.addedToCart"));
    },
    [notify, t]
  );
  const setQty = useCallback((id, qty) => {
    const n = Math.max(1, Math.min(99, Number(qty) || 1));
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: n } : i)));
  }, []);
  const removeFromCart = useCallback(
    (id) => {
      setCart((prev) => prev.filter((i) => i.id !== id));
      notify(t("toast.removedFromCart"));
    },
    [notify, t]
  );
  const clearCart = useCallback(() => setCart([]), []);

  /* ----- wishlist ----- */
  const inWishlist = useCallback((id) => wishlist.includes(id), [wishlist]);
  const toggleWishlist = useCallback(
    (id) => {
      const has = wishlist.includes(id);
      setWishlist((prev) => (has ? prev.filter((x) => x !== id) : [...prev, id]));
      notify(has ? t("toast.removedFromWishlist") : t("toast.addedToWishlist"));
    },
    [wishlist, notify, t]
  );
  const removeFromWishlist = useCallback(
    (id) => {
      setWishlist((prev) => prev.filter((x) => x !== id));
      notify(t("toast.removedFromWishlist"));
    },
    [notify, t]
  );
  const moveAllToCart = useCallback(() => {
    if (!wishlist.length) return;
    wishlist.forEach((id) => addToCart(id, 1, { silent: true }));
    setWishlist([]);
    notify(t("toast.movedToCart"));
  }, [wishlist, addToCart, notify, t]);

  /* ----- coupon ----- */
  const applyCoupon = useCallback((code) => {
    const key = String(code || "").trim().toUpperCase();
    if (COUPONS[key]) {
      setCoupon({ code: key, pct: COUPONS[key] });
      return { ok: true, pct: COUPONS[key] };
    }
    return { ok: false };
  }, []);
  const removeCoupon = useCallback(() => setCoupon(null), []);

  /* ----- derived ----- */
  const items = useMemo(
    () => cart.map((i) => ({ ...i, product: getProduct(i.id) })).filter((i) => i.product),
    [cart]
  );
  const cartCount = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const totals = useMemo(() => {
    const subtotal = round2(items.reduce((s, i) => s + i.product.price * i.qty, 0));
    const discount = coupon ? round2((subtotal * coupon.pct) / 100) : 0;
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    return { subtotal, discount, shipping, total: round2(subtotal - discount + shipping) };
  }, [items, coupon]);

  /* ----- orders ----- */
  const placeOrder = useCallback(
    ({ billing, payment, userId }) => {
      const order = {
        id: `EX-${Date.now().toString().slice(-8)}`,
        userId: userId || "guest",
        date: new Date().toISOString(),
        status: "processing",
        payment,
        billing,
        coupon: coupon?.code || null,
        totals,
        items: items.map((i) => ({ id: i.id, name: i.product.name, image: i.product.image, price: i.product.price, qty: i.qty })),
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      setCoupon(null);
      return order;
    },
    [items, totals, coupon]
  );
  const cancelOrder = useCallback(
    (id) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
      notify(t("toast.orderCancelled"));
    },
    [notify, t]
  );

  const value = {
    items, cartCount, totals, coupon, wishlist, orders, toast,
    addToCart, setQty, removeFromCart, clearCart,
    inWishlist, toggleWishlist, removeFromWishlist, moveAllToCart,
    applyCoupon, removeCoupon, placeOrder, cancelOrder, notify,
    freeShippingFrom: FREE_SHIPPING_FROM,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
