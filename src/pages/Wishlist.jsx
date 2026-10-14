import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard";
import Stars from "../components/Stars";
import { Kicker } from "../components/SectionHeading";
import { useShop } from "../context/ShopContext";
import { byIds, products } from "../data/products";
import { money } from "../lib/format";

function WishlistCard({ product }) {
  const { t } = useTranslation();
  const { addToCart, removeFromWishlist } = useShop();
  return (
    <article data-testid="wishlist-item" className="min-w-0">
      <div className="relative aspect-[270/250] overflow-hidden rounded bg-soft">
        <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
          <img src={product.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </Link>
        {product.discount ? <span className="absolute start-2 top-2 rounded bg-brand px-3 py-1 text-xs text-white sm:start-3 sm:top-3">-{product.discount}%</span> : null}
        <button
          type="button"
          data-testid="remove-from-wishlist"
          onClick={() => removeFromWishlist(product.id)}
          aria-label={`${t("wishlist.remove")}: ${product.name}`}
          className="absolute end-2 top-2 grid h-[34px] w-[34px] place-items-center rounded-full bg-white shadow-sm hover:bg-brand hover:text-white sm:end-3 sm:top-3"
        >
          <Trash2 size={18} />
        </button>
        <button
          type="button"
          data-testid="wishlist-add-to-cart"
          onClick={() => addToCart(product.id)}
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black py-2.5 text-sm text-white hover:bg-black/85"
        >
          <ShoppingCart size={18} aria-hidden="true" />
          {t("common.addToCart")}
        </button>
      </div>
      <Link to={`/product/${product.id}`} className="mt-4 block truncate font-medium hover:text-brand">{product.name}</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="font-medium text-brand">{money(product.price)}</span>
        {product.oldPrice && <s className="font-medium text-black/50">{money(product.oldPrice)}</s>}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Stars rating={product.rating} label={t("product.starsLabel", { count: product.rating })} />
        <span className="text-sm font-semibold text-black/50">({product.reviews})</span>
      </div>
    </article>
  );
}

export default function Wishlist() {
  const { t } = useTranslation();
  const { wishlist, moveAllToCart } = useShop();
  const items = byIds(wishlist);
  const suggestions = products.filter((p) => !wishlist.includes(p.id)).slice(10, 14).concat(products.filter((p) => !wishlist.includes(p.id)).slice(0, 4)).slice(0, 4);

  return (
    <div className="container-x pt-8 sm:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl">{t("wishlist.title", { count: items.length })}</h1>
        {items.length > 0 && (
          <button type="button" onClick={moveAllToCart} className="rounded border border-black/50 px-8 py-3.5 font-medium transition hover:bg-black hover:text-white sm:px-12 sm:py-4">
            {t("wishlist.moveAll")}
          </button>
        )}
      </div>

      {items.length ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-14 sm:gap-[30px] md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <WishlistCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="mx-auto mt-14 flex max-w-md flex-col items-center py-8 text-center">
          <Heart size={64} strokeWidth={1.2} className="text-black/40" aria-hidden="true" />
          <h2 className="mt-6 text-2xl font-semibold">{t("wishlist.empty")}</h2>
          <p className="mt-2 text-black/60">{t("wishlist.emptyHint")}</p>
        </div>
      )}

      <section className="mt-16 sm:mt-[80px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Kicker><span className="text-base font-normal text-black sm:text-xl">{t("wishlist.justForYou")}</span></Kicker>
          <Link to="/shop" className="rounded border border-black/50 px-8 py-3.5 font-medium transition hover:bg-black hover:text-white sm:px-12 sm:py-4">{t("wishlist.seeAll")}</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-14 sm:gap-[30px] lg:grid-cols-4">
          {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
