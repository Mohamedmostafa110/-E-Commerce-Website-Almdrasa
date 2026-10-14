import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShop } from "../context/ShopContext";
import { money } from "../lib/format";
import Stars from "./Stars";

export default function ProductCard({ product, showColors = false, className = "" }) {
  const { t } = useTranslation();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const liked = inWishlist(product.id);
  const to = `/product/${product.id}`;

  return (
    <article data-testid="product-card" className={`group w-full min-w-0 ${className}`}>
      <div className="relative aspect-[270/250] overflow-hidden rounded bg-soft">
        <Link to={to} tabIndex={-1} aria-hidden="true" className="block h-full w-full">
          <img src={product.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </Link>

        {product.discount ? (
          <span className="absolute start-2 top-2 rounded bg-brand px-3 py-1 text-xs text-white sm:start-3 sm:top-3">-{product.discount}%</span>
        ) : product.isNew ? (
          <span className="absolute start-2 top-2 rounded bg-mint px-3 py-1 text-xs text-black sm:start-3 sm:top-3">{t("product.new")}</span>
        ) : null}

        <div className="absolute end-2 top-2 flex flex-col gap-2 sm:end-3 sm:top-3">
          <button
            type="button"
            data-testid="add-to-wishlist"
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={liked}
            aria-label={liked ? t("product.removeFromWishlist") : t("product.addToWishlist")}
            className="grid h-[34px] w-[34px] place-items-center rounded-full bg-white shadow-sm transition hover:bg-brand hover:text-white"
          >
            <Heart size={18} className={liked ? "fill-brand text-brand hover:text-white" : ""} />
          </button>
          <Link
            to={to}
            aria-label={t("product.quickView")}
            className="grid h-[34px] w-[34px] place-items-center rounded-full bg-white shadow-sm transition hover:bg-brand hover:text-white"
          >
            <Eye size={18} />
          </Link>
        </div>

        <button
          type="button"
          data-testid="add-to-cart"
          onClick={() => addToCart(product.id)}
          className="absolute inset-x-0 bottom-0 bg-black py-2.5 text-center text-sm text-white opacity-0 transition-opacity hover:bg-black/85 focus-visible:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        >
          {t("common.addToCart")}
        </button>
      </div>

      <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
        <Link data-testid="product-link" to={to} className="block truncate font-medium hover:text-brand" title={product.name}>
          {product.name}
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-medium text-brand">{money(product.price)}</span>
          {product.oldPrice && <s className="font-medium text-black/50">{money(product.oldPrice)}</s>}
        </div>
        <div className="flex items-center gap-2">
          <Stars rating={product.rating} label={t("product.starsLabel", { count: product.rating })} />
          <span className="text-sm font-semibold text-black/50">({product.reviews})</span>
        </div>
        {showColors && product.colors.length > 0 && (
          <div className="flex gap-2 pt-0.5" aria-hidden="true">
            {product.colors.map((c, i) => (
              <span key={c} className={`h-5 w-5 rounded-full border-2 ${i === 0 ? "border-black" : "border-transparent"}`} style={{ background: c }} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
