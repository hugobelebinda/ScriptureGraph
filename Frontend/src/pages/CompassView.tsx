import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { COMPASS_THEMES, type CompassEmotionId } from "../data/compassThemes";
import { useIsBelowLg } from "../hooks/useMediaQuery";
import { findVerseInChapter, parseUid, useBibleData } from "../hooks/useBibleData";

type ActiveSelection = {
  themeId: CompassEmotionId;
  verseUid?: string;
};

export function CompassView() {
  const { t } = useTranslation();
  const { lang, fetchChapter } = useBibleData();
  const isMobile = useIsBelowLg();
  const [active, setActive] = useState<ActiveSelection | null>(null);
  const [loadingUid, setLoadingUid] = useState<string | null>(null);
  const [verseText, setVerseText] = useState<string | null>(null);
  const [verseError, setVerseError] = useState<string | null>(null);

  const activeTheme = active ? COMPASS_THEMES.find((th) => th.id === active.themeId) : undefined;
  const showMobileModal = isMobile && Boolean(activeTheme);

  useEffect(() => {
    if (!showMobileModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showMobileModal]);

  function resetToEmotions() {
    setActive(null);
    setVerseText(null);
    setVerseError(null);
    setLoadingUid(null);
  }

  function backToVerseList() {
    if (!active) return;
    setActive({ themeId: active.themeId });
    setVerseText(null);
    setVerseError(null);
    setLoadingUid(null);
  }

  function handleMobileModalClose() {
    if (active?.verseUid) {
      backToVerseList();
    } else {
      resetToEmotions();
    }
  }

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

  function verseReference(uid: string): string {
    const parsed = parseUid(uid);
    if (!parsed) return uid;
    return `${t(`books.${parsed.book}`, { defaultValue: parsed.book })} ${parsed.chapter}:${parsed.verse}`;
  }

  function renderVerseDetail() {
    if (!activeTheme || !active?.verseUid) return null;
    const uid = active.verseUid;
    return (
      <>
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark/70">
          {verseReference(uid)}
        </p>
        {loadingUid === uid ? (
          <p className="text-sm text-sage-dark/70">{t("compass.loadingVerse")}</p>
        ) : verseError ? (
          <p className="text-sm text-rose-700">{verseError}</p>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-sage-dark">{verseText ?? ""}</p>
            <p className="text-xs leading-relaxed text-sage-dark/80">
              {t(
                activeTheme.verses.find((v) => v.uid === uid)?.summaryKey ?? "compass.missingSummary",
                { defaultValue: t("compass.missingSummary") },
              )}
            </p>
          </>
        )}
      </>
    );
  }

  function renderVerseList(hideTitle = false) {
    if (!activeTheme) return null;
    return (
      <>
        {hideTitle ? null : (
          <h3 className="text-sm font-semibold text-sage-dark">{t(activeTheme.labelKey)}</h3>
        )}
        <p className="text-xs text-sage-dark/70">{t("compass.pickVerseHint")}</p>
        <ul className="mt-2 space-y-1 text-sm">
          {activeTheme.verses.map((v) => {
            const isSelected = active?.verseUid === v.uid;
            const isLoading = loadingUid === v.uid;
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
                  {verseReference(v.uid)}
                  {isLoading ? " …" : ""}
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <div className="relative">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
        <section aria-label={t("nav.compass") ?? ""}>
          <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.compass")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-sage-dark/80">{t("compass.intro")}</p>

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
                    setLoadingUid(null);
                  }}
                  className={`flex h-full flex-col justify-between rounded-2xl p-4 text-left shadow-sm ring-0 transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sage-forest focus-visible:ring-offset-sage-bg ${theme.colorClass} ${
                    isActive
                      ? "ring-1 ring-sage-forest/30 ring-offset-2 ring-offset-sage-bg"
                      : ""
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-sage-dark/75">
                      {t("nav.compass")}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-sage-dark">{t(theme.labelKey)}</h3>
                    <p className="mt-1 text-xs text-sage-dark/85">{t(theme.subtitleKey)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Desktop: side panel */}
        <section
          aria-label="Compass verses"
          className="mt-4 hidden rounded-2xl border border-sage-primary/35 bg-white/95 p-4 shadow-sm lg:block lg:mt-0"
        >
          {activeTheme ? (
            <div className="flex h-full flex-col gap-4 sm:flex-row">
              <div className="w-full max-w-xs shrink-0 space-y-2 border-b border-sage-primary/30 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
                {renderVerseList()}
              </div>
              <div className="min-w-0 flex-1 space-y-3 pt-2 sm:pt-0 sm:pl-1">
                {active?.verseUid ? (
                  renderVerseDetail()
                ) : (
                  <p className="text-xs text-sage-dark/70">{t("compass.noVerseSelected")}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="max-w-sm text-center text-xs text-sage-dark/70">{t("compass.pickVerseHint")}</p>
            </div>
          )}
        </section>
      </div>

      {/* Mobile: centered modal — verse list, then verse detail */}
      {showMobileModal && activeTheme ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compass-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label={
              active?.verseUid ? t("compass.backToVerseList") : t("compass.closeDetail")
            }
            onClick={handleMobileModalClose}
          />
          <div className="relative max-h-[min(85dvh,32rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-sage-primary/40 bg-white p-5 shadow-2xl">
            <button
              type="button"
              onClick={handleMobileModalClose}
              className="absolute right-3 top-3 z-10 rounded-lg border border-sage-primary/40 bg-sage-bg px-2.5 py-1 text-xs font-semibold text-sage-dark hover:bg-sage-primary/25"
              aria-label={
                active?.verseUid ? t("compass.backToVerseList") : t("compass.closeDetail")
              }
            >
              {t("compass.closeDetail")}
            </button>
            <div className="space-y-3 pr-16 pt-1">
              <h3 id="compass-modal-title" className="text-sm font-semibold text-sage-forest">
                {t(activeTheme.labelKey)}
              </h3>
              {active?.verseUid ? renderVerseDetail() : renderVerseList(true)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
