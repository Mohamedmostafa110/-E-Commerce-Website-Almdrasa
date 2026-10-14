import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import CouponBox from "../components/CouponBox";
import { useShop } from "../context/ShopContext";
import { money } from "../lib/format";

const card = "rounded bg-white shadow-[0_1px_13px_rgba(0,0,0,0.1)]";
const outlineBtn = "inline-flex items-center justify-center rounded border border-black/50 px-8 py-3.5 font-medium transition hover:bg-black hover:text-white sm:px-12 sm:py-4";

export default function Cart() {
  const { t } = useTranslation();
  const { items, totals, setQty, removeFromCart, notify } = useShop();
  const crumbs = [{ label: t("common.home"), to: "/" }, { label: t("cart.title") }];

  if (items.length === 0) {
    return (
      <div className="container-x pt-6 sm:pt-16">
        <Breadcrumb items={crumbs} />
        <div className="mx-auto mt-16 flex max-w-md flex-col items-center py-10 text-center">
          <ShoppingCart size={64} strokeWidth={1.2} className="text-black/40" aria-hidden="true" />
          <h1 className="mt-6 text-2xl font-semibold">{t("cart.empty")}</h1>
          <p className="mt-2 text-black/60">{t("cart.emptyHint")}</p>
          <Link to="/shop" className="mt-8 rounded bg-brand px-10 py-3.5 font-medium text-white hover:bg-brand-hover">{t("cart.returnToShop")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pt-6 sm:pt-16">
      <Breadcrumb items={crumbs} />
      <h1 className="sr-only">{t("cart.title")}</h1>

      <div className={`${card} mt-10 hidden grid-cols-[2fr_1fr_1fr_1fr] px-10 py-6 md:mt-20 md:grid`} aria-hidden="true">
        <span>{t("cart.product")}</span>
        <span>{t("cart.price")}</span>
        <span>{t("cart.quantity")}</span>
        <span className="text-end">{t("cart.subtotal")}</span>
      </div>

      <ul className="mt-8 space-y-5 md:mt-10 md:space-y-10">
        {items.map(({ id, qty, product }) => (
          <li key={id} data-testid="cart-item" className={`${card} grid items-center gap-4 p-4 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] md:px-10 md:py-6`}>
            <div className="relative flex items-center gap-4 sm:col-span-2 md:col-span-1">
              <button
                type="button"
                data-testid="remove-from-cart"
                onClick={() => removeFromCart(id)}
                aria-label={`${t("cart.remove")}: ${product.name}`}
                className="absolute -start-2 -top-2 z-10 grid h-5 w-5 place-items-center rounded-full bg-brand text-white hover:bg-black"
              >
                <X size={14} />
              </button>
              <img src={product.image} alt="" className="h-14 w-14 shrink-0 rounded bg-soft object-cover" />
              <Link to={`/product/${id}`} className="font-medium hover:text-brand">{product.name}</Link>
            </div>
            <p><span className="text-black/50 md:hidden">{t("cart.price")}: </span>{money(product.price)}</p>
            <div className="flex items-center gap-3">
              <span className="text-black/50 md:hidden">{t("cart.quantity")}: </span>
              <div className="inline-flex h-11 items-center overflow-hidden rounded border border-black/50">
                <button type="button" onClick={() => setQty(id, qty - 1)} disabled={qty <= 1} aria-label={t("product.decrease")} className="grid h-full w-9 place-items-center hover:bg-soft disabled:opacity-40">
                  <Minus size={16} />
                </button>
                <output aria-label={t("product.quantity")} className="w-9 text-center">{String(qty).padStart(2, "0")}</output>
                <button type="button" onClick={() => setQty(id, qty + 1)} aria-label={t("product.increase")} className="grid h-full w-9 place-items-center hover:bg-soft">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <p className="md:text-end"><span className="text-black/50 md:hidden">{t("cart.subtotal")}: </span>{money(product.price * qty)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap justify-between gap-4">
        <Link to="/shop" className={outlineBtn}>{t("cart.returnToShop")}</Link>
        <button type="button" onClick={() => notify(t("cart.updated"))} className={outlineBtn}>{t("cart.updateCart")}</button>
      </div>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-16">
        <CouponBox className="self-start" />
        <div className="w-full rounded border-[1.5px] border-black p-6 lg:ms-auto lg:max-w-[470px]">
          <h2 className="text-xl font-medium">{t("cart.cartTotal")}</h2>
          <dl className="mt-6 text-base">
            <div className="flex justify-between border-b border-black/40 py-4"><dt>{t("cart.subtotalLabel")}</dt><dd>{money(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between border-b border-black/40 py-4 text-emerald-700"><dt>{t("cart.discountLabel")}</dt><dd>-{money(totals.discount)}</dd></div>}
            <div className="flex justify-between border-b border-black/40 py-4"><dt>{t("cart.shippingLabel")}</dt><dd>{totals.shipping ? money(totals.shipping) : t("common.free")}</dd></div>
            <div className="flex justify-between py-4 font-medium"><dt>{t("cart.totalLabel")}</dt><dd>{money(totals.total)}</dd></div>
          </dl>
          <div className="mt-2 flex justify-center">
            <Link to="/checkout" className="rounded bg-brand px-10 py-3.5 font-medium text-white transition hover:bg-brand-hover sm:px-12 sm:py-4">{t("cart.checkout")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
