/**
 * Cross-checks every Journey Visualizer waypoint against the OpenBible.info
 * Bible Geocoding dataset (CC-BY, https://github.com/openbibleinfo/Bible-Geocoding-Data).
 *
 * Download the data first:
 *   mkdir -p /tmp/geo && cd /tmp/geo
 *   curl -sSLO https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/main/data/ancient.jsonl
 *
 * Then: npx tsx scripts/crosscheck-journeys.ts
 *
 * Candidate identifications are disambiguated automatically: where the dataset has
 * several places sharing a name ("Ramah 1".."Ramah 9"), the one whose verse list
 * overlaps our own cited chapters wins.
 */
import fs from "node:fs";
import { JOURNEYS, type JourneyWaypoint } from "../Frontend/src/data/journeysData";

const ANCIENT_PATH = "/tmp/geo/ancient.jsonl";
const MODERN_PATH = "/tmp/geo/modern.jsonl";

type ObVerse = { usx: string };
type ObResolution = { lonlat?: string; lonlat_type?: string; modern_basis_id?: string };
type ObIdentification = {
  description?: string;
  modifier?: string;
  score: { time_total: number; vote_total: number };
  resolutions?: ObResolution[];
};
type ObRecord = {
  id: string;
  friendly_id: string;
  url_slug: string;
  types?: string[];
  verses?: ObVerse[];
  identifications?: ObIdentification[];
  modern_associations?: Record<string, { name: string; score: number; url_slug: string }>;
};

/** Waypoint id -> base name to search in the dataset, or null when the dataset has no such place. */
const LOOKUP: Record<string, string | null> = {
  // Exodus
  "exodus-rameses": "rameses",
  "exodus-succoth": "succoth",
  "exodus-pi-hahiroth": "pi-hahiroth",
  "exodus-marah": "marah",
  "exodus-elim": "elim",
  "exodus-wilderness-sin": "sin", // the dataset files the wilderness of Sin under "Sin"
  "exodus-rephidim": "rephidim",
  "exodus-sinai": "mount sinai",
  "exodus-kadesh-barnea": "kadesh-barnea",
  "exodus-mount-hor": "mount hor 1", // "Mount Hor 2" is the northern one of Num 34
  "exodus-plains-moab": "mount nebo",
  // Abraham
  "abraham-ur": "ur",
  "abraham-haran": "haran",
  "abraham-shechem": "shechem",
  "abraham-bethel-1": "bethel",
  "abraham-egypt": "egypt",
  "abraham-bethel-2": "bethel",
  "abraham-hebron": "hebron",
  "abraham-gerar": "gerar",
  "abraham-beersheba": "beersheba",
  "abraham-moriah": "moriah",
  // David
  "david-gibeah": "gibeah",
  "david-ramah": "ramah",
  "david-nob": "nob",
  "david-gath": "gath",
  "david-adullam": "adullam",
  "david-hereth": "hereth",
  "david-keilah": "keilah",
  "david-ziph": "wilderness of ziph",
  "david-en-gedi": "engedi",
  "david-maon-carmel": "wilderness of maon",
  "david-ziklag": "ziklag",
  // Jesus
  "jesus-capernaum": "capernaum",
  "jesus-perea": null, // "Perea" is Josephus's term; the Bible says "beyond the Jordan"
  "jesus-jericho": "jericho",
  "jesus-bethany": "bethany",
  "jesus-bethphage": "bethphage",
  "jesus-jerusalem-temple": "jerusalem",
  "jesus-gethsemane": "gethsemane",
  "jesus-golgotha": "golgotha",
  "jesus-empty-tomb": "golgotha", // the tomb is the same site; no separate dataset entry
  // Joshua
  "joshua-shittim": "shittim",
  "joshua-jordan": "jordan",
  "joshua-gilgal": "gilgal",
  "joshua-jericho": "jericho",
  "joshua-ai-1": "ai",
  "joshua-ai-2": "ai",
  "joshua-ebal-gerizim": "mount ebal",
  "joshua-gibeon": "gibeon",
  "joshua-makkedah": "makkedah",
  "joshua-merom": "waters of merom",
  // Ark
  "ark-shiloh": "shiloh",
  "ark-ebenezer": "ebenezer",
  "ark-ashdod": "ashdod",
  "ark-gath": "gath",
  "ark-ekron": "ekron",
  "ark-beth-shemesh": "beth-shemesh",
  "ark-kiriath-jearim": "kiriath-jearim",
  "ark-perez-uzzah": "perez-uzzah",
  "ark-obed-edom": null, // the house of Obed-Edom is not a named place in the dataset
  "ark-city-of-david": "city of david",
  "ark-solomons-temple": "moriah",
  // Paul 1
  "paul1-antioch-syria": "antioch 1",
  "paul1-seleucia": "seleucia",
  "paul1-salamis": "salamis",
  "paul1-paphos": "paphos",
  "paul1-perga": "perga",
  "paul1-antioch-pisidia": "antioch 2", // Pisidian Antioch, not Antioch on the Orontes
  "paul1-iconium": "iconium",
  "paul1-lystra": "lystra",
  "paul1-derbe": "derbe",
  "paul1-return": null, // a synthetic midpoint standing for three cities
  "paul1-antioch-return": "antioch 1",
  // Paul 2
  "paul2-antioch-syria": "antioch 1",
  "paul2-derbe-lystra": "lystra",
  "paul2-troas": "troas",
  "paul2-philippi": "philippi",
  "paul2-thessalonica": "thessalonica",
  "paul2-berea": "berea",
  "paul2-athens": "athens",
  "paul2-corinth": "corinth",
  "paul2-ephesus": "ephesus",
  "paul2-caesarea-jerusalem": "caesarea",
  "paul2-antioch-return": "antioch 1",
  // Paul 3
  "paul3-antioch-syria": "antioch 1",
  "paul3-galatia-phrygia": "galatia",
  "paul3-ephesus": "ephesus",
  "paul3-macedonia-greece": "corinth",
  "paul3-troas": "troas",
  "paul3-miletus": "miletus",
  "paul3-tyre": "tyre",
  "paul3-caesarea": "caesarea",
  "paul3-jerusalem": "jerusalem",
};

/**
 * Stops that deliberately use a candidate other than the highest-scoring one, so a
 * reported delta here is expected rather than drift.
 */
const DELIBERATE_OVERRIDES: Record<string, string> = {
  "exodus-pi-hahiroth":
    "sits on the northern shore of the Gulf of Suez, which the dataset ranks first " +
    "for the sea of this crossing (Red Sea 1, 369). Every candidate for the campsite " +
    "itself lies 28-110 km north in the isthmus lagoons, and the top-scored one " +
    "(Tell Defenneh, 220) is inland in the Nile Delta; the description says so",
};

function haversineKm(
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number],
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

const records: ObRecord[] = fs
  .readFileSync(ANCIENT_PATH, "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line) as ObRecord);

/**
 * Modern-location names by id. The site label has to come from the identification we
 * actually take coordinates from: a place's highest-scoring identification and its
 * highest-scoring modern association are not always the same one.
 */
const modernNames = new Map<string, string>(
  fs
    .readFileSync(MODERN_PATH, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as { id: string; friendly_id?: string })
    .map((entry) => [entry.id, entry.friendly_id ?? entry.id]),
);

/** Chapters we cite, as "USX CHAPTER" keys, for disambiguating same-named places. */
function citedChapters(waypoint: JourneyWaypoint): Set<string> {
  const out = new Set<string>();
  for (const ref of waypoint.refs) {
    const chapters = ref.ref.match(/\d+(?=:)/g) ?? [];
    for (const chapter of chapters) out.add(`${ref.usfm} ${chapter}`);
  }
  return out;
}

function recordChapters(record: ObRecord): Set<string> {
  const out = new Set<string>();
  for (const verse of record.verses ?? []) {
    const [book, chapterVerse] = verse.usx.split(" ");
    const chapter = (chapterVerse ?? "").split(":")[0];
    if (book && chapter) out.add(`${book} ${chapter}`);
  }
  return out;
}

type Best = {
  record: ObRecord;
  overlap: number;
  lonlat: [number, number] | null;
  modernName: string;
  score: number;
  candidateCount: number;
  modifier: string;
  placeType: string;
  runnerUp: string;
};

function pickRecord(baseName: string, waypoint: JourneyWaypoint): Best | null {
  const matches = records.filter((r) => {
    const name = (r.friendly_id ?? "").toLowerCase();
    return name === baseName || new RegExp(`^${baseName} \\d+$`).test(name);
  });
  if (!matches.length) return null;

  const cited = citedChapters(waypoint);
  const scored = matches.map((record) => {
    const chapters = recordChapters(record);
    let overlap = 0;
    for (const key of cited) if (chapters.has(key)) overlap += 1;
    return { record, overlap };
  });
  scored.sort((a, b) => b.overlap - a.overlap);
  const chosen = scored[0];

  // Highest-confidence identification with usable coordinates.
  const ids = [...(chosen.record.identifications ?? [])].sort(
    (a, b) => (b.score?.time_total ?? 0) - (a.score?.time_total ?? 0),
  );
  const withCoords = ids.find((id) => id.resolutions?.some((r) => r.lonlat));
  const resolution = withCoords?.resolutions?.find((r) => r.lonlat);
  const lonlat = resolution?.lonlat
    ? (resolution.lonlat.split(",").map(Number) as [number, number])
    : null;
  const ranked = Object.values(chosen.record.modern_associations ?? {}).sort(
    (a, b) => b.score - a.score,
  );
  // Prefer the name of the location the coordinates actually came from.
  const basisName = resolution?.modern_basis_id
    ? modernNames.get(resolution.modern_basis_id)
    : undefined;

  return {
    record: chosen.record,
    overlap: chosen.overlap,
    lonlat,
    modernName: basisName ?? ranked[0]?.name ?? "-",
    score: withCoords?.score?.time_total ?? 0,
    candidateCount: ranked.length,
    modifier: withCoords?.modifier ?? "-",
    placeType: (chosen.record.types ?? []).join("/") || "-",
    runnerUp: ranked[1] ? `${ranked[1].name} (${ranked[1].score})` : "-",
  };
}

const rows: string[] = [];
const noSource: string[] = [];
const bigDeltas: string[] = [];
const lowConfidence: string[] = [];
const provenance: string[] = [];

for (const journey of JOURNEYS) {
  rows.push(`\n=== ${journey.titleEn} ===`);
  for (const waypoint of journey.waypoints) {
    const baseName = LOOKUP[waypoint.id];
    if (baseName === undefined) {
      rows.push(`  ${waypoint.id.padEnd(28)} !! NO LOOKUP ENTRY`);
      continue;
    }
    if (baseName === null) {
      rows.push(`  ${waypoint.nameEn.padEnd(34)} -- not a named place in the dataset`);
      noSource.push(`${waypoint.id} (${waypoint.nameEn})`);
      continue;
    }
    const best = pickRecord(baseName, waypoint);
    if (!best || !best.lonlat) {
      rows.push(`  ${waypoint.nameEn.padEnd(34)} !! no coordinates found for "${baseName}"`);
      noSource.push(`${waypoint.id} (${waypoint.nameEn})`);
      continue;
    }
    const km = haversineKm([waypoint.lng, waypoint.lat], best.lonlat);
    const override = DELIBERATE_OVERRIDES[waypoint.id];
    if (override) {
      rows.push(`  ${waypoint.nameEn.padEnd(34)} -- deliberate override: ${override}`);
      continue;
    }
    const flag = km > 5 ? " <<< CHECK" : "";
    rows.push(
      `  ${waypoint.nameEn.padEnd(34)} ${best.record.friendly_id.padEnd(20)} ` +
        `${best.modernName.padEnd(24)} conf=${String(best.score).padStart(4)}/1000 ` +
        `cand=${String(best.candidateCount).padStart(2)} type=${best.placeType.padEnd(10)} ` +
        `mod=${best.modifier.padEnd(5)} runner-up=${best.runnerUp.padEnd(28)} ` +
        `overlap=${best.overlap} delta=${km.toFixed(2)}km${flag}`,
    );
    provenance.push(
      `  "${waypoint.id}": { lng: ${best.lonlat[0]}, lat: ${best.lonlat[1]}, ` +
        `site: ${JSON.stringify(best.modernName)}, confidence: ${best.score}, ` +
        `candidates: ${best.candidateCount}, slug: ${JSON.stringify(best.record.url_slug)}, ` +
        `type: ${JSON.stringify(best.placeType)}, modifier: ${JSON.stringify(best.modifier)} },`,
    );
    if (km > 5) {
      bigDeltas.push(
        `${waypoint.id}: ${km.toFixed(1)}km off ${best.modernName} -> [${best.lonlat[0]}, ${best.lonlat[1]}]`,
      );
    }
    if (best.score < 500) {
      lowConfidence.push(
        `${waypoint.id}: conf ${best.score}/1000, ${best.candidateCount} candidate(s), best="${best.modernName}"`,
      );
    }
  }
}

console.log(rows.join("\n"));
console.log(`\n\n######## PLACES WITH NO DATASET ENTRY (${noSource.length}) ########`);
console.log(noSource.join("\n") || "(none)");
console.log(`\n######## DELTAS OVER 5 KM (${bigDeltas.length}) ########`);
console.log(bigDeltas.join("\n") || "(none)");
console.log(`\n######## CONFIDENCE BELOW 500/1000 (${lowConfidence.length}) ########`);
console.log(lowConfidence.join("\n") || "(none)");
console.log(`\n######## PASTE-READY PROVENANCE ########`);
console.log(provenance.join("\n"));
