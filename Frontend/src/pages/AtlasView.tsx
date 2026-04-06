import { useTranslation } from "react-i18next";

export function AtlasView() {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.atlas")}</h2>
      <p className="mt-2 text-sage-dark/80">Mapbox atlas — coming next.</p>
    </div>
  );
}
