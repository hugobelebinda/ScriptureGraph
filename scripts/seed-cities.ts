/**
 * Prepares the raw material for the Cities page dataset.
 *
 * For each city in CITY_LOOKUP it resolves the OpenBible.info record, prints a
 * paste-ready stub with coordinates and provenance, the per-book spread of verse
 * mentions to draw reference-tier events from, and any Journey Visualizer waypoint
 * that sits on the same spot so its already-verified bilingual prose can be reused.
 *
 * Download the data first:
 *   mkdir -p /tmp/geo && cd /tmp/geo
 *   curl -sSLO https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/main/data/ancient.jsonl
 *   curl -sSLO https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/main/data/modern.jsonl
 *
 * Then: npx tsx scripts/seed-cities.ts
 */
import fs from "node:fs";
import { JOURNEYS } from "../Frontend/src/data/journeysData";

const ANCIENT_PATH = "/tmp/geo/ancient.jsonl";
const MODERN_PATH = "/tmp/geo/modern.jsonl";

type ObVerse = { usx: string };
type ObResolution = { lonlat?: string; modern_basis_id?: string };
type ObIdentification = {
  modifier?: string;
  score: { time_total: number };
  resolutions?: ObResolution[];
};
type ObRecord = {
  friendly_id: string;
  url_slug: string;
  types?: string[];
  verses?: ObVerse[];
  identifications?: ObIdentification[];
  modern_associations?: Record<string, { name: string; score: number }>;
};

/**
 * City id -> exact `friendly_id` in the dataset. Numbered where the dataset splits a
 * name across several places: "Antioch 1" is the Syrian capital and "Antioch 2" the
 * Pisidian one, "Samaria 1" the city and "Samaria 2" the region, and so on.
 */
const CITY_LOOKUP: Record<string, string> = {
  // Judea
  jerusalem: "Jerusalem",
  bethlehem: "Bethlehem 1",
  hebron: "Hebron",
  bethany: "Bethany 1",
  gibeon: "Gibeon",
  beersheba: "Beersheba 1",
  lachish: "Lachish",
  emmaus: "Emmaus",
  // Jordan valley
  jericho: "Jericho 1",
  sodom: "Sodom",
  // Samaria
  samaria: "Samaria 1",
  shechem: "Shechem",
  shiloh: "Shiloh",
  bethel: "Bethel 1",
  // Galilee
  capernaum: "Capernaum",
  nazareth: "Nazareth",
  cana: "Cana",
  bethsaida: "Bethsaida 1",
  // Coast
  tyre: "Tyre",
  sidon: "Sidon",
  joppa: "Joppa",
  caesarea: "Caesarea",
  gaza: "Gaza",
  ashdod: "Ashdod",
  gath: "Gath 1",
  // Syria
  damascus: "Damascus",
  antioch: "Antioch 1",
  // Mesopotamia
  babylon: "Babylon 1",
  nineveh: "Nineveh",
  ur: "Ur 1",
  haran: "Haran",
  // Asia Minor
  ephesus: "Ephesus",
  tarsus: "Tarsus",
  "antioch-pisidia": "Antioch 2",
  lystra: "Lystra",
  troas: "Troas",
  // Greece and Rome
  rome: "Rome",
  corinth: "Corinth",
  athens: "Athens",
  philippi: "Philippi",
  thessalonica: "Thessalonica",
  berea: "Berea",
  cenchreae: "Cenchreae",
  neapolis: "Neapolis",
  nicopolis: "Nicopolis",
  syracuse: "Syracuse",
  puteoli: "Puteoli",
};

const records = new Map<string, ObRecord>(
  fs
    .readFileSync(ANCIENT_PATH, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as ObRecord)
    .map((record) => [record.friendly_id, record]),
);

const modernNames = new Map<string, string>(
  fs
    .readFileSync(MODERN_PATH, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as { id: string; friendly_id?: string })
    .map((entry) => [entry.id, entry.friendly_id ?? entry.id]),
);

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

const allWaypoints = JOURNEYS.flatMap((journey) =>
  journey.waypoints.map((waypoint) => ({ journey: journey.id, waypoint })),
);

let missing = 0;

for (const [cityId, friendlyId] of Object.entries(CITY_LOOKUP)) {
  const record = records.get(friendlyId);
  if (!record) {
    missing += 1;
    console.log(`\n### ${cityId}\n  !! no dataset record named "${friendlyId}"`);
    continue;
  }

  const identifications = [...(record.identifications ?? [])].sort(
    (a, b) => (b.score?.time_total ?? 0) - (a.score?.time_total ?? 0),
  );
  const chosen = identifications.find((id) => id.resolutions?.some((r) => r.lonlat));
  const resolution = chosen?.resolutions?.find((r) => r.lonlat);
  const lonlat = resolution?.lonlat
    ? (resolution.lonlat.split(",").map(Number) as [number, number])
    : null;
  const associations = Object.values(record.modern_associations ?? {}).sort(
    (a, b) => b.score - a.score,
  );
  const site = resolution?.modern_basis_id
    ? modernNames.get(resolution.modern_basis_id)
    : undefined;

  console.log(`\n### ${cityId}  (${friendlyId})`);
  if (!lonlat) {
    missing += 1;
    console.log("  !! no coordinates in any identification");
    continue;
  }

  console.log(
    `  lng: ${lonlat[0]}, lat: ${lonlat[1]},\n` +
      `  source: { site: ${JSON.stringify(site ?? associations[0]?.name ?? "-")}, ` +
      `confidence: ${chosen?.score?.time_total ?? 0}, ` +
      `candidates: ${associations.length}, slug: ${JSON.stringify(record.url_slug)} },`,
  );

  const verses = record.verses ?? [];
  console.log(`  verseMentions: ${verses.length}`);

  // Which books carry the mentions, so the reference tier can be spread across the
  // whole narrative instead of clustering wherever the city is densest.
  const byBook = new Map<string, number>();
  for (const verse of verses) {
    const book = verse.usx.split(" ")[0];
    if (book) byBook.set(book, (byBook.get(book) ?? 0) + 1);
  }
  const spread = [...byBook.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([book, count]) => `${book}:${count}`)
    .join(" ");
  console.log(`  books: ${spread}`);

  // Journey stops on this spot already have verified bilingual prose and refs.
  const nearby = allWaypoints.filter(
    ({ waypoint }) =>
      haversineKm([waypoint.lng, waypoint.lat], lonlat) < 3,
  );
  for (const { journey, waypoint } of nearby) {
    const refs = waypoint.refs.map((ref) => `${ref.usfm} ${ref.ref}`).join(", ");
    console.log(`  reuse [${journey}] ${waypoint.id}: ${refs}`);
  }
}

console.log(
  `\n${Object.keys(CITY_LOOKUP).length} cities, ${missing} unresolved`,
);
process.exit(missing === 0 ? 0 : 1);
