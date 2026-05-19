import { type ElementDefinition } from "cytoscape";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { GraphVersePanel } from "../components/GraphVersePanel";
import { HierarchicalSearch } from "../components/HierarchicalSearch";
import { RelationalGraphCanvas } from "../components/RelationalGraphCanvas";
import { useIsBelowLg } from "../hooks/useMediaQuery";
import { BOOK_ORDER } from "../data/canonicalBooks";
import {
  type CrossReferencesGraphPayload,
  normalizeVerseUidInput,
  useBibleData,
} from "../hooks/useBibleData";

const BOOK_COLORS = [
  "#588157",
  "#6c8f6b",
  "#739f82",
  "#8aa17b",
  "#7f8f5d",
  "#9e7c59",
  "#7a8ca3",
  "#7b78a8",
  "#5f9ea0",
  "#9c9150",
  "#9d6f63",
  "#8d6f8f",
] as const;

type FilterTier = "core" | "strong" | "all";

function bookColor(book: string): string {
  let hash = 0;
  for (let i = 0; i < book.length; i += 1) {
    hash = (hash * 31 + book.charCodeAt(i)) >>> 0;
  }
  return BOOK_COLORS[hash % BOOK_COLORS.length] ?? "#588157";
}

function nextParamsWithVerse(previous: URLSearchParams, verse: string): URLSearchParams {
  const next = new URLSearchParams(previous);
  next.set("verse", verse);
  next.delete("book");
  return next;
}

function verseLabelFromUid(uid: string): string {
  const [, chapter, verse] = uid.split(".");
  if (!chapter || !verse) return uid;
  return `${chapter}:${verse}`;
}

function displayUid(uid: string, t: (key: string, options?: { defaultValue?: string }) => string): string {
  const [book, chapter, verse] = uid.split(".");
  if (!book || !chapter || !verse) return uid;
  const localizedBook = t(`books.${book}`, { defaultValue: book });
  return `${localizedBook} ${chapter}:${verse}`;
}

export function GraphView() {
  const { t } = useTranslation();
  const { lang, fetchCrossReferencesGraph } = useBibleData();
  const [params, setParams] = useSearchParams();

  const verseFromUrl = useMemo(() => {
    const explicitVerse = normalizeVerseUidInput(params.get("verse") ?? "");
    return explicitVerse ?? null;
  }, [params]);
  const preselectedBookFromUrl = useMemo(() => {
    const candidate = (params.get("book") ?? "").trim().toUpperCase();
    if (!candidate) return null;
    return BOOK_ORDER.includes(candidate as (typeof BOOK_ORDER)[number]) ? candidate : null;
  }, [params]);

  const [centerUid, setCenterUid] = useState<string | null>(verseFromUrl);
  const [graphPayload, setGraphPayload] = useState<CrossReferencesGraphPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredUid, setHoveredUid] = useState<string | null>(null);
  const [graphTier, setGraphTier] = useState<"core" | "strong">("core");
  const [listTier, setListTier] = useState<FilterTier>("core");
  const [mobileTab, setMobileTab] = useState<"graph" | "verses">("graph");
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isMobile = useIsBelowLg();

  useEffect(() => {
    setCenterUid(verseFromUrl);
  }, [verseFromUrl]);

  useEffect(() => {
    if (!centerUid) {
      setGraphPayload(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const payload = await fetchCrossReferencesGraph(centerUid);
        if (cancelled) return;
        setGraphPayload(payload);
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setError(t("graph.loadFailed"));
        setGraphPayload(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [centerUid, fetchCrossReferencesGraph, t]);

  useEffect(() => {
    setGraphTier("core");
    setListTier("core");
  }, [centerUid]);

  const selectVerse = useCallback(
    (uid: string) => {
      const normalized = normalizeVerseUidInput(uid);
      if (!normalized) return;
      setCenterUid(normalized);
      setParams((prev) => nextParamsWithVerse(prev, normalized), { replace: true });
    },
    [setParams],
  );

  const onNodeSelect = useCallback(
    (uid: string) => {
      selectVerse(uid);
      if (isMobile) setMobileTab("verses");
    },
    [isMobile, selectVerse],
  );

  const onNodeHover = useCallback((uid: string | null) => {
    setHoveredUid(uid);
  }, []);

  const feedByUid = useMemo(() => {
    if (!graphPayload) return new Map<string, CrossReferencesGraphPayload["feed"][number]>();
    return new Map(graphPayload.feed.map((item) => [item.uid, item]));
  }, [graphPayload]);

  const rankedUids = useMemo(() => {
    if (!graphPayload) {
      return {
        core: [] as string[],
        strong: [] as string[],
        all: [] as string[],
      };
    }

    return {
      core: graphPayload.ranking.core_uids,
      strong: graphPayload.ranking.strong_uids,
      all: graphPayload.ranking.all_uids,
    };
  }, [graphPayload]);

  const feed = useMemo(() => {
    const mapUidsToFeed = (uids: string[]) =>
      uids
        .map((uid) => feedByUid.get(uid))
        .filter((item): item is CrossReferencesGraphPayload["feed"][number] => Boolean(item));

    if (listTier === "core") return mapUidsToFeed(rankedUids.core);
    if (listTier === "strong") return mapUidsToFeed(rankedUids.strong);
    return mapUidsToFeed(rankedUids.all);
  }, [feedByUid, listTier, rankedUids]);

  const graphUids = useMemo(() => {
    if (!centerUid) return new Set<string>();

    const uids = new Set<string>([centerUid]);
    const activeTierUids = graphTier === "core" ? rankedUids.core : rankedUids.strong;
    for (const uid of activeTierUids) uids.add(uid);

    return uids;
  }, [centerUid, graphTier, rankedUids.core, rankedUids.strong]);

  const graphNodes = useMemo(() => {
    if (!graphPayload) return [];
    return graphPayload.graph.nodes
      .filter((n) => graphUids.has(n.data.uid))
      .map((n) => {
        const bookName = lang === "fr" ? n.data.book_name_fr : n.data.book_name_en;
        const label = isMobile
          ? `${n.data.book} ${verseLabelFromUid(n.data.uid)}`
          : `${bookName.toUpperCase()} ${verseLabelFromUid(n.data.uid)}`;
        return {
          data: {
            ...n.data,
            label,
            color: bookColor(n.data.book),
          },
        };
      });
  }, [graphPayload, graphUids, isMobile, lang]);

  const graphEdges = useMemo(() => {
    if (!graphPayload) return [];
    return graphPayload.graph.edges.filter(
      (e) => graphUids.has(e.data.source) && graphUids.has(e.data.target),
    );
  }, [graphPayload, graphUids]);

  const centerNode = useMemo(() => {
    if (!graphPayload || !centerUid) return null;
    return graphPayload.graph.nodes.find((n) => n.data.uid === centerUid) ?? null;
  }, [centerUid, graphPayload]);

  const elements = useMemo<ElementDefinition[]>(() => {
    return [...graphNodes.map((n) => ({ data: n.data })), ...graphEdges.map((e) => ({ data: e.data }))];
  }, [graphEdges, graphNodes]);

  useEffect(() => {
    if (!hoveredUid || isMobile) return;
    const node = itemRefs.current[hoveredUid];
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [hoveredUid, isMobile]);

  const uidLabel = useCallback((uid: string) => displayUid(uid, t), [t]);

  const versePanelProps = centerUid
    ? {
        t,
        lang,
        centerUid,
        centerNode,
        preselectedBookFromUrl,
        displayUid: uidLabel,
        listTier,
        setListTier,
        setGraphTier,
        feed,
        loading,
        hoveredUid,
        itemRefs,
        onSelectVerse: selectVerse,
        onNodeSelect,
        compact: isMobile,
      }
    : null;

  if (!centerUid) {
    return (
      <section className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-sage-bg px-6 text-sage-dark lg:h-screen lg:min-h-0">
        <div className="w-full max-w-xl rounded-2xl border border-sage-primary/40 bg-white/85 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-sage-dark">{t("nav.graph")}</h2>
          <p className="mt-2 text-sm text-sage-dark/80">{t("graph.enterPrompt")}</p>
          <div className="mt-4">
            <HierarchicalSearch
              initialBook={preselectedBookFromUrl}
              onSelectVerse={(uid) => {
                const normalized = normalizeVerseUidInput(uid);
                if (!normalized) return;
                setCenterUid(normalized);
                setParams((prev) => nextParamsWithVerse(prev, normalized), {
                  replace: true,
                });
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  const graphCanvas = error ? (
    <div className="flex h-full items-center justify-center text-sm text-red-700">{error}</div>
  ) : (
    <RelationalGraphCanvas
      elements={elements}
      centerUid={centerUid}
      compactLabels={isMobile}
      visible={!isMobile || mobileTab === "graph"}
      onNodeSelect={onNodeSelect}
      onNodeHover={onNodeHover}
    />
  );

  const graphHeader = (
    <header className="flex shrink-0 items-center justify-between border-b border-sage-primary/35 px-3 py-2 lg:px-4 lg:py-3">
      <div>
        <h2 className="text-base font-semibold text-sage-dark lg:text-lg">{t("nav.graph")}</h2>
        <p className="text-[11px] text-sage-dark/70 lg:text-xs">
          {t("graph.meta", { uid: displayUid(centerUid, t) })}
        </p>
      </div>
      <div className="text-right text-[11px] text-sage-dark/70 lg:text-xs">
        <div>
          {loading ? t("graph.loading") : t("graph.nodesCount", { count: graphNodes.length })}
        </div>
        <div>{loading ? "" : t("graph.edgesCount", { count: graphEdges.length })}</div>
      </div>
    </header>
  );

  return (
    <section className="flex h-[calc(100dvh-3.5rem)] flex-col bg-sage-bg text-sage-dark lg:h-screen">
      <div className="flex shrink-0 border-b border-sage-primary/35 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("graph")}
          className={`flex-1 px-3 py-2.5 text-sm font-semibold ${
            mobileTab === "graph"
              ? "border-b-2 border-sage-forest text-sage-forest"
              : "text-sage-dark/70"
          }`}
        >
          {t("mobile.graphTab")}
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("verses")}
          className={`flex-1 px-3 py-2.5 text-sm font-semibold ${
            mobileTab === "verses"
              ? "border-b-2 border-sage-forest text-sage-forest"
              : "text-sage-dark/70"
          }`}
        >
          {t("mobile.versesTab")}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div
          className={`min-h-0 min-w-0 flex-col bg-white/85 lg:flex lg:w-3/5 lg:border-r lg:border-sage-primary/45 ${
            isMobile && mobileTab !== "graph" ? "hidden" : "flex flex-1"
          }`}
        >
          {graphHeader}
          <div className="min-h-0 flex-1">{graphCanvas}</div>
        </div>

        <aside
          className={`min-h-0 min-w-0 flex-col bg-sage-primary/15 lg:flex lg:w-2/5 lg:min-w-[22rem] ${
            isMobile && mobileTab !== "verses" ? "hidden" : "flex flex-1"
          }`}
        >
          {versePanelProps ? <GraphVersePanel {...versePanelProps} /> : null}
        </aside>
      </div>
    </section>
  );
}
