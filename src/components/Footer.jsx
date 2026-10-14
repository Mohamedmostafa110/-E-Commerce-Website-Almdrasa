import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShop } from "../context/ShopContext";

const linkCls = "block py-1 text-white/90 transition hover:text-white hover:underline";

export default function Footer() {
  const { t } = useTranslation();
  const { notify } = useShop();
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    notify(t("footer.subscribed"));
    setEmail("");
  };

  return (
    <footer className="mt-20 bg-black text-white md:mt-32">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_0.9fr_0.9fr_1.1fr] lg:gap-8 lg:py-20">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-[0.03em]">Exclusive</h2>
          <h3 className="mt-6 text-xl font-medium">{t("footer.subscribe")}</h3>
          <p className="mt-4">{t("footer.offer")}</p>
          <form onSubmit={subscribe} className="mt-4 flex items-center rounded border border-white/60 ps-4 pe-2 focus-within:border-white">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.emailPlaceholder")}
              aria-label={t("footer.emailPlaceholder")}
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-white/50"
            />
            <button type="submit" aria-label={t("footer.subscribeAction")} className="grid h-9 w-9 place-items-center">
              <Send size={22} className="rtl:-scale-x-100" />
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-medium">{t("footer.support")}</h3>
          <address className="mt-6 space-y-4 not-italic">
            <p className="max-w-[175px]">{t("footer.address")}</p>
            <p><a href="mailto:exclusive@gmail.com" className="hover:underline">exclusive@gmail.com</a></p>
            <p dir="ltr" className="text-start"><a href="tel:+88015888889999" className="hover:underline">+88015-88888-9999</a></p>
          </address>
        </div>

        <div>
          <h3 className="text-xl font-medium">{t("footer.account")}</h3>
          <ul className="mt-6 space-y-2">
            <li><Link className={linkCls} to="/account">{t("footer.myAccount")}</Link></li>
            <li><Link className={linkCls} to="/login">{t("footer.loginRegister")}</Link></li>
            <li><Link className={linkCls} to="/cart">{t("footer.cart")}</Link></li>
            <li><Link className={linkCls} to="/wishlist">{t("footer.wishlist")}</Link></li>
            <li><Link className={linkCls} to="/shop">{t("footer.shop")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-medium">{t("footer.quickLink")}</h3>
          <ul className="mt-6 space-y-2">
            <li><Link className={linkCls} to="/about">{t("footer.privacy")}</Link></li>
            <li><Link className={linkCls} to="/about">{t("footer.terms")}</Link></li>
            <li><Link className={linkCls} to="/contact">{t("footer.faq")}</Link></li>
            <li><Link className={linkCls} to="/contact">{t("footer.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-medium">{t("footer.downloadApp")}</h3>
          <p className="mt-6 text-xs font-medium text-white/70">{t("footer.saveNote")}</p>
          <div className="mt-2 flex items-center gap-2">
            <img src="/images/qr.png" alt="QR code" width="80" height="80" className="h-20 w-20 bg-white p-0.5" loading="lazy" />
            <div className="flex flex-col gap-2">
              <img src="/images/google-play.png" alt="Get it on Google Play" width="104" height="38" className="h-[38px] w-auto" loading="lazy" />
              <img src="/images/app-store.png" alt="Download on the App Store" width="104" height="38" className="h-[38px] w-auto" loading="lazy" />
            </div>
          </div>
          <div className="mt-6 flex gap-6" aria-label="Social media">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-brand"><Facebook size={22} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-brand"><Twitter size={22} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-brand"><Instagram size={22} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-brand"><Linkedin size={22} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/40">
        <p className="container-x">© {t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
