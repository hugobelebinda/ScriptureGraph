import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { InterlinearCredit } from "../components/InterlinearCredit";
import { InterlinearVerse } from "../components/InterlinearVerse";
import { BOOK_CHAPTERS, BOOK_ORDER } from "../data/canonicalBooks";
import type { InterlinearBook, StrongsEntry } from "../data/interlinearTypes";
import { parseUid, useBibleData, type ChapterPayload } from "../hooks/useBibleData";
import { fetchInterlinearBook, fetchStrongsDictionary, tokensToVerse } from "../lib/interlinearData";

export function InterlinearView() {
  const { t } = useTranslation();
  const { fetchChapter } = useBibleData();
  const [params, setParams] = useSearchParams();

  const fromUrl = useMemo(() => {
    const verse = parseUid(params.get("verse") ?? "");
    if (verse) return verse;
    const book = (params.get("book") ?? "GEN").toUpperCase();
    const chapter = Number(params.get("chapter") ?? "1");
    const safeBook = BOOK_ORDER.includes(book as (typeof BOOK_ORDER)[number]) ? book : "GEN";
    const max = BOOK_CHAPTERS[safeBook] ?? 1;
    return { book: safeBook, chapter: Number.isFinite(chapter) ? Math.min(Math.max(chapter, 1), max) : 1, verse: 1 };
  }, [params]);

  const [book, setBook] = useState(fromUrl.book);
  const [chapter, setChapter] = useState(fromUrl.chapter);
  const [interlinear, setInterlinear] = useState<InterlinearBook | null>(null);
  const [dictionary, setDictionary] = useState<Record<string, StrongsEntry>>({});
  const [translation, setTranslation] = useState<ChapterPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBook(fromUrl.book);
    setChapter(fromUrl.chapter);
  }, [fromUrl.book, fromUrl.chapter]);

  const chapters = useMemo(() => {
    const max = BOOK_CHAPTERS[book] ?? 1;
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [book]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const kind = BOOK_ORDER.indexOf(book as (typeof BOOK_ORDER)[number]) <= BOOK_ORDER.indexOf("MAL") ? "H" : "G";
    void (async () => {
      try {
        const [bookData, dict] = await Promise.all([
          fetchInterlinearBook(book),
          fetchStrongsDictionary(kind),
        ]);
        if (cancelled) return;
        setInterlinear(bookData);
        setDictionary(dict);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : t("interlinear.loadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [book, t]);

  useEffect(() => {
    let cancelled = false;
    setTranslation(null);
    void fetchChapter(book, chapter)
      .then((data) => {
        if (!cancelled) setTranslation(data);
      })
      .catch(() => {
        if (!cancelled) setTranslation(null);
      });
    return () => {
      cancelled = true;
    };
  }, [book, chapter, fetchChapter]);

  useEffect(() => {
    const node = document.getElementById(`verse-${fromUrl.book}.${fromUrl.chapter}.${fromUrl.verse}`);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [fromUrl, interlinear]);

  function applySelection(nextBook: string, nextChapter: number, verse = 1) {
    setBook(nextBook);
    setChapter(nextChapter);
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.set("verse", `${nextBook}.${nextChapter}.${verse}`);
        next.delete("book");
        next.delete("chapter");
        return next;
      },
      { replace: true },
    );
  }

  const verseMap = interlinear?.chapters[String(chapter)] ?? {};
  const verseNums = Object.keys(verseMap)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const rtl = interlinear?.dir === "rtl";

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section>
        <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.interlinear")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-sage-dark/80">{t("interlinear.intro")}</p>
        <p className="mt-2 text-sm italic text-sage-dark/65">{t("interlinear.hint")}</p>
        <div className="mt-4">
          <InterlinearCredit />
        </div>
      </section>

      <div className="grid gap-3 rounded-xl border border-sage-primary/40 bg-white/70 p-3 shadow-sm sm:grid-cols-2">
        <label className="block text-xs font-medium text-sage-dark/80">
          {t("search.book")}
          <select
            value={book}
            onChange={(event) => applySelection(event.target.value, 1)}
            className="mt-1 w-full rounded-lg border border-sage-primary/50 bg-white px-2 py-1.5 text-sm"
          >
            {BOOK_ORDER.map((id) => (
              <option key={id} value={id}>
                {t(`books.${id}`, { defaultValue: id })}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-sage-dark/80">
          {t("search.chapter")}
          <select
            value={chapter}
            onChange={(event) => applySelection(book, Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-sage-primary/50 bg-white px-2 py-1.5 text-sm"
          >
            {chapters.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? <p className="text-sm italic text-sage-dark/60">{t("interlinear.loading")}</p> : null}

      <article className="space-y-5 rounded-2xl border border-sage-primary/40 bg-white/80 px-5 py-6 shadow-sm sm:px-7 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-dark/55">
          {t(`books.${book}`, { defaultValue: book })} {chapter}
        </p>
        {verseNums.map((num) => {
          const uid = `${book}.${chapter}.${num}`;
          const translationRow = translation?.verses.find((verse) => parseUid(verse.uid)?.verse === num);
          return (
            <div
              key={uid}
              id={`verse-${uid}`}
              className={`scroll-mt-20 space-y-2 border-t border-sage-primary/25 pt-4 first:border-t-0 first:pt-0 ${
                fromUrl.verse === num ? "rounded-xl bg-amber-50/70 px-3 py-3" : ""
              }`}
            >
              <p className="text-xs font-semibold text-sage-dark/50">{num}</p>
              <InterlinearVerse
                dictionaryData={dictionary}
                verseData={tokensToVerse(verseMap[String(num)])}
                rtl={rtl}
              />
              {translationRow ? (
                <p className="text-sm leading-relaxed text-sage-dark/75">{translationRow.text}</p>
              ) : null}
            </div>
          );
        })}
      </article>
    </div>
  );
}
