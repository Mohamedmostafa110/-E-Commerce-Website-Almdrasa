import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useShop } from "../context/ShopContext";

export default function CouponBox({ className = "" }) {
  const { t } = useTranslation();
  const { applyCoupon, removeCoupon, coupon } = useShop();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);

  const apply = () => {
    const res = applyCoupon(code);
    setMsg(res.ok ? { ok: true, text: t("cart.couponApplied", { code: code.trim().toUpperCase(), pct: res.pct }) } : { ok: false, text: t("cart.couponInvalid") });
    if (res.ok) setCode("");
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <input
          name="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply();
            }
          }}
          placeholder={t("cart.couponCode")}
          aria-label={t("cart.couponCode")}
          className="h-14 min-w-0 flex-1 basis-40 rounded border border-black/60 bg-white px-4 outline-none focus:border-brand"
        />
        <button type="button" onClick={apply} className="h-14 rounded bg-brand px-8 font-medium text-white transition hover:bg-brand-hover">
          {t("cart.applyCoupon")}
        </button>
      </div>
      {coupon && (
        <p className="mt-3 text-sm text-emerald-700">
          {t("cart.couponApplied", { code: coupon.code, pct: coupon.pct })}{" "}
          <button type="button" onClick={() => { removeCoupon(); setMsg(null); }} className="underline">{t("cart.removeCoupon")}</button>
        </p>
      )}
      {!coupon && msg && !msg.ok && <p role="alert" className="mt-3 text-sm text-brand">{msg.text}</p>}
    </div>
  );
}
