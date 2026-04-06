import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import chronologyTooltipsEn from "../locales/chronology-tooltips.en.json";
import chronologyTooltipsFr from "../locales/chronology-tooltips.fr.json";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

const stored =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("scripturegraph_lang")
    : null;
const lng = stored === "fr" || stored === "en" ? stored : "en";

const enTranslation = {
  ...en,
  chronology: {
    ...en.chronology,
    tooltips: chronologyTooltipsEn as Record<string, string>,
  },
};

const frTranslation = {
  ...fr,
  chronology: {
    ...fr.chronology,
    tooltips: chronologyTooltipsFr as Record<string, string>,
  },
};

void i18n.use(initReactI18next).init({
  lng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
  },
});

i18n.on("languageChanged", (l) => {
  if (l === "fr" || l === "en") localStorage.setItem("scripturegraph_lang", l);
});

export default i18n;
