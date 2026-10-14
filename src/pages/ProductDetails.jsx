import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Minus, Plus, RefreshCw, Star, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import ProductCard from "../components/ProductCard";
import Stars from "../components/Stars";
import { Kicker } from "../components/SectionHeading";
import NotFound from "./NotFound";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { getProduct, products, seededReviews } from "../data/products";
import { money } from "../lib/format";
import { KEYS, store } from "../lib/storage";

function Reviews({ product }) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { notify } = useShop();
  const [mine, setMine] = useState(() => store.get(KEYS.reviews, {})[product.id] || []);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const all = useMemo(() => [...mine, ...seededReviews(product.id)], [mine, product.id]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError(t("product.reviewRequired"));
      return;
    }
    const review = {
      id: `r_${Date.now()}`,
      author: user?.name || t("product.guest"),
      userId: user?.id || null,
      rating,
      text: text.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    const next = [review, ...mine];
    setMine(next);
    const all = store.get(KEYS.reviews, {});
    store.set(KEYS.reviews, { ...all, [product.id]: next });
    setText("");
    setRating(5);
    setError("");
    notify(t("product.reviewAdded"));
  };

  return (
    <section className="mt-16 sm:mt-24" aria-labelledby="reviews-title">
      <Kicker>{t("product.reviewsTitle")}</Kicker>
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16">
        <form onSubmit={submit} noValidate className="space-y-4">
          <h2 id="reviews-title" className="text-xl font-semibold">{t("product.writeReview")}</h2>
          <fieldset>
            <legend className="mb-2 text-sm text-black/60">{t("product.yourRating")}</legend>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={t("product.rateStars", { count: n })}
                  aria-pressed={rating === n}
                  className="rounded p-0.5"
                >
                  <Star size={26} strokeWidth={0} fill="currentColor" className={n <= rating ? "text-star" : "text-black/25"} aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
          <textarea
            data-testid="review-text"
            name="review"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError("");
            }}
            rows={4}
            placeholder={t("product.reviewPlaceholder")}
            aria-label={t("product.writeReview")}
            className="w-full resize-y rounded bg-soft p-4 outline-none placeholder:text-black/50 focus:ring-2 focus:ring-brand/40"
          />
          {error && <p role="alert" className="text-sm text-brand">{error}</p>}
          <button data-testid="review-submit" type="submit" className="rounded bg-brand px-10 py-3 font-medium text-white transition hover:bg-brand-hover">
            {t("product.submitReview")}
          </button>
        </form>

        <ul className="space-y-4" aria-label={t("product.reviewsTitle")}>
          {all.length === 0 && <li className="text-black/60">{t("product.noReviews")}</li>}
          {all.map((r) => (
            <li key={r.id} data-testid="review" className="rounded border border-black/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-semibold text-white" aria-hidden="true">
                    {(r.author || "?").trim().charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-medium">{r.author}</p>
                    <Stars rating={r.rating} size={14} label={t("product.starsLabel", { count: r.rating })} />
                  </div>
                </div>
                <time className="text-xs text-black/50" dateTime={r.date}>
                  {new Date(r.date).toLocaleDateString(i18n.language)}
                </time>
              </div>
              <p className="mt-3 break-words text-sm leading-6">{r.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Details({ product }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(product.sizes.includes("M") ? "M" : product.sizes[0]);
  const [qty, setQty] = useState(1);
  const liked = inWishlist(product.id);
  const userReviews = (store.get(KEYS.reviews, {})[product.id] || []).length;

  const related = useMemo(() => {
    const same = products.filter((p) => p.id !== product.id && (p.cat === product.cat || p.dept === product.dept));
    const rest = products.filter((p) => p.id !== product.id && !same.includes(p));
    return [...same, ...rest].slice(0, 4);
  }, [product]);

  const buyNow = () => {
    addToCart(product.id, qty, { silent: true });
    navigate("/checkout");
  };

  return (
    <div className="container-x pt-6 sm:pt-16">
      <Breadcrumb
        items={[
          { label: t("common.home"), to: "/" },
          { label: t(`cats.${product.cat}`), to: `/shop?cat=${product.cat}` },
          { label: product.name },
        ]}
      />

      <section data-testid="product-details" className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 sm:mt-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-[70px]">
        <div className="flex min-w-0 flex-col-reverse gap-3 sm:flex-row sm:gap-[30px]">
          {product.images.length > 1 && (
            <div className="no-scrollbar flex gap-3 overflow-x-auto sm:w-[120px] sm:shrink-0 sm:flex-col sm:gap-4 sm:overflow-visible">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`${product.name} ${i + 1}`}
                  aria-current={i === active}
                  className={`aspect-[170/138] w-20 shrink-0 overflow-hidden rounded bg-soft sm:w-full ${i === active ? "ring-2 ring-brand" : ""}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="grid min-h-[300px] flex-1 place-items-center overflow-hidden rounded bg-soft sm:min-h-[420px] lg:min-h-[600px]">
            <img src={product.images[active]} alt={product.name} className="max-h-[620px] w-full object-contain" />
          </div>
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-[0.03em]">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <Stars rating={product.rating} label={t("product.starsLabel", { count: product.rating })} />
            <span className="text-black/50">{t("product.reviewsCount", { count: product.reviews + userReviews })}</span>
            <span className="hidden h-4 w-px bg-black/40 sm:block" aria-hidden="true" />
            <span className="text-emerald-600">{t("product.inStock")}</span>
          </div>
          <p className="mt-4 flex flex-wrap items-baseline gap-3 text-2xl tracking-[0.03em]">
            <span>{money(product.price)}</span>
            {product.oldPrice && <s className="text-base text-black/50">{money(product.oldPrice)}</s>}
          </p>
          <p className="mt-5 border-b border-black/60 pb-6 text-sm leading-6">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <span className="text-xl tracking-[0.03em]">{t("product.colours")}</span>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(i)}
                    aria-label={c}
                    aria-pressed={i === color}
                    className={`grid h-5 w-5 place-items-center rounded-full border-2 ${i === color ? "border-black" : "border-transparent"}`}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ background: c }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="text-xl tracking-[0.03em]">{t("product.size")}</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={s === size}
                    className={`h-8 min-w-8 rounded border px-2 text-sm font-medium transition ${s === size ? "border-brand bg-brand text-white" : "border-black/50 hover:border-brand"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-stretch gap-3 sm:gap-4">
            <div className="flex h-11 items-stretch overflow-hidden rounded border border-black/50">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t("product.decrease")} className="grid w-10 place-items-center hover:bg-brand hover:text-white">
                <Minus size={20} />
              </button>
              <output aria-label={t("product.quantity")} className="grid w-14 place-items-center border-x border-black/50 text-xl font-medium sm:w-20">{qty}</output>
              <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label={t("product.increase")} className="grid w-10 place-items-center bg-brand text-white hover:bg-brand-hover">
                <Plus size={20} />
              </button>
            </div>
            <button type="button" onClick={buyNow} className="h-11 min-w-[140px] flex-1 rounded bg-brand px-6 font-medium text-white transition hover:bg-brand-hover sm:flex-none sm:px-12">
              {t("product.buyNow")}
            </button>
            <button
              type="button"
              data-testid="detail-wishlist"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={liked}
              aria-label={liked ? t("product.removeFromWishlist") : t("product.addToWishlist")}
              className="grid h-11 w-11 place-items-center rounded border border-black/50 hover:border-brand"
            >
              <Heart size={22} className={liked ? "fill-brand text-brand" : ""} />
            </button>
          </div>
          <button
            type="button"
            data-testid="detail-add-to-cart"
            onClick={() => addToCart(product.id, qty)}
            className="mt-3 h-11 w-full rounded border border-black/50 font-medium transition hover:bg-black hover:text-white"
          >
            {t("common.addToCart")}
          </button>

          <div className="mt-8 divide-y divide-black/50 rounded border border-black/50">
            <div className="flex items-center gap-4 p-4 sm:p-5">
              <Truck size={36} strokeWidth={1.4} className="shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">{t("product.freeDelivery")}</p>
                <p className="mt-1 text-xs font-medium underline">{t("product.deliveryNote")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 sm:p-5">
              <RefreshCw size={36} strokeWidth={1.4} className="shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">{t("product.returnDelivery")}</p>
                <p className="mt-1 text-xs font-medium">
                  {t("product.returnNote")} <Link to="/about" className="underline">{t("product.details")}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reviews key={product.id} product={product} />

      <section className="mt-16 sm:mt-24">
        <Kicker>{t("product.relatedItem")}</Kicker>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-10 sm:gap-[30px] lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const product = getProduct(id);
  if (!product) return <NotFound message={t("product.notFound")} />;
  return <Details key={product.id} product={product} />;
}
