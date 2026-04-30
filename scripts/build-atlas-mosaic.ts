import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Position = [number, number];
type PolygonGeometry = { type: "Polygon"; coordinates: Position[][] };
type MultiPolygonGeometry = { type: "MultiPolygon"; coordinates: Position[][][] };
type Feature = {
  type: "Feature";
  id?: string | number;
  properties: Record<string, unknown> | null;
  geometry: PolygonGeometry | MultiPolygonGeometry;
};
type FeatureCollection = { type: "FeatureCollection"; features: Feature[] };

type BiblicalOverlay = {
  id: string;
  file: string;
  featureName?: string;
  nameEn: string;
  nameFr: string;
  startYear: number;
  endYear: number;
};

const PUBLIC_GEO_DIR = path.resolve(process.cwd(), "Frontend/public/atlas/geojson");

const BIBLICAL_OVERLAYS: BiblicalOverlay[] = [
  {
    id: "egypt-new-kingdom",
    file: "egypt_bc1500.geojson",
    nameEn: "New Kingdom of Egypt",
    nameFr: "Nouvel Empire égyptien",
    startYear: -1500,
    endYear: -1077,
  },
  {
    id: "assyria-empire",
    file: "assyria_bc700.geojson",
    nameEn: "Neo-Assyrian Empire",
    nameFr: "Empire néo-assyrien",
    startYear: -911,
    endYear: -609,
  },
  {
    id: "babylonia-empire",
    file: "babylonia_bc700.geojson",
    nameEn: "Neo-Babylonian Empire",
    nameFr: "Empire néo-babylonien",
    startYear: -626,
    endYear: -539,
  },
  {
    id: "persia-achaemenid",
    file: "persian_empire.geojson",
    nameEn: "Achaemenid Empire",
    nameFr: "Empire achéménide",
    startYear: -550,
    endYear: -330,
  },
  {
    id: "hellenistic-alexander",
    file: "alexanders_empire.geojson",
    nameEn: "Empire of Alexander",
    nameFr: "Empire d'Alexandre",
    startYear: -336,
    endYear: -323,
  },
  {
    id: "rome-republic",
    file: "roman_empire_bce_60.geojson",
    nameEn: "Roman Republic",
    nameFr: "République romaine",
    startYear: -200,
    endYear: -27,
  },
  {
    id: "rome-imperial",
    file: "roman_empire_ce_117_extent.geojson",
    nameEn: "Roman Empire",
    nameFr: "Empire romain",
    startYear: -27,
    endYear: 100,
  },
  {
    id: "hasmonean",
    file: "hasmonean_kingdom.geojson",
    nameEn: "Hasmonean Kingdom",
    nameFr: "Royaume hasmonéen",
    startYear: -140,
    endYear: -37,
  },
  {
    id: "herodian",
    file: "herods_kingdom.geojson",
    nameEn: "Herodian Kingdom",
    nameFr: "Royaume hérodien",
    startYear: -37,
    endYear: 6,
  },
];

const TRIBES_FILE = "twelve_tribes.geojson";
const TRIBE_NAME_FR: Record<string, string> = {
  Reuben: "Ruben",
  Simeon: "Siméon",
  Levi: "Lévi",
  Benjamin: "Benjamin",
  Dan: "Dan",
  Naphtali: "Nephtali",
  Gad: "Gad",
  Asher: "Aser",
  Issachar: "Issacar",
  Zebulun: "Zabulon",
  Manasseh: "Manassé",
  "East Manasseh": "Manassé oriental",
  Ephraim: "Éphraïm",
  Judah: "Juda",
};

type PeriodLabel = { start: number; end: number; en: string; fr: string };

// For each anachronistic dataset name, list correct labels per historical period.
// Resolver picks the entry whose [start, end] contains target_year.
const PERIOD_LABELS: Record<string, PeriodLabel[]> = {
  "Kingdom of David and Solomon": [
    { start: -2000, end: -1051, en: "Canaan and Israelite settlements", fr: "Canaan et établissements israélites" },
    { start: -1050, end: -1011, en: "Tribal Israel under Saul", fr: "Israël tribal sous Saül" },
    { start: -1010, end: -931, en: "United Monarchy of Israel", fr: "Monarchie unie d'Israël" },
    { start: -930, end: -723, en: "Kingdoms of Israel and Judah", fr: "Royaumes d'Israël et de Juda" },
    { start: -722, end: -587, en: "Kingdom of Judah", fr: "Royaume de Juda" },
    { start: -586, end: -540, en: "Babylonian Yehud", fr: "Yehud babylonien" },
    { start: -539, end: -333, en: "Yehud (Persian province)", fr: "Yehud (province perse)" },
    { start: -332, end: -142, en: "Hellenistic Judaea", fr: "Judée hellénistique" },
    { start: -141, end: -64, en: "Hasmonean Judaea", fr: "Judée hasmonéenne" },
    { start: -63, end: -38, en: "Roman client Judaea", fr: "Judée cliente de Rome" },
    { start: -37, end: 5, en: "Herodian Kingdom", fr: "Royaume hérodien" },
    { start: 6, end: 200, en: "Roman province of Judaea", fr: "Province romaine de Judée" },
  ],
  "Egypt": [
    { start: -2000, end: -1078, en: "New Kingdom of Egypt", fr: "Nouvel Empire égyptien" },
    { start: -1077, end: -665, en: "Third Intermediate Period of Egypt", fr: "Troisième Période intermédiaire d'Égypte" },
    { start: -664, end: -526, en: "Saite Egypt (26th Dynasty)", fr: "Égypte saïte (XXVIᵉ dynastie)" },
    { start: -525, end: -333, en: "Persian Egypt (27th Dynasty)", fr: "Égypte perse (XXVIIᵉ dynastie)" },
    { start: -332, end: -31, en: "Ptolemaic Egypt", fr: "Égypte ptolémaïque" },
    { start: -30, end: 200, en: "Roman Egypt", fr: "Égypte romaine" },
  ],
  "Assyria": [
    { start: -2000, end: -1078, en: "Middle Assyrian Empire", fr: "Empire médio-assyrien" },
    { start: -1077, end: -912, en: "Assyria (transitional)", fr: "Assyrie (transition)" },
    { start: -911, end: -610, en: "Neo-Assyrian Empire", fr: "Empire néo-assyrien" },
    { start: -609, end: -540, en: "Assyria under Babylon", fr: "Assyrie sous Babylone" },
    { start: -539, end: -331, en: "Persian Assyria", fr: "Assyrie perse" },
    { start: -330, end: -64, en: "Hellenistic Assyria", fr: "Assyrie hellénistique" },
    { start: -63, end: 200, en: "Roman/Parthian Assyria", fr: "Assyrie romano-parthe" },
  ],
  "Babylonia": [
    { start: -2000, end: -1156, en: "Kassite Babylonia", fr: "Babylonie kassite" },
    { start: -1155, end: -1026, en: "Second Dynasty of Isin (Babylonia)", fr: "Deuxième dynastie d'Isin (Babylonie)" },
    { start: -1025, end: -627, en: "Babylonia (Assyrian-vassal era)", fr: "Babylonie (vassale assyrienne)" },
    { start: -626, end: -540, en: "Neo-Babylonian Empire", fr: "Empire néo-babylonien" },
    { start: -539, end: -331, en: "Babylonian satrapy (Persia)", fr: "Satrapie de Babylone (Perse)" },
    { start: -330, end: -64, en: "Hellenistic Babylonia", fr: "Babylonie hellénistique" },
    { start: -63, end: 200, en: "Parthian Babylonia", fr: "Babylonie parthe" },
  ],
  "Elam": [
    { start: -2000, end: -1101, en: "Middle Elamite Kingdom", fr: "Royaume médio-élamite" },
    { start: -1100, end: -540, en: "Neo-Elamite Kingdom", fr: "Royaume néo-élamite" },
    { start: -539, end: -331, en: "Elam (Persian satrapy)", fr: "Élam (satrapie perse)" },
    { start: -330, end: -64, en: "Susiana (Hellenistic)", fr: "Suse (hellénistique)" },
    { start: -63, end: 200, en: "Elymais (Parthian)", fr: "Élymée (parthe)" },
  ],
  "state societies and Aramaean kingdoms": [
    { start: -2000, end: -1101, en: "Late Bronze Age states", fr: "États du Bronze récent" },
    { start: -1100, end: -733, en: "Aramaean kingdoms", fr: "Royaumes araméens" },
    { start: -732, end: -540, en: "Aramaean lands under Assyria/Babylon", fr: "Terres araméennes sous Assyrie/Babylone" },
    { start: -539, end: -331, en: "Trans-Euphrates satrapy", fr: "Satrapie de Transeuphratène" },
    { start: -330, end: -64, en: "Hellenistic Syria", fr: "Syrie hellénistique" },
    { start: -63, end: 200, en: "Roman Syria", fr: "Syrie romaine" },
  ],
  "Arabian pastoral nomads": [
    { start: -2000, end: 200, en: "Arabian nomadic peoples", fr: "Peuples nomades arabes" },
  ],
  "Saba": [
    { start: -1200, end: -275, en: "Kingdom of Saba", fr: "Royaume de Saba" },
    { start: -274, end: 200, en: "Sabaean–Himyarite era", fr: "Époque sabéo-himyarite" },
  ],
  "Kush": [
    { start: -2000, end: -1071, en: "Egyptian Kush", fr: "Kouch égyptien" },
    { start: -1070, end: -670, en: "Kingdom of Kush (Napata)", fr: "Royaume de Kouch (Napata)" },
    { start: -669, end: 200, en: "Kingdom of Meroe", fr: "Royaume de Méroé" },
  ],
  "Hittites": [
    { start: -2000, end: -1180, en: "Hittite Empire", fr: "Empire hittite" },
    { start: -1179, end: -700, en: "Neo-Hittite states", fr: "États néo-hittites" },
  ],
  "Greek city-states": [
    { start: -1200, end: -481, en: "Archaic Greek city-states", fr: "Cités-États grecques archaïques" },
    { start: -480, end: -323, en: "Classical Greek city-states", fr: "Cités-États grecques classiques" },
  ],
  "Greek colonies": [
    { start: -800, end: -323, en: "Greek colonies", fr: "Colonies grecques" },
  ],
  "Phrygia": [
    { start: -1200, end: -695, en: "Phrygian Kingdom", fr: "Royaume phrygien" },
    { start: -694, end: -547, en: "Phrygia under Lydia", fr: "Phrygie sous Lydie" },
    { start: -546, end: -333, en: "Phrygia (Persian satrapy)", fr: "Phrygie (satrapie perse)" },
    { start: -332, end: 200, en: "Phrygia (Hellenistic-Roman)", fr: "Phrygie (hellénistique-romaine)" },
  ],
  "Lydia": [
    { start: -1200, end: -547, en: "Kingdom of Lydia", fr: "Royaume de Lydie" },
    { start: -546, end: -333, en: "Lydia (Persian satrapy)", fr: "Lydie (satrapie perse)" },
    { start: -332, end: 200, en: "Lydia (Hellenistic-Roman)", fr: "Lydie (hellénistique-romaine)" },
  ],
  "Urartu": [
    { start: -860, end: -589, en: "Kingdom of Urartu", fr: "Royaume d'Urartu" },
  ],
  "Roman Republic": [
    { start: -509, end: -28, en: "Roman Republic", fr: "République romaine" },
  ],
  "Rome": [
    { start: -753, end: -510, en: "Kingdom of Rome", fr: "Royaume de Rome" },
    { start: -509, end: -28, en: "Roman Republic", fr: "République romaine" },
    { start: -27, end: 200, en: "Roman Empire", fr: "Empire romain" },
  ],
};

function resolvePeriodLabel(name: string, year: number): { en: string; fr: string } | null {
  const periods = PERIOD_LABELS[name];
  if (!periods) return null;
  for (const period of periods) {
    if (year >= period.start && year <= period.end) {
      return { en: period.en, fr: period.fr };
    }
  }
  return null;
}

const TARGET_YEARS = Array.from({ length: ((100 - -1400) / 50) + 1 }, (_, i) => -1400 + i * 50);
const BOUNDS = {
  west: -10,
  east: 60,
  south: 10,
  north: 55,
};
const OUT_FILE = path.resolve(
  process.cwd(),
  "Frontend/public/atlas/historical-basemaps/biblical_mosaic.geojson",
);

type IndexEntry = {
  year: number;
  filename: string;
};

function midpointFloor(a: number, b: number): number {
  return Math.floor((a + b) / 2);
}

function intervalForYear(i: number, years: number[]): { start: number; end: number } {
  const current = years[i];
  const prev = years[i - 1];
  const next = years[i + 1];
  const start = prev === undefined ? -1400 : midpointFloor(prev, current) + 1;
  const end = next === undefined ? 100 : midpointFloor(current, next);
  return { start, end };
}

function computeBBoxFromRing(points: number[][], bbox: { minX: number; minY: number; maxX: number; maxY: number }) {
  for (const point of points) {
    const [x, y] = point;
    if (x < bbox.minX) bbox.minX = x;
    if (y < bbox.minY) bbox.minY = y;
    if (x > bbox.maxX) bbox.maxX = x;
    if (y > bbox.maxY) bbox.maxY = y;
  }
}

function featureBBox(feature: Feature): { minX: number; minY: number; maxX: number; maxY: number } {
  const bbox = {
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  if (feature.geometry.type === "Polygon") {
    for (const ring of feature.geometry.coordinates) computeBBoxFromRing(ring, bbox);
    return bbox;
  }
  for (const polygon of feature.geometry.coordinates) {
    for (const ring of polygon) computeBBoxFromRing(ring, bbox);
  }
  return bbox;
}

function intersectsBiblicalBounds(feature: Feature): boolean {
  const bbox = featureBBox(feature);
  return !(
    bbox.maxX < BOUNDS.west ||
    bbox.minX > BOUNDS.east ||
    bbox.maxY < BOUNDS.south ||
    bbox.minY > BOUNDS.north
  );
}

function nearestEntry(targetYear: number, entries: IndexEntry[]): IndexEntry {
  let best = entries[0];
  let bestDist = Math.abs(targetYear - best.year);
  for (const entry of entries) {
    const dist = Math.abs(targetYear - entry.year);
    if (dist < bestDist) {
      best = entry;
      bestDist = dist;
    }
  }
  return best;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

const NAME_FR: Record<string, string> = {
  // Empires
  "Egypt": "Égypte",
  "New Kingdom of Egypt": "Nouvel Empire égyptien",
  "Ptolemaic Kingdom": "Royaume ptolémaïque",
  "Kingdom of Israel": "Royaume d'Israël",
  "Kingdom of Judah": "Royaume de Juda",
  "Judah": "Juda",
  "Israel": "Israël",
  "Judea": "Judée",
  "Judaea": "Judée",
  "Samaria": "Samarie",
  "Galilee": "Galilée",
  "Perea": "Pérée",
  "Decapolis": "Décapole",
  "Phoenicia": "Phénicie",
  "Philistia": "Philistie",
  "Edom": "Édom",
  "Moab": "Moab",
  "Ammon": "Ammon",
  "Aram": "Aram",
  "Aram-Damascus": "Aram-Damas",
  "Damascus": "Damas",
  "Syria": "Syrie",
  "Hittite Empire": "Empire hittite",
  "Hittites": "Hittites",
  "Mitanni": "Mitanni",
  "Assyria": "Assyrie",
  "Assyrian Empire": "Empire assyrien",
  "Neo-Assyrian Empire": "Empire néo-assyrien",
  "Middle Assyrian Empire": "Empire médio-assyrien",
  "Babylonia": "Babylonie",
  "Babylon": "Babylone",
  "Babylonian Empire": "Empire babylonien",
  "Neo-Babylonian Empire": "Empire néo-babylonien",
  "Median Empire": "Empire mède",
  "Medes": "Mèdes",
  "Persia": "Perse",
  "Achaemenid Empire": "Empire achéménide",
  "Parthian Empire": "Empire parthe",
  "Seleucid Empire": "Empire séleucide",
  "Macedon": "Macédoine",
  "Macedonia": "Macédoine",
  "Macedonian Empire": "Empire macédonien",
  "Alexander's Empire": "Empire d'Alexandre",
  "Greece": "Grèce",
  "Athens": "Athènes",
  "Sparta": "Sparte",
  "Thebes": "Thèbes",
  "Corinth": "Corinthe",
  "Hasmonean Kingdom": "Royaume hasmonéen",
  "Herodian Kingdom": "Royaume hérodien",
  "Roman Empire": "Empire romain",
  "Roman Republic": "République romaine",
  "Rome": "Rome",
  "Italy": "Italie",
  "Carthage": "Carthage",
  "Phrygia": "Phrygie",
  "Lydia": "Lydie",
  "Cilicia": "Cilicie",
  "Cappadocia": "Cappadoce",
  "Pontus": "Pont",
  "Bithynia": "Bithynie",
  "Bithynia-Pontus": "Bithynie-et-Pont",
  "Galatia": "Galatie",
  "Asia": "Asie",
  "Pamphylia": "Pamphylie",
  "Lycia": "Lycie",
  "Caria": "Carie",
  "Achaea": "Achaïe",
  "Achaia": "Achaïe",
  "Crete": "Crète",
  "Cyprus": "Chypre",
  "Arabia": "Arabie",
  "Nabataea": "Nabatée",
  "Nabataean Kingdom": "Royaume nabatéen",
  "Sinai": "Sinaï",
  "Cyrenaica": "Cyrénaïque",
  "Numidia": "Numidie",
  "Mauretania": "Mauritanie",
  "Mesopotamia": "Mésopotamie",
  "Elam": "Élam",
  "Sumer": "Sumer",
  "Akkad": "Akkad",
  "Anatolia": "Anatolie",
  "Armenia": "Arménie",
  "Caucasus": "Caucase",
  "Scythia": "Scythie",
  "Thrace": "Thrace",
  "Illyria": "Illyrie",
  "Dacia": "Dacie",
  "Gaul": "Gaule",
  "Hispania": "Hispanie",
  "Iberia": "Ibérie",
  // Tribes / regions used in OT
  "Reuben": "Ruben",
  "Simeon": "Siméon",
  "Levi": "Lévi",
  "Benjamin": "Benjamin",
  "Dan": "Dan",
  "Naphtali": "Nephtali",
  "Gad": "Gad",
  "Asher": "Aser",
  "Issachar": "Issacar",
  "Zebulun": "Zabulon",
  "Manasseh": "Manassé",
  "East Manasseh": "Manassé oriental",
  "Ephraim": "Éphraïm",
  // Misc
  "Unnamed region": "Région sans nom",
  // Additional names actually present in aourednik dataset
  "Saba": "Saba",
  "Kush": "Koush",
  "Kingdom of David and Solomon": "Royaume de David et Salomon",
  "Arabian pastoral nomads": "Nomades pastoraux arabes",
  "state societies and Aramaean kingdoms": "Sociétés étatiques et royaumes araméens",
  "Celtiberians": "Celtibères",
  "Berbers": "Berbères",
  "Greek city-states": "Cités-États grecques",
  "Greek colonies": "Colonies grecques",
  "Achaemenid Empire ": "Empire achéménide",
  "Carthaginian Empire": "Empire carthaginois",
  "Meroe": "Méroé",
  "Saharan Pastoral Nomads": "Nomades pastoraux sahariens",
  "Saharan pastoral nomads": "Nomades pastoraux sahariens",
  "West African cereal farmers": "Agriculteurs céréaliers ouest-africains",
  "Ethiopian highland farmers": "Agriculteurs des hauts plateaux éthiopiens",
  "Arctic marine mammal hunters": "Chasseurs arctiques de mammifères marins",
  "Paleo-Siberian hunter-gatherers": "Chasseurs-cueilleurs paléosibériens",
  "Celts": "Celtes",
  "Sabini": "Sabins",
  "Sabines": "Sabins",
  "Samnites": "Samnites",
  "Etrurians": "Étrusques",
  "Atropatene": "Atropatène",
  "Colchis": "Colchide",
  "Bosporan Kingdom": "Royaume du Bosphore",
  "Bosporian Kingdom": "Royaume du Bosphore",
  "Damot": "Damot",
  "Qataban": "Qataban",
  "Hadramaut": "Hadramaout",
  "Himyarite Kingdom": "Royaume himyarite",
  "Maan": "Ma'in",
  "Mascat": "Mascate",
  "Kingdom of Antigonus": "Royaume d'Antigone",
  "Kingdom of Kassander": "Royaume de Cassandre",
  "Kingdom of Lysimachus": "Royaume de Lysimaque",
  "Kingdom of Syphax": "Royaume de Syphax",
  "Kingdom of Gala": "Royaume de Gala",
  "Macedon and Hellenic League": "Macédoine et Ligue hellénique",
  "Seleucid Kingdom": "Royaume séleucide",
  "Pergamon": "Pergame",
  "Phrygians": "Phrygiens",
  "Daces": "Daces",
  "Dardania": "Dardanie",
  "Cimerians": "Cimmériens",
  "Sarmates": "Sarmates",
  "Iranian pastoralists": "Pasteurs iraniens",
  "Karasuk culture": "Culture de Karassouk",
  "La Tène culture": "Culture de La Tène",
  "Lusatian culture": "Culture lusacienne",
  "Pomeranian culture ": "Culture poméranienne",
  "Pomeranian culture": "Culture poméranienne",
  "Eastern Masurian culture": "Culture mazurienne orientale",
  "Western Masurian culture": "Culture mazurienne occidentale",
  "Sambian-Nothangian culture": "Culture sambienne-nothangienne",
  "Bell-shaped burials culture": "Culture des sépultures campaniformes",
  "Brushed Pottery culture": "Culture de la poterie brossée",
  "Chernoles culture": "Culture de Tchernoles",
  "Plain-Pottery culture": "Culture de la poterie unie",
  "Proto-Scythian culture": "Culture proto-scythique",
  "Urnfield cultures": "Culture des champs d'urnes",
  "Celltic Hallsatt culture": "Culture celtique de Hallstatt",
  "Milograd culture": "Culture de Milograd",
  "N. European Bronze Age cultures": "Cultures de l'âge du bronze nord-européen",
  "Curonians": "Couroniens",
  "Boii": "Boïens",
  "Boihaenum": "Boïhémie",
  "Dumonii": "Dumonii",
  "Suren Kingdom": "Royaume de Suren",
  "Kushan Empire": "Empire kouchan",
  "Bactria": "Bactriane",
  "Parthia": "Parthie",
  "Urartu": "Ourartou",
  "Illyrians": "Illyriens",
  "Odrysian Kingdom": "Royaume odryse",
  "Scythians": "Scythes",
  "Arabs": "Arabes",
  "Arameans": "Araméens",
  "minor states": "petits États",
  "Blemmyes": "Blemmyes",
  "Alans": "Alains",
  "Axum": "Aksoum",
  "Nabatean Kingdom": "Royaume nabatéen",
  "?": "Inconnu",
};

async function main() {
  const index = await fetchJson<{ years: IndexEntry[] }>(
    "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/index.json",
  );
  const usableEntries = index.years
    .filter((entry) => entry.year >= -2000 && entry.year <= 200)
    .sort((a, b) => a.year - b.year);

  const outFeatures: Feature[] = [];

  for (let i = 0; i < TARGET_YEARS.length; i += 1) {
    const targetYear = TARGET_YEARS[i];
    const matched = nearestEntry(targetYear, usableEntries);
    const sourceUrl = `https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/${matched.filename}`;
    const data = await fetchJson<FeatureCollection>(sourceUrl);
    const interval = intervalForYear(i, TARGET_YEARS);
    let kept = 0;

    for (const feature of data.features ?? []) {
      if (feature.geometry?.type !== "Polygon" && feature.geometry?.type !== "MultiPolygon") continue;
      if (!intersectsBiblicalBounds(feature)) continue;
      kept += 1;
      const rawName = String(feature.properties?.NAME ?? feature.properties?.name ?? "Unnamed region");
      const periodLabel = resolvePeriodLabel(rawName, targetYear);
      const nameEn = periodLabel?.en ?? rawName;
      const nameFr = periodLabel?.fr ?? NAME_FR[rawName] ?? rawName;
      outFeatures.push({
        ...feature,
        id: `${targetYear}:${kept}`,
        properties: {
          ...(feature.properties ?? {}),
          name_original: rawName,
          name_en: nameEn,
          name_fr: nameFr,
          start_year: interval.start,
          end_year: interval.end,
          target_year: targetYear,
          source_year: matched.year,
          source_file: matched.filename,
        },
      });
    }
    console.log(
      `[atlas] target ${targetYear} -> source ${matched.year} (${matched.filename}) | kept ${kept} clipped features`,
    );
  }

  // Phase 2: hand-curated biblical overlays (kingdoms, empires, tribes)
  let overlayCount = 0;
  for (const overlay of BIBLICAL_OVERLAYS) {
    const filePath = path.join(PUBLIC_GEO_DIR, overlay.file);
    try {
      const raw = await readFile(filePath, "utf-8");
      const data = JSON.parse(raw) as FeatureCollection;
      let kept = 0;
      for (const feature of data.features ?? []) {
        if (feature.geometry?.type !== "Polygon" && feature.geometry?.type !== "MultiPolygon") continue;
        if (overlay.featureName) {
          const candidateName = String(
            feature.properties?.name ?? feature.properties?.NAME ?? "",
          );
          if (candidateName !== overlay.featureName) continue;
        }
        kept += 1;
        outFeatures.push({
          ...feature,
          id: `overlay-${overlay.id}-${kept}`,
          properties: {
            ...(feature.properties ?? {}),
            name_en: overlay.nameEn,
            name_fr: overlay.nameFr,
            start_year: overlay.startYear,
            end_year: overlay.endYear,
            target_year: overlay.startYear,
            source_year: overlay.startYear,
            source_file: overlay.file,
            overlay: true,
          },
        });
      }
      console.log(
        `[atlas] overlay ${overlay.id} (${overlay.startYear}..${overlay.endYear}) -> kept ${kept} feature(s)`,
      );
      overlayCount += kept;
    } catch (err) {
      console.warn(`[atlas] overlay missing or unreadable: ${overlay.file}`, err);
    }
  }

  // Tribes overlay (each named feature becomes its own tribe polygon for early period).
  try {
    const tribesPath = path.join(PUBLIC_GEO_DIR, TRIBES_FILE);
    const raw = await readFile(tribesPath, "utf-8");
    const data = JSON.parse(raw) as FeatureCollection;
    let kept = 0;
    for (const feature of data.features ?? []) {
      if (feature.geometry?.type !== "Polygon" && feature.geometry?.type !== "MultiPolygon") continue;
      const tribeNameEn = String(
        feature.properties?.name ?? feature.properties?.NAME ?? "",
      ).trim();
      if (!tribeNameEn) continue;
      kept += 1;
      outFeatures.push({
        ...feature,
        id: `overlay-tribe-${tribeNameEn}-${kept}`,
        properties: {
          ...(feature.properties ?? {}),
          name_en: `Tribe of ${tribeNameEn}`,
          name_fr: `Tribu de ${TRIBE_NAME_FR[tribeNameEn] ?? tribeNameEn}`,
          start_year: -1200,
          end_year: -722,
          target_year: -1100,
          source_year: -1100,
          source_file: TRIBES_FILE,
          overlay: true,
        },
      });
    }
    console.log(`[atlas] overlay twelve_tribes -> kept ${kept} feature(s)`);
    overlayCount += kept;
  } catch (err) {
    console.warn("[atlas] tribes overlay missing or unreadable", err);
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(
    OUT_FILE,
    JSON.stringify(
      {
        type: "FeatureCollection",
        features: outFeatures,
      },
      null,
      2,
    ),
  );
  console.log(
    `[atlas] wrote ${outFeatures.length} features (${overlayCount} biblical overlays) to ${OUT_FILE}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

