/**
 * Checks every Cities-page scripture reference against the verse text in the DB.
 * Run with: npx tsx scripts/verify-city-refs.ts
 */
import { BOOK_CHAPTERS } from "../Frontend/src/data/canonicalBooks";
import { CITIES, type City } from "../Frontend/src/data/citiesData";
import type { ScriptureRef } from "../Frontend/src/data/journeysData";

const API = process.env.API_URL || "http://localhost:3001";

type Span = { chapter: number; start: number; end: number };

const STOP = new Set([
  "that", "this", "with", "from", "here", "city", "cities", "until", "after",
  "before", "their", "them", "they", "into", "then", "when", "where", "which",
  "while", "would", "could", "about", "under", "over", "been", "have", "were",
  "will", "shall", "upon", "also", "only", "more", "most", "some", "such",
  "than", "there", "these", "those", "through", "during", "without", "against",
  "between", "among", "because", "after", "does", "down", "back", "away",
  "comes", "come", "came", "goes", "gone", "sent", "sends", "takes", "taken",
  "makes", "made", "keeps", "kept", "says", "said", "named", "name", "called",
  "people", "whole", "other", "first", "next", "later", "still", "even",
  "itself", "himself", "herself", "themselves", "whose", "whom", "what",
  "onto", "toward", "towards", "beyond", "around", "across", "near", "once",
  "again", "never", "always", "being", "doing", "having", "every", "each",
]);

const CITY_ALIASES: Record<string, string[]> = {
  jerusalem: ["jerusalem", "salem", "zion", "jebus", "jebusite", "moriah", "ariel"],
  bethlehem: ["bethlehem", "ephrath", "ephrathah"],
  hebron: ["hebron", "kirjath-arba", "kiriath-arba", "mamre"],
  gibeon: ["gibeon", "gibeonite", "gibeonites"],
  beersheba: ["beersheba", "beer-sheba"],
  bethany: ["bethany"],
  lachish: ["lachish"],
  emmaus: ["emmaus"],
  jericho: ["jericho", "palms"],
  sodom: ["sodom", "gomorrah"],
  samaria: ["samaria", "samaritans", "shemer"],
  shechem: ["shechem"],
  shiloh: ["shiloh"],
  bethel: ["bethel", "beth-el", "luz"],
  jezreel: ["jezreel"],
  capernaum: ["capernaum"],
  nazareth: ["nazareth"],
  cana: ["cana"],
  bethsaida: ["bethsaida"],
  tyre: ["tyre", "tyrian", "hiram"],
  sidon: ["sidon", "sidonian", "sidonians", "zarephath"],
  joppa: ["joppa", "japho"],
  caesarea: ["caesarea"],
  gaza: ["gaza"],
  ashdod: ["ashdod", "azotus", "dagon"],
  gath: ["gath", "gittite", "goliath"],
  damascus: ["damascus"],
  antioch: ["antioch"],
  babylon: ["babylon", "babel", "chaldean", "chaldeans", "chebar"],
  nineveh: ["nineveh", "ninevites"],
  ur: ["ur"],
  haran: ["haran"],
  ephesus: ["ephesus", "ephesian", "ephesians"],
  tarsus: ["tarsus"],
  "antioch-pisidia": ["antioch", "pisidia", "pisidian"],
  lystra: ["lystra"],
  troas: ["troas"],
  rome: ["rome", "roman", "romans"],
  corinth: ["corinth", "corinthians"],
  athens: ["athens", "athenians", "areopagus"],
  philippi: ["philippi", "philippians"],
  thessalonica: ["thessalonica", "thessalonians"],
  berea: ["berea", "bereans", "beroia", "beroea"],
  cenchreae: ["cenchreae", "cenchrea"],
  neapolis: ["neapolis"],
  nicopolis: ["nicopolis"],
  syracuse: ["syracuse"],
  puteoli: ["puteoli"],
};

function parseRefSpans(ref: string): Span[] {
  const match = ref.match(/^(\d+):(\d+)(?:-(\d+)(?::(\d+))?)?$/);
  if (!match) return [];
  const startChapter = Number(match[1]);
  const startVerse = Number(match[2]);
  if (!match[3]) {
    return [{ chapter: startChapter, start: startVerse, end: startVerse }];
  }
  if (match[4]) {
    const endChapter = Number(match[3]);
    const endVerse = Number(match[4]);
    const spans: Span[] = [];
    for (let chapter = startChapter; chapter <= endChapter; chapter += 1) {
      if (chapter === startChapter) {
        spans.push({ chapter, start: startVerse, end: Number.POSITIVE_INFINITY });
      } else if (chapter === endChapter) {
        spans.push({ chapter, start: 1, end: endVerse });
      } else {
        spans.push({ chapter, start: 1, end: Number.POSITIVE_INFINITY });
      }
    }
    return spans;
  }
  return [{ chapter: startChapter, start: startVerse, end: Number(match[3]) }];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s-]/g, " ");
}

function labelTokens(label: string): string[] {
  return normalize(label)
    .split(/[\s-]+/)
    .filter((w) => w.length > 3 && !STOP.has(w) && !/^\d+$/.test(w));
}

function aliasesFor(city: City): string[] {
  const extra = CITY_ALIASES[city.id] ?? [];
  return [...new Set([normalize(city.nameEn), normalize(city.nameFr), ...extra])];
}

const chapterCache = new Map<string, Map<number, string>>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadChapter(book: string, chapter: number): Promise<Map<number, string>> {
  const key = `${book}.${chapter}`;
  const cached = chapterCache.get(key);
  if (cached) return cached;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const res = await fetch(`${API}/api/verses/${encodeURIComponent(book)}/${chapter}?lang=en`);
    if (res.status === 429) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    if (!res.ok) {
      chapterCache.set(key, new Map());
      return chapterCache.get(key)!;
    }
    const payload = (await res.json()) as {
      verses?: Array<{ uid: string; text?: string; text_en?: string }>;
    };
    const map = new Map<number, string>();
    for (const verse of payload.verses ?? []) {
      const number = Number(verse.uid.split(".")[2]);
      const text = verse.text_en || verse.text || "";
      if (Number.isFinite(number)) map.set(number, text);
    }
    chapterCache.set(key, map);
    await sleep(350);
    return map;
  }
  throw new Error(`${book}.${chapter} rate-limited`);
}

type Issue = {
  city: string;
  eventId: string;
  label: string;
  refs: string;
  kind: "missing-book" | "bad-range" | "empty-chapter" | "missing-verses" | "weak-match";
  detail: string;
  excerpt: string;
};

async function versesForRef(ref: ScriptureRef): Promise<{
  issues: string[];
  texts: string[];
}> {
  const issues: string[] = [];
  const texts: string[] = [];
  const maxChapter = BOOK_CHAPTERS[ref.usfm];
  if (!maxChapter) {
    issues.push(`unknown book ${ref.usfm}`);
    return { issues, texts };
  }
  const spans = parseRefSpans(ref.ref);
  if (spans.length === 0) {
    issues.push(`unparseable range ${ref.ref}`);
    return { issues, texts };
  }
  for (const span of spans) {
    if (span.chapter < 1 || span.chapter > maxChapter) {
      issues.push(`${ref.usfm} ${span.chapter} is outside 1–${maxChapter}`);
      continue;
    }
    const chapter = await loadChapter(ref.usfm, span.chapter);
    if (chapter.size === 0) {
      issues.push(`${ref.usfm}.${span.chapter} has no verses in the database`);
      continue;
    }
    const last = Math.max(...chapter.keys());
    const end = Number.isFinite(span.end) ? span.end : last;
    if (span.start > last || end > last) {
      issues.push(
        `${ref.usfm} ${span.chapter}:${span.start}-${end} overruns chapter (last verse ${last})`,
      );
    }
    const missing: number[] = [];
    for (let n = span.start; n <= end && n <= last; n += 1) {
      const text = chapter.get(n);
      // WEB leaves some later-manuscript verses as empty rows (e.g. Acts 8:37).
      if (text == null) missing.push(n);
      else if (text.trim()) texts.push(text);
    }
    if (missing.length) {
      issues.push(`${ref.usfm} ${span.chapter} missing verses ${missing.slice(0, 8).join(",")}`);
    }
  }
  return { issues, texts };
}

function excerpt(texts: string[]): string {
  const joined = texts.join(" ").replace(/\s+/g, " ").trim();
  return joined.length > 420 ? `${joined.slice(0, 420)}…` : joined;
}

async function main(): Promise<void> {
  const issues: Issue[] = [];
  let events = 0;
  let refs = 0;

  for (const city of CITIES) {
    const cityAliases = aliasesFor(city);
    for (const event of city.events) {
      events += 1;
      const allTexts: string[] = [];
      const refLabels: string[] = [];
      const hard: string[] = [];

      for (const ref of event.refs) {
        refs += 1;
        refLabels.push(`${ref.usfm} ${ref.ref}`);
        const result = await versesForRef(ref);
        allTexts.push(...result.texts);
        hard.push(...result.issues);
      }

      const sample = excerpt(allTexts);
      const blob = normalize(allTexts.join(" "));
      const cityHit = cityAliases.some((alias) => alias && blob.includes(alias));
      const tokens = labelTokens(event.labelEn);
      const tokenHits = tokens.filter((token) => blob.includes(token));
      const hitRatio = tokens.length === 0 ? 1 : tokenHits.length / tokens.length;

      if (hard.length) {
        for (const detail of hard) {
          issues.push({
            city: city.nameEn,
            eventId: event.id,
            label: event.labelEn,
            refs: refLabels.join("; "),
            kind: detail.includes("unknown book")
              ? "missing-book"
              : detail.includes("unparseable")
                ? "bad-range"
                : detail.includes("no verses")
                  ? "empty-chapter"
                  : "missing-verses",
            detail,
            excerpt: sample,
          });
        }
      } else if (!cityHit && hitRatio < 0.34) {
        issues.push({
          city: city.nameEn,
          eventId: event.id,
          label: event.labelEn,
          refs: refLabels.join("; "),
          kind: "weak-match",
          detail: `city name absent; label tokens hit ${tokenHits.length}/${tokens.length} (${tokenHits.join(", ") || "none"})`,
          excerpt: sample,
        });
      }
    }
  }

  const hardCount = issues.filter((i) => i.kind !== "weak-match").length;
  const weak = issues.filter((i) => i.kind === "weak-match");

  console.log(`${CITIES.length} cities, ${events} events, ${refs} refs, ${chapterCache.size} chapters fetched`);
  console.log(`${hardCount} hard failure(s), ${weak.length} weak-match warning(s)\n`);

  for (const issue of issues) {
    console.log(`[${issue.kind}] ${issue.eventId}`);
    console.log(`  ${issue.city} — ${issue.label}`);
    console.log(`  ${issue.refs}`);
    console.log(`  ${issue.detail}`);
    if (issue.excerpt) console.log(`  TEXT: ${issue.excerpt}`);
    console.log("");
  }

  process.exit(hardCount === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
