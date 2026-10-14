import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthShell, { authInput } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export default function Signup() {
  const { t } = useTranslation();
  const { signup, loginWithGoogle } = useAuth();
  const { notify } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const fail = (err) => setError(t(`auth.errors.${err?.code && t(`auth.errors.${err.code}`) !== `auth.errors.${err.code}` ? err.code : "generic"}`));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const user = await signup({ name: form.name, identifier: form.email, password: form.password });
      notify(t("auth.accountCreated", { name: user.name }));
      navigate("/");
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError("");
    try {
      const user = await loginWithGoogle();
      notify(t("auth.welcomeBack", { name: user.name }));
      navigate("/");
    } catch (err) {
      fail(err);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-3xl font-medium tracking-[0.04em] sm:text-4xl">{t("auth.createAccount")}</h1>
      <p className="mt-5">{t("auth.enterDetails")}</p>
      <form data-testid="signup-form" onSubmit={submit} noValidate className="mt-8 space-y-8">
        <input name="name" type="text" autoComplete="name" value={form.name} onChange={set("name")} placeholder={t("auth.name")} aria-label={t("auth.name")} className={authInput} />
        <input name="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder={t("auth.emailOrPhone")} aria-label={t("auth.emailOrPhone")} className={authInput} />
        <input name="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} placeholder={t("auth.password")} aria-label={t("auth.password")} className={authInput} />
        {error && <p role="alert" className="text-sm text-brand">{error}</p>}
        <div className="space-y-4">
          <button type="submit" disabled={busy} className="h-14 w-full rounded bg-brand font-medium text-white transition hover:bg-brand-hover disabled:opacity-60">
            {busy ? t("auth.creating") : t("auth.createBtn")}
          </button>
          <button type="button" onClick={google} className="flex h-14 w-full items-center justify-center gap-4 rounded border border-black/40 transition hover:bg-soft">
            <GoogleIcon />
            {t("auth.signupGoogle")}
          </button>
        </div>
      </form>
      <p className="mt-8 text-center text-black/70">
        {t("auth.haveAccount")}{" "}
        <Link to="/login" className="ms-2 border-b border-black/50 pb-0.5 font-medium text-black hover:border-brand hover:text-brand">{t("common.logIn")}</Link>
      </p>
    </AuthShell>
  );
}
