import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Apple, ArrowRight, Camera, ChevronRight, Gamepad2, Headphones, Headset, Monitor, ShieldCheck, Smartphone, Truck, Watch } from "lucide-react";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard";
import { ArrowButtons, SectionHeading } from "../components/SectionHeading";
import useCountdown, { pad } from "../components/useCountdown";
import { KEYS } from "../lib/storage";
import { bestSelling, browseCategories, departments, exploreProducts, flashSales } from "../data/products";

const DAY = 86400000;
const catIcons = { phones: Smartphone, computers: Monitor, smartwatch: Watch, camera: Camera, headphones: Headphones, gaming: Gamepad2 };
const slideMeta = [
  { img: "/images/hero-iphone.jpg", to: "/product/iphone-14-pro", icon: true },
  { img: "/images/banner-jbl.jpg", to: "/product/jbl-boombox-speaker" },
  { img: "/images/ps5.jpg", to: "/product/playstation-5" },
  { img: "/images/perfume.jpg", to: "/product/gucci-intense-oud-edp" },
  { img: "/images/speakers.jpg", to: "/product/amazon-wireless-speakers" },
];

const redBtn = "inline-flex items-center justify-center rounded bg-brand px-8 py-3.5 text-base font-medium text-white transition hover:bg-brand-hover sm:px-12 sm:py-4";

function useScroller() {
  const ref = useRef(null);
  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    const rtl = document.documentElement.dir === "rtl";
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * Math.max(el.clientWidth * 0.8, 240), behavior: "smooth" });
  };
  return [ref, scroll];
}

/* ---------------- Hero ---------------- */
function Hero() {
  const { t } = useTranslation();
  const slides = t("hero.slides", { returnObjects: true });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % slideMeta.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const slide = slideMeta[index];
  const copy = Array.isArray(slides) ? slides[index] : null;

  return (
    <section className="container-x lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
      <aside aria-label="Departments" className="hidden border-e border-black/30 pe-4 pt-10 lg:block">
        <ul className="space-y-4">
          {departments.map((d) => (
            <li key={d.key} className="group/dept relative">
              <Link to={`/shop?dept=${d.key}`} className="flex items-center justify-between py-0.5 hover:text-brand">
                {t(`depts.${d.key}`)}
                {d.sub && <ChevronRight size={18} className="rtl:rotate-180" aria-hidden="true" />}
              </Link>
              {d.sub && (
                <ul className="invisible absolute start-full top-0 z-30 ms-4 w-52 space-y-1 rounded border border-black/10 bg-white p-3 opacity-0 shadow-lg transition group-focus-within/dept:visible group-focus-within/dept:opacity-100 group-hover/dept:visible group-hover/dept:opacity-100">
                  {d.sub.map((s) => (
                    <li key={s}>
                      <Link to={`/shop?dept=${d.key}`} className="block rounded px-3 py-1.5 text-sm hover:bg-soft hover:text-brand">
                        {t(`depts.sub.${s}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0 lg:ps-11 lg:pt-10">
        <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-3 lg:hidden" aria-label="Departments">
          {departments.map((d) => (
            <li key={d.key} className="shrink-0">
              <Link to={`/shop?dept=${d.key}`} className="block rounded-full border border-black/20 px-4 py-1.5 text-sm hover:border-brand hover:text-brand">
                {t(`depts.${d.key}`)}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className="relative overflow-hidden bg-black text-white"
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div key={index} className="fade-in grid min-h-[320px] grid-cols-1 items-center sm:min-h-[344px] sm:grid-cols-2">
            <div className="order-2 px-6 pb-14 pt-2 sm:order-1 sm:px-10 sm:py-10 lg:px-16">
              <div className="flex items-center gap-4 text-sm sm:text-base">
                {slide.icon && <Apple size={38} fill="currentColor" strokeWidth={0} aria-hidden="true" />}
                <span>{copy?.kicker}</span>
              </div>
              <h2 className="mt-4 max-w-[17rem] text-3xl font-semibold leading-tight tracking-[0.04em] sm:mt-5 sm:max-w-sm sm:text-4xl lg:text-5xl lg:leading-[60px]">
                {copy?.title}
              </h2>
              <Link to={slide.to} className="mt-5 inline-flex items-center gap-2 border-b border-white/70 pb-1 font-medium hover:border-white sm:mt-6">
                {t("common.shopNow")} <ArrowRight size={20} className="rtl:rotate-180" />
              </Link>
            </div>
            <div className="order-1 h-44 sm:order-2 sm:h-[344px]">
              <img src={slide.img} alt="" className="h-full w-full object-contain" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-3">
            {slideMeta.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("hero.slideLabel", { n: i + 1 })}
                aria-current={i === index}
                className={`h-3 w-3 rounded-full border-2 transition ${i === index ? "border-white bg-brand" : "border-transparent bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Flash sales ---------------- */
function FlashCountdown() {
  const { t } = useTranslation();
  const time = useCountdown(KEYS.flashEnd, 3 * DAY + 23 * 3600000 + 19 * 60000 + 56000);
  const units = [
    ["days", time.days],
    ["hours", time.hours],
    ["minutes", time.minutes],
    ["seconds", time.seconds],
  ];
  return (
    <div className="flex items-end gap-2 sm:gap-4" role="timer" aria-label={t("home.flashSales")}>
      {units.map(([key, value], i) => (
        <div key={key} className="flex items-end gap-2 sm:gap-4">
          <div>
            <div className="text-[11px] font-medium sm:text-xs">{t(`home.${key}`)}</div>
            <div className="font-heading text-2xl font-bold tracking-wider tabular-nums sm:text-[32px]">{pad(value)}</div>
          </div>
          {i < units.length - 1 && <span className="pb-1 text-xl font-bold text-brand/60 sm:pb-2 sm:text-3xl" aria-hidden="true">:</span>}
        </div>
      ))}
    </div>
  );
}

function FlashSales() {
  const { t } = useTranslation();
  const [ref, scroll] = useScroller();
  return (
    <section className="mt-12 border-b border-black/20 pb-14 sm:mt-20 sm:pb-16" aria-labelledby="flash-title">
      <SectionHeading kicker={t("home.today")} title={<span id="flash-title">{t("home.flashSales")}</span>} right={<ArrowButtons onPrev={() => scroll(-1)} onNext={() => scroll(1)} />}>
        <FlashCountdown />
      </SectionHeading>
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-0 sm:mx-0 sm:gap-[30px] sm:px-0">
        {flashSales.map((p) => (
          <div key={p.id} className="w-[190px] shrink-0 snap-start sm:w-[230px] lg:w-[270px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="mt-10 flex justify-center sm:mt-14">
        <Link to="/shop" className={redBtn}>{t("common.viewAllProducts")}</Link>
      </div>
    </section>
  );
}

/* ---------------- Categories ---------------- */
function Categories() {
  const { t } = useTranslation();
  const [ref, scroll] = useScroller();
  return (
    <section className="mt-14 border-b border-black/20 pb-14 sm:mt-16 sm:pb-16">
      <SectionHeading kicker={t("home.categories")} title={t("home.browseByCategory")} right={<ArrowButtons onPrev={() => scroll(-1)} onNext={() => scroll(1)} />} />
      <ul ref={ref} className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-0 sm:mx-0 sm:gap-[30px] sm:px-0">
        {browseCategories.map((key) => {
          const Icon = catIcons[key];
          return (
            <li key={key} className="shrink-0 snap-start">
              <Link
                to={`/shop?cat=${key}`}
                className="flex h-[110px] w-[130px] flex-col items-center justify-center gap-3 rounded border border-black/30 transition hover:border-brand hover:bg-brand hover:text-white sm:h-[145px] sm:w-[170px] sm:gap-4"
              >
                <Icon size={44} strokeWidth={1.4} aria-hidden="true" />
                <span className="text-sm sm:text-base">{t(`cats.${key}`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------------- Best selling ---------------- */
function BestSelling() {
  const { t } = useTranslation();
  return (
    <section className="mt-14 sm:mt-16">
      <SectionHeading kicker={t("home.thisMonth")} title={t("home.bestSelling")} right={<Link to="/shop" className={redBtn.replace("sm:px-12 sm:py-4", "sm:px-12 sm:py-3.5")}>{t("common.viewAll")}</Link>} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-[30px] lg:grid-cols-4">
        {bestSelling.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Music banner ---------------- */
function MusicBanner() {
  const { t } = useTranslation();
  const time = useCountdown(KEYS.bannerEnd, 5 * DAY + 23 * 3600000 + 59 * 60000 + 35000);
  const units = [["days", time.days], ["hours", time.hours], ["minutes", time.minutes], ["seconds", time.seconds]];
  return (
    <section className="mt-16 overflow-hidden bg-black text-white sm:mt-[70px]">
      <div className="grid items-center gap-4 md:grid-cols-2">
        <div className="px-6 pt-10 sm:px-14 sm:py-14">
          <p className="font-semibold text-mint">{t("home.musicKicker")}</p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-[0.04em] sm:mt-6 sm:text-5xl sm:leading-[60px]">{t("home.musicTitle")}</h2>
          <ul className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-6" role="timer" aria-label={t("home.musicTitle")}>
            {units.map(([key, value]) => (
              <li key={key} className="flex h-[58px] w-[58px] flex-col items-center justify-center rounded-full bg-white text-black sm:h-[62px] sm:w-[62px]">
                <span className="text-base font-semibold leading-none tabular-nums">{pad(value)}</span>
                <span className="mt-0.5 text-[10px] leading-none">{t(`home.${key}`)}</span>
              </li>
            ))}
          </ul>
          <Link to="/product/jbl-boombox-speaker" className="mt-8 inline-flex rounded bg-mint px-10 py-3.5 font-medium text-black transition hover:brightness-90 sm:mt-10 sm:px-12 sm:py-4">
            {t("home.buyNow")}
          </Link>
        </div>
        <img src="/images/banner-jbl.jpg" alt="" loading="lazy" className="h-64 w-full object-cover object-left sm:h-[420px] md:h-full md:max-h-[500px]" />
      </div>
    </section>
  );
}

/* ---------------- Explore ---------------- */
function Explore() {
  const { t } = useTranslation();
  const PAGE = 8;
  const pages = Math.ceil(exploreProducts.length / PAGE);
  const [page, setPage] = useState(0);
  const visible = exploreProducts.slice(page * PAGE, page * PAGE + PAGE);
  return (
    <section className="mt-16 sm:mt-[70px]">
      <SectionHeading
        kicker={t("home.ourProducts")}
        title={t("home.explore")}
        right={
          <ArrowButtons
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(pages - 1, p + 1))}
            prevDisabled={page === 0}
            nextDisabled={page === pages - 1}
            prevLabel={t("home.previousPage")}
            nextLabel={t("home.nextPage")}
          />
        }
      />
      <div key={page} className="fade-in grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-[30px] sm:gap-y-[60px] lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} showColors />
        ))}
      </div>
      <div className="mt-12 flex justify-center sm:mt-[60px]">
        <Link to="/shop" className={redBtn}>{t("common.viewAllProducts")}</Link>
      </div>
    </section>
  );
}

/* ---------------- New arrival ---------------- */
function Tile({ img, imgClass, title, text, to, className = "" }) {
  const { t } = useTranslation();
  return (
    <div className={`relative overflow-hidden bg-[#0d0d0d] text-white ${className}`}>
      {img && <img src={img} alt="" loading="lazy" className={`absolute ${imgClass}`} />}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-16 sm:p-8 sm:pt-20">
        <h3 className="text-xl font-semibold tracking-[0.04em] sm:text-2xl">{title}</h3>
        <p className="mt-2 max-w-[260px] text-sm">{text}</p>
        <Link to={to} className="mt-3 inline-block border-b border-white/70 pb-0.5 text-sm font-medium hover:border-white sm:mt-4 sm:text-base">
          {t("common.shopNow")}
        </Link>
      </div>
    </div>
  );
}

function NewArrival() {
  const { t } = useTranslation();
  return (
    <section className="mt-16 sm:mt-[140px]">
      <SectionHeading kicker={t("home.featured")} title={t("home.newArrival")} />
      <div className="grid gap-4 sm:gap-[30px] lg:grid-cols-2 lg:grid-rows-2">
        <Tile
          className="min-h-[400px] lg:row-span-2 lg:min-h-[600px]"
          img="/images/ps5.jpg"
          imgClass="inset-x-0 top-0 h-[75%] w-full object-cover object-top"
          title={t("home.ps5Title")}
          text={t("home.ps5Text")}
          to="/product/playstation-5"
        />
        <Tile className="min-h-[260px] bg-gradient-to-br from-zinc-900 to-black lg:min-h-[285px]" title={t("home.womenTitle")} text={t("home.womenText")} to="/shop?dept=womens" />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-[30px]">
          <Tile
            className="min-h-[260px] lg:min-h-[285px]"
            img="/images/speakers.jpg"
            imgClass="inset-x-0 top-0 h-[68%] w-full object-cover object-top"
            title={t("home.speakersTitle")}
            text={t("home.speakersText")}
            to="/product/amazon-wireless-speakers"
          />
          <Tile
            className="min-h-[260px] lg:min-h-[285px]"
            img="/images/perfume.jpg"
            imgClass="inset-x-0 top-0 h-[68%] w-full object-cover object-top"
            title={t("home.perfumeTitle")}
            text={t("home.perfumeText")}
            to="/product/gucci-intense-oud-edp"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */
function Services() {
  const { t } = useTranslation();
  const items = [
    { icon: Truck, title: t("home.deliveryTitle"), text: t("home.deliveryText") },
    { icon: Headset, title: t("home.supportTitle"), text: t("home.supportText") },
    { icon: ShieldCheck, title: t("home.guaranteeTitle"), text: t("home.guaranteeText") },
  ];
  return (
    <section className="mx-auto mt-16 grid max-w-4xl gap-10 sm:mt-[140px] sm:grid-cols-3 sm:gap-8" aria-label="Services">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex flex-col items-center px-4 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-black/25">
            <span className="grid h-[58px] w-[58px] place-items-center rounded-full bg-black text-white">
              <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </span>
          <h3 className="mt-6 text-lg font-semibold sm:text-xl">{title}</h3>
          <p className="mt-2 text-sm">{text}</p>
        </div>
      ))}
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container-x">
        <FlashSales />
        <Categories />
        <BestSelling />
        <MusicBanner />
        <Explore />
        <NewArrival />
        <Services />
      </div>
    </>
  );
}
