import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookCoverImage } from "../components/BookCoverImage";
import { useIsBelowLg } from "../hooks/useMediaQuery";
import { BOOK_ORDER } from "../data/canonicalBooks";
import { CHRONOLOGY_SECTIONS } from "../data/chronologicalBooks";

const SHOW_DELAY_MS = 280;
const HIDE_DELAY_MS = 120;
const BIBLICAL_ORDER_SECTIONS = [
  { key: "pentateuch", books: ["GEN", "EXO", "LEV", "NUM", "DEU"] },
  { key: "historical", books: ["JOS", "JDG", "RUT", "1SA", "2SA", "1KI", "2KI", "1CH", "2CH", "EZR", "NEH", "EST"] },
  { key: "wisdom", books: ["JOB", "PSA", "PRO", "ECC", "SNG"] },
  { key: "majorProphets", books: ["ISA", "JER", "LAM", "EZK", "DAN"] },
  { key: "minorProphets", books: ["HOS", "JOL", "AMO", "OBA", "JON", "MIC", "NAM", "HAB", "ZEP", "HAG", "ZEC", "MAL"] },
  { key: "gospels", books: ["MAT", "MRK", "LUK", "JHN"] },
  { key: "acts", books: ["ACT"] },
  { key: "paulineEpistles", books: ["ROM", "1CO", "2CO", "GAL", "EPH", "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM"] },
  { key: "generalEpistles", books: ["HEB", "JAS", "1PE", "2PE", "1JN", "2JN", "3JN", "JUD"] },
  { key: "apocalypse", books: ["REV"] },
] as const;

type OrderMode = "biblical" | "chronological";

function TimelineBookRow({
  usfm,
  position,
}: {
  usfm: string;
  position: number;
}) {
  const { t } = useTranslation();
  const isMobile = useIsBelowLg();
  const [open, setOpen] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tipId = `chronology-tip-${usfm}`;

  const clearTimers = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    showTimer.current = null;
    hideTimer.current = null;
  }, []);

  const scheduleShow = useCallback(() => {
    clearTimers();
    showTimer.current = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
  }, [clearTimers]);

  const scheduleHide = useCallback(() => {
    clearTimers();
    hideTimer.current = setTimeout(() => setOpen(false), HIDE_DELAY_MS);
  }, [clearTimers]);

  const showNow = useCallback(() => {
    clearTimers();
    setOpen(true);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const tip = t(`chronology.tooltips.${usfm}`, {
    defaultValue: t("chronology.tooltipFallback"),
  });

  return (
    <li className={`relative overflow-visible ${open ? "z-20" : "z-0"}`}>
      <span
        className="absolute -left-[calc(1rem+2px)] top-3 h-2 w-2 rounded-full bg-sage-forest"
        aria-hidden
      />
      <div
        className="relative rounded-lg outline-none"
        onMouseEnter={isMobile ? undefined : scheduleShow}
        onMouseLeave={isMobile ? undefined : scheduleHide}
        onFocusCapture={showNow}
        onBlurCapture={(e) => {
          const next = e.relatedTarget;
          if (next instanceof Node && e.currentTarget.contains(next)) return;
          scheduleHide();
        }}
      >
        {isMobile ? (
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="group flex w-full items-baseline justify-between gap-3 rounded-lg border border-transparent px-2 py-2 text-left transition hover:border-sage-primary/40 hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-sage-forest focus-visible:ring-offset-2 focus-visible:ring-offset-sage-bg"
            aria-expanded={open}
            aria-describedby={open ? tipId : undefined}
          >
            <span className="font-medium text-sage-dark group-hover:text-sage-forest">
              <span className="mr-2 tabular-nums text-sage-dark/50">{position}.</span>
              {t(`books.${usfm}`, { defaultValue: usfm })}
            </span>
            <span className="shrink-0 font-mono text-xs text-sage-dark/45">{usfm}</span>
          </button>
        ) : (
          <Link
            to={`/graph?book=${encodeURIComponent(usfm)}`}
            className="group flex items-baseline justify-between gap-3 rounded-lg border border-transparent px-2 py-2 transition hover:border-sage-primary/40 hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-sage-forest focus-visible:ring-offset-2 focus-visible:ring-offset-sage-bg"
            aria-describedby={open ? tipId : undefined}
          >
            <span className="font-medium text-sage-dark group-hover:text-sage-forest">
              <span className="mr-2 tabular-nums text-sage-dark/50">{position}.</span>
              {t(`books.${usfm}`, { defaultValue: usfm })}
            </span>
            <span className="shrink-0 font-mono text-xs text-sage-dark/45">{usfm}</span>
          </Link>
        )}
        {open ? (
          <div
            id={tipId}
            role="tooltip"
            className="absolute left-0 right-0 top-full z-50 mt-2 w-[min(100vw-1.5rem,42rem)] max-w-none rounded-xl border border-sage-primary/50 bg-white text-left shadow-xl sm:left-0 sm:right-auto"
            onMouseEnter={() => {
              clearTimers();
              setOpen(true);
            }}
            onMouseLeave={scheduleHide}
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5">
              <div className="mx-auto w-full max-w-[min(100%,280px)] shrink-0 overflow-hidden rounded-lg ring-1 ring-sage-primary/30 sm:mx-0 sm:w-56 sm:max-w-none">
                <BookCoverImage usfm={usfm} />
              </div>
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-sage-dark/95">{tip}</p>
            </div>
            {isMobile ? (
              <Link
                to={`/graph?book=${encodeURIComponent(usfm)}`}
                className="mx-4 mb-4 inline-block rounded-lg bg-sage-forest px-3 py-2 text-xs font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                {t("mobile.openInGraph")}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function ChronologicalView() {
  const { t } = useTranslation();
  const isMobile = useIsBelowLg();
  const [orderMode, setOrderMode] = useState<OrderMode>("chronological");

  const biblicalSectionsWithPos = useMemo(() => {
    let p = 0;
    const canonicalSet = new Set(BOOK_ORDER);
    return BIBLICAL_ORDER_SECTIONS.map((section) => ({
      key: section.key,
      books: section.books
        .filter((usfm) => canonicalSet.has(usfm))
        .map((usfm) => {
          p += 1;
          return { usfm, position: p };
        }),
    })).filter((section) => section.books.length > 0);
  }, []);

  const sectionsWithPos = useMemo(() => {
    let p = 0;
    return CHRONOLOGY_SECTIONS.map((section) => ({
      eraKey: section.eraKey,
      books: section.books.map((usfm) => {
        p += 1;
        return { usfm, position: p };
      }),
    }));
  }, []);

  const showBiblical = !isMobile || orderMode === "biblical";
  const showChronological = !isMobile || orderMode === "chronological";

  return (
    <div className="mx-auto max-w-7xl pb-16">
      <header className="mb-8 border-b border-sage-primary/30 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-sage-dark">{t("chronology.title")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-sage-dark/80">{t("chronology.intro")}</p>
      </header>

      {isMobile ? (
        <div
          className="mb-6 flex rounded-lg border border-sage-primary/45 bg-white/60 p-1 lg:hidden"
          role="tablist"
          aria-label={t("chronology.title")}
        >
          <button
            type="button"
            role="tab"
            aria-selected={orderMode === "biblical"}
            onClick={() => setOrderMode("biblical")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
              orderMode === "biblical"
                ? "bg-sage-forest text-white"
                : "text-sage-dark hover:bg-sage-primary/30"
            }`}
          >
            {t("chronology.biblicalOrder")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={orderMode === "chronological"}
            onClick={() => setOrderMode("chronological")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
              orderMode === "chronological"
                ? "bg-sage-forest text-white"
                : "text-sage-dark hover:bg-sage-primary/30"
            }`}
          >
            {t("chronology.chronologicalOrder")}
          </button>
        </div>
      ) : null}

      <div className={isMobile ? "space-y-10" : "grid gap-10 lg:grid-cols-2"}>
        {showBiblical ? (
          <section aria-labelledby="biblical-order">
            {!isMobile ? (
              <h2 id="biblical-order" className="mb-4 text-lg font-semibold text-sage-forest">
                {t("chronology.biblicalOrder")}
              </h2>
            ) : null}
            <div className="space-y-10">
              {biblicalSectionsWithPos.map((section) => (
                <section key={section.key} aria-labelledby={`bib-section-${section.key}`}>
                  <h3
                    id={`bib-section-${section.key}`}
                    className="mb-4 text-base font-semibold text-sage-forest/90"
                  >
                    {t(`chronology.biblicalSections.${section.key}`)}
                  </h3>
                  <ol className="space-y-2 border-l-2 border-sage-primary/50 pl-4">
                    {section.books.map(({ usfm, position }) => (
                      <TimelineBookRow key={`bib-${usfm}`} usfm={usfm} position={position} />
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </section>
        ) : null}

        {showChronological ? (
          <section aria-labelledby="chronological-order">
            {!isMobile ? (
              <h2 id="chronological-order" className="mb-4 text-lg font-semibold text-sage-forest">
                {t("chronology.chronologicalOrder")}
              </h2>
            ) : null}
            <div className="space-y-12">
              {sectionsWithPos.map((section) => (
                <section key={section.eraKey} aria-labelledby={`era-${section.eraKey}`}>
                  <h3
                    id={`era-${section.eraKey}`}
                    className="mb-4 text-base font-semibold text-sage-forest/90"
                  >
                    {t(`chronology.era.${section.eraKey}`)}
                  </h3>
                  <ol className="space-y-2 border-l-2 border-sage-primary/50 pl-4">
                    {section.books.map(({ usfm, position }) => (
                      <TimelineBookRow key={usfm} usfm={usfm} position={position} />
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <p className="mt-10 text-xs text-sage-dark/60">{t("chronology.disclaimer")}</p>
    </div>
  );
}
