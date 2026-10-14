import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Kicker({ children }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="block h-8 w-4 rounded-[4px] bg-brand sm:h-10 sm:w-5" aria-hidden="true" />
      <span className="text-sm font-semibold text-brand sm:text-base">{children}</span>
    </div>
  );
}

export function ArrowButtons({ onPrev, onNext, prevDisabled, nextDisabled, prevLabel, nextLabel }) {
  const { t } = useTranslation();
  const cls =
    "grid h-9 w-9 place-items-center rounded-full bg-soft text-black transition hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-soft disabled:hover:text-black sm:h-[46px] sm:w-[46px]";
  return (
    <div className="flex shrink-0 gap-2">
      <button type="button" className={cls} onClick={onPrev} disabled={prevDisabled} aria-label={prevLabel || t("common.previous")}>
        <ArrowLeft size={20} className="rtl:rotate-180" />
      </button>
      <button type="button" className={cls} onClick={onNext} disabled={nextDisabled} aria-label={nextLabel || t("common.next")}>
        <ArrowRight size={20} className="rtl:rotate-180" />
      </button>
    </div>
  );
}

export function SectionHeading({ kicker, title, children, right }) {
  return (
    <div className="mb-8 sm:mb-10">
      <Kicker>{kicker}</Kicker>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mt-5">
        <div className="flex flex-wrap items-end gap-x-10 gap-y-4 lg:gap-x-[87px]">
          <h2 className="text-2xl font-semibold tracking-[0.04em] sm:text-4xl">{title}</h2>
          {children}
        </div>
        {right}
      </div>
    </div>
  );
}
