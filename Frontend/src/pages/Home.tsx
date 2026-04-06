import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.home")}</h2>
      <p className="text-sage-dark/90">{t("home.welcome")}</p>
      <p className="text-sm text-sage-dark/70">{t("home.apiHint")}</p>
    </div>
  );
}
