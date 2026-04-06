import "./loadEnv.js";
import { createReadStream } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BATCH = 2000;

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, "../..");
const DATA_RAW = join(REPO_ROOT, "data-raw");
const BIBLE_EN = join(DATA_RAW, "bible-en");
const BIBLE_FR = join(DATA_RAW, "bible-fr");
const CROSS_REF_FILE = join(DATA_RAW, "cross_references.txt");

/** Protestant canon (USFM), same order as cross_references.txt sources. */
const BOOK_ORDER = [
  "GEN", "EXO", "LEV", "NUM", "DEU", "JOS", "JDG", "RUT", "1SA", "2SA", "1KI", "2KI",
  "1CH", "2CH", "EZR", "NEH", "EST", "JOB", "PSA", "PRO", "ECC", "SNG", "ISA", "JER",
  "LAM", "EZK", "DAN", "HOS", "JOL", "AMO", "OBA", "JON", "MIC", "NAM", "HAB", "ZEP",
  "HAG", "ZEC", "MAL", "MAT", "MRK", "LUK", "JHN", "ACT", "ROM", "1CO", "2CO", "GAL",
  "EPH", "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "HEB", "JAS", "1PE",
  "2PE", "1JN", "2JN", "3JN", "JUD", "REV",
] as const;

const CANONICAL_BOOKS = new Set<string>(BOOK_ORDER);

/** OpenBible.info abbreviations (dotted refs) → USFM book codes. */
const OPENBIBLE_TO_USFM: Record<string, string> = {
  Gen: "GEN", Exod: "EXO", Lev: "LEV", Num: "NUM", Deut: "DEU", Josh: "JOS", Judg: "JDG",
  Ruth: "RUT", "1Sam": "1SA", "2Sam": "2SA", "1Kgs": "1KI", "2Kgs": "2KI", "1Chr": "1CH",
  "2Chr": "2CH", Ezra: "EZR", Neh: "NEH", Esth: "EST", Job: "JOB", Ps: "PSA", Prov: "PRO",
  Eccl: "ECC", Song: "SNG", Isa: "ISA", Jer: "JER", Lam: "LAM", Ezek: "EZK", Dan: "DAN",
  Hos: "HOS", Joel: "JOL", Amos: "AMO", Obad: "OBA", Jonah: "JON", Mic: "MIC", Nah: "NAM",
  Hab: "HAB", Zeph: "ZEP", Hag: "HAG", Zech: "ZEC", Mal: "MAL", Matt: "MAT", Mark: "MRK",
  Luke: "LUK", John: "JHN", Acts: "ACT", Rom: "ROM", "1Cor": "1CO", "2Cor": "2CO", Gal: "GAL",
  Eph: "EPH", Phil: "PHP", Col: "COL", "1Thess": "1TH", "2Thess": "2TH", "1Tim": "1TI",
  "2Tim": "2TI", Titus: "TIT", Phlm: "PHM", Heb: "HEB", Jas: "JAS", "1Pet": "1PE",
  "2Pet": "2PE", "1John": "1JN", "2John": "2JN", "3John": "3JN", Jude: "JUD", Rev: "REV",
};

/** Optional long names / aliases → same keys as OPENBIBLE_TO_USFM (before USFM step). */
const LONG_NAME_TO_OPENBIBLE_KEY: Record<string, keyof typeof OPENBIBLE_TO_USFM> = {
  genesis: "Gen", exodus: "Exod", leviticus: "Lev", numbers: "Num", deuteronomy: "Deut",
  joshua: "Josh", judges: "Judg", ruth: "Ruth", "1 samuel": "1Sam", "2 samuel": "2Sam",
  "1 kings": "1Kgs", "2 kings": "2Kgs", "1 chronicles": "1Chr", "2 chronicles": "2Chr",
  ezra: "Ezra", nehemiah: "Neh", esther: "Esth", job: "Job", psalm: "Ps", psalms: "Ps",
  proverbs: "Prov", ecclesiastes: "Eccl", songofsolomon: "Song", song: "Song", isaiah: "Isa",
  jeremiah: "Jer", lamentations: "Lam", ezekiel: "Ezek", daniel: "Dan", hosea: "Hos",
  joel: "Joel", amos: "Amos", obadiah: "Obad", jonah: "Jonah", micah: "Mic", nahum: "Nah",
  habakkuk: "Hab", zephaniah: "Zeph", haggai: "Hag", zechariah: "Zech", malachi: "Mal",
  matthew: "Matt", mark: "Mark", luke: "Luke", john: "John", acts: "Acts", romans: "Rom",
  "1 corinthians": "1Cor", "2 corinthians": "2Cor", galatians: "Gal", ephesians: "Eph",
  philippians: "Phil", colossians: "Col", "1 thessalonians": "1Thess",
  "2 thessalonians": "2Thess", "1 timothy": "1Tim", "2 timothy": "2Tim", titus: "Titus",
  philemon: "Phlm", hebrews: "Heb", james: "Jas", "1 peter": "1Pet", "2 peter": "2Pet",
  "1 john": "1John", "2 john": "2John", "3 john": "3John", jude: "Jude", revelation: "Rev",
  jn: "John", jnh: "Jonah", mk: "Mark", lk: "Luke", mt: "Matt", rm: "Rom", ps: "Ps",
};

type VerseRow = {
  uid: string;
  text_en: string;
  text_fr: string;
  book_name_en: string;
  book_name_fr: string;
};

type ContentPiece = string | { noteId?: number; [k: string]: unknown };

interface ChapterJson {
  book?: { id?: string; name?: string };
  chapter?: { content?: Array<{ type?: string; number?: number; content?: ContentPiece[] }> };
}

function flattenVerseText(pieces: ContentPiece[] | undefined): string {
  if (!pieces?.length) return "";
  return pieces.map((p) => (typeof p === "string" ? p : "")).join("").trim();
}

function uidFor(book: string, chapter: number, verse: number): string {
  return `${book}.${chapter}.${verse}`;
}

function openbibleKeyToUsfm(key: string): string | null {
  return OPENBIBLE_TO_USFM[key as keyof typeof OPENBIBLE_TO_USFM] ?? null;
}

/**
 * Parse references like Gen.1.1, John.3.16, 1Chr.10.13, or "John 3:16" / "Jn 3:16".
 */
function parseRefToUsfmParts(ref: string): { book: string; chapter: number; verse: number } | null {
  const s = ref.trim();
  if (!s) return null;

  const dotted = s.match(/^(.+)\.(\d+)\.(\d+)$/);
  if (dotted) {
    const abbrev = dotted[1]!;
    const ch = Number(dotted[2]);
    const vs = Number(dotted[3]);
    if (!Number.isFinite(ch) || !Number.isFinite(vs)) return null;
    const usfm = openbibleKeyToUsfm(abbrev);
    if (!usfm) return null;
    return { book: usfm, chapter: ch, verse: vs };
  }

  const spaced = s.match(
    /^([A-Za-z0-9]+)\s+(\d+)\s*:\s*(\d+)(?:\s*[-–]\s*\d+)?$/i,
  );
  if (spaced) {
    const word = spaced[1]!.toLowerCase();
    const ch = Number(spaced[2]);
    const vs = Number(spaced[3]);
    const obKey = LONG_NAME_TO_OPENBIBLE_KEY[word];
    if (!obKey) return null;
    const usfm = OPENBIBLE_TO_USFM[obKey];
    if (!usfm) return null;
    return { book: usfm, chapter: ch, verse: vs };
  }

  return null;
}

function toUid(parts: { book: string; chapter: number; verse: number }): string {
  return uidFor(parts.book, parts.chapter, parts.verse);
}

type RefParts = { book: string; chapter: number; verse: number };

function cmpRef(a: RefParts, b: RefParts): number {
  const ai = BOOK_ORDER.indexOf(a.book as (typeof BOOK_ORDER)[number]);
  const bi = BOOK_ORDER.indexOf(b.book as (typeof BOOK_ORDER)[number]);
  if (ai !== bi) return ai < bi ? -1 : 1;
  if (a.chapter !== b.chapter) return a.chapter - b.chapter;
  return a.verse - b.verse;
}

/** book → chapter → max verse number (from seeded text). */
type BookMeta = Map<string, Map<number, number>>;

function recordVerseMeta(meta: BookMeta, book: string, chapter: number, verse: number): void {
  let chMap = meta.get(book);
  if (!chMap) {
    chMap = new Map();
    meta.set(book, chMap);
  }
  chMap.set(chapter, Math.max(chMap.get(chapter) ?? 0, verse));
}

function nextRef(cur: RefParts, meta: BookMeta): RefParts | null {
  const chMap = meta.get(cur.book);
  if (!chMap) return null;
  const maxV = chMap.get(cur.chapter);
  if (maxV !== undefined && cur.verse < maxV) {
    return { book: cur.book, chapter: cur.chapter, verse: cur.verse + 1 };
  }
  const chapters = [...chMap.keys()].sort((a, b) => a - b);
  const idx = chapters.indexOf(cur.chapter);
  if (idx >= 0 && idx < chapters.length - 1) {
    const nc = chapters[idx + 1]!;
    return { book: cur.book, chapter: nc, verse: 1 };
  }
  const bi = BOOK_ORDER.indexOf(cur.book as (typeof BOOK_ORDER)[number]);
  if (bi < 0) return null;
  for (let i = bi + 1; i < BOOK_ORDER.length; i++) {
    const nb = BOOK_ORDER[i]!;
    const nm = meta.get(nb);
    if (nm?.size) {
      const fc = [...nm.keys()].sort((a, b) => a - b)[0]!;
      return { book: nb, chapter: fc, verse: 1 };
    }
  }
  return null;
}

function expandRange(start: RefParts, end: RefParts, meta: BookMeta): RefParts[] {
  if (cmpRef(start, end) > 0) return [];
  const out: RefParts[] = [];
  let cur: RefParts | null = { ...start };
  while (cur && cmpRef(cur, end) <= 0) {
    out.push({ ...cur });
    if (cur.book === end.book && cur.chapter === end.chapter && cur.verse === end.verse) {
      break;
    }
    cur = nextRef(cur, meta);
    if (!cur) break;
  }
  return out;
}

/** Split OpenBible target field into start/end segments (handles cross-book ranges). */
function splitRangeTarget(targetRaw: string): [string, string] | null {
  const t = targetRaw.trim();
  const m = t.match(/^(.+\.\d+\.\d+)-(.+)$/);
  if (!m) return null;
  return [m[1]!.trim(), m[2]!.trim()];
}

function parseEndRef(endStr: string, start: RefParts): RefParts | null {
  const full = parseRefToUsfmParts(endStr);
  if (full) return full;
  const short = endStr.match(/^(\d+)\.(\d+)$/);
  if (short) {
    const ch = Number(short[1]);
    const vs = Number(short[2]);
    if (!Number.isFinite(ch) || !Number.isFinite(vs)) return null;
    return { book: start.book, chapter: ch, verse: vs };
  }
  return null;
}

/** Expand OpenBible-style ref (single verse or range) into USFM UIDs. */
function expandRefUids(raw: string, meta: BookMeta): string[] {
  const range = splitRangeTarget(raw);
  if (!range) {
    const one = parseRefToUsfmParts(raw);
    return one ? [toUid(one)] : [];
  }
  const [a, b] = range;
  const start = parseRefToUsfmParts(a);
  if (!start) return [];
  const end = parseEndRef(b, start);
  if (!end) return [];
  return expandRange(start, end, meta).map(toUid);
}

async function flushVerses(batch: VerseRow[]): Promise<void> {
  if (!batch.length) return;
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.verse.createMany({ data: batch });
  });
}

async function flushCrossRefs(
  batch: { source_uid: string; target_uid: string; weight: number }[],
): Promise<void> {
  if (!batch.length) return;
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.crossReference.createMany({
      data: batch,
      skipDuplicates: true,
    });
  });
}

async function seedVerses(): Promise<BookMeta> {
  const meta: BookMeta = new Map();
  const enStat = await stat(BIBLE_EN).catch(() => null);
  if (!enStat?.isDirectory()) {
    throw new Error(`Missing bible-en directory: ${BIBLE_EN}`);
  }

  const books = (await readdir(BIBLE_EN)).filter((b) => CANONICAL_BOOKS.has(b));
  books.sort((a, b) => BOOK_ORDER.indexOf(a as (typeof BOOK_ORDER)[number]) - BOOK_ORDER.indexOf(b as (typeof BOOK_ORDER)[number]));

  let batch: VerseRow[] = [];
  let total = 0;

  for (const book of books) {
    const enBookDir = join(BIBLE_EN, book);
    const frBookDir = join(BIBLE_FR, book);
    const st = await stat(enBookDir).catch(() => null);
    if (!st?.isDirectory()) continue;

    const chapters = (await readdir(enBookDir))
      .filter((f) => f.endsWith(".json"))
      .map((f) => Number(f.replace(/\.json$/i, "")))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);

    for (const chapter of chapters) {
      const enPath = join(enBookDir, `${chapter}.json`);
      const frPath = join(frBookDir, `${chapter}.json`);
      const [enRaw, frRaw] = await Promise.all([
        readFile(enPath, "utf8"),
        readFile(frPath, "utf8").catch(() => null),
      ]);
      if (frRaw === null) {
        console.warn(`Skipping ${book} ${chapter}: missing French file`);
        continue;
      }

      const enJson = JSON.parse(enRaw) as ChapterJson;
      const frJson = JSON.parse(frRaw) as ChapterJson;
      const bookNameEn = enJson.book?.name ?? book;
      const bookNameFr = frJson.book?.name ?? book;

      const enContent = enJson.chapter?.content ?? [];
      const frByNum = new Map<number, string>();
      for (const block of frJson.chapter?.content ?? []) {
        if (block.type === "verse" && typeof block.number === "number") {
          frByNum.set(block.number, flattenVerseText(block.content));
        }
      }

      for (const block of enContent) {
        if (block.type !== "verse" || typeof block.number !== "number") continue;
        const v = block.number;
        const textEn = flattenVerseText(block.content);
        const textFr = frByNum.get(v) ?? "";
        recordVerseMeta(meta, book, chapter, v);
        batch.push({
          uid: uidFor(book, chapter, v),
          text_en: textEn,
          text_fr: textFr,
          book_name_en: bookNameEn,
          book_name_fr: bookNameFr,
        });
        total++;
        if (batch.length >= BATCH) {
          await flushVerses(batch);
          batch = [];
          console.log(`Verses… ${total} rows`);
        }
      }
    }
  }

  await flushVerses(batch);
  console.log(`Verses done: ${total} rows`);
  return meta;
}

async function seedCrossReferences(meta: BookMeta, validUids: Set<string>): Promise<void> {
  const st = await stat(CROSS_REF_FILE).catch(() => null);
  if (!st?.isFile()) {
    throw new Error(`Missing cross_references.txt: ${CROSS_REF_FILE}`);
  }

  const dedupe = new Map<string, number>();
  let batch: { source_uid: string; target_uid: string; weight: number }[] = [];
  let lineNo = 0;
  let kept = 0;
  let skipped = 0;

  const rl = createInterface({
    input: createReadStream(CROSS_REF_FILE, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lineNo++;
    if (lineNo === 1) continue;
    const trimmed = line.trim();
    if (!trimmed) continue;

    const parts = trimmed.split("\t");
    if (parts.length < 3) {
      skipped++;
      continue;
    }
    const fromRaw = parts[0]!.trim();
    const toRaw = parts[1]!.trim();
    const weight = Number(parts[2]!.trim());
    if (!Number.isFinite(weight)) {
      skipped++;
      continue;
    }

    const sources = expandRefUids(fromRaw, meta);
    const targets = expandRefUids(toRaw, meta);
    if (!sources.length || !targets.length) {
      skipped++;
      continue;
    }

    for (const source_uid of sources) {
      if (!validUids.has(source_uid)) continue;
      for (const target_uid of targets) {
        if (!validUids.has(target_uid)) continue;
        if (source_uid === target_uid) continue;
        const key = `${source_uid}\t${target_uid}`;
        const prev = dedupe.get(key);
        if (prev === undefined || weight > prev) dedupe.set(key, weight);
      }
    }
  }

  for (const [key, weight] of dedupe) {
    const [source_uid, target_uid] = key.split("\t");
    batch.push({ source_uid: source_uid!, target_uid: target_uid!, weight });
    kept++;
    if (batch.length >= BATCH) {
      await flushCrossRefs(batch);
      batch = [];
      console.log(`Cross-references… ${kept} unique edges queued`);
    }
  }

  await flushCrossRefs(batch);
  console.log(`Cross-references done: ${kept} rows (skipped malformed lines: ${skipped})`);
}

async function main(): Promise<void> {
  console.log("DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@"));
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "CrossReference", "Verse" RESTART IDENTITY CASCADE`);

  const meta = await seedVerses();
  const verseCount = await prisma.verse.count();
  const uidRows: { uid: string }[] = await prisma.verse.findMany({
    select: { uid: true },
  });
  const validUids = new Set<string>(uidRows.map((r) => r.uid));
  console.log(`Verse UID set size: ${validUids.size}`);

  await seedCrossReferences(meta, validUids);
  const crossCount = await prisma.crossReference.count();

  console.log("\n--- Counts ---");
  console.log("verses:", verseCount);
  console.log("cross_references:", crossCount);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
