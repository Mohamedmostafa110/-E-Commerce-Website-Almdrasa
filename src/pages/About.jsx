import { DollarSign, Headset, Instagram, Linkedin, ShieldCheck, ShoppingBag, Store, Truck, Twitter, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";

const team = [
  { name: "Tom Cruise", role: "about.role1", img: "/images/team-1.jpg" },
  { name: "Emma Watson", role: "about.role2", img: "/images/team-2.jpg" },
  { name: "Will Smith", role: "about.role3", img: "/images/team-3.jpg" },
];

export default function About() {
  const { t } = useTranslation();
  const stats = [
    { icon: Store, value: "10.5k", label: t("about.stat1") },
    { icon: DollarSign, value: "33k", label: t("about.stat2"), highlight: true },
    { icon: ShoppingBag, value: "45.5k", label: t("about.stat3") },
    { icon: Wallet, value: "25k", label: t("about.stat4") },
  ];
  const services = [
    { icon: Truck, title: t("home.deliveryTitle"), text: t("home.deliveryText") },
    { icon: Headset, title: t("home.supportTitle"), text: t("home.supportText") },
    { icon: ShieldCheck, title: t("home.guaranteeTitle"), text: t("home.guaranteeText") },
  ];
  return (
    <div className="pt-6 sm:pt-16">
      <div className="container-x">
        <Breadcrumb items={[{ label: t("common.home"), to: "/" }, { label: t("common.about") }]} />
      </div>

      <section className="mt-10 grid items-center gap-10 sm:mt-14 lg:grid-cols-2 lg:gap-16">
        <div className="container-x lg:me-0 lg:max-w-none lg:pe-0 lg:ps-[max(30px,calc((100vw-1170px)/2))]">
          <h1 className="text-4xl font-semibold tracking-[0.06em] sm:text-5xl">{t("about.story")}</h1>
          <p className="mt-8 max-w-[525px] leading-7 sm:mt-10">{t("about.p1")}</p>
          <p className="mt-6 max-w-[525px] leading-7">{t("about.p2")}</p>
        </div>
        <div className="mx-4 grid h-64 place-items-center rounded bg-[#eb7ba6] sm:mx-6 sm:h-96 lg:mx-0 lg:h-[400px] lg:rounded-e-none lg:rounded-s" aria-hidden="true">
          <ShoppingBag size={120} strokeWidth={1} className="text-white/70" />
        </div>
      </section>

      <div className="container-x">
        <ul className="mt-16 grid grid-cols-1 gap-6 sm:mt-24 sm:grid-cols-2 sm:gap-[30px] lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label, highlight }) => (
            <li
              key={value}
              className={`flex flex-col items-center rounded border px-6 py-8 text-center transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-lg sm:py-10 ${highlight ? "border-brand bg-brand text-white shadow-lg" : "border-black/30"}`}
            >
              <span className={`grid h-20 w-20 place-items-center rounded-full ${highlight ? "bg-white/30" : "bg-black/25"}`}>
                <span className={`grid h-[58px] w-[58px] place-items-center rounded-full ${highlight ? "bg-white text-black" : "bg-black text-white"}`}>
                  <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
                </span>
              </span>
              <p className="mt-6 font-heading text-3xl font-bold tracking-[0.06em]">{value}</p>
              <p className="mt-2">{label}</p>
            </li>
          ))}
        </ul>

        <ul className="mt-16 grid gap-8 sm:mt-24 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
          {team.map((m) => (
            <li key={m.name}>
              <div className="overflow-hidden rounded bg-soft">
                <img src={m.img} alt={m.name} loading="lazy" className="aspect-[260/300] w-full object-cover object-top" />
              </div>
              <h2 className="mt-6 text-2xl font-medium tracking-[0.06em] sm:text-3xl">{m.name}</h2>
              <p className="mt-1">{t(m.role)}</p>
              <div className="mt-4 flex gap-4">
                <Twitter size={22} aria-label="Twitter" />
                <Instagram size={22} aria-label="Instagram" />
                <Linkedin size={22} aria-label="LinkedIn" />
              </div>
            </li>
          ))}
        </ul>

        <section className="mx-auto mt-16 grid max-w-4xl gap-10 sm:mt-24 sm:grid-cols-3 sm:gap-8" aria-label="Services">
          {services.map(({ icon: Icon, title, text }) => (
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
      </div>
    </div>
  );
}
