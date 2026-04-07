import { useState } from "react";
import { useTranslation } from "react-i18next";
import { COMPASS_THEMES, type CompassEmotionId } from "../data/compassThemes";
import { findVerseInChapter, parseUid, useBibleData } from "../hooks/useBibleData";

type ActiveSelection = {
  themeId: CompassEmotionId;
  verseUid?: string;
};

export function CompassView() {
  const { t } = useTranslation();
  const { lang, fetchChapter } = useBibleData();
  const [active, setActive] = useState<ActiveSelection | null>(null);
  const [loadingUid, setLoadingUid] = useState<string | null>(null);
  const [verseText, setVerseText] = useState<string | null>(null);
  const [verseError, setVerseError] = useState<string | null>(null);

  async function handleSelectVerse(
    themeId: CompassEmotionId,
    uid: string,
    opts?: { bypassCache?: boolean },
  ) {
    setActive({ themeId, verseUid: uid });
    setVerseError(null);
    setVerseText(null);
    setLoadingUid(uid);
    const parsed = parseUid(uid);
    if (!parsed) {
      setVerseError("Invalid verse id");
      setLoadingUid(null);
      return;
    }
    try {
      const chapter = await fetchChapter(parsed.book, parsed.chapter, {
        bypassCache: opts?.bypassCache,
      });
      const verse = findVerseInChapter(chapter, parsed.verse);
      if (!verse) {
        setVerseError("Verse not found in chapter");
      } else {
        const text = lang === "fr" ? verse.text_fr : verse.text_en;
        if (!text && !opts?.bypassCache) {
          // If we have a stale cached chapter (e.g. before re-seeding),
          // retry once bypassing the in-memory cache.
          await handleSelectVerse(themeId, uid, { bypassCache: true });
          return;
        }
        setVerseText(text);
      }
    } catch (e) {
      setVerseError(e instanceof Error ? e.message : "Failed to load verse");
    } finally {
      setLoadingUid((curr) => (curr === uid ? null : curr));
    }
  }

  const activeTheme =
    active && COMPASS_THEMES.find((t) => t.id === active.themeId);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
      <section aria-label={t("nav.compass") ?? ""}>
        <h2 className="text-2xl font-semibold text-sage-dark">
          {t("nav.compass")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-sage-dark/80">
          {t("compass.intro")}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {COMPASS_THEMES.map((theme) => {
            const isActive = active?.themeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setActive({ themeId: theme.id });
                  setVerseText(null);
                  setVerseError(null);
                }}
                className={`flex h-full flex-col justify-between rounded-2xl border border-sage-primary/35 ${theme.colorClass} p-4 text-left shadow-sm ring-0 transition hover:shadow-md hover:border-sage-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sage-forest focus-visible:ring-offset-sage-bg ${
                  isActive ? "scale-[1.02]" : ""
                }`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark/80 drop-shadow-sm">
                    {t("nav.compass")}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-sage-dark drop-shadow-sm">
                    {t(theme.labelKey)}
                  </h3>
                  <p className="mt-1 text-xs text-sage-dark/90 drop-shadow-sm">
                    {t(theme.subtitleKey)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section
        aria-label="Compass verses"
        className="mt-4 rounded-2xl border border-sage-primary/40 bg-white/80 p-4 shadow-sm sm:mt-8"
      >
        {activeTheme ? (
          <div className="flex h-full flex-col gap-4 sm:flex-row">
            <div className="w-full max-w-xs shrink-0 space-y-2 border-b border-sage-primary/30 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
              <h3 className="text-sm font-semibold text-sage-dark">
                {t(activeTheme.labelKey)}
              </h3>
              <p className="text-xs text-sage-dark/70">
                {t("compass.pickVerseHint")}
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {activeTheme.verses.map((v) => {
                  const isSelected = active?.verseUid === v.uid;
                  const isLoading = loadingUid === v.uid;
                  const parsed = parseUid(v.uid);
                  const reference = parsed
                    ? `${t(`books.${parsed.book}`, {
                        defaultValue: parsed.book,
                      })} ${parsed.chapter}:${parsed.verse}`
                    : v.uid;
                  return (
                    <li key={v.uid}>
                      <button
                        type="button"
                        onClick={() => handleSelectVerse(activeTheme.id, v.uid)}
                        className={`w-full rounded-lg px-2 py-1.5 text-left text-xs font-medium transition ${
                          isSelected
                            ? "bg-sage-forest text-white"
                            : "text-sage-dark hover:bg-sage-primary/30"
                        }`}
                      >
                        {reference}
                        {isLoading ? " …" : ""}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="min-w-0 flex-1 space-y-3 pt-2 sm:pt-0 sm:pl-1">
              {active?.verseUid ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark/70">
                    {activeTheme.verses.find((v) => v.uid === active.verseUid)
                      ?.uid ?? active.verseUid}
                  </p>
                  {loadingUid === active.verseUid ? (
                    <p className="text-xs text-sage-dark/70">
                      {t("compass.loadingVerse")}
                    </p>
                  ) : verseError ? (
                    <p className="text-xs text-rose-700">{verseError}</p>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed text-sage-dark">
                        {verseText ?? ""}
                      </p>
                      <p className="text-xs leading-relaxed text-sage-dark/80">
                        {t(
                          activeTheme.verses.find(
                            (v) => v.uid === active.verseUid,
                          )?.summaryKey ?? "compass.missingSummary",
                          { defaultValue: t("compass.missingSummary") },
                        )}
                      </p>
                    </>
                  )}
                </>
              ) : (
                <p className="text-xs text-sage-dark/70">
                  {t("compass.noVerseSelected")}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="max-w-sm text-center text-xs text-sage-dark/70">
              {t("compass.pickVerseHint")}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

