import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import fr from "./locales/fr.json";
import { KEYS, store } from "../lib/storage";

export const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "fr", label: "Français", dir: "ltr" },
];

const saved = store.get(KEYS.lang, null);
const initial = LANGUAGES.some((l) => l.code === saved) ? saved : "en";

function applyDocumentLanguage(code) {
  const lang = LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar }, fr: { translation: fr } },
  lng: initial,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnObjects: true,
});

applyDocumentLanguage(initial);
i18n.on("languageChanged", (code) => {
  applyDocumentLanguage(code);
  store.set(KEYS.lang, code);
});

export default i18n;
