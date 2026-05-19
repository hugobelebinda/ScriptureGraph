import type { TFunction } from "i18next";
import type { MutableRefObject } from "react";
import type { CrossReferencesGraphPayload } from "../hooks/useBibleData";
import { HierarchicalSearch } from "./HierarchicalSearch";

type FilterTier = "core" | "strong" | "all";

type CenterNode = CrossReferencesGraphPayload["graph"]["nodes"][number];

type FeedItem = CrossReferencesGraphPayload["feed"][number];

type Props = {
  t: TFunction;
  lang: "en" | "fr";
  centerUid: string;
  centerNode: CenterNode | null;
  preselectedBookFromUrl: string | null;
  displayUid: (uid: string) => string;
  listTier: FilterTier;
  setListTier: (tier: FilterTier) => void;
  setGraphTier: (tier: "core" | "strong") => void;
  feed: FeedItem[];
  loading: boolean;
  hoveredUid: string | null;
  itemRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
  onSelectVerse: (uid: string) => void;
  onNodeSelect: (uid: string) => void;
  compact?: boolean;
};

function TierButtons({
  t,
  listTier,
  setListTier,
  setGraphTier,
}: Pick<Props, "t" | "listTier" | "setListTier" | "setGraphTier">) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          setGraphTier("core");
          setListTier("core");
        }}
        className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
          listTier === "core"
            ? "bg-sage-forest text-white"
            : "bg-white text-sage-dark border border-sage-primary/45"
        }`}
      >
        {t("graph.tierCore")}
      </button>
      <button
        type="button"
        onClick={() => {
          setGraphTier("strong");
          setListTier("strong");
        }}
        className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
          listTier === "strong"
            ? "bg-sage-forest text-white"
            : "bg-white text-sage-dark border border-sage-primary/45"
        }`}
      >
        {t("graph.tierStrong")}
      </button>
      <button
        type="button"
        onClick={() => setListTier("all")}
        className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
          listTier === "all"
            ? "bg-sage-forest text-white"
            : "bg-white text-sage-dark border border-sage-primary/45"
        }`}
      >
        {t("graph.tierAll")}
      </button>
    </div>
  );
}

export function GraphVersePanel({
  t,
  lang,
  centerUid,
  centerNode,
  preselectedBookFromUrl,
  displayUid,
  listTier,
  setListTier,
  setGraphTier,
  feed,
  loading,
  hoveredUid,
  itemRefs,
  onSelectVerse,
  onNodeSelect,
  compact = false,
}: Props) {
  const feedList = (
    <div className="space-y-3">
      {feed.map((item) => {
        const primary = lang === "fr" ? item.text_fr : item.text_en;
        const secondary = lang === "fr" ? item.text_en : item.text_fr;
        const isHovered = hoveredUid === item.uid;
        const isCenter = centerUid === item.uid;
        return (
          <div
            key={item.uid}
            ref={(el) => {
              itemRefs.current[item.uid] = el;
            }}
            className={`rounded-lg border px-3 py-2 transition ${
              isCenter
                ? "border-sage-forest bg-sage-forest/10"
                : isHovered
                  ? "border-sage-primary bg-sage-primary/15"
                  : "border-sage-primary/35 bg-white/70"
            }`}
          >
            <div className="mb-1">
              <button
                type="button"
                onClick={() => onNodeSelect(item.uid)}
                className="text-left text-xs font-semibold text-sage-forest hover:text-sage-dark"
              >
                {displayUid(item.uid)}
              </button>
            </div>
            <p className="text-sm leading-relaxed text-sage-dark">{primary}</p>
            <p className="mt-1 text-xs italic leading-relaxed text-sage-dark/60">{secondary}</p>
          </div>
        );
      })}
      {!loading && feed.length === 0 ? (
        <p className="px-2 py-6 text-sm text-sage-dark/70">{t("graph.noVerses")}</p>
      ) : null}
    </div>
  );

  if (compact) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 border-b border-sage-primary/35 px-3 py-2">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-sage-dark/75">
            {t("graph.searchLabel")}
          </p>
          <HierarchicalSearch initialBook={preselectedBookFromUrl} onSelectVerse={onSelectVerse} />
        </div>

        <div className="sticky top-0 z-10 shrink-0 border-b border-sage-primary/35 bg-sage-primary/15 px-3 py-2.5">
          <TierButtons
            t={t}
            listTier={listTier}
            setListTier={setListTier}
            setGraphTier={setGraphTier}
          />
          {listTier === "all" ? (
            <p className="mt-1.5 text-[10px] text-sage-dark/65">{t("graph.allDoesNotExpandGraph")}</p>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {centerNode ? (
            <div className="mb-3 rounded-lg border border-sage-primary/55 bg-sage-primary/25 px-3 py-2">
              <div className="mb-1 text-xs font-semibold text-sage-forest">
                {displayUid(centerNode.data.uid)}
              </div>
              <p className="text-sm leading-relaxed text-sage-dark">
                {lang === "fr" ? centerNode.data.text_fr : centerNode.data.text_en}
              </p>
            </div>
          ) : null}
          {feedList}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-sage-primary/35 px-4 py-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage-dark/75">
          {t("graph.searchLabel")}
        </p>
        <HierarchicalSearch initialBook={preselectedBookFromUrl} onSelectVerse={onSelectVerse} />
        <p className="mt-2 rounded-md border border-sage-primary/35 bg-white/70 px-2.5 py-1.5 text-[11px] leading-relaxed text-sage-dark/75">
          {t("graph.lsgVerseMergeNotice")}
        </p>

        {centerNode ? (
          <div className="mt-3 rounded-lg border border-sage-primary/55 bg-sage-primary/25 px-3 py-2">
            <div className="mb-1 text-xs font-semibold text-sage-forest">
              {displayUid(centerNode.data.uid)}
            </div>
            <p className="text-sm leading-relaxed text-sage-dark">
              {lang === "fr" ? centerNode.data.text_fr : centerNode.data.text_en}
            </p>
            <p className="mt-1 text-xs italic leading-relaxed text-sage-dark/60">
              {lang === "fr" ? centerNode.data.text_en : centerNode.data.text_fr}
            </p>
          </div>
        ) : null}

        <div className="mt-3">
          <TierButtons
            t={t}
            listTier={listTier}
            setListTier={setListTier}
            setGraphTier={setGraphTier}
          />
        </div>
        {listTier === "all" ? (
          <p className="mt-1 text-[11px] text-sage-dark/65">{t("graph.allDoesNotExpandGraph")}</p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">{feedList}</div>
    </div>
  );
}
