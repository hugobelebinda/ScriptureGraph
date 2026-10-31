import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { InterlinearCredit } from "../components/InterlinearCredit";
import type { StrongsEntry } from "../data/interlinearTypes";
import { parseUid, useBibleData } from "../hooks/useBibleData";
import { fetchStrongsDictionary, fetchStrongsOccurrences, strongsDefinition } from "../lib/interlinearData";

const PAGE_SIZE = 20;

function isHebrewId(id: string): boolean {
  return id.toUpperCase().startsWith("H");
}

export function InterlinearWordView() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";
  const { fetchChapter } = useBibleData();
  const { strongsId = "" } = useParams();
  const id = strongsId.trim().toUpperCase();
  const kind: "H" | "G" = isHebrewId(id) ? "H" : "G";
  const hebrew = isHebrewId(id);

  const [entry, setEntry] = useState<StrongsEntry | undefined>();
  const [uids, setUids] = useState<string[]>([]);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [excerpts, setExcerpts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setVisible(PAGE_SIZE);
    setExcerpts({});
    void (async () => {
      try {
        const [dict, list] = await Promise.all([
          fetchStrongsDictionary(kind),
          fetchStrongsOccurrences(id),
        ]);
        if (cancelled) return;
        setEntry(dict[id]);
        setUids(list);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : t("interlinear.loadError"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, kind, t]);

  const page = useMemo(() => uids.slice(0, visible), [uids, visible]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const next: Record<string, string> = {};
      for (const uid of page) {
        const parsed = parseUid(uid);
        if (!parsed) continue;
        try {
          const chapter = await fetchChapter(parsed.book, parsed.chapter);
          const verse = chapter.verses.find((row) => parseUid(row.uid)?.verse === parsed.verse);
          if (verse) next[uid] = verse.text;
        } catch {
          next[uid] = "";
        }
      }
      if (!cancelled) setExcerpts((prev) => ({ ...prev, ...next }));
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchChapter, page]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section>
        <Link
          to="/interlinear"
          className="text-sm font-medium text-sage-forest underline decoration-sage-forest/40 underline-offset-2 hover:text-sage-dark"
        >
          {t("interlinear.backToVerse")}
        </Link>
        <h2 className="mt-3 text-2xl font-semibold text-sage-dark">{t("interlinear.wordTitle")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-sage-dark/80">{t("interlinear.wordIntro")}</p>
      </section>

      <article className="rounded-2xl border border-sage-primary/40 bg-white/80 px-5 py-6 shadow-sm sm:px-7 sm:py-8">
        {entry ? (
          <div className="space-y-3">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-sage-dark/55">
              {entry.id}
            </p>
            <p
              className="font-hebrew text-3xl font-semibold text-sage-dark"
              dir={hebrew ? "rtl" : "ltr"}
              lang={hebrew ? "he" : "grc"}
            >
              {entry.original_word}
            </p>
            <p className="text-sm italic text-sage-dark/70">({entry.transliteration})</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-sage-dark/55">
              {hebrew ? t("interlinear.originHebrew") : t("interlinear.originGreek")}
            </p>
            {lang === "fr" && entry.glossFr ? (
              <p className="text-sm font-medium text-sage-dark">{entry.glossFr}</p>
            ) : null}
            <p className="text-sm leading-relaxed text-sage-dark/85">{strongsDefinition(entry, lang)}</p>
          </div>
        ) : (
          <p className="text-sm text-sage-dark/70">{t("interlinear.entryMissing")}</p>
        )}
      </article>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-sage-dark">{t("interlinear.occurrencesHeading")}</h3>
        <p className="text-xs italic text-sage-dark/60">
          {t("interlinear.occurrencesCount", { shown: page.length, total: uids.length })}
        </p>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        {uids.length === 0 && !error ? (
          <p className="text-sm text-sage-dark/70">{t("interlinear.occurrencesEmpty")}</p>
        ) : (
          <ul className="space-y-3">
            {page.map((uid) => {
              const parsed = parseUid(uid);
              return (
                <li key={uid} className="rounded-xl border border-sage-primary/35 bg-white/70 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark/55">
                    {parsed
                      ? `${t(`books.${parsed.book}`, { defaultValue: parsed.book })} ${parsed.chapter}:${parsed.verse}`
                      : uid}
                  </p>
                  {uid in excerpts ? (
                    excerpts[uid] ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-sage-dark/85">{excerpts[uid]}</p>
                    ) : null
                  ) : (
                    <p className="mt-1.5 text-xs italic text-sage-dark/50">{t("interlinear.verseLoading")}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3">
                    <Link
                      to={`/interlinear?verse=${encodeURIComponent(uid)}`}
                      className="text-xs font-medium text-sage-forest underline decoration-sage-forest/40 underline-offset-2 hover:text-sage-dark"
                    >
                      {t("interlinear.openInInterlinear")}
                    </Link>
                    <Link
                      to={`/graph?verse=${encodeURIComponent(uid)}`}
                      className="text-xs font-medium text-sage-forest underline decoration-sage-forest/40 underline-offset-2 hover:text-sage-dark"
                    >
                      {t("interlinear.openInGraph")}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {visible < uids.length ? (
          <button
            type="button"
            onClick={() => setVisible((n) => n + PAGE_SIZE)}
            className="rounded-lg bg-sage-forest px-3 py-2 text-sm font-medium text-white"
          >
            {t("interlinear.showMore")}
          </button>
        ) : null}
      </section>

      <InterlinearCredit />
    </div>
  );
}
