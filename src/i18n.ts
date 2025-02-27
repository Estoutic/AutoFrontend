// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ruTranslation from "./locales/ru.json";
import enTranslation from "./locales/en.json";
import zhTranslation from "./locales/zh.json";

const params = new URLSearchParams(window.location.search);
const lang = params.get("lang") || "ru";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ruTranslation },
      en: { translation: enTranslation },
      zh: { translation: zhTranslation },
    },
    lng: lang, 
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;