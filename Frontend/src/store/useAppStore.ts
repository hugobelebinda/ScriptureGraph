import { create } from "zustand";

/** UI locale for API `lang=`; kept in sync with i18n in `LanguageToggle`. */
export type UiLang = "en" | "fr";

type AppState = {
  uiLang: UiLang;
  setUiLang: (l: UiLang) => void;
};

export const useAppStore = create<AppState>((set) => ({
  uiLang:
    typeof localStorage !== "undefined" &&
    localStorage.getItem("scripturegraph_lang") === "fr"
      ? "fr"
      : "en",
  setUiLang: (l) => set({ uiLang: l }),
}));
