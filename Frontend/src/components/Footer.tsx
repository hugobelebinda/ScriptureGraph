import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const text = t("footer.notice");

  return (
    <footer className="border-t border-sage-primary/25 bg-sage-footer px-4 py-3 text-center text-[0.7rem] leading-relaxed text-sage-dark/65 sm:text-xs sm:leading-snug">
      <p className="mx-auto max-w-5xl">{text}</p>
    </footer>
  );
}
