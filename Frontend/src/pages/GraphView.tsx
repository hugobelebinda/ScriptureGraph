import { type ElementDefinition } from "cytoscape";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { HierarchicalSearch } from "../components/HierarchicalSearch";
import { RelationalGraphCanvas } from "../components/RelationalGraphCanvas";
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
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
    if (!hoveredUid) return;
    const node = itemRefs.current[hoveredUid];
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [hoveredUid]);

  useEffect(() => {
    setGraphTier("core");
    setListTier("core");
  }, [centerUid]);

  const onNodeSelect = useCallback(
    (uid: string) => {
      const normalized = normalizeVerseUidInput(uid);
      if (!normalized) return;
      setCenterUid(normalized);
      setParams((prev) => nextParamsWithVerse(prev, normalized), { replace: true });
    },
    [setParams],
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
      .map((n) => ({
        data: {
          ...n.data,
          label: `${(lang === "fr" ? n.data.book_name_fr : n.data.book_name_en).toUpperCase()} ${verseLabelFromUid(n.data.uid)}`,
          color: bookColor(n.data.book),
        },
      }));
  }, [graphPayload, graphUids, lang]);

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

  if (!centerUid) {
    return (
      <section className="flex h-screen items-center justify-center bg-sage-bg px-6 text-sage-dark">
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

  return (
    <section className="flex h-screen bg-sage-bg text-sage-dark">
      <div className="flex w-3/5 min-w-0 flex-col border-r border-sage-primary/45 bg-white/85">
        <header className="flex items-center justify-between border-b border-sage-primary/35 px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-sage-dark">{t("nav.graph")}</h2>
            <p className="text-xs text-sage-dark/70">
              {t("graph.meta", { uid: displayUid(centerUid, t) })}
            </p>
          </div>
          <div className="text-right text-xs text-sage-dark/70">
            <div>
              {loading ? t("graph.loading") : t("graph.nodesCount", { count: graphNodes.length })}
            </div>
            <div>
              {loading ? "" : t("graph.edgesCount", { count: graphEdges.length })}
            </div>
          </div>
        </header>
        <div className="min-h-0 flex-1">
          {error ? (
            <div className="flex h-full items-center justify-center text-sm text-red-700">{error}</div>
          ) : (
            <RelationalGraphCanvas
              elements={elements}
              centerUid={centerUid}
              onNodeSelect={onNodeSelect}
              onNodeHover={onNodeHover}
            />
          )}
        </div>
      </div>

      <aside className="flex w-2/5 min-w-[22rem] flex-col bg-sage-primary/15">
        <div className="border-b border-sage-primary/35 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage-dark/75">
            {t("graph.searchLabel")}
          </p>
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
          <p className="mt-2 rounded-md border border-sage-primary/35 bg-white/70 px-2.5 py-1.5 text-[11px] leading-relaxed text-sage-dark/75">
            {t("graph.lsgVerseMergeNotice")}
          </p>

          {centerNode ? (
            <div className="mt-3 rounded-lg border border-sage-primary/55 bg-sage-primary/25 px-3 py-2">
              <div className="mb-1 text-xs font-semibold text-sage-forest">
                {displayUid(centerNode.data.uid, t)}
              </div>
              <p className="text-sm leading-relaxed text-sage-dark">
                {lang === "fr" ? centerNode.data.text_fr : centerNode.data.text_en}
              </p>
              <p className="mt-1 text-xs italic leading-relaxed text-sage-dark/60">
                {lang === "fr" ? centerNode.data.text_en : centerNode.data.text_fr}
              </p>
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-2">
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
              onClick={() => {
                setListTier("all");
              }}
              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                listTier === "all"
                  ? "bg-sage-forest text-white"
                  : "bg-white text-sage-dark border border-sage-primary/45"
              }`}
            >
              {t("graph.tierAll")}
            </button>
          </div>
          {listTier === "all" ? (
            <p className="mt-1 text-[11px] text-sage-dark/65">{t("graph.allDoesNotExpandGraph")}</p>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
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
                    {item.uid}
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
      </aside>
    </section>
  );
}
