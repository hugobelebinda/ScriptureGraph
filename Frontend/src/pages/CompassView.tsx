import { useTranslation } from "react-i18next";

export function CompassView() {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.compass")}</h2>
      <p className="mt-2 text-sage-dark/80">Spiritual compass / emotion cards — coming next.</p>
    </div>
  );
}
