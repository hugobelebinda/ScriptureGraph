import type { InterlinearBook, StrongsEntry } from "../data/interlinearTypes";

type CompactEntry = { w: string; x: string; d: string; df?: string; g?: string };

const bookCache = new Map<string, InterlinearBook>();
const dictCache = new Map<"H" | "G", Record<string, StrongsEntry>>();
const occCache = new Map<"H" | "G", Record<string, string[]>>();

function expandDict(kind: "H" | "G", raw: Record<string, CompactEntry>): Record<string, StrongsEntry> {
  const out: Record<string, StrongsEntry> = {};
  for (const [id, entry] of Object.entries(raw)) {
    out[id] = {
      id,
      original_word: entry.w,
      transliteration: entry.x,
      part_of_speech: kind === "H" ? "Hebrew" : "Greek",
      definition: entry.d,
      definitionFr: entry.df,
      glossFr: entry.g,
    };
  }
  return out;
}

export async function fetchInterlinearBook(usfm: string): Promise<InterlinearBook> {
  const key = usfm.toUpperCase();
  const cached = bookCache.get(key);
  if (cached) return cached;
  const res = await fetch(`/interlinear/books/${encodeURIComponent(key)}.json`);
  if (!res.ok) throw new Error(`Interlinear book ${key} is not available.`);
  const data = (await res.json()) as InterlinearBook;
  bookCache.set(key, data);
  return data;
}

export async function fetchStrongsDictionary(kind: "H" | "G"): Promise<Record<string, StrongsEntry>> {
  const cached = dictCache.get(kind);
  if (cached) return cached;
  const file = kind === "H" ? "strongs-he.json" : "strongs-el.json";
  const res = await fetch(`/interlinear/${file}`);
  if (!res.ok) throw new Error("Strong's dictionary is not available.");
  const data = expandDict(kind, (await res.json()) as Record<string, CompactEntry>);
  dictCache.set(kind, data);
  return data;
}

export async function fetchStrongsOccurrences(id: string): Promise<string[]> {
  const kind: "H" | "G" = id.toUpperCase().startsWith("G") ? "G" : "H";
  let index = occCache.get(kind);
  if (!index) {
    const file = kind === "H" ? "occ-he.json" : "occ-el.json";
    const res = await fetch(`/interlinear/${file}`);
    if (!res.ok) throw new Error("Strong's concordance is not available.");
    index = (await res.json()) as Record<string, string[]>;
    occCache.set(kind, index);
  }
  return index[id.toUpperCase()] ?? [];
}

export function strongsDefinition(entry: StrongsEntry | undefined, lang: "en" | "fr"): string {
  if (!entry) return "";
  if (lang === "fr" && entry.definitionFr) return entry.definitionFr;
  return entry.definition;
}

export function tokensToVerse(
  tokens: { t: string; s?: string }[] | undefined,
): { text: string; strongsId?: string }[] {
  return (tokens ?? []).map((token) =>
    token.s ? { text: token.t, strongsId: token.s } : { text: token.t },
  );
}
