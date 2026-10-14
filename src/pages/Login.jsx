import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthShell, { authInput } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { notify } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const user = await login({ identifier: form.email, password: form.password });
      notify(t("auth.welcomeBack", { name: user.name }));
      navigate("/");
    } catch (err) {
      const known = err?.code && t(`auth.errors.${err.code}`) !== `auth.errors.${err.code}`;
      setError(t(`auth.errors.${known ? err.code : "generic"}`));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-3xl font-medium tracking-[0.04em] sm:text-4xl">{t("auth.loginTitle")}</h1>
      <p className="mt-5">{t("auth.enterDetails")}</p>
      <form data-testid="login-form" onSubmit={submit} noValidate className="mt-8 space-y-8">
        <input name="email" type="email" autoComplete="username" value={form.email} onChange={set("email")} placeholder={t("auth.emailOrPhone")} aria-label={t("auth.emailOrPhone")} className={authInput} />
        <input name="password" type="password" autoComplete="current-password" value={form.password} onChange={set("password")} placeholder={t("auth.password")} aria-label={t("auth.password")} className={authInput} />
        {error && <p role="alert" className="text-sm text-brand">{error}</p>}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button type="submit" disabled={busy} className="h-14 rounded bg-brand px-12 font-medium text-white transition hover:bg-brand-hover disabled:opacity-60">
            {busy ? t("auth.loggingIn") : t("auth.loginBtn")}
          </button>
          <button type="button" onClick={() => notify(t("auth.forgotNotice"))} className="text-brand hover:underline">
            {t("auth.forgot")}
          </button>
        </div>
      </form>
      <p className="mt-8 text-center text-black/70">
        {t("auth.noAccount")}{" "}
        <Link to="/signup" className="ms-2 border-b border-black/50 pb-0.5 font-medium text-black hover:border-brand hover:text-brand">{t("common.signUp")}</Link>
      </p>
    </AuthShell>
  );
}
