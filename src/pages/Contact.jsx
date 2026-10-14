import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb";
import { useShop } from "../context/ShopContext";

const field = "h-[50px] w-full rounded bg-soft px-4 outline-none placeholder:text-black/50 focus:ring-2 focus:ring-brand/40";

export default function Contact() {
  const { t } = useTranslation();
  const { notify } = useShop();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    notify(t("contact.sent"));
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="container-x pt-6 sm:pt-16">
      <Breadcrumb items={[{ label: t("common.home"), to: "/" }, { label: t("common.contact") }]} />
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-16 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-[30px]">
        <section className="rounded bg-white p-6 shadow-[0_1px_13px_rgba(0,0,0,0.1)] sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white"><Phone size={20} aria-hidden="true" /></span>
            <h1 className="font-medium">{t("contact.callTitle")}</h1>
          </div>
          <p className="mt-6 text-sm">{t("contact.callText")}</p>
          <p className="mt-4 text-sm">{t("contact.phone")}</p>
          <hr className="my-6 border-black/50" />
          <div className="flex items-center gap-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white"><Mail size={20} aria-hidden="true" /></span>
            <h2 className="font-medium">{t("contact.writeTitle")}</h2>
          </div>
          <p className="mt-6 text-sm">{t("contact.writeText")}</p>
          <p className="mt-4 break-words text-sm">{t("contact.emails")}</p>
          <p className="mt-4 break-words text-sm">{t("contact.emails2")}</p>
        </section>

        <form onSubmit={submit} className="rounded bg-white p-6 shadow-[0_1px_13px_rgba(0,0,0,0.1)] sm:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <input required name="name" autoComplete="name" value={form.name} onChange={set("name")} placeholder={`${t("contact.yourName")} *`} aria-label={t("contact.yourName")} className={field} />
            <input required type="email" name="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder={`${t("contact.yourEmail")} *`} aria-label={t("contact.yourEmail")} className={field} />
            <input required type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder={`${t("contact.yourPhone")} *`} aria-label={t("contact.yourPhone")} className={field} />
          </div>
          <textarea name="message" rows={8} value={form.message} onChange={set("message")} placeholder={t("contact.yourMessage")} aria-label={t("contact.yourMessage")} className="mt-4 w-full resize-y rounded bg-soft p-4 outline-none placeholder:text-black/50 focus:ring-2 focus:ring-brand/40" />
          <div className="mt-6 flex justify-end">
            <button type="submit" className="w-full rounded bg-brand px-12 py-4 font-medium text-white transition hover:bg-brand-hover sm:w-auto">{t("contact.send")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
