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

export type ParsedUid = {
  book: string;
  chapter: number;
  verse: number;
};

const chapterCache = new Map<string, ChapterPayload>();

export function parseUid(uid: string): ParsedUid | null {
  const parts = uid.trim().split(".");
  if (parts.length !== 3) return null;
  const [book, ch, vs] = parts;
  const chapter = Number(ch);
  const verse = Number(vs);
  if (!book || !Number.isFinite(chapter) || !Number.isFinite(verse)) return null;
  return { book: book.toUpperCase(), chapter, verse };
}

export function findVerseInChapter(
  chapter: ChapterPayload,
  verseNumber: number,
): VerseDto | null {
  return (
    chapter.verses.find(
      (v) => parseUid(v.uid)?.verse === verseNumber,
    ) ?? null
  );
}

/**
 * Fetches from `/api/...` (Vite dev proxy → Express). Always sends current UI `lang`
 * for verse text and connection snippets.
 */
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

  return { lang, fetchChapter, fetchConnections };
}
