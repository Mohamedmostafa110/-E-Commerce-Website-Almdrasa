import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShop } from "../context/ShopContext";
import TopBar from "./TopBar";
import Header from "./Header";
import Footer from "./Footer";

function BackToTop() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("common.backToTop")}
      className="fixed bottom-5 end-4 z-30 grid h-11 w-11 place-items-center rounded-full bg-soft text-black shadow-md transition hover:bg-black hover:text-white sm:end-8"
    >
      <ArrowUp size={22} />
    </button>
  );
}

function Toast() {
  const { toast } = useShop();
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {toast && (
        <div
          key={toast.id}
          className={`toast-in pointer-events-auto max-w-[92vw] rounded px-5 py-3 text-sm text-white shadow-lg ${toast.type === "error" ? "bg-brand" : "bg-black"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Support "/#/cart" style links while the app is already open.
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.startsWith("#/")) navigate(window.location.hash.slice(1), { replace: true });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <Toast />
    </div>
  );
}
