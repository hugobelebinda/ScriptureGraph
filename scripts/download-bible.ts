/**
 * Downloads HelloAO Bible JSON: books list + every chapter for English and French.
 *
 * Default translation slugs match common docs (`web`, `lsg`). If those paths return
 * HTML (VuePress shell) instead of JSON, the script falls back to `eng_web` and `fra_lsg`.
 *
 * Override: BIBLE_EN_TRANSLATION_ID, BIBLE_FR_TRANSLATION_ID, REQUEST_DELAY_MS
 */

import { mkdir, stat, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API_BASE = "https://bible.helloao.org/api";

function uniqueIds(...ids: (string | undefined)[]): string[] {
  return [...new Set(ids.filter((x): x is string => Boolean(x)))];
}

/** Try env override first, then short doc slugs, then known-working API ids. */
const EN_IDS = uniqueIds(
  process.env.BIBLE_EN_TRANSLATION_ID,
  "web",
  "eng_web",
);
const FR_IDS = uniqueIds(
  process.env.BIBLE_FR_TRANSLATION_ID,
  "lsg",
  "fra_lsg",
);

const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS ?? "200") || 200;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_EN = join(ROOT, "data-raw", "bible-en");
const OUT_FR = join(ROOT, "data-raw", "bible-fr");

interface TranslationBook {
  id: string;
  numberOfChapters: number;
  firstChapterNumber: number;
  lastChapterNumber: number;
}

interface TranslationBooks {
  books: TranslationBook[];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isLikelyJson(text: string): boolean {
  const t = text.trimStart();
  return t.startsWith("{") || t.startsWith("[");
}

/** If `path` is a file (e.g. an old placeholder), remove it so we can use it as a directory. */
async function ensureDirRoot(path: string): Promise<void> {
  try {
    const s = await stat(path);
    if (s.isFile()) {
      await unlink(path);
    }
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "ENOENT") {
      // missing — mkdir below will create
    } else {
      throw e;
    }
  }
  await mkdir(path, { recursive: true });
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return text;
}

async function resolveTranslation(
  label: string,
  candidateIds: string[],
): Promise<{ translationId: string; books: TranslationBooks }> {
  const tried: string[] = [];
  for (const id of candidateIds) {
    if (tried.includes(id)) continue;
    tried.push(id);
    const url = `${API_BASE}/${id}/books.json`;
    await sleep(REQUEST_DELAY_MS);
    const text = await fetchText(url);
    if (!isLikelyJson(text)) {
      console.warn(
        `[${label}] ${url} returned non-JSON (likely HTML). Trying next candidate…`,
      );
      continue;
    }
    const data = JSON.parse(text) as TranslationBooks;
    if (!Array.isArray(data.books)) {
      throw new Error(`Invalid books.json shape at ${url}`);
    }
    console.log(`[${label}] Using translation id "${id}" (${url})`);
    return { translationId: id, books: data };
  }
  throw new Error(
    `[${label}] Could not load books.json. Tried: ${tried.join(", ")}`,
  );
}

async function saveChapter(
  translationId: string,
  bookId: string,
  chapter: number,
  outDir: string,
): Promise<void> {
  const url = `${API_BASE}/${translationId}/${bookId}/${chapter}.json`;
  await sleep(REQUEST_DELAY_MS);
  const text = await fetchText(url);
  if (!isLikelyJson(text)) {
    throw new Error(`Expected JSON from ${url}, got non-JSON body`);
  }
  const file = join(outDir, bookId, `${chapter}.json`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, text, "utf8");
}

async function downloadTranslation(
  label: string,
  candidateIds: string[],
  outDir: string,
): Promise<void> {
  await ensureDirRoot(outDir);
  const { translationId, books } = await resolveTranslation(
    label,
    candidateIds,
  );

  let chapterCount = 0;
  for (const book of books.books) {
    const { id: bookId, firstChapterNumber, lastChapterNumber } = book;
    for (let ch = firstChapterNumber; ch <= lastChapterNumber; ch++) {
      await saveChapter(translationId, bookId, ch, outDir);
      chapterCount++;
      if (chapterCount % 50 === 0) {
        console.log(
          `[${label}] … ${chapterCount} chapters (${bookId} ${ch})`,
        );
      }
    }
  }
  console.log(`[${label}] Done: ${chapterCount} chapter files → ${outDir}`);
}

async function main(): Promise<void> {
  console.log(
    `Request delay: ${REQUEST_DELAY_MS}ms (set REQUEST_DELAY_MS to change)`,
  );
  await downloadTranslation("en", EN_IDS, OUT_EN);
  await downloadTranslation("fr", FR_IDS, OUT_FR);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
