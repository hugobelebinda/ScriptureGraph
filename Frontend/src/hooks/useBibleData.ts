import { useCallback, useMemo } from "react";
import { useAppStore } from "../store/useAppStore";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export type VerseDto = {
  uid: string;
  text: string;
  text_en: string;
  text_fr: string;
};

export type ChapterPayload = {
  book: string;
  chapter: number;
  lang: string;
  book_name: string | null;
  verses: VerseDto[];
};

export type ConnectionDto = {
  target_uid: string;
  weight: number;
  text: string | null;
  book_name: string | null;
};

export type ConnectionsPayload = {
  source_uid: string;
  lang: string;
  connections: ConnectionDto[];
};

export type EgoGraphNode = {
  data: {
    id: string;
    uid: string;
    book: string;
    label: string;
    text_en: string;
    text_fr: string;
    book_name_en: string;
    book_name_fr: string;
    distance: number;
  };
};

export type EgoGraphEdge = {
  data: {
    id: string;
    source: string;
    target: string;
    weight: number;
    depth: number;
  };
};

export type EgoGraphFeedItem = {
  uid: string;
  distance: number;
  book: string;
  text_en: string;
  text_fr: string;
  book_name_en: string;
  book_name_fr: string;
  relevance: number;
};

export type CrossReferencesGraphPayload = {
  center_uid: string;
  lang: string;
  ranking_method: string;
  ranking_lens: {
    description: string;
    depth_factor: {
      depth_1: number;
      depth_2: number;
    };
  };
  stats: {
    nodes: number;
    edges: number;
  };
  graph: {
    nodes: EgoGraphNode[];
    edges: EgoGraphEdge[];
  };
  feed: EgoGraphFeedItem[];
  ranking: {
    core_uids: string[];
    strong_uids: string[];
    all_uids: string[];
  };
};

export type ParsedUid = {
  book: string;
  chapter: number;
  verse: number;
};

const chapterCache = new Map<string, ChapterPayload>();
const egoGraphCache = new Map<string, CrossReferencesGraphPayload>();

export function parseUid(uid: string): ParsedUid | null {
  const parts = uid.trim().split(".");
  if (parts.length !== 3) return null;
  const [book, ch, vs] = parts;
  const chapter = Number(ch);
  const verse = Number(vs);
  if (!book || !Number.isFinite(chapter) || !Number.isFinite(verse)) return null;
  return { book: book.toUpperCase(), chapter, verse };
}

export function findVerseInChapter(chapter: ChapterPayload, verseNumber: number): VerseDto | null {
  return chapter.verses.find((v) => parseUid(v.uid)?.verse === verseNumber) ?? null;
}

export function normalizeVerseUidInput(input: string): string | null {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, "");
  if (/^[A-Z0-9]+\.\d+\.\d+$/.test(cleaned)) return cleaned;

  const m = input.trim().toUpperCase().match(/^([1-3]?[A-Z]{2,})\s*(\d+)[.:](\d+)$/);
  if (!m) return null;
  const book = m[1];
  const chapter = Number(m[2]);
  const verse = Number(m[3]);
  if (!Number.isFinite(chapter) || !Number.isFinite(verse)) return null;
  return `${book}.${chapter}.${verse}`;
}

export function useBibleData() {
  const uiLang = useAppStore((s) => s.uiLang);
  const lang = useMemo(() => uiLang, [uiLang]);

  const fetchChapter = useCallback(
    async (
      book: string,
      chapter: number,
      opts?: { bypassCache?: boolean },
    ): Promise<ChapterPayload> => {
      const cacheKey = `${lang}:${book.toUpperCase()}:${chapter}`;
      if (!opts?.bypassCache) {
        const cached = chapterCache.get(cacheKey);
        if (cached) return cached;
      }

      const q = new URLSearchParams({ lang });
      const url = `${API_BASE}/api/verses/${encodeURIComponent(book)}/${chapter}?${q}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Verses ${res.status}: ${await res.text()}`);
      }
      const data = (await res.json()) as ChapterPayload;
      chapterCache.set(cacheKey, data);
      return data;
    },
    [lang],
  );

  const fetchConnections = useCallback(
    async (verseUid: string): Promise<ConnectionsPayload> => {
      const q = new URLSearchParams({ lang });
      const path = encodeURIComponent(verseUid);
      const url = `${API_BASE}/api/connections/${path}?${q}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Connections ${res.status}: ${await res.text()}`);
      }
      return res.json() as Promise<ConnectionsPayload>;
    },
    [lang],
  );

  const fetchCrossReferencesGraph = useCallback(
    async (verseUid: string, opts?: { bypassCache?: boolean }): Promise<CrossReferencesGraphPayload> => {
      const normalized = verseUid.trim().toUpperCase();
      const cacheKey = `${lang}:${normalized}`;
      if (!opts?.bypassCache) {
        const cached = egoGraphCache.get(cacheKey);
        if (cached) return cached;
      }

      const q = new URLSearchParams({ lang });
      const path = encodeURIComponent(normalized);
      const url = `${API_BASE}/api/cross-references/${path}?${q}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Cross references ${res.status}: ${await res.text()}`);
      }

      const data = (await res.json()) as CrossReferencesGraphPayload;
      egoGraphCache.set(cacheKey, data);
      return data;
    },
    [lang],
  );

  return { lang, fetchChapter, fetchConnections, fetchCrossReferencesGraph };
}
