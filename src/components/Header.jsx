import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Heart, LogOut, Menu, Search, ShoppingCart, User, X, ShoppingBag, XCircle, Star, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

const navCls = ({ isActive }) =>
  `border-b py-1 text-base transition-colors hover:border-black/40 ${isActive ? "border-black/50" : "border-transparent"}`;

function Badge({ count, testId }) {
  return (
    <span
      data-testid={testId}
      className={`absolute -end-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[11px] leading-none text-white transition-opacity ${count ? "opacity-100" : "opacity-0"}`}
    >
      {count}
    </span>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const { cartCount, wishlist, notify } = useShop();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    if (location.pathname === "/search") setQ(params.get("q") || "");
  }, [location.pathname, params]);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onDown = (e) => accountRef.current && !accountRef.current.contains(e.target) && setAccountOpen(false);
    const onKey = (e) => e.key === "Escape" && setAccountOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleLogout = async () => {
    await logout();
    notify(t("auth.loggedOut"));
    navigate("/login");
  };

  const iconBtn = "relative grid h-9 w-9 place-items-center rounded-full transition hover:bg-black/5";
  const accountItems = [
    { to: "/account", label: t("header.manageAccount"), icon: User },
    { to: "/account?tab=orders", label: t("header.myOrders"), icon: ShoppingBag },
    { to: "/account?tab=cancellations", label: t("header.myCancellations"), icon: XCircle },
    { to: "/account?tab=reviews", label: t("header.myReviews"), icon: Star },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-black/20 bg-white/95 backdrop-blur">
      <div className="container-x flex flex-wrap items-center gap-x-3 gap-y-3 py-3 sm:gap-x-4 md:flex-nowrap md:gap-x-3 md:py-5 lg:gap-x-4">
        <button
          type="button"
          className="order-0 grid h-9 w-9 place-items-center rounded md:hidden"
          aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="order-1 font-heading text-2xl font-bold tracking-[0.03em]">
          Exclusive
        </Link>

        <nav aria-label={t("header.mainNav")} className="order-2 mx-auto hidden gap-5 md:flex lg:gap-12">
          <NavLink to="/" end className={navCls}>{t("common.home")}</NavLink>
          <NavLink to="/contact" className={navCls}>{t("common.contact")}</NavLink>
          <NavLink to="/about" className={navCls}>{t("common.about")}</NavLink>
          {!isLoggedIn && <NavLink to="/signup" className={navCls}>{t("common.signUp")}</NavLink>}
        </nav>

        <form role="search" onSubmit={submitSearch} className="order-last flex w-full items-center rounded bg-soft ps-5 pe-3 md:order-3 md:w-[150px] lg:w-[243px]">
          <input
            data-testid="search-input"
            name="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("header.searchPlaceholder")}
            aria-label={t("header.search")}
            enterKeyHint="search"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-xs outline-none placeholder:text-black/50 [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="submit" aria-label={t("header.search")} className="grid h-8 w-8 shrink-0 place-items-center">
            <Search size={20} />
          </button>
        </form>

        <div className="order-2 ms-auto flex items-center gap-1 sm:gap-2 md:order-4 md:ms-0">
          <Link to="/wishlist" className={iconBtn} aria-label={t("header.wishlist")}>
            <Heart size={24} />
            <Badge count={wishlist.length} testId="wishlist-count" />
          </Link>
          <Link to="/cart" className={iconBtn} aria-label={t("header.cart")}>
            <ShoppingCart size={24} />
            <Badge count={cartCount} testId="cart-count" />
          </Link>

          {isLoggedIn && (
            <>
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label={t("header.account")}
                  title={user?.name}
                  className={`grid h-8 w-8 place-items-center rounded-full ${accountOpen ? "bg-brand text-white" : "bg-brand text-white hover:bg-brand-hover"}`}
                >
                  <UserRound size={18} />
                </button>
                {accountOpen && (
                  <div role="menu" className="absolute end-0 top-11 z-50 w-60 rounded bg-gradient-to-br from-zinc-700/90 to-purple-500/80 py-3 text-sm text-white shadow-xl backdrop-blur-md">
                    {accountItems.map(({ to, label, icon: Icon }) => (
                      <Link key={to} to={to} role="menuitem" className="flex items-center gap-4 px-5 py-2 hover:bg-white/10">
                        <Icon size={20} />
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                data-testid="logout"
                onClick={handleLogout}
                aria-label={t("common.logout")}
                className="flex h-9 items-center gap-2 rounded-full px-2 text-sm transition hover:bg-black/5 sm:px-3"
              >
                <LogOut size={20} className="rtl:-scale-x-100" />
                <span className="hidden lg:inline">{t("common.logout")}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label={t("header.mainNav")} className="fade-in border-t border-black/10 bg-white md:hidden">
          <ul className="container-x flex flex-col py-2 text-base">
            {[
              ["/", t("common.home")],
              ["/shop", t("common.products")],
              ["/contact", t("common.contact")],
              ["/about", t("common.about")],
              ...(isLoggedIn
                ? [["/account", t("header.manageAccount")]]
                : [["/signup", t("common.signUp")], ["/login", t("common.logIn")]]),
            ].map(([to, label]) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"} className={({ isActive }) => `block py-3 ${isActive ? "font-semibold text-brand" : ""}`}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
