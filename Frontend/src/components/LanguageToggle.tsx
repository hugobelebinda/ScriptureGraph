import { useTranslation } from "react-i18next";
import type { UiLang } from "../store/useAppStore";
import { useAppStore } from "../store/useAppStore";

export function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const setUiLang = useAppStore((s) => s.setUiLang);
  const uiLang = useAppStore((s) => s.uiLang);

  function setLang(l: UiLang) {
    void i18n.changeLanguage(l);
    setUiLang(l);
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-sage-dark/70">
        {t("language.toggle")}
      </span>
      <div className="flex rounded-lg border border-sage-primary/50 bg-white/60 p-0.5">
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`flex-1 rounded-md px-2 py-1 text-sm font-medium transition ${
            uiLang === "en"
              ? "bg-sage-forest text-white"
              : "text-sage-dark hover:bg-sage-primary/30"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLang("fr")}
          className={`flex-1 rounded-md px-2 py-1 text-sm font-medium transition ${
            uiLang === "fr"
              ? "bg-sage-forest text-white"
              : "text-sage-dark hover:bg-sage-primary/30"
          }`}
        >
          FR
        </button>
      </div>
    </div>
  );
}
