/**
 * Builds compact interlinear JSON from public-domain / CC sources:
 * - Open Scriptures Hebrew Bible (WLC + Strong's lemmas, CC BY 4.0)
 * - Nestle 1904 Greek NT morphology (public domain)
 * - Open Scriptures Strong's dictionaries (CC BY-SA)
 * - French UBS glosses (bcv-data/strongs) plus cached full French Strong's
 *   renderings in scripts/data/strongs-fr-defs.json
 *
 * Run: npx tsx scripts/build-interlinear.ts
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "Frontend/public/interlinear");

const OT_BOOKS: { usfm: string; file: string; osis: string }[] = [
  { usfm: "GEN", file: "Gen", osis: "Gen" },
  { usfm: "EXO", file: "Exod", osis: "Exod" },
  { usfm: "LEV", file: "Lev", osis: "Lev" },
  { usfm: "NUM", file: "Num", osis: "Num" },
  { usfm: "DEU", file: "Deut", osis: "Deut" },
  { usfm: "JOS", file: "Josh", osis: "Josh" },
  { usfm: "JDG", file: "Judg", osis: "Judg" },
  { usfm: "RUT", file: "Ruth", osis: "Ruth" },
  { usfm: "1SA", file: "1Sam", osis: "1Sam" },
  { usfm: "2SA", file: "2Sam", osis: "2Sam" },
  { usfm: "1KI", file: "1Kgs", osis: "1Kgs" },
  { usfm: "2KI", file: "2Kgs", osis: "2Kgs" },
  { usfm: "1CH", file: "1Chr", osis: "1Chr" },
  { usfm: "2CH", file: "2Chr", osis: "2Chr" },
  { usfm: "EZR", file: "Ezra", osis: "Ezra" },
  { usfm: "NEH", file: "Neh", osis: "Neh" },
  { usfm: "EST", file: "Esth", osis: "Esth" },
  { usfm: "JOB", file: "Job", osis: "Job" },
  { usfm: "PSA", file: "Ps", osis: "Ps" },
  { usfm: "PRO", file: "Prov", osis: "Prov" },
  { usfm: "ECC", file: "Eccl", osis: "Eccl" },
  { usfm: "SNG", file: "Song", osis: "Song" },
  { usfm: "ISA", file: "Isa", osis: "Isa" },
  { usfm: "JER", file: "Jer", osis: "Jer" },
  { usfm: "LAM", file: "Lam", osis: "Lam" },
  { usfm: "EZK", file: "Ezek", osis: "Ezek" },
  { usfm: "DAN", file: "Dan", osis: "Dan" },
  { usfm: "HOS", file: "Hos", osis: "Hos" },
  { usfm: "JOL", file: "Joel", osis: "Joel" },
  { usfm: "AMO", file: "Amos", osis: "Amos" },
  { usfm: "OBA", file: "Obad", osis: "Obad" },
  { usfm: "JON", file: "Jonah", osis: "Jonah" },
  { usfm: "MIC", file: "Mic", osis: "Mic" },
  { usfm: "NAM", file: "Nah", osis: "Nah" },
  { usfm: "HAB", file: "Hab", osis: "Hab" },
  { usfm: "ZEP", file: "Zeph", osis: "Zeph" },
  { usfm: "HAG", file: "Hag", osis: "Hag" },
  { usfm: "ZEC", file: "Zech", osis: "Zech" },
  { usfm: "MAL", file: "Mal", osis: "Mal" },
];

const NT_OSIS_TO_USFM: Record<string, string> = {
  Matt: "MAT",
  Mark: "MRK",
  Luke: "LUK",
  John: "JHN",
  Acts: "ACT",
  Rom: "ROM",
  "1Cor": "1CO",
  "2Cor": "2CO",
  Gal: "GAL",
  Eph: "EPH",
  Phil: "PHP",
  Col: "COL",
  "1Thess": "1TH",
  "2Thess": "2TH",
  "1Tim": "1TI",
  "2Tim": "2TI",
  Titus: "TIT",
  Phlm: "PHM",
  Heb: "HEB",
  Jas: "JAS",
  "1Pet": "1PE",
  "2Pet": "2PE",
  "1John": "1JN",
  "2John": "2JN",
  "3John": "3JN",
  Jude: "JUD",
  Rev: "REV",
};

type Token = { t: string; s?: string };
type BookJson = { book: string; dir: "rtl" | "ltr"; chapters: Record<string, Record<string, Token[]>> };
type DictJson = Record<string, { w: string; x: string; d: string; df?: string; g?: string }>;

function normalizeStrongsId(raw: string): string | null {
  const match = /^(H|G)0*(\d+)$/i.exec(raw.trim());
  if (!match) return null;
  return `${match[1].toUpperCase()}${Number(match[2])}`;
}

function parseFrenchGlosses(tsv: string): Map<string, string> {
  const glosses = new Map<string, { text: string; lexicon: boolean }>();
  for (const line of tsv.split(/\r?\n/)) {
    if (!line || line.startsWith("#") || line.startsWith("strong\t")) continue;
    const [strong, , gloss, methods] = line.split("\t");
    const id = normalizeStrongsId(strong ?? "");
    if (!id || !gloss) continue;
    const lexicon = (methods ?? "").includes("lexicon");
    const current = glosses.get(id);
    if (!current || (lexicon && !current.lexicon)) {
      glosses.set(id, { text: gloss, lexicon });
    }
  }
  return new Map([...glosses].map(([id, value]) => [id, value.text]));
}

function applyFrenchGlosses(dict: DictJson, glosses: Map<string, string>): void {
  for (const [id, entry] of Object.entries(dict)) {
    const fr = glosses.get(id);
    if (fr) entry.g = fr;
  }
}

async function applyFrenchDefinitions(dict: DictJson): Promise<void> {
  const path = join(ROOT, "scripts/data/strongs-fr-defs.json");
  try {
    const defs = JSON.parse(await readFile(path, "utf8")) as Record<string, string>;
    for (const [id, entry] of Object.entries(dict)) {
      const fr = defs[id];
      if (fr) entry.df = fr;
    }
  } catch {
    // Optional cache from scripts/translate-strongs-fr.py
  }
}

const occurrences = new Map<string, Set<string>>();

function addOccurrence(id: string, uid: string): void {
  let set = occurrences.get(id);
  if (!set) {
    set = new Set();
    occurrences.set(id, set);
  }
  set.add(uid);
}

async function download(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function stripTags(xml: string): string {
  return xml
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function lastStrongsNumber(lemma: string): string | null {
  const nums = [...lemma.matchAll(/(\d{1,4})/g)].map((m) => m[1]);
  const raw = nums.at(-1);
  if (!raw) return null;
  return String(Number(raw));
}

function parseHebrewDictionary(js: string): DictJson {
  const start = js.indexOf("{");
  const end = js.lastIndexOf("}");
  const parsed = JSON.parse(js.slice(start, end + 1)) as Record<
    string,
    { lemma?: string; xlit?: string; strongs_def?: string; kjv_def?: string }
  >;
  const out: DictJson = {};
  for (const [id, entry] of Object.entries(parsed)) {
    out[id] = {
      w: entry.lemma ?? "",
      x: entry.xlit ?? "",
      d: (entry.strongs_def || entry.kjv_def || "").replace(/[{}]/g, ""),
    };
  }
  return out;
}

function parseHebrewBook(xml: string, usfm: string): BookJson {
  const book: BookJson = { book: usfm, dir: "rtl", chapters: {} };
  const verseRe = /<verse\b[^>]*osisID="([^"]+)"[^>]*>([\s\S]*?)<\/verse>/gi;
  let verseMatch: RegExpExecArray | null;
  while ((verseMatch = verseRe.exec(xml))) {
    const osis = verseMatch[1] ?? "";
    const body = verseMatch[2] ?? "";
    const ref = osis.split(" ")[0] ?? "";
    const parts = ref.split(".");
    const chapter = parts[1];
    const verse = parts[2];
    if (!chapter || !verse) continue;
    const uid = `${usfm}.${Number(chapter)}.${Number(verse)}`;
    const tokens: Token[] = [];
    const wordRe = /<w\b([^>]*)>([\s\S]*?)<\/w>/gi;
    let wordMatch: RegExpExecArray | null;
    while ((wordMatch = wordRe.exec(body))) {
      const attrs = wordMatch[1] ?? "";
      const text = stripTags(wordMatch[2] ?? "").replace(/\//g, "");
      if (!text) continue;
      const lemma = /lemma="([^"]*)"/i.exec(attrs)?.[1] ?? "";
      const num = lastStrongsNumber(lemma);
      const id = num ? `H${num}` : undefined;
      tokens.push(id ? { t: text, s: id } : { t: text });
      if (id) addOccurrence(id, uid);
    }
    if (!tokens.length) continue;
    book.chapters[String(Number(chapter))] ??= {};
    book.chapters[String(Number(chapter))]![String(Number(verse))] = tokens;
  }
  return book;
}

function parseNestleCsv(csv: string): Map<string, BookJson> {
  const books = new Map<string, BookJson>();
  for (const line of csv.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cols = line.split("\t");
    if (cols.length < 5) continue;
    const ref = cols[0] ?? "";
    const word = stripTags(cols[1] ?? "").replace(/[.,;:·;!?()[\]"'«»]+$/g, "").trim();
    const strongsField = cols[4] ?? "";
    const match = /^([A-Za-z0-9]+)\s+(\d+):(\d+)$/.exec(ref);
    if (!match || !word) continue;
    const usfm = NT_OSIS_TO_USFM[match[1] ?? ""];
    if (!usfm) continue;
    const chapter = String(Number(match[2]));
    const verse = String(Number(match[3]));
    const uid = `${usfm}.${chapter}.${verse}`;
    const num = lastStrongsNumber(strongsField.split("&")[0] ?? "");
    const id = num ? `G${num}` : undefined;
    let book = books.get(usfm);
    if (!book) {
      book = { book: usfm, dir: "ltr", chapters: {} };
      books.set(usfm, book);
    }
    book.chapters[chapter] ??= {};
    book.chapters[chapter]![verse] ??= [];
    book.chapters[chapter]![verse]!.push(id ? { t: word, s: id } : { t: word });
    if (id) addOccurrence(id, uid);
  }
  return books;
}

async function main(): Promise<void> {
  await mkdir(join(OUT, "books"), { recursive: true });

  console.log("Downloading Strong's dictionaries…");
  const [heJs, elJs] = await Promise.all([
    download(
      "https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.js",
    ),
    download(
      "https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js",
    ),
  ]);
  const heDict = parseHebrewDictionary(heJs);
  const elDict = parseHebrewDictionary(elJs);
  console.log("Downloading French Strong's glosses…");
  const fraTsv = await download(
    "https://huggingface.co/datasets/bcv-data/strongs/resolve/main/glosses/fra.tsv",
  );
  const fraGlosses = parseFrenchGlosses(fraTsv);
  applyFrenchGlosses(heDict, fraGlosses);
  applyFrenchGlosses(elDict, fraGlosses);
  await applyFrenchDefinitions(heDict);
  await applyFrenchDefinitions(elDict);
  await writeFile(join(OUT, "strongs-he.json"), JSON.stringify(heDict));
  await writeFile(join(OUT, "strongs-el.json"), JSON.stringify(elDict));
  console.log(`  Hebrew entries: ${Object.keys(heDict).length}`);
  console.log(`  Greek entries: ${Object.keys(elDict).length}`);

  console.log("Downloading Open Scriptures Hebrew Bible…");
  for (const book of OT_BOOKS) {
    const xml = await download(
      `https://raw.githubusercontent.com/openscriptures/morphhb/master/wlc/${book.file}.xml`,
    );
    const json = parseHebrewBook(xml, book.usfm);
    await writeFile(join(OUT, "books", `${book.usfm}.json`), JSON.stringify(json));
    const verses = Object.values(json.chapters).reduce((n, ch) => n + Object.keys(ch).length, 0);
    console.log(`  ${book.usfm}  ${verses} verses`);
  }

  console.log("Downloading Nestle 1904 morphology…");
  const csv = await download(
    "https://raw.githubusercontent.com/biblicalhumanities/Nestle1904/master/morph/Nestle1904.csv",
  );
  const ntBooks = parseNestleCsv(csv);
  for (const [usfm, json] of ntBooks) {
    await writeFile(join(OUT, "books", `${usfm}.json`), JSON.stringify(json));
    const verses = Object.values(json.chapters).reduce((n, ch) => n + Object.keys(ch).length, 0);
    console.log(`  ${usfm}  ${verses} verses`);
  }

  const occHe: Record<string, string[]> = {};
  const occEl: Record<string, string[]> = {};
  for (const [id, uids] of occurrences) {
    const list = [...uids];
    if (id.startsWith("G")) occEl[id] = list;
    else occHe[id] = list;
  }
  await writeFile(join(OUT, "occ-he.json"), JSON.stringify(occHe));
  await writeFile(join(OUT, "occ-el.json"), JSON.stringify(occEl));
  console.log(`Occurrences: ${occurrences.size} lemmas`);
  console.log(`Wrote ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
