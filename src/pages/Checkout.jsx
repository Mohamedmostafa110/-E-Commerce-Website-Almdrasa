import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import CouponBox from "../components/CouponBox";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { money } from "../lib/format";
import { KEYS, store } from "../lib/storage";

const inputCls = "h-[50px] w-full rounded bg-soft px-4 outline-none focus:ring-2 focus:ring-brand/40";

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-black/50">
        {label}
        {required && <span className="text-brand/70">*</span>}
      </span>
      {children}
    </label>
  );
}

export default function Checkout() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { items, totals, placeOrder } = useShop();
  const saved = store.get(KEYS.billing, null);
  const [form, setForm] = useState(() => ({
    firstName: saved?.firstName || user?.name || "",
    company: saved?.company || "",
    address: saved?.address || user?.address || "",
    apartment: saved?.apartment || "",
    city: saved?.city || "",
    phone: saved?.phone || "",
    email: saved?.email || (user?.email?.includes("@phone.") ? "" : user?.email || ""),
  }));
  const [payment, setPayment] = useState("cod");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [saveInfo, setSaveInfo] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const crumbs = [{ label: t("common.home"), to: "/" }, { label: t("cart.title"), to: "/cart" }, { label: t("checkout.title") }];

  const submit = (e) => {
    e.preventDefault();
    if (busy) return;
    if (items.length === 0) return setError(t("checkout.emptyCart"));
    const missing = ["firstName", "address", "city", "phone", "email"].some((k) => !String(form[k]).trim());
    if (missing) return setError(t("checkout.fillRequired"));
    if (!/^\S+@\S+$/.test(form.email.trim())) return setError(t("checkout.invalidEmail"));
    setError("");
    setBusy(true);
    if (saveInfo) store.set(KEYS.billing, form);
    else store.remove(KEYS.billing);
    const placed = placeOrder({ billing: form, payment, userId: user?.id });
    setOrder(placed);
    setBusy(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (order) {
    return (
      <div className="container-x pt-6 sm:pt-16">
        <Breadcrumb items={crumbs} />
        <div data-testid="order-success" role="status" className="mx-auto mt-14 flex max-w-xl flex-col items-center py-10 text-center sm:mt-24">
          <CheckCircle2 size={72} strokeWidth={1.4} className="text-emerald-600" aria-hidden="true" />
          <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">{t("checkout.successTitle")}</h1>
          <p className="mt-3 text-black/70">{t("checkout.successText", { id: order.id })}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="rounded bg-brand px-8 py-3.5 font-medium text-white hover:bg-brand-hover">{t("checkout.continueShopping")}</Link>
            {user && <Link to="/account?tab=orders" className="rounded border border-black/50 px-8 py-3.5 font-medium hover:bg-black hover:text-white">{t("checkout.viewOrders")}</Link>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pt-6 sm:pt-16">
      <Breadcrumb items={crumbs} />
      <form data-testid="checkout-form" onSubmit={submit} noValidate className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-12 sm:mt-14 lg:grid-cols-[minmax(0,470px)_minmax(0,527px)] lg:justify-between lg:gap-10">
        <div>
          <h1 className="text-3xl font-medium tracking-[0.03em] sm:text-4xl">{t("checkout.billing")}</h1>
          <div className="mt-8 space-y-6 sm:space-y-8">
            <Field label={t("checkout.firstName")} required><input name="firstName" autoComplete="given-name" value={form.firstName} onChange={set("firstName")} className={inputCls} /></Field>
            <Field label={t("checkout.company")}><input name="company" autoComplete="organization" value={form.company} onChange={set("company")} className={inputCls} /></Field>
            <Field label={t("checkout.street")} required><input name="address" autoComplete="street-address" value={form.address} onChange={set("address")} className={inputCls} /></Field>
            <Field label={t("checkout.apartment")}><input name="apartment" autoComplete="address-line2" value={form.apartment} onChange={set("apartment")} className={inputCls} /></Field>
            <Field label={t("checkout.city")} required><input name="city" autoComplete="address-level2" value={form.city} onChange={set("city")} className={inputCls} /></Field>
            <Field label={t("checkout.phone")} required><input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} className={inputCls} /></Field>
            <Field label={t("checkout.email")} required><input name="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} className={inputCls} /></Field>
            <label className="flex cursor-pointer items-center gap-4">
              <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} className="h-6 w-6 shrink-0 accent-brand" />
              <span>{t("checkout.saveInfo")}</span>
            </label>
          </div>
        </div>

        <div className="min-w-0 lg:pt-20">
          <ul className="space-y-6">
            {items.map(({ id, qty, product }) => (
              <li key={id} className="flex items-center justify-between gap-4">
                <span className="flex min-w-0 items-center gap-4 sm:gap-6">
                  <img src={product.image} alt="" className="h-[54px] w-[54px] shrink-0 rounded bg-soft object-cover" />
                  <span className="truncate">{product.name}{qty > 1 && <span className="text-black/50"> × {qty}</span>}</span>
                </span>
                <span className="shrink-0">{money(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6">
            <div className="flex justify-between border-b border-black/40 py-4"><dt>{t("cart.subtotalLabel")}</dt><dd>{money(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between border-b border-black/40 py-4 text-emerald-700"><dt>{t("cart.discountLabel")}</dt><dd>-{money(totals.discount)}</dd></div>}
            <div className="flex justify-between border-b border-black/40 py-4"><dt>{t("cart.shippingLabel")}</dt><dd>{totals.shipping ? money(totals.shipping) : t("common.free")}</dd></div>
            <div className="flex justify-between py-4 font-medium"><dt>{t("cart.totalLabel")}</dt><dd>{money(totals.total)}</dd></div>
          </dl>

          <fieldset className="mt-2 space-y-4">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="flex items-center gap-4">
                <input type="radio" name="payment" value="bank" checked={payment === "bank"} onChange={() => setPayment("bank")} className="h-6 w-6 accent-black" />
                {t("checkout.bank")}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold" aria-hidden="true">
                <span className="rounded border px-1.5 py-0.5 italic text-blue-700">VISA</span>
                <span className="rounded border px-1.5 py-0.5 text-red-600">MC</span>
              </span>
            </label>
            {payment === "bank" && (
              <div className="grid gap-3 rounded bg-soft p-4 sm:grid-cols-[2fr_1fr_1fr]">
                <input name="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder={t("checkout.cardNumber")} aria-label={t("checkout.cardNumber")} value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))} className="h-11 rounded bg-white px-3 outline-none focus:ring-2 focus:ring-brand/40 sm:col-span-1" />
                <input name="cardExpiry" autoComplete="cc-exp" placeholder={t("checkout.cardExpiry")} aria-label={t("checkout.cardExpiry")} value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))} className="h-11 rounded bg-white px-3 outline-none focus:ring-2 focus:ring-brand/40" />
                <input name="cardCvc" inputMode="numeric" autoComplete="cc-csc" placeholder={t("checkout.cardCvc")} aria-label={t("checkout.cardCvc")} value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))} className="h-11 rounded bg-white px-3 outline-none focus:ring-2 focus:ring-brand/40" />
                <p className="text-xs text-black/60 sm:col-span-3">{t("checkout.testMode")}</p>
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-4">
              <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} className="h-6 w-6 accent-black" />
              {t("checkout.cod")}
            </label>
          </fieldset>

          <CouponBox className="mt-8" />

          {error && <p role="alert" className="mt-6 rounded bg-brand/10 px-4 py-3 text-sm text-brand">{error}</p>}
          <button data-testid="place-order" type="submit" disabled={busy} className="mt-8 rounded bg-brand px-12 py-4 font-medium text-white transition hover:bg-brand-hover disabled:opacity-60">
            {t("checkout.placeOrder")}
          </button>
        </div>
      </form>
    </div>
  );
}
