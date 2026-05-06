import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BOOK_CHAPTERS, BOOK_ORDER } from "../data/canonicalBooks";
import { useBibleData } from "../hooks/useBibleData";

type Props = {
  onSelectVerse?: (uid: string) => void;
  initialBook?: string | null;
};

export function HierarchicalSearch({ onSelectVerse, initialBook }: Props) {
  const { t } = useTranslation();
  const { lang, fetchChapter } = useBibleData();
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState<number | "">("");
  const [verseNums, setVerseNums] = useState<number[]>([]);
  const [verse, setVerse] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const maxCh = book ? (BOOK_CHAPTERS[book] ?? 0) : 0;
  const chapters = useMemo(
    () => (maxCh ? Array.from({ length: maxCh }, (_, i) => i + 1) : []),
    [maxCh],
  );

  useEffect(() => {
    const normalized = (initialBook ?? "").trim().toUpperCase();
    if (!normalized || !BOOK_ORDER.includes(normalized as (typeof BOOK_ORDER)[number])) return;
    setBook(normalized);
  }, [initialBook]);

  useEffect(() => {
    setChapter("");
    setVerse("");
    setVerseNums([]);
    setError(null);
  }, [book]);

  useEffect(() => {
    setVerse("");
    setVerseNums([]);
    setError(null);
    if (!book || chapter === "") return;
    let cancelled = false;
    void (async () => {
      try {
        const data = await fetchChapter(book, chapter as number);
        if (cancelled) return;
        const nums = data.verses
          .map((v) => parseInt(v.uid.split(".")[2] ?? "0", 10))
          .filter((n) => Number.isFinite(n))
          .sort((a, b) => a - b);
        setVerseNums(nums);
      } catch (e) {
        if (!cancelled) {
          setVerseNums([]);
          setError(e instanceof Error ? e.message : "Load failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [book, chapter, fetchChapter, lang]);

  function submit() {
    if (!book || chapter === "" || verse === "") return;
    const uid = `${book}.${chapter}.${verse}`;
    onSelectVerse?.(uid);
  }

  return (
    <div className="space-y-3 rounded-xl border border-sage-primary/40 bg-white/70 p-3 shadow-sm">
      <h3 className="text-sm font-semibold text-sage-dark">{t("sidebar.search")}</h3>
      <label className="block text-xs font-medium text-sage-dark/80">
        {t("search.book")}
        <select
          value={book}
          onChange={(e) => setBook(e.target.value)}
          className="mt-1 w-full rounded-lg border border-sage-primary/50 bg-white px-2 py-1.5 text-sm"
        >
          <option value="">{t("search.pickBook")}</option>
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
          value={chapter === "" ? "" : String(chapter)}
          onChange={(e) =>
            setChapter(e.target.value ? Number(e.target.value) : "")
          }
          disabled={!book}
          className="mt-1 w-full rounded-lg border border-sage-primary/50 bg-white px-2 py-1.5 text-sm disabled:opacity-50"
        >
          <option value="">{t("search.pickChapter")}</option>
          {chapters.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-medium text-sage-dark/80">
        {t("search.verse")}
        <select
          value={verse === "" ? "" : String(verse)}
          onChange={(e) =>
            setVerse(e.target.value ? Number(e.target.value) : "")
          }
          disabled={verseNums.length === 0}
          className="mt-1 w-full rounded-lg border border-sage-primary/50 bg-white px-2 py-1.5 text-sm disabled:opacity-50"
        >
          <option value="">{t("search.pickVerse")}</option>
          {verseNums.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      {error ? (
        <p className="text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={submit}
        disabled={!book || chapter === "" || verse === ""}
        className="w-full rounded-lg bg-sage-forest px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
      >
        {t("search.explore")}
      </button>
    </div>
  );
}
