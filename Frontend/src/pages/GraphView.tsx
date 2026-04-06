import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export function GraphView() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const book = params.get("book")?.toUpperCase() ?? "";

  return (
    <div>
      <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.graph")}</h2>
      {book ? (
        <p className="mt-2 text-sm text-sage-forest">
          {t("graph.pendingBook", {
            book: t(`books.${book}`, { defaultValue: book }),
            code: book,
          })}
        </p>
      ) : null}
      <p className="mt-2 text-sage-dark/80">
        Four-level navigation (books → chapters → reading + connection rail → graph
        modal) will live here.
      </p>
    </div>
  );
}
