import { useTranslation } from "react-i18next";
import type { UiLang } from "../store/useAppStore";
import { useAppStore } from "../store/useAppStore";

type Props = {
  /** Mobile drawer on translucent panel — white labels. Desktop sidebar unchanged. */
  variant?: "default" | "drawer";
};

export function LanguageToggle({ variant = "default" }: Props) {
  const isDrawer = variant === "drawer";
  const { t, i18n } = useTranslation();
  const setUiLang = useAppStore((s) => s.setUiLang);
  const uiLang = useAppStore((s) => s.uiLang);

  function setLang(l: UiLang) {
    void i18n.changeLanguage(l);
    setUiLang(l);
  }

  return (
    <div className="flex flex-col gap-1">
      <span
        className={
          isDrawer
            ? "text-xs font-medium uppercase tracking-wide text-white"
            : "text-xs font-medium uppercase tracking-wide text-sage-dark/70"
        }
      >
        {t("language.toggle")}
      </span>
      <div
        className={
          isDrawer
            ? "flex rounded-lg border border-white/35 bg-white/15 p-0.5 backdrop-blur-sm"
            : "flex rounded-lg border border-sage-primary/50 bg-white/60 p-0.5"
        }
      >
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`flex-1 rounded-md px-2 py-1 text-sm font-medium transition ${
            uiLang === "en"
              ? isDrawer
                ? "bg-white/35 text-white"
                : "bg-sage-forest text-white"
              : isDrawer
                ? "text-white hover:bg-white/20"
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
              ? isDrawer
                ? "bg-white/35 text-white"
                : "bg-sage-forest text-white"
              : isDrawer
                ? "text-white hover:bg-white/20"
                : "text-sage-dark hover:bg-sage-primary/30"
          }`}
        >
          FR
        </button>
      </div>
    </div>
  );
}
