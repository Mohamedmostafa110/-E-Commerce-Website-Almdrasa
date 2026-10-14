import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import ProductCard from "../components/ProductCard";
import { products, searchProducts } from "../data/products";

const sorters = {
  default: null,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
};

/** Shared listing page: /shop (all, ?dept=, ?cat=) and /search?q= */
export default function Shop({ search = false }) {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [sort, setSort] = useState("default");
  const q = (params.get("q") || "").trim();
  const dept = params.get("dept");
  const cat = params.get("cat");

  const { list, title } = useMemo(() => {
    let base;
    let heading;
    if (search) {
      base = searchProducts(q);
      heading = q ? t("shop.searchResults", { q }) : t("shop.allProducts");
    } else {
      base = products.filter((p) => (!dept || p.dept === dept) && (!cat || p.cat === cat));
      heading = dept ? t(`depts.${dept}`) : cat ? t(`cats.${cat}`) : t("shop.allProducts");
    }
    const fn = sorters[sort];
    return { list: fn ? [...base].sort(fn) : base, title: heading };
  }, [search, q, dept, cat, sort, t]);

  return (
    <div className="container-x pt-6 pb-4 sm:pt-16">
      <Breadcrumb items={[{ label: t("common.home"), to: "/" }, { label: search ? t("header.search") : t("common.products"), to: search ? undefined : "/shop" }, ...(search || dept || cat ? [{ label: search ? q || t("shop.allProducts") : title }] : [])]} />

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 sm:mt-12">
        <div>
          <h1 className="text-2xl font-semibold tracking-[0.03em] sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-black/60" aria-live="polite">{t("shop.resultsCount", { count: list.length })}</p>
        </div>
        {list.length > 1 && (
          <label className="flex items-center gap-3 text-sm">
            <span className="text-black/60">{t("shop.sortBy")}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded border border-black/30 bg-white px-3 py-2">
              <option value="default">{t("shop.sortDefault")}</option>
              <option value="priceAsc">{t("shop.sortPriceAsc")}</option>
              <option value="priceDesc">{t("shop.sortPriceDesc")}</option>
              <option value="rating">{t("shop.sortRating")}</option>
            </select>
          </label>
        )}
      </div>

      {list.length ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-10 sm:gap-x-[30px] sm:gap-y-[50px] md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} showColors />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-16 max-w-md py-10 text-center">
          <p className="text-lg">{search ? t("shop.noResults", { q }) : t("shop.noProducts")}</p>
          <Link to="/shop" className="mt-6 inline-flex rounded bg-brand px-10 py-3.5 text-white hover:bg-brand-hover">
            {t("shop.clearFilters")}
          </Link>
        </div>
      )}
    </div>
  );
}
