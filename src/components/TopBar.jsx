import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

export default function TopBar() {
  const { t, i18n } = useTranslation();
  return (
    <div className="bg-black text-white">
      <div className="container-x flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
        <p className="min-w-0 flex-1 text-center leading-snug sm:ps-24">
          {t("topbar.sale")}{" "}
          <Link to="/shop" className="ms-1 inline-block font-semibold underline underline-offset-2">
            {t("topbar.shopNow")}
          </Link>
        </p>
        <div className="relative shrink-0">
          <select
            data-testid="lang-switch"
            aria-label={t("topbar.language")}
            value={i18n.resolvedLanguage || i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="cursor-pointer appearance-none bg-transparent py-1 pe-6 ps-1 text-xs text-white focus-visible:outline-white sm:text-sm"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-black text-white">
                {l.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute end-0 top-1/2 -translate-y-1/2" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
