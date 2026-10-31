import { useTranslation } from "react-i18next";

const CHURCH_BIBLE_URL = "https://eglisederosemont.ca/bible/";
const OSHB_URL = "https://github.com/openscriptures/morphhb";
const NESTLE_URL = "https://github.com/biblicalhumanities/Nestle1904";

export function InterlinearCredit() {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 text-xs leading-relaxed text-sage-dark/60">
      <p>
        {t("interlinear.sources")}{" "}
        <a
          href={CHURCH_BIBLE_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-sage-forest underline decoration-sage-forest/40 underline-offset-2 hover:text-sage-dark"
        >
          {t("interlinear.churchName")}
        </a>
        {t("interlinear.inspirationEnd")}
      </p>
      <p>
        {t("interlinear.dataCredit")}{" "}
        <a
          href={OSHB_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-sage-forest underline decoration-sage-forest/40 underline-offset-2 hover:text-sage-dark"
        >
          Open Scriptures Hebrew Bible
        </a>
        {t("interlinear.dataCreditMid")}
        <a
          href={NESTLE_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-sage-forest underline decoration-sage-forest/40 underline-offset-2 hover:text-sage-dark"
        >
          Nestle 1904
        </a>
        {t("interlinear.dataCreditEnd")}
      </p>
      <p>{t("interlinear.glossCredit")}</p>
    </div>
  );
}
