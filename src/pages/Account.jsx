import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import Stars from "../components/Stars";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { getProduct } from "../data/products";
import { money } from "../lib/format";
import { KEYS, store } from "../lib/storage";

const fieldCls = "h-[50px] w-full rounded bg-soft px-4 outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-60";

function OrderList({ orders, cancellable }) {
  const { t, i18n } = useTranslation();
  const { cancelOrder } = useShop();
  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.id} className="rounded border border-black/15 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{t("account.orderNumber")} {o.id}</p>
            <span className={`rounded-full px-3 py-1 text-xs ${o.status === "cancelled" ? "bg-black/10" : "bg-emerald-100 text-emerald-800"}`}>{t(`account.status.${o.status}`)}</span>
          </div>
          <p className="mt-1 text-sm text-black/60">{new Date(o.date).toLocaleDateString(i18n.language)} · {money(o.totals.total)}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {o.items.map((i) => (
              <li key={i.id} title={`${i.name} × ${i.qty}`}><img src={i.image} alt={i.name} className="h-12 w-12 rounded bg-soft object-cover" /></li>
            ))}
          </ul>
          {cancellable && o.status === "processing" && (
            <button type="button" onClick={() => cancelOrder(o.id)} className="mt-3 text-sm text-brand hover:underline">{t("account.cancelOrder")}</button>
          )}
        </li>
      ))}
    </ul>
  );
}

function ProfileForm() {
  const { t } = useTranslation();
  const { user, updateAccount } = useAuth();
  const { notify } = useShop();
  const [first = "", ...rest] = (user?.name || "").split(" ");
  const init = { first, last: rest.join(" "), address: user?.address || "", current: "", next: "", confirm: "" };
  const [f, setF] = useState(init);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (f.next && f.next !== f.confirm) return setError(t("account.passwordMismatch"));
    try {
      await updateAccount({ name: `${f.first} ${f.last}`.trim(), address: f.address, currentPassword: f.current, newPassword: f.next });
      setF((s) => ({ ...s, current: "", next: "", confirm: "" }));
      notify(t("account.saved"));
    } catch (err) {
      const known = err?.code && t(`auth.errors.${err.code}`) !== `auth.errors.${err.code}`;
      setError(t(`auth.errors.${known ? err.code : "generic"}`));
    }
  };


  return (
    <form onSubmit={submit} noValidate>
      <h2 className="text-xl font-medium text-brand">{t("account.editProfile")}</h2>
      <div className="mt-4 grid gap-x-12 gap-y-5 sm:grid-cols-2">
        <label><span className="mb-2 block">{t("account.firstName")}</span><input name="firstName" value={f.first} onChange={set("first")} className={fieldCls} /></label>
        <label><span className="mb-2 block">{t("account.lastName")}</span><input name="lastName" value={f.last} onChange={set("last")} className={fieldCls} /></label>
        <label><span className="mb-2 block">{t("account.email")}</span><input name="email" value={user?.email?.includes("@phone.") ? "" : user?.email || ""} readOnly className={`${fieldCls} opacity-70`} /></label>
        <label><span className="mb-2 block">{t("account.address")}</span><input name="address" value={f.address} onChange={set("address")} placeholder={t("account.addressPlaceholder")} className={fieldCls} /></label>
      </div>
      <fieldset className="mt-6 space-y-4">
        <legend className="mb-2">{t("account.passwordChanges")}</legend>
        <input type="password" autoComplete="current-password" value={f.current} onChange={set("current")} placeholder={t("account.currentPassword")} aria-label={t("account.currentPassword")} className={fieldCls} />
        <input type="password" autoComplete="new-password" value={f.next} onChange={set("next")} placeholder={t("account.newPassword")} aria-label={t("account.newPassword")} className={fieldCls} />
        <input type="password" autoComplete="new-password" value={f.confirm} onChange={set("confirm")} placeholder={t("account.confirmPassword")} aria-label={t("account.confirmPassword")} className={fieldCls} />
      </fieldset>
      {error && <p role="alert" className="mt-4 text-sm text-brand">{error}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-6">
        <button type="button" onClick={() => { setF(init); setError(""); }} className="hover:underline">{t("account.cancel")}</button>
        <button type="submit" className="rounded bg-brand px-10 py-3.5 font-medium text-white transition hover:bg-brand-hover sm:px-12 sm:py-4">{t("account.saveChanges")}</button>
      </div>
    </form>
  );
}

export default function Account() {
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const { orders } = useShop();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "profile";
  const mine = useMemo(() => orders.filter((o) => user && o.userId === user.id), [orders, user]);
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    if (!user) return;
    const all = store.get(KEYS.reviews, {});
    setMyReviews(Object.entries(all).flatMap(([pid, list]) => list.filter((r) => r.userId === user.id).map((r) => ({ ...r, pid }))));
  }, [user, tab]);

  const link = (key, label) => (
    <li key={key}>
      <button type="button" onClick={() => setParams(key === "profile" ? {} : { tab: key })} aria-current={tab === key ? "page" : undefined} className={`py-1 text-start transition ${tab === key ? "text-brand" : "text-black/50 hover:text-black"}`}>
        {label}
      </button>
    </li>
  );

  let content;
  if (!isLoggedIn) {
    content = (
      <div className="py-10 text-center">
        <p className="text-lg">{t("account.pleaseLogin")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/login" className="rounded bg-brand px-10 py-3.5 font-medium text-white hover:bg-brand-hover">{t("common.logIn")}</Link>
          <Link to="/signup" className="rounded border border-black/50 px-10 py-3.5 font-medium hover:bg-black hover:text-white">{t("common.signUp")}</Link>
        </div>
      </div>
    );
  } else if (tab === "orders") {
    const list = mine.filter((o) => o.status !== "cancelled");
    content = list.length ? <OrderList orders={list} cancellable /> : <p className="py-6 text-black/60">{t("account.noOrders")}</p>;
  } else if (tab === "cancellations") {
    const list = mine.filter((o) => o.status === "cancelled");
    content = list.length ? <OrderList orders={list} /> : <p className="py-6 text-black/60">{t("account.noCancellations")}</p>;
  } else if (tab === "returns") {
    content = <p className="py-6 text-black/60">{t("account.noReturns")}</p>;
  } else if (tab === "reviews") {
    content = myReviews.length ? (
      <ul className="space-y-4">
        {myReviews.map((r) => (
          <li key={r.id} className="rounded border border-black/15 p-4">
            <Link to={`/product/${r.pid}`} className="font-medium hover:text-brand">{getProduct(r.pid)?.name}</Link>
            <div className="mt-1"><Stars rating={r.rating} size={14} label={t("product.starsLabel", { count: r.rating })} /></div>
            <p className="mt-2 break-words text-sm">{r.text}</p>
            <time className="mt-1 block text-xs text-black/50">{new Date(r.date).toLocaleDateString(i18n.language)}</time>
          </li>
        ))}
      </ul>
    ) : <p className="py-6 text-black/60">{t("account.noReviews")}</p>;
  } else if (tab === "address") {
    content = (
      <div>
        <h2 className="text-xl font-medium text-brand">{t("account.addressBook")}</h2>
        <p className="mt-4 text-sm text-black/60">{t("account.addressSaved")}</p>
        <p className="mt-1">{user.address || <span className="text-black/60">{t("account.noAddress")}</span>}</p>
      </div>
    );
  } else if (tab === "payment") {
    content = (
      <div>
        <h2 className="text-xl font-medium text-brand">{t("account.paymentOptions")}</h2>
        <p className="mt-4 text-black/70">{t("account.noPayments")}</p>
      </div>
    );
  } else {
    content = <ProfileForm key={user.id} />;
  }

  return (
    <div className="container-x pt-6 sm:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Breadcrumb items={[{ label: t("common.home"), to: "/" }, { label: t("account.manage") }]} />
        {isLoggedIn && <p className="text-sm">{t("account.welcome")} <span className="text-brand">{user.name}</span></p>}
      </div>
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 sm:mt-20 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-[40px]">
        <nav aria-label={t("account.manage")} className="space-y-5">
          <div>
            <h2 className="font-medium">{t("account.manage")}</h2>
            <ul className="mt-3 flex flex-col ps-6">{[link("profile", t("account.myProfile")), link("address", t("account.addressBook")), link("payment", t("account.paymentOptions"))]}</ul>
          </div>
          <div>
            <h2 className="font-medium">{t("account.myOrders")}</h2>
            <ul className="mt-3 flex flex-col ps-6">{[link("orders", t("account.myOrders")), link("returns", t("account.myReturns")), link("cancellations", t("account.myCancellations")), link("reviews", t("account.myReviews"))]}</ul>
          </div>
          <Link to="/wishlist" className="block font-medium hover:text-brand">{t("account.myWishlist")}</Link>
        </nav>
        <section className="min-w-0 rounded bg-white p-6 shadow-[0_1px_13px_rgba(0,0,0,0.1)] sm:p-10 lg:px-[80px] lg:py-10">{content}</section>
      </div>
    </div>
  );
}
