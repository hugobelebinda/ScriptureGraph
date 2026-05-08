import { BOOK_ORDER } from "./canonicalBooks";
import chronologyTooltipsEn from "../locales/chronology-tooltips.en.json";
import chronologyTooltipsFr from "../locales/chronology-tooltips.fr.json";

export type EmpireLayer = {
  id: string;
  nameKey: string;
  startYear: number;
  endYear: number;
  fillColor: string;
  outlineColor: string;
  labelKey?: string;
  labelPoint?: [number, number];
  polygon?: [number, number][];
  geojsonPath?: string;
  featureName?: string;
};

export type AuthorshipStar = {
  usfm: string;
  lat: number;
  lng: number;
  startYear: number;
  endYear: number;
  placeKey: string;
  authorEn: string;
  authorFr: string;
  contextEn: string;
  contextFr: string;
};

export const ATLAS_MIN_YEAR = -1400;
export const ATLAS_MAX_YEAR = 100;
export const ATLAS_DEFAULT_YEAR = -1400;

// Coarse polygons meant for historical orientation only (v1).
export const EMPIRE_LAYERS: EmpireLayer[] = [
  {
    id: "egypt",
    nameKey: "atlas.layers.egypt",
    startYear: -1500,
    endYear: -1000,
    fillColor: "#b7946a",
    outlineColor: "#8f6e45",
    labelKey: "atlas.layers.egypt",
    labelPoint: [30.2, 27.4],
    geojsonPath: "/atlas/geojson/egypt_bc1500.geojson",
  },
  {
    id: "assyria",
    nameKey: "atlas.layers.assyria",
    startYear: -950,
    endYear: -609,
    fillColor: "#af9d6e",
    outlineColor: "#8f7f56",
    labelKey: "atlas.layers.assyria",
    labelPoint: [43.2, 35.4],
    geojsonPath: "/atlas/geojson/assyria_bc700.geojson",
  },
  {
    id: "babylon",
    nameKey: "atlas.layers.babylon",
    startYear: -626,
    endYear: -539,
    fillColor: "#9c8769",
    outlineColor: "#7a684e",
    labelKey: "atlas.layers.babylon",
    labelPoint: [45.5, 32.4],
    geojsonPath: "/atlas/geojson/babylonia_bc700.geojson",
  },
  {
    id: "persia",
    nameKey: "atlas.layers.persia",
    startYear: -539,
    endYear: -331,
    fillColor: "#8fa181",
    outlineColor: "#6d7d62",
    labelKey: "atlas.layers.persia",
    labelPoint: [50.0, 31.0],
    geojsonPath: "/atlas/geojson/persian_empire.geojson",
  },
  {
    id: "hellenistic",
    nameKey: "atlas.layers.hellenistic",
    startYear: -331,
    endYear: -63,
    fillColor: "#7f8fa7",
    outlineColor: "#5f6d82",
    labelKey: "atlas.layers.hellenistic",
    labelPoint: [29.5, 36.6],
    geojsonPath: "/atlas/geojson/alexanders_empire.geojson",
  },
  {
    id: "rome",
    nameKey: "atlas.layers.rome",
    startYear: -63,
    endYear: 100,
    fillColor: "#9e8b84",
    outlineColor: "#7a6a64",
    labelKey: "atlas.layers.rome",
    labelPoint: [33.0, 35.7],
    geojsonPath: "/atlas/geojson/roman_empire_bce_60.geojson",
  },
  {
    id: "rome_high",
    nameKey: "atlas.layers.romeHigh",
    startYear: 40,
    endYear: 100,
    fillColor: "#9e8b84",
    outlineColor: "#7a6a64",
    labelKey: "atlas.layers.romeHigh",
    labelPoint: [34.0, 36.1],
    geojsonPath: "/atlas/geojson/roman_empire_ce_117_extent.geojson",
  },
  {
    id: "hasmonean",
    nameKey: "atlas.layers.hasmonean",
    startYear: -140,
    endYear: -37,
    fillColor: "#7b8b6a",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.hasmonean",
    labelPoint: [35.1, 31.8],
    geojsonPath: "/atlas/geojson/hasmonean_kingdom.geojson",
  },
  {
    id: "herodian",
    nameKey: "atlas.layers.herodian",
    startYear: -37,
    endYear: 6,
    fillColor: "#8f8666",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.herodian",
    labelPoint: [35.1, 31.7],
    geojsonPath: "/atlas/geojson/herods_kingdom.geojson",
  },
];

export const TERRITORY_LAYERS: EmpireLayer[] = [
  {
    id: "tribe_judah",
    nameKey: "atlas.layers.tribeJudah",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6e8a6f",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeJudah",
    labelPoint: [35.0, 31.4],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Judah",
  },
  {
    id: "tribe_benjamin",
    nameKey: "atlas.layers.tribeBenjamin",
    startYear: -1200,
    endYear: -722,
    fillColor: "#8b7f63",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeBenjamin",
    labelPoint: [35.3, 31.8],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Benjamin",
  },
  {
    id: "tribe_simeon",
    nameKey: "atlas.layers.tribeSimeon",
    startYear: -1200,
    endYear: -722,
    fillColor: "#7b7b62",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeSimeon",
    labelPoint: [34.8, 30.9],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Simeon",
  },
  {
    id: "tribe_dan",
    nameKey: "atlas.layers.tribeDan",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeDan",
    labelPoint: [34.9, 32.3],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Dan",
  },
  {
    id: "tribe_ephraim",
    nameKey: "atlas.layers.tribeEphraim",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeEphraim",
    labelPoint: [35.2, 32.4],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Ephraim",
  },
  {
    id: "tribe_manasseh_west",
    nameKey: "atlas.layers.tribeManassehWest",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeManassehWest",
    labelPoint: [35.2, 32.8],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Manasseh",
  },
  {
    id: "tribe_manasseh_east",
    nameKey: "atlas.layers.tribeManassehEast",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeManassehEast",
    labelPoint: [36.3, 32.9],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "East Manasseh",
  },
  {
    id: "tribe_reuben",
    nameKey: "atlas.layers.tribeReuben",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeReuben",
    labelPoint: [36.5, 31.2],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Reuben",
  },
  {
    id: "tribe_gad",
    nameKey: "atlas.layers.tribeGad",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeGad",
    labelPoint: [36.3, 32.1],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Gad",
  },
  {
    id: "tribe_issachar",
    nameKey: "atlas.layers.tribeIssachar",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeIssachar",
    labelPoint: [35.5, 32.7],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Issachar",
  },
  {
    id: "tribe_zebulun",
    nameKey: "atlas.layers.tribeZebulun",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeZebulun",
    labelPoint: [35.4, 33.0],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Zebulun",
  },
  {
    id: "tribe_naphtali",
    nameKey: "atlas.layers.tribeNaphtali",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeNaphtali",
    labelPoint: [35.8, 33.3],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Naphtali",
  },
  {
    id: "tribe_asher",
    nameKey: "atlas.layers.tribeAsher",
    startYear: -1200,
    endYear: -722,
    fillColor: "#6c8375",
    outlineColor: "#c47e3a",
    labelKey: "atlas.layers.tribeAsher",
    labelPoint: [35.0, 33.2],
    geojsonPath: "/atlas/geojson/twelve_tribes.geojson",
    featureName: "Asher",
  },
];

type AuthorshipProfile = {
  placeKey: string;
  startYear: number;
  endYear: number;
  authorEn: string;
  authorFr: string;
  contextEn: string;
  contextFr: string;
};

const PAULINE_AUTHOR_BOOKS = new Set([
  "ROM",
  "1CO",
  "2CO",
  "GAL",
  "EPH",
  "PHP",
  "COL",
  "1TH",
  "2TH",
  "1TI",
  "2TI",
  "TIT",
  "PHM",
]);

function toAtlasShortSummary(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  const firstSentence = normalized.split(/(?<=[.!?])\s+/)[0] ?? normalized;
  const withoutDateDetails = firstSentence
    .replace(
      /\([^)]*(?:\b(?:BC|BCE|AD|CE)\b|av\.\s*J\.-C\.|apr\.\s*J\.-C\.|\b\d{1,4}\b|siècle|century|c\.)[^)]*\)/gi,
      "",
    )
    .replace(
      /(?:,\s*|;\s*)[^,;.!?]*(?:\b(?:BC|BCE|AD|CE)\b|av\.\s*J\.-C\.|apr\.\s*J\.-C\.|\b\d{1,4}\b|siècle|century|c\.)[^,;.!?]*/gi,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .trim();
  const concise = withoutDateDetails || firstSentence;
  if (concise.length <= 190) return concise;
  return `${concise.slice(0, 187).trimEnd()}...`;
}

const PLACE_COORDS: Record<string, [number, number]> = {
  "atlas.place.moab": [31.95, 35.93],
  "atlas.place.jerusalem": [31.78, 35.23],
  "atlas.place.anathoth": [31.81, 35.26],
  "atlas.place.babylon": [32.54, 44.42],
  "atlas.place.judea": [31.77, 35.21],
  "atlas.place.achaia": [41.0, 28.97],
  "atlas.place.patmos": [37.3, 27.3],
  "atlas.place.samaria": [32.28, 35.19],
  "atlas.place.susa": [32.19, 48.25],
  "atlas.place.nineveh": [36.36, 43.15],
  "atlas.place.tekoa": [31.65, 35.2],
  "atlas.place.uz": [30.8, 35.6],
  "atlas.place.corinth": [37.94, 22.94],
  "atlas.place.ephesus": [37.94, 27.34],
  "atlas.place.rome": [41.9, 12.49],
  "atlas.place.crete": [35.24, 24.81],
  "atlas.place.galatia": [39.5, 35.5],
  "atlas.place.macedonia": [40.72, 23.03],
};

const OT_DEFAULT: AuthorshipProfile = {
  placeKey: "atlas.place.jerusalem",
  startYear: -700,
  endYear: -450,
  authorEn: "Traditional prophetic/scribal circles",
  authorFr: "Milieux prophétiques/scribaux traditionnels",
  contextEn: "Compiled in Israel/Judah literary traditions over time.",
  contextFr: "Compilé dans les traditions littéraires d’Israël/Juda au fil du temps.",
};

const NT_DEFAULT: AuthorshipProfile = {
  placeKey: "atlas.place.rome",
  startYear: 50,
  endYear: 95,
  authorEn: "Apostolic-era Christian communities",
  authorFr: "Communautés chrétiennes de l’ère apostolique",
  contextEn: "Written for early churches across the Roman world.",
  contextFr: "Rédigé pour les premières Églises dans le monde romain.",
};

const BOOK_PROFILES: Partial<Record<(typeof BOOK_ORDER)[number], AuthorshipProfile>> = {
  GEN: {
    placeKey: "atlas.place.moab",
    startYear: -1445,
    endYear: -1405,
    authorEn: "Moses (traditional attribution)",
    authorFr: "Moïse (attribution traditionnelle)",
    contextEn: "Primeval and patriarchal history framed before entering Canaan.",
    contextFr: "Histoire primitive et patriarcale cadrée avant l’entrée en Canaan.",
  },
  EXO: {
    placeKey: "atlas.place.moab",
    startYear: -1445,
    endYear: -1405,
    authorEn: "Moses (traditional attribution)",
    authorFr: "Moïse (attribution traditionnelle)",
    contextEn: "Narrative of deliverance, covenant, and wilderness laws.",
    contextFr: "Récit de la délivrance, de l’alliance et des lois du désert.",
  },
  LEV: {
    placeKey: "atlas.place.moab",
    startYear: -1445,
    endYear: -1405,
    authorEn: "Moses (traditional attribution)",
    authorFr: "Moïse (attribution traditionnelle)",
    contextEn: "Priestly and holiness code traditions in the Sinai setting.",
    contextFr: "Traditions sacerdotales et code de sainteté dans le cadre sinaïtique.",
  },
  NUM: {
    placeKey: "atlas.place.moab",
    startYear: -1445,
    endYear: -1405,
    authorEn: "Moses (traditional attribution)",
    authorFr: "Moïse (attribution traditionnelle)",
    contextEn: "Wilderness generation transitions toward the promised land.",
    contextFr: "Transition de la génération du désert vers la terre promise.",
  },
  DEU: {
    placeKey: "atlas.place.moab",
    startYear: -1400,
    endYear: -1400,
    authorEn: "Moses (traditional attribution)",
    authorFr: "Moïse (attribution traditionnelle)",
    contextEn: "Covenant speeches in the plains of Moab.",
    contextFr: "Discours d’alliance dans les plaines de Moab.",
  },
  JOS: {
    placeKey: "atlas.place.judea",
    startYear: -1380,
    endYear: -1320,
    authorEn: "Joshua-era traditions",
    authorFr: "Traditions de l’époque de Josué",
    contextEn: "Land allotment memory and conquest framing.",
    contextFr: "Mémoire de l’allotissement du pays et cadre de conquête.",
  },
  JDG: {
    placeKey: "atlas.place.jerusalem",
    startYear: -1050,
    endYear: -1000,
    authorEn: "Prophetic redaction (traditional Samuel link)",
    authorFr: "Rédaction prophétique (lien traditionnel avec Samuel)",
    contextEn: "Cycles of apostasy, oppression, and deliverance.",
    contextFr: "Cycles d’apostasie, d’oppression et de délivrance.",
  },
  RUT: {
    placeKey: "atlas.place.jerusalem",
    startYear: -1000,
    endYear: -900,
    authorEn: "Royal-era narrative tradition",
    authorFr: "Tradition narrative de l’époque royale",
    contextEn: "Davidic lineage narrative set in Bethlehem.",
    contextFr: "Récit de lignée davidique situé à Bethléem.",
  },
  EST: {
    placeKey: "atlas.place.susa",
    startYear: -450,
    endYear: -350,
    authorEn: "Diaspora Jewish court tradition",
    authorFr: "Tradition juive diasporique de cour",
    contextEn: "Persian court survival account associated with Susa.",
    contextFr: "Récit de survie à la cour perse associé à Suse.",
  },
  JOB: {
    placeKey: "atlas.place.uz",
    startYear: -900,
    endYear: -500,
    authorEn: "Wisdom tradition",
    authorFr: "Tradition sapientielle",
    contextEn: "Poetic debate text situated in the land of Uz.",
    contextFr: "Texte poétique de débat situé au pays d’Uts.",
  },
  PSA: {
    placeKey: "atlas.place.jerusalem",
    startYear: -1000,
    endYear: -400,
    authorEn: "Davidic and temple worship traditions",
    authorFr: "Traditions davidiques et cultuelles du temple",
    contextEn: "Collected hymns and prayers across multiple generations.",
    contextFr: "Recueil d’hymnes et de prières sur plusieurs générations.",
  },
  PRO: {
    placeKey: "atlas.place.jerusalem",
    startYear: -950,
    endYear: -500,
    authorEn: "Solomonic and wisdom school traditions",
    authorFr: "Traditions salomoniennes et écoles de sagesse",
    contextEn: "Instructional wisdom sayings compiled over time.",
    contextFr: "Maximes sapientielles d’instruction compilées au fil du temps.",
  },
  ECC: {
    placeKey: "atlas.place.jerusalem",
    startYear: -450,
    endYear: -250,
    authorEn: "Qoheleth wisdom voice",
    authorFr: "Voix sapientielle de Qohélet",
    contextEn: "Philosophical reflection from post-exilic wisdom context.",
    contextFr: "Réflexion philosophique dans un contexte sapientiel postexilique.",
  },
  SNG: {
    placeKey: "atlas.place.jerusalem",
    startYear: -950,
    endYear: -300,
    authorEn: "Song tradition linked to Solomon",
    authorFr: "Tradition poétique liée à Salomon",
    contextEn: "Poetic love anthology preserved in Israel’s canon.",
    contextFr: "Anthologie poétique amoureuse conservée dans le canon d’Israël.",
  },
  ISA: {
    placeKey: "atlas.place.jerusalem",
    startYear: -740,
    endYear: -680,
    authorEn: "Isaiah and Isaianic school",
    authorFr: "Ésaïe et école isaïenne",
    contextEn: "Oracles centered in Judah during Assyrian pressure.",
    contextFr: "Oracles centrés sur Juda sous la pression assyrienne.",
  },
  JER: {
    placeKey: "atlas.place.jerusalem",
    startYear: -627,
    endYear: -580,
    authorEn: "Jeremiah and Baruch traditions",
    authorFr: "Traditions de Jérémie et Baruch",
    contextEn: "Warnings and laments around Jerusalem’s collapse.",
    contextFr: "Avertissements et lamentations autour de l’effondrement de Jérusalem.",
  },
  LAM: {
    placeKey: "atlas.place.jerusalem",
    startYear: -586,
    endYear: -560,
    authorEn: "Post-fall Jerusalem lament tradition",
    authorFr: "Tradition de lamentation post-chute de Jérusalem",
    contextEn: "Poetic responses to the destruction of Jerusalem.",
    contextFr: "Réponses poétiques à la destruction de Jérusalem.",
  },
  EZK: {
    placeKey: "atlas.place.babylon",
    startYear: -593,
    endYear: -571,
    authorEn: "Ezekiel among the exiles",
    authorFr: "Ézéchiel parmi les exilés",
    contextEn: "Exilic prophetic visions from Mesopotamia.",
    contextFr: "Visions prophétiques de l’exil en Mésopotamie.",
  },
  DAN: {
    placeKey: "atlas.place.babylon",
    startYear: -600,
    endYear: -530,
    authorEn: "Diaspora court tradition (Danielic)",
    authorFr: "Tradition diasporique de cour (daniélique)",
    contextEn: "Court narratives and apocalyptic motifs in imperial settings.",
    contextFr: "Récits de cour et motifs apocalyptiques en contexte impérial.",
  },
  HOS: {
    placeKey: "atlas.place.samaria",
    startYear: -755,
    endYear: -715,
    authorEn: "Hosea",
    authorFr: "Osée",
    contextEn: "Northern kingdom critique before Assyria’s conquest.",
    contextFr: "Critique du royaume du Nord avant la conquête assyrienne.",
  },
  JOL: {
    placeKey: "atlas.place.jerusalem",
    startYear: -500,
    endYear: -350,
    authorEn: "Joel",
    authorFr: "Joël",
    contextEn: "Prophetic call around Zion and temple worship.",
    contextFr: "Appel prophétique autour de Sion et du culte du temple.",
  },
  AMO: {
    placeKey: "atlas.place.tekoa",
    startYear: -760,
    endYear: -750,
    authorEn: "Amos",
    authorFr: "Amos",
    contextEn: "Shepherd-prophet announcing judgment to Israel.",
    contextFr: "Prophète-pasteur annonçant le jugement d’Israël.",
  },
  OBA: {
    placeKey: "atlas.place.jerusalem",
    startYear: -586,
    endYear: -550,
    authorEn: "Obadiah",
    authorFr: "Abdias",
    contextEn: "Oracle concerning Edom and Zion after Judah’s fall.",
    contextFr: "Oracle sur Édom et Sion après la chute de Juda.",
  },
  JON: {
    placeKey: "atlas.place.jerusalem",
    startYear: -780,
    endYear: -730,
    authorEn: "Jonah tradition",
    authorFr: "Tradition de Jonas",
    contextEn: "The book’s Israelite setting is debated; the exact city is unknown, though Jerusalem is often proposed.",
    contextFr: "Le cadre en Israël est débattu : la ville exacte est inconnue, mais Jérusalem est souvent proposée.",
  },
  MIC: {
    placeKey: "atlas.place.jerusalem",
    startYear: -735,
    endYear: -700,
    authorEn: "Micah",
    authorFr: "Michée",
    contextEn: "Judah and Samaria justice oracles.",
    contextFr: "Oracles de justice pour Juda et Samarie.",
  },
  NAM: {
    placeKey: "atlas.place.judea",
    startYear: -660,
    endYear: -620,
    authorEn: "Nahum",
    authorFr: "Nahum",
    contextEn: "Although the message targets Nineveh, it is generally thought to have been written in Judah (not in Nineveh).",
    contextFr: "Même si la prophétie vise Ninive, il est généralement pensé qu’elle a été rédigée en Juda (et non à Ninive).",
  },
  HAB: {
    placeKey: "atlas.place.jerusalem",
    startYear: -620,
    endYear: -600,
    authorEn: "Habakkuk",
    authorFr: "Habacuc",
    contextEn: "Dialogue on violence and divine justice before Babylonian rise.",
    contextFr: "Dialogue sur la violence et la justice divine avant la montée babylonienne.",
  },
  ZEP: {
    placeKey: "atlas.place.jerusalem",
    startYear: -640,
    endYear: -620,
    authorEn: "Zephaniah",
    authorFr: "Sophonie",
    contextEn: "Day-of-the-Lord proclamation in Judah.",
    contextFr: "Annonce du jour de l’Éternel en Juda.",
  },
  HAG: {
    placeKey: "atlas.place.jerusalem",
    startYear: -520,
    endYear: -515,
    authorEn: "Haggai",
    authorFr: "Aggée",
    contextEn: "Temple rebuilding exhortations in Persian Yehud.",
    contextFr: "Exhortations à la reconstruction du temple dans le Yehud perse.",
  },
  ZEC: {
    placeKey: "atlas.place.jerusalem",
    startYear: -520,
    endYear: -480,
    authorEn: "Zechariah",
    authorFr: "Zacharie",
    contextEn: "Post-exilic visions around restoration hopes.",
    contextFr: "Visions postexiliques autour des espérances de restauration.",
  },
  MAL: {
    placeKey: "atlas.place.jerusalem",
    startYear: -460,
    endYear: -430,
    authorEn: "Malachi",
    authorFr: "Malachie",
    contextEn: "Late post-exilic covenant critique in Judah.",
    contextFr: "Critique de l’alliance à la fin de l’époque postexilique.",
  },
  MAT: {
    placeKey: "atlas.place.judea",
    startYear: 55,
    endYear: 70,
    authorEn: "Matthew (traditional attribution)",
    authorFr: "Matthieu (attribution traditionnelle)",
    contextEn: "Gospel shaped for Jewish-Christian audiences.",
    contextFr: "Évangile façonné pour des milieux judéo-chrétiens.",
  },
  MRK: {
    placeKey: "atlas.place.rome",
    startYear: 60,
    endYear: 70,
    authorEn: "Mark (traditional attribution)",
    authorFr: "Marc (attribution traditionnelle)",
    contextEn: "Early passion-focused Gospel likely tied to Roman context.",
    contextFr: "Évangile ancien centré sur la passion, probablement lié au contexte romain.",
  },
  LUK: {
    placeKey: "atlas.place.achaia",
    startYear: 60,
    endYear: 80,
    authorEn: "Luke",
    authorFr: "Luc",
    contextEn: "Orderly narrative for a broader Greek-speaking audience.",
    contextFr: "Récit ordonné pour un public grec plus large.",
  },
  JHN: {
    placeKey: "atlas.place.ephesus",
    startYear: 80,
    endYear: 95,
    authorEn: "Johannine community tradition",
    authorFr: "Tradition de la communauté johannique",
    contextEn: "Theological Gospel tradition associated with Asia Minor.",
    contextFr: "Tradition évangélique théologique associée à l’Asie Mineure.",
  },
  ACT: {
    placeKey: "atlas.place.achaia",
    startYear: 62,
    endYear: 85,
    authorEn: "Luke",
    authorFr: "Luc",
    contextEn: "Narrative of early church expansion in Roman provinces.",
    contextFr: "Récit de l’expansion de l’Église primitive dans les provinces romaines.",
  },
  ROM: {
    placeKey: "atlas.place.corinth",
    startYear: 56,
    endYear: 57,
    authorEn: "Paul",
    authorFr: "Paul",
    contextEn: "Letter to Rome likely written from Corinth.",
    contextFr: "Lettre à Rome probablement écrite depuis Corinthe.",
  },
  "1CO": {
    placeKey: "atlas.place.ephesus",
    startYear: 53,
    endYear: 55,
    authorEn: "Paul",
    authorFr: "Paul",
    contextEn: "Written during Paul’s ministry in Ephesus.",
    contextFr: "Rédigée durant le ministère de Paul à Éphèse.",
  },
  "2CO": {
    placeKey: "atlas.place.macedonia",
    startYear: 55,
    endYear: 56,
    authorEn: "Paul",
    authorFr: "Paul",
    contextEn: "Follow-up correspondence from Macedonia.",
    contextFr: "Correspondance de suivi depuis la Macédoine.",
  },
  GAL: {
    placeKey: "atlas.place.ephesus",
    startYear: 48,
    endYear: 55,
    authorEn: "Paul",
    authorFr: "Paul",
    contextEn: "Defense of gospel freedom for Galatian communities.",
    contextFr: "Défense de la liberté de l’Évangile pour les communautés galates.",
  },
  EPH: {
    placeKey: "atlas.place.rome",
    startYear: 60,
    endYear: 62,
    authorEn: "Pauline prison-letter tradition",
    authorFr: "Tradition paulinienne de lettres de captivité",
    contextEn: "Circular exhortation for churches in Asia Minor.",
    contextFr: "Exhortation circulaire pour des Églises d’Asie Mineure.",
  },
  PHP: {
    placeKey: "atlas.place.rome",
    startYear: 60,
    endYear: 62,
    authorEn: "Paul",
    authorFr: "Paul",
    contextEn: "Prison-era encouragement to the Philippian church.",
    contextFr: "Encouragement de captivité pour l’Église de Philippes.",
  },
  COL: {
    placeKey: "atlas.place.rome",
    startYear: 60,
    endYear: 62,
    authorEn: "Pauline tradition",
    authorFr: "Tradition paulinienne",
    contextEn: "Christ-centered teaching for Colossae.",
    contextFr: "Enseignement centré sur le Christ pour Colosses.",
  },
  "1TH": {
    placeKey: "atlas.place.corinth",
    startYear: 50,
    endYear: 51,
    authorEn: "Paul",
    authorFr: "Paul",
    contextEn: "Early pastoral letter from Corinth.",
    contextFr: "Lettre pastorale précoce depuis Corinthe.",
  },
  "2TH": {
    placeKey: "atlas.place.corinth",
    startYear: 50,
    endYear: 52,
    authorEn: "Paul",
    authorFr: "Paul",
    contextEn: "Companion letter clarifying hope and endurance.",
    contextFr: "Lettre complémentaire clarifiant espérance et persévérance.",
  },
  "1TI": {
    placeKey: "atlas.place.ephesus",
    startYear: 62,
    endYear: 65,
    authorEn: "Pauline pastoral tradition",
    authorFr: "Tradition pastorale paulinienne",
    contextEn: "Guidance for church order and leadership.",
    contextFr: "Consignes sur l’ordre ecclésial et la direction.",
  },
  "2TI": {
    placeKey: "atlas.place.rome",
    startYear: 64,
    endYear: 67,
    authorEn: "Pauline pastoral tradition",
    authorFr: "Tradition pastorale paulinienne",
    contextEn: "Final exhortations amid persecution context.",
    contextFr: "Exhortations finales dans un contexte de persécution.",
  },
  TIT: {
    placeKey: "atlas.place.macedonia",
    startYear: 62,
    endYear: 65,
    authorEn: "Pauline pastoral tradition",
    authorFr: "Tradition pastorale paulinienne",
    contextEn: "Letter likely written in Macedonia, giving church order instructions to Titus serving on the island of Crete.",
    contextFr: "Lettre probablement rédigée en Macédoine, donnant à Tite des instructions d’organisation d’Église pour son service en Crète.",
  },
  PHM: {
    placeKey: "atlas.place.rome",
    startYear: 60,
    endYear: 62,
    authorEn: "Paul",
    authorFr: "Paul",
    contextEn: "Personal appeal letter from imprisonment setting.",
    contextFr: "Lettre d’appel personnelle dans un cadre de captivité.",
  },
  HEB: {
    placeKey: "atlas.place.rome",
    startYear: 60,
    endYear: 90,
    authorEn: "Anonymous early Christian homilist",
    authorFr: "Homéliste chrétien primitif anonyme",
    contextEn: "Sermonic theology for persevering believers.",
    contextFr: "Théologie homilétique pour des croyants persévérants.",
  },
  JAS: {
    placeKey: "atlas.place.jerusalem",
    startYear: 45,
    endYear: 62,
    authorEn: "James (traditional attribution)",
    authorFr: "Jacques (attribution traditionnelle)",
    contextEn: "Wisdom-shaped instruction to dispersed believers.",
    contextFr: "Instruction de type sapientiel aux croyants dispersés.",
  },
  "1PE": {
    placeKey: "atlas.place.rome",
    startYear: 60,
    endYear: 64,
    authorEn: "Peter (traditional attribution)",
    authorFr: "Pierre (attribution traditionnelle)",
    contextEn: "Encouragement for churches under social pressure.",
    contextFr: "Encouragement pour des Églises sous pression sociale.",
  },
  "2PE": {
    placeKey: "atlas.place.rome",
    startYear: 60,
    endYear: 68,
    authorEn: "Petrine tradition",
    authorFr: "Tradition pétrinienne",
    contextEn: "Warning against false teachers and delayed expectations.",
    contextFr: "Avertissement contre les faux enseignants et le retard perçu.",
  },
  "1JN": {
    placeKey: "atlas.place.ephesus",
    startYear: 85,
    endYear: 95,
    authorEn: "Johannine community elder",
    authorFr: "Ancien de la communauté johannique",
    contextEn: "Pastoral assurance and discernment in community conflict.",
    contextFr: "Assurance pastorale et discernement en contexte de conflit communautaire.",
  },
  "2JN": {
    placeKey: "atlas.place.ephesus",
    startYear: 85,
    endYear: 95,
    authorEn: "Johannine elder",
    authorFr: "Ancien johannique",
    contextEn: "Brief warning letter about truth and hospitality.",
    contextFr: "Brève lettre d’avertissement sur la vérité et l’hospitalité.",
  },
  "3JN": {
    placeKey: "atlas.place.ephesus",
    startYear: 85,
    endYear: 95,
    authorEn: "Johannine elder",
    authorFr: "Ancien johannique",
    contextEn: "Personal commendation and leadership concern letter.",
    contextFr: "Lettre personnelle de recommandation et souci de gouvernance.",
  },
  JUD: {
    placeKey: "atlas.place.jerusalem",
    startYear: 60,
    endYear: 90,
    authorEn: "Jude (traditional attribution)",
    authorFr: "Jude (attribution traditionnelle)",
    contextEn: "Short warning against corrupt teaching.",
    contextFr: "Court avertissement contre des enseignements corrompus.",
  },
  REV: {
    placeKey: "atlas.place.patmos",
    startYear: 90,
    endYear: 96,
    authorEn: "John of Patmos",
    authorFr: "Jean de Patmos",
    contextEn: "Apocalyptic vision for persecuted churches in Asia.",
    contextFr: "Vision apocalyptique pour des Églises persécutées d’Asie.",
  },
};

function baseProfileForBook(usfm: (typeof BOOK_ORDER)[number]): AuthorshipProfile {
  const isOldTestament = BOOK_ORDER.indexOf(usfm) <= BOOK_ORDER.indexOf("MAL");
  return isOldTestament ? OT_DEFAULT : NT_DEFAULT;
}

export const AUTHORSHIP_STARS: AuthorshipStar[] = BOOK_ORDER.map((usfm, index) => {
  const profile = BOOK_PROFILES[usfm] ?? baseProfileForBook(usfm);
  const timelineEn = chronologyTooltipsEn[usfm as keyof typeof chronologyTooltipsEn];
  const timelineFr = chronologyTooltipsFr[usfm as keyof typeof chronologyTooltipsFr];
  const forcePaul = PAULINE_AUTHOR_BOOKS.has(usfm);
  const base = PLACE_COORDS[profile.placeKey] ?? PLACE_COORDS["atlas.place.jerusalem"];
  let contextEn = toAtlasShortSummary(timelineEn ?? profile.contextEn);
  let contextFr = toAtlasShortSummary(timelineFr ?? profile.contextFr);

  // Atlas mini-summaries: add key “debates” detail where you asked for it.
  // (The timeline summaries are more general, so we enrich the Atlas-only text.)
  if (usfm === "MAT") {
    contextEn =
      "Jesus’ life and teaching; critical dating commonly AD 80–90 (post-temple). " +
      "The book’s origin is also debated, with Antioch sometimes proposed.";
    contextFr =
      "Vie et enseignement de Jésus ; datation critique souvent 80–90 apr. J.-C. " +
      "Le lieu d’origine du livre est aussi débattu, et Antioche est parfois proposé.";
  }
  if (usfm === "JON") {
    contextEn =
      "The book’s Israelite setting is debated; the exact city is unknown, though Jerusalem is often proposed.";
    contextFr = "Le cadre en Israël est débattu : la ville exacte est inconnue, mais Jérusalem est souvent proposée.";
  }
  if (usfm === "NAM") {
    contextEn =
      "Although the message targets Nineveh, it is generally thought to have been written in Judah (not in Nineveh).";
    contextFr =
      "Même si la prophétie vise Ninive, il est généralement pensé qu’elle a été rédigée en Juda (et non à Ninive).";
  }
  if (usfm === "TIT") {
    contextEn =
      "Letter likely written in Macedonia, giving church order instructions to Titus serving on the island of Crete.";
    contextFr =
      "Lettre probablement rédigée en Macédoine, donnant à Tite des instructions d’organisation d’Église pour son service en Crète.";
  }
  return {
    usfm,
    lat: base[0],
    lng: base[1],
    startYear: profile.startYear,
    endYear: profile.endYear,
    placeKey: profile.placeKey,
    authorEn: forcePaul ? "Paul" : profile.authorEn,
    authorFr: forcePaul ? "Paul" : profile.authorFr,
    contextEn,
    contextFr,
  };
});
