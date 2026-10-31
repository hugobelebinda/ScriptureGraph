import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { StrongsEntry, TaggedVerse } from "../data/interlinearTypes";
import { strongsDefinition } from "../lib/interlinearData";

type InterlinearVerseProps = {
  dictionaryData: Record<string, StrongsEntry>;
  verseData: TaggedVerse;
  rtl?: boolean;
};

const parchmentCard =
  "z-[90] rounded-xl border border-amber-200/70 bg-[#f7efe1] px-3.5 py-3 text-left shadow-xl";

function TaggedWordTrigger({
  text,
  strongsId,
  entry,
}: {
  text: string;
  strongsId: string;
  entry?: StrongsEntry;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Root open={open} onOpenChange={setOpen}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          className="cursor-pointer border-b-2 border-dotted border-sage-forest/70 bg-transparent p-0 text-inherit align-baseline leading-loose hover:border-sage-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-forest/50 focus-visible:ring-offset-2 focus-visible:ring-offset-sage-bg"
          onClick={() => setOpen(true)}
        >
          {text}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="top" sideOffset={8} className={parchmentCard}>
          <StrongsCard entry={entry} fallbackId={strongsId} surface={text} />
          <Tooltip.Arrow className="fill-[#f7efe1]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function isHebrewId(id: string): boolean {
  return id.toUpperCase().startsWith("H");
}

function StrongsCard({
  entry,
  fallbackId,
  surface,
}: {
  entry?: StrongsEntry;
  fallbackId: string;
  surface: string;
}) {
  const { t, i18n } = useTranslation();
  const hebrew = isHebrewId(fallbackId);
  const original = entry?.original_word || surface;
  const lang = i18n.language === "fr" ? "fr" : "en";
  const definition = strongsDefinition(entry, lang);

  return (
    <div className="max-w-[20rem] space-y-2">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-sage-dark/55">
        {entry?.id ?? fallbackId}
      </p>
      <p
        className="font-hebrew text-2xl font-semibold leading-snug text-sage-dark"
        dir={hebrew ? "rtl" : "ltr"}
        lang={hebrew ? "he" : "grc"}
      >
        {original}
      </p>
      {entry?.transliteration ? (
        <p className="text-sm italic text-sage-dark/70">({entry.transliteration})</p>
      ) : null}
      <p className="text-[11px] font-medium uppercase tracking-wide text-sage-dark/55">
        {hebrew ? t("interlinear.originHebrew") : t("interlinear.originGreek")}
      </p>
      {lang === "fr" && entry?.glossFr ? (
        <p className="text-sm font-medium text-sage-dark">{entry.glossFr}</p>
      ) : null}
      <p className="text-sm leading-relaxed text-sage-dark/85">
        {definition || t("interlinear.entryMissing")}
      </p>
      <Link
        to={`/interlinear/word/${encodeURIComponent(entry?.id ?? fallbackId)}`}
        className="block pt-1 text-xs font-medium text-sage-forest underline decoration-sage-forest/40 underline-offset-2 hover:text-sage-dark"
        onPointerDown={(event) => event.stopPropagation()}
      >
        {t("interlinear.seeElsewhere")}
      </Link>
    </div>
  );
}

export function InterlinearVerse({ dictionaryData, verseData, rtl = false }: InterlinearVerseProps) {
  return (
    <Tooltip.Provider delayDuration={180} skipDelayDuration={80}>
      <p
        className={`font-hebrew text-xl leading-loose text-sage-dark sm:text-2xl ${rtl ? "" : ""}`}
        dir={rtl ? "rtl" : "ltr"}
        lang={rtl ? "he" : "grc"}
      >
        {verseData.map((word, index) => {
          const space = index === 0 ? "" : " ";
          if (!word.strongsId) {
            return (
              <span key={`${word.text}-${index}`}>
                {space}
                {word.text}
              </span>
            );
          }

          return (
            <span key={`${word.strongsId}-${index}`}>
              {space}
              <TaggedWordTrigger
                text={word.text}
                strongsId={word.strongsId}
                entry={dictionaryData[word.strongsId]}
              />
            </span>
          );
        })}
      </p>
    </Tooltip.Provider>
  );
}
