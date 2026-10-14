import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";

export default function NotFound({ message }) {
  const { t } = useTranslation();
  return (
    <div className="container-x pt-6 sm:pt-16">
      <Breadcrumb items={[{ label: t("common.home"), to: "/" }, { label: t("notFound.crumb") }]} />
      <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center py-10 text-center sm:mt-28">
        <h1 className="text-5xl font-medium tracking-[0.03em] sm:text-7xl lg:text-[110px] lg:leading-[115px]">{t("notFound.title")}</h1>
        <p className="mt-8 sm:mt-10">{message || t("notFound.text")}</p>
        <Link to="/" className="mt-10 rounded bg-brand px-10 py-3.5 font-medium text-white transition hover:bg-brand-hover sm:mt-20 sm:px-12 sm:py-4">
          {t("notFound.back")}
        </Link>
      </div>
    </div>
  );
}
