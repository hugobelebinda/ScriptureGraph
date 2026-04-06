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

/**
 * Fetches from `/api/...` (Vite dev proxy → Express). Always sends current UI `lang`
 * for verse text and connection snippets.
 */
export function useBibleData() {
  const uiLang = useAppStore((s) => s.uiLang);
  const lang = useMemo(() => uiLang, [uiLang]);

  const fetchChapter = useCallback(
    async (book: string, chapter: number): Promise<ChapterPayload> => {
      const q = new URLSearchParams({ lang });
      const url = `${API_BASE}/api/verses/${encodeURIComponent(book)}/${chapter}?${q}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Verses ${res.status}: ${await res.text()}`);
      }
      return res.json() as Promise<ChapterPayload>;
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
