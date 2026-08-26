/**
 * Nine biblical journeys rendered by the Journey Visualizer.
 *
 * Scripture references are stored as USFM code + range so book names resolve
 * through the existing `books.*` locale block instead of being duplicated per language.
 *
 * Coordinates are WGS84 decimal degrees taken from the OpenBible.info Bible Geocoding
 * dataset (CC BY 4.0, https://github.com/openbibleinfo/Bible-Geocoding-Data), which
 * catalogues every proposed modern location for each biblical place and scores how much
 * current scholarship backs it. Each waypoint keeps that provenance in `source` so the
 * UI can say how firm an identification is. Run `scripts/crosscheck-journeys.ts` to
 * re-verify these against the upstream dataset.
 *
 * Three stops have no source at all; they omit `source` and say so in their description.
 */

export type ScriptureRef = {
  usfm: string;
  ref: string;
};

export type WaypointSource = {
  /** Modern site that the dataset identifies with this biblical place. */
  site: string;
  /** How strongly current scholarship backs that identification, 0-1000. */
  confidence: number;
  /** How many competing modern locations have been proposed for the place. */
  candidates: number;
  /** Path segment under https://www.openbible.info/geo/ancient/ for the citation. */
  slug: string;
};

export type JourneyWaypoint = {
  id: string;
  nameEn: string;
  nameFr: string;
  lng: number;
  lat: number;
  descriptionEn: string;
  descriptionFr: string;
  refs: ScriptureRef[];
  /** Omitted when no source places this stop; the description explains why. */
  source?: WaypointSource;
};

export type JourneyEra = "pentateuch" | "conquest" | "monarchy" | "gospels" | "acts";

export type Journey = {
  id: string;
  titleEn: string;
  titleFr: string;
  era: JourneyEra;
  waypoints: JourneyWaypoint[];
};

export const JOURNEY_ERAS: JourneyEra[] = [
  "pentateuch",
  "conquest",
  "monarchy",
  "gospels",
  "acts",
];

const EXODUS: Journey = {
  id: "exodus",
  titleEn: "The Exodus & Wilderness Wandering",
  titleFr: "L'Exode et l'errance au désert",
  era: "pentateuch",
  waypoints: [
    {
      id: "exodus-rameses",
      nameEn: "Rameses (Egypt)",
      nameFr: "Ramsès (Égypte)",
      lng: 31.834217,
      lat: 30.79937,
      descriptionEn:
        "The Israelites depart Egypt following the Passover and the tenth plague.",
      descriptionFr:
        "Les Israélites quittent l'Égypte après la Pâque et la dixième plaie.",
      refs: [{ usfm: "EXO", ref: "12:37-39" }],
      source: {
        site: "Qantir",
        confidence: 509,
        candidates: 4,
        slug: "rameses",
      },
    },
    {
      id: "exodus-succoth",
      nameEn: "Succoth",
      nameFr: "Succoth",
      lng: 32.099,
      lat: 30.5527,
      descriptionEn: "The first encampment where the people bake unleavened bread.",
      descriptionFr:
        "Le premier campement, où le peuple cuit des pains sans levain.",
      refs: [
        { usfm: "EXO", ref: "12:37" },
        { usfm: "EXO", ref: "13:20" },
      ],
      source: {
        site: "Tell el Maskhuta",
        confidence: 206,
        candidates: 4,
        slug: "succoth-2",
      },
    },
    {
      id: "exodus-pi-hahiroth",
      nameEn: "Pi-Hahiroth (Red Sea)",
      nameFr: "Pi-Hahiroth (mer Rouge)",
      lng: 32.52,
      lat: 29.95,
      descriptionEn:
        'God parts the sea for Israel and collapses the waters on Pharaoh\'s pursuing army. The campsite itself is unlocated: every proposed site for Pi-Hahiroth sits 28 to 110 km north of here among the lagoons of the isthmus. So this marker follows the sea instead, on the northern shore of the Gulf of Suez, which is the leading identification for the "Red Sea" of this crossing — the Hebrew yam suph, "Sea of Reeds".',
      descriptionFr:
        "Dieu ouvre la mer devant Israël puis referme les eaux sur l'armée de Pharaon. Le campement lui-même n'est pas localisé : tous les sites proposés pour Pi-Hahiroth se trouvent à 28 à 110 km au nord d'ici, parmi les lagunes de l'isthme. Ce marqueur suit donc la mer, sur la rive nord du golfe de Suez, qui est l'identification la mieux appuyée pour la « mer Rouge » de cette traversée — l'hébreu yam suph, « mer des Roseaux ».",
      refs: [{ usfm: "EXO", ref: "14:21-28" }],
      source: {
        site: "Gulf of Suez, northern shore",
        confidence: 369,
        candidates: 8,
        slug: "red-sea-1",
      },
    },
    {
      id: "exodus-marah",
      nameEn: "Marah",
      nameFr: "Mara",
      lng: 32.94284,
      lat: 29.34604,
      descriptionEn:
        "The Israelites find bitter water, which God instructs Moses to make sweet using a piece of wood.",
      descriptionFr:
        "Les Israélites trouvent une eau amère que Dieu ordonne à Moïse d'adoucir avec un morceau de bois.",
      refs: [{ usfm: "EXO", ref: "15:23-25" }],
      source: {
        site: "Ain Hawarah",
        confidence: 384,
        candidates: 4,
        slug: "marah",
      },
    },
    {
      id: "exodus-elim",
      nameEn: "Elim",
      nameFr: "Élim",
      lng: 32.915833,
      lat: 29.254722,
      descriptionEn: "An oasis encampment featuring 12 springs and 70 palm trees.",
      descriptionFr:
        "Un campement d'oasis comptant 12 sources et 70 palmiers.",
      refs: [{ usfm: "EXO", ref: "15:27" }],
      source: {
        site: "Wadi Gharandal",
        confidence: 533,
        candidates: 4,
        slug: "elim",
      },
    },
    {
      id: "exodus-wilderness-sin",
      nameEn: "Wilderness of Sin",
      nameFr: "Désert de Sin",
      lng: 33.536667,
      lat: 29.147778,
      descriptionEn:
        "The congregation grumbles about starvation, and God provides manna and quail from heaven.",
      descriptionFr:
        "L'assemblée murmure contre la faim, et Dieu envoie du ciel la manne et des cailles.",
      refs: [{ usfm: "EXO", ref: "16:1-15" }],
      source: {
        site: "Debbet er Ramleh",
        confidence: 311,
        candidates: 3,
        slug: "sin",
      },
    },
    {
      id: "exodus-rephidim",
      nameEn: "Rephidim",
      nameFr: "Rephidim",
      lng: 33.880278,
      lat: 28.623056,
      descriptionEn:
        "Moses strikes the rock to provide water, and Joshua defeats the Amalekites in battle.",
      descriptionFr:
        "Moïse frappe le rocher pour donner de l'eau, et Josué bat les Amalécites au combat.",
      refs: [{ usfm: "EXO", ref: "17:1-13" }],
      source: {
        site: "Wadi Rufaiyil",
        confidence: 379,
        candidates: 5,
        slug: "rephidim",
      },
    },
    {
      id: "exodus-sinai",
      nameEn: "Mount Sinai",
      nameFr: "Mont Sinaï",
      lng: 33.973333,
      lat: 28.539722,
      descriptionEn:
        "Moses receives the Ten Commandments, and the Israelites worship the golden calf.",
      descriptionFr:
        "Moïse reçoit les Dix Commandements, et les Israélites adorent le veau d'or.",
      refs: [
        { usfm: "EXO", ref: "19:1-20:21" },
        { usfm: "EXO", ref: "32:1-35" },
      ],
      source: {
        site: "Jebel Musa",
        confidence: 465,
        candidates: 14,
        slug: "mount-sinai",
      },
    },
    {
      id: "exodus-kadesh-barnea",
      nameEn: "Kadesh Barnea",
      nameFr: "Kadès-Barnéa",
      lng: 34.422222,
      lat: 30.648333,
      descriptionEn:
        "Spies are sent into Canaan; the people rebel out of fear and are condemned to wander the wilderness.",
      descriptionFr:
        "Des espions sont envoyés en Canaan ; le peuple se révolte par peur et est condamné à errer au désert.",
      refs: [{ usfm: "NUM", ref: "13:1-14:35" }],
      source: {
        site: "Ain el Qudeirat",
        confidence: 864,
        candidates: 2,
        slug: "kadesh-barnea",
      },
    },
    {
      id: "exodus-mount-hor",
      nameEn: "Mount Hor",
      nameFr: "Mont Hor",
      lng: 35.056872,
      lat: 30.832057,
      descriptionEn:
        "The high priest Aaron dies and is succeeded by his son Eleazar.",
      descriptionFr:
        "Le grand prêtre Aaron meurt et son fils Éléazar lui succède.",
      refs: [{ usfm: "NUM", ref: "20:22-29" }],
      source: {
        site: "Har Zin",
        confidence: 336,
        candidates: 5,
        slug: "mount-hor-1",
      },
    },
    {
      id: "exodus-plains-moab",
      nameEn: "Plains of Moab (Mount Nebo)",
      nameFr: "Plaines de Moab (mont Nébo)",
      lng: 35.75,
      lat: 31.766667,
      descriptionEn:
        "Moses delivers his final sermons, views the Promised Land, and dies.",
      descriptionFr:
        "Moïse prononce ses derniers discours, contemple la Terre promise, puis meurt.",
      refs: [{ usfm: "DEU", ref: "34:1-8" }],
      source: {
        site: "Jabal al Naba",
        confidence: 413,
        candidates: 3,
        slug: "mount-nebo",
      },
    },
  ],
};

const ABRAHAM: Journey = {
  id: "abraham",
  titleEn: "Abraham's Migration",
  titleFr: "La migration d'Abraham",
  era: "pentateuch",
  waypoints: [
    {
      id: "abraham-ur",
      nameEn: "Ur of the Chaldeans",
      nameFr: "Ur en Chaldée",
      lng: 46.104444,
      lat: 30.962222,
      descriptionEn:
        "Abram's birthplace, where God first calls him to leave his country.",
      descriptionFr:
        "Le lieu de naissance d'Abram, où Dieu l'appelle pour la première fois à quitter son pays.",
      refs: [
        { usfm: "GEN", ref: "11:28" },
        { usfm: "GEN", ref: "15:7" },
      ],
      source: {
        site: "Tell el Muqayyar",
        confidence: 703,
        candidates: 4,
        slug: "ur-1",
      },
    },
    {
      id: "abraham-haran",
      nameEn: "Haran",
      nameFr: "Charan",
      lng: 39.032778,
      lat: 36.864444,
      descriptionEn:
        "Abram's father Terah dies here; God reiterates the call to leave for Canaan.",
      descriptionFr:
        "Térach, le père d'Abram, y meurt ; Dieu renouvelle l'appel à partir pour Canaan.",
      refs: [
        { usfm: "GEN", ref: "11:31-32" },
        { usfm: "GEN", ref: "12:1-4" },
      ],
      source: {
        site: "Harran",
        confidence: 922,
        candidates: 1,
        slug: "haran",
      },
    },
    {
      id: "abraham-shechem",
      nameEn: "Shechem",
      nameFr: "Sichem",
      lng: 35.281944,
      lat: 32.213611,
      descriptionEn:
        "God promises the land to Abram's offspring, and Abram builds his first altar.",
      descriptionFr:
        "Dieu promet le pays à la descendance d'Abram, qui bâtit son premier autel.",
      refs: [{ usfm: "GEN", ref: "12:6-7" }],
      source: {
        site: "Tell Balatah",
        confidence: 1000,
        candidates: 1,
        slug: "shechem",
      },
    },
    {
      id: "abraham-bethel-1",
      nameEn: "Bethel / Ai",
      nameFr: "Béthel / Aï",
      lng: 35.241389,
      lat: 31.922778,
      descriptionEn: "Abram builds another altar and calls upon the name of the Lord.",
      descriptionFr:
        "Abram bâtit un autre autel et invoque le nom de l'Éternel.",
      refs: [{ usfm: "GEN", ref: "12:8" }],
      source: {
        site: "Beitin",
        confidence: 716,
        candidates: 3,
        slug: "bethel-1",
      },
    },
    {
      id: "abraham-egypt",
      nameEn: "Egypt",
      nameFr: "Égypte",
      lng: 31.3075,
      lat: 30.129444,
      descriptionEn:
        "Driven by severe famine, Abram goes to Egypt and deceitfully passes Sarai off as his sister.",
      descriptionFr:
        "Poussé par une grave famine, Abram descend en Égypte et fait passer Saraï pour sa sœur.",
      refs: [{ usfm: "GEN", ref: "12:10-20" }],
      source: {
        site: "Ain Shams",
        confidence: 1000,
        candidates: 1,
        slug: "egypt",
      },
    },
    {
      id: "abraham-bethel-2",
      nameEn: "Bethel / Ai (Return)",
      nameFr: "Béthel / Aï (retour)",
      lng: 35.241389,
      lat: 31.922778,
      descriptionEn:
        "Abram and Lot separate their massive herds to avoid conflict.",
      descriptionFr:
        "Abram et Lot séparent leurs immenses troupeaux pour éviter les conflits.",
      refs: [{ usfm: "GEN", ref: "13:1-11" }],
      source: {
        site: "Beitin",
        confidence: 716,
        candidates: 3,
        slug: "bethel-1",
      },
    },
    {
      id: "abraham-hebron",
      nameEn: "Hebron (Oaks of Mamre)",
      nameFr: "Hébron (chênes de Mamré)",
      lng: 35.10222,
      lat: 31.525087,
      descriptionEn:
        "Abram settles, builds an altar, and God formally establishes His covenant.",
      descriptionFr:
        "Abram s'installe, bâtit un autel, et Dieu établit formellement son alliance.",
      refs: [
        { usfm: "GEN", ref: "13:18" },
        { usfm: "GEN", ref: "15:1-21" },
      ],
      source: {
        site: "Tel Rumeida",
        confidence: 1000,
        candidates: 1,
        slug: "hebron",
      },
    },
    {
      id: "abraham-gerar",
      nameEn: "Gerar",
      nameFr: "Guérar",
      lng: 34.6065,
      lat: 31.3821,
      descriptionEn:
        "Abraham dwells in the south; King Abimelech takes Sarah, but God intervenes in a dream.",
      descriptionFr:
        "Abraham habite au sud ; le roi Abimélec prend Sara, mais Dieu intervient dans un songe.",
      refs: [{ usfm: "GEN", ref: "20:1-18" }],
      source: {
        site: "Tel Haror",
        confidence: 694,
        candidates: 4,
        slug: "gerar",
      },
    },
    {
      id: "abraham-beersheba",
      nameEn: "Beersheba",
      nameFr: "Beer-Schéba",
      lng: 34.840833,
      lat: 31.244722,
      descriptionEn:
        "Abraham makes a treaty with Abimelech, and Isaac is eventually born here.",
      descriptionFr:
        "Abraham conclut une alliance avec Abimélec, et Isaac y naît par la suite.",
      refs: [{ usfm: "GEN", ref: "21:22-34" }],
      source: {
        site: "Tel Beer Sheva",
        confidence: 406,
        candidates: 2,
        slug: "beersheba-2",
      },
    },
    {
      id: "abraham-moriah",
      nameEn: "Mount Moriah",
      nameFr: "Mont Moriya",
      lng: 35.235556,
      lat: 31.777778,
      descriptionEn:
        "God tests Abraham by commanding him to sacrifice Isaac, providing a ram as a substitute.",
      descriptionFr:
        "Dieu éprouve Abraham en lui ordonnant de sacrifier Isaac, puis pourvoit un bélier en substitut.",
      refs: [{ usfm: "GEN", ref: "22:1-19" }],
      source: {
        site: "Mount Moriah",
        confidence: 325,
        candidates: 7,
        slug: "moriah",
      },
    },
  ],
};

const DAVID: Journey = {
  id: "david",
  titleEn: "David's Fugitive Circuit",
  titleFr: "La fuite de David",
  era: "monarchy",
  waypoints: [
    {
      id: "david-gibeah",
      nameEn: "Gibeah",
      nameFr: "Guibea",
      lng: 35.230718,
      lat: 31.823113,
      descriptionEn:
        "David escapes an assassination attempt by Saul, climbing through a window with Michal's help.",
      descriptionFr:
        "David échappe à une tentative d'assassinat de Saül en passant par une fenêtre avec l'aide de Mical.",
      refs: [{ usfm: "1SA", ref: "19:11-17" }],
      source: {
        site: "Tel el Ful",
        confidence: 669,
        candidates: 2,
        slug: "gibeah-1",
      },
    },
    {
      id: "david-ramah",
      nameEn: "Ramah (Naioth)",
      nameFr: "Rama (Najoth)",
      lng: 35.23161,
      lat: 31.85434,
      descriptionEn:
        "David flees to the prophet Samuel; Saul's pursuing messengers fall into prophetic trances.",
      descriptionFr:
        "David se réfugie auprès du prophète Samuel ; les messagers de Saül tombent en transe prophétique.",
      refs: [{ usfm: "1SA", ref: "19:18-24" }],
      source: {
        site: "Al Ram",
        confidence: 474,
        candidates: 6,
        slug: "ramah-4",
      },
    },
    {
      id: "david-nob",
      nameEn: "Nob",
      nameFr: "Nob",
      lng: 35.244167,
      lat: 31.7925,
      descriptionEn:
        "The priest Ahimelech gives David the holy bread and the sword of Goliath.",
      descriptionFr:
        "Le prêtre Achimélec donne à David les pains consacrés et l'épée de Goliath.",
      refs: [{ usfm: "1SA", ref: "21:1-9" }],
      source: {
        site: "Ras el Mesharif",
        confidence: 197,
        candidates: 7,
        slug: "nob",
      },
    },
    {
      id: "david-gath",
      nameEn: "Gath",
      nameFr: "Gath",
      lng: 34.84694,
      lat: 31.69972,
      descriptionEn:
        "Fearing the Philistines, David feigns insanity by scratching on doors and drooling.",
      descriptionFr:
        "Craignant les Philistins, David simule la folie en griffant les portes et en laissant couler sa salive.",
      refs: [{ usfm: "1SA", ref: "21:10-15" }],
      source: {
        site: "Tell es Safi",
        confidence: 850,
        candidates: 6,
        slug: "gath-1",
      },
    },
    {
      id: "david-adullam",
      nameEn: "Cave of Adullam",
      nameFr: "Caverne d'Adullam",
      lng: 35.001667,
      lat: 31.651667,
      descriptionEn:
        "David hides and gathers his family along with a band of 400 outcasts and debtors.",
      descriptionFr:
        "David se cache et rassemble sa famille ainsi qu'une troupe de 400 exclus et endettés.",
      refs: [{ usfm: "1SA", ref: "22:1-2" }],
      source: {
        site: "Khirbet esh Sheikh Madhkur",
        confidence: 737,
        candidates: 2,
        slug: "adullam",
      },
    },
    {
      id: "david-hereth",
      nameEn: "Forest of Hereth",
      nameFr: "Forêt de Héreth",
      lng: 35.043133,
      lat: 31.614106,
      descriptionEn:
        "The prophet Gad instructs David to leave Moab and return to the territory of Judah.",
      descriptionFr:
        "Le prophète Gad ordonne à David de quitter Moab et de revenir au pays de Juda.",
      refs: [{ usfm: "1SA", ref: "22:5" }],
      source: {
        site: "Kharas",
        confidence: 356,
        candidates: 2,
        slug: "hereth",
      },
    },
    {
      id: "david-keilah",
      nameEn: "Keilah",
      nameFr: "Keïla",
      lng: 35.0036,
      lat: 31.6137,
      descriptionEn:
        "David saves the city from Philistines, but flees when he learns the citizens plan to hand him over to Saul.",
      descriptionFr:
        "David délivre la ville des Philistins, mais s'enfuit en apprenant que les habitants veulent le livrer à Saül.",
      refs: [{ usfm: "1SA", ref: "23:1-13" }],
      source: {
        site: "Khirbet Qila",
        confidence: 815,
        candidates: 1,
        slug: "keilah",
      },
    },
    {
      id: "david-ziph",
      nameEn: "Wilderness of Ziph",
      nameFr: "Désert de Ziph",
      lng: 35.13514,
      lat: 31.47475,
      descriptionEn:
        "Jonathan secretly visits David to encourage him; the Ziphites betray David's location.",
      descriptionFr:
        "Jonathan vient secrètement encourager David ; les Ziphiens trahissent sa cachette.",
      refs: [{ usfm: "1SA", ref: "23:14-24" }],
      source: {
        site: "Tell Zif",
        confidence: 1000,
        candidates: 1,
        slug: "wilderness-of-ziph",
      },
    },
    {
      id: "david-en-gedi",
      nameEn: "En Gedi",
      nameFr: "En-Guédi",
      lng: 35.383333,
      lat: 31.45,
      descriptionEn:
        "David hides in a cave and cuts a piece of Saul's robe instead of killing him.",
      descriptionFr:
        "David se cache dans une caverne et coupe un pan du manteau de Saül au lieu de le tuer.",
      refs: [{ usfm: "1SA", ref: "24:1-22" }],
      source: {
        site: "Ein Gedi",
        confidence: 1000,
        candidates: 1,
        slug: "engedi",
      },
    },
    {
      id: "david-maon-carmel",
      nameEn: "Wilderness of Maon / Carmel",
      nameFr: "Désert de Maon / Carmel",
      lng: 35.133839,
      lat: 31.409448,
      descriptionEn:
        "Nabal insults David, but Abigail intervenes with provisions to prevent bloodshed.",
      descriptionFr:
        "Nabal insulte David, mais Abigaïl intervient avec des provisions pour éviter un carnage.",
      refs: [{ usfm: "1SA", ref: "25:1-35" }],
      source: {
        site: "Tel Main",
        confidence: 1000,
        candidates: 1,
        slug: "wilderness-of-maon",
      },
    },
    {
      id: "david-ziklag",
      nameEn: "Ziklag",
      nameFr: "Tsiklag",
      lng: 34.6816,
      lat: 31.3912,
      descriptionEn:
        "Achish grants David this city; Amalekites later raid it, but David pursues them and recovers everything.",
      descriptionFr:
        "Akisch donne cette ville à David ; les Amalécites la pillent plus tard, mais David les poursuit et récupère tout.",
      refs: [
        { usfm: "1SA", ref: "27:1-7" },
        { usfm: "1SA", ref: "30:1-20" },
      ],
      source: {
        site: "Tell esh Sharia",
        confidence: 531,
        candidates: 8,
        slug: "ziklag",
      },
    },
  ],
};

const JESUS: Journey = {
  id: "jesus",
  titleEn: "The Journeys of Jesus",
  titleFr: "Les voyages de Jésus",
  era: "gospels",
  waypoints: [
    {
      id: "jesus-capernaum",
      nameEn: "Capernaum",
      nameFr: "Capernaüm",
      lng: 35.575,
      lat: 32.881111,
      descriptionEn:
        "Jesus begins the final journey to Jerusalem, teaching the disciples about humility and forgiveness.",
      descriptionFr:
        "Jésus entame le dernier voyage vers Jérusalem, enseignant aux disciples l'humilité et le pardon.",
      refs: [{ usfm: "MAT", ref: "18:1-35" }],
      source: {
        site: "Tell Hum",
        confidence: 842,
        candidates: 2,
        slug: "capernaum",
      },
    },
    {
      id: "jesus-perea",
      nameEn: "Perea (Beyond the Jordan)",
      nameFr: "Pérée (au-delà du Jourdain)",
      lng: 35.6167,
      lat: 32,
      descriptionEn:
        'Jesus teaches on divorce, blesses the little children, and speaks with the rich young ruler. No source locates this stop: "Perea" is Josephus\'s name for the region, and the Gospels say only "beyond the Jordan", so this marker is an editorial placement on the east bank rather than an attested site.',
      descriptionFr:
        "Jésus enseigne sur le divorce, bénit les petits enfants et s'entretient avec le jeune homme riche. Aucune source ne situe cette étape : « Pérée » est le nom employé par Josèphe pour la région, et les Évangiles disent seulement « au-delà du Jourdain » ; ce marqueur est donc un placement éditorial sur la rive est, non un site attesté.",
      refs: [
        { usfm: "MAT", ref: "19:1-30" },
        { usfm: "MRK", ref: "10:1-31" },
      ],
    },
    {
      id: "jesus-jericho",
      nameEn: "Jericho",
      nameFr: "Jéricho",
      lng: 35.436238,
      lat: 31.851872,
      descriptionEn:
        "Jesus heals the blind beggar Bartimaeus and invites himself to the house of Zacchaeus the tax collector.",
      descriptionFr:
        "Jésus guérit le mendiant aveugle Bartimée et s'invite chez Zachée le publicain.",
      refs: [
        { usfm: "MRK", ref: "10:46-52" },
        { usfm: "LUK", ref: "19:1-10" },
      ],
      source: {
        site: "Tell el Alayiq",
        confidence: 1000,
        candidates: 1,
        slug: "jericho-2",
      },
    },
    {
      id: "jesus-bethany",
      nameEn: "Bethany",
      nameFr: "Béthanie",
      lng: 35.255903,
      lat: 31.771661,
      descriptionEn:
        "Jesus raises Lazarus from the dead and is anointed with expensive perfume by Mary.",
      descriptionFr:
        "Jésus ressuscite Lazare et reçoit de Marie une onction de parfum de grand prix.",
      refs: [
        { usfm: "JHN", ref: "11:1-44" },
        { usfm: "JHN", ref: "12:1-8" },
      ],
      source: {
        site: "Al Eizariya",
        confidence: 889,
        candidates: 1,
        slug: "bethany-1",
      },
    },
    {
      id: "jesus-bethphage",
      nameEn: "Bethphage (Mount of Olives)",
      nameFr: "Bethphagé (mont des Oliviers)",
      lng: 35.250839,
      lat: 31.777619,
      descriptionEn:
        "Jesus instructs two disciples to retrieve a donkey for the Triumphal Entry.",
      descriptionFr:
        "Jésus envoie deux disciples chercher un ânon pour l'entrée triomphale.",
      refs: [{ usfm: "MAT", ref: "21:1-7" }],
      source: {
        site: "Et Tur",
        confidence: 698,
        candidates: 3,
        slug: "bethphage",
      },
    },
    {
      id: "jesus-jerusalem-temple",
      nameEn: "Jerusalem (The Temple)",
      nameFr: "Jérusalem (le Temple)",
      lng: 35.234167,
      lat: 31.776667,
      descriptionEn:
        "Jesus enters the city, cleanses the temple of moneychangers, and delivers final public teachings.",
      descriptionFr:
        "Jésus entre dans la ville, chasse les changeurs du temple et donne ses derniers enseignements publics.",
      refs: [{ usfm: "MAT", ref: "21:12-23:39" }],
      source: {
        site: "Jerusalem",
        confidence: 1000,
        candidates: 1,
        slug: "jerusalem",
      },
    },
    {
      id: "jesus-gethsemane",
      nameEn: "Gethsemane",
      nameFr: "Gethsémané",
      lng: 35.239425,
      lat: 31.779419,
      descriptionEn:
        "Jesus prays in deep agony, is betrayed by Judas Iscariot, and is arrested.",
      descriptionFr:
        "Jésus prie dans une profonde angoisse, est trahi par Judas Iscariote, puis arrêté.",
      refs: [{ usfm: "MAT", ref: "26:36-56" }],
      source: {
        site: "Gethsemane",
        confidence: 1000,
        candidates: 1,
        slug: "gethsemane",
      },
    },
    {
      id: "jesus-golgotha",
      nameEn: "Golgotha (Calvary)",
      nameFr: "Golgotha (Calvaire)",
      lng: 35.22975,
      lat: 31.778444,
      descriptionEn: "Jesus is crucified, speaks his final words, and dies.",
      descriptionFr: "Jésus est crucifié, prononce ses dernières paroles et meurt.",
      refs: [{ usfm: "MAT", ref: "27:32-50" }],
      source: {
        site: "Church of the Holy Sepulchre",
        confidence: 426,
        candidates: 3,
        slug: "golgotha",
      },
    },
    {
      id: "jesus-empty-tomb",
      nameEn: "The Empty Tomb",
      nameFr: "Le tombeau vide",
      lng: 35.22975,
      lat: 31.778444,
      descriptionEn:
        "Jesus resurrects on the third day and appears to Mary Magdalene and the disciples.",
      descriptionFr:
        "Jésus ressuscite le troisième jour et apparaît à Marie de Magdala puis aux disciples.",
      refs: [
        { usfm: "MAT", ref: "28:1-10" },
        { usfm: "JHN", ref: "20:1-29" },
      ],
      source: {
        site: "Church of the Holy Sepulchre",
        confidence: 426,
        candidates: 3,
        slug: "golgotha",
      },
    },
  ],
};

const JOSHUA: Journey = {
  id: "joshua",
  titleEn: "Joshua's Conquest of Canaan",
  titleFr: "La conquête de Canaan par Josué",
  era: "conquest",
  waypoints: [
    {
      id: "joshua-shittim",
      nameEn: "Shittim (Acacia Grove)",
      nameFr: "Sittim (bois d'acacias)",
      lng: 35.67368,
      lat: 31.84018,
      descriptionEn:
        "Joshua secretly sends two spies into Jericho, where they are hidden by Rahab.",
      descriptionFr:
        "Josué envoie secrètement deux espions à Jéricho, où Rahab les cache.",
      refs: [{ usfm: "JOS", ref: "2:1-24" }],
      source: {
        site: "Tall el Hammam",
        confidence: 671,
        candidates: 3,
        slug: "shittim",
      },
    },
    {
      id: "joshua-jordan",
      nameEn: "Jordan River",
      nameFr: "Le Jourdain",
      lng: 35.558333,
      lat: 31.761389,
      descriptionEn:
        "The priests step into the flooded river, the waters stop flowing, and the nation crosses on dry ground.",
      descriptionFr:
        "Les prêtres entrent dans le fleuve en crue, les eaux s'arrêtent et la nation traverse à sec.",
      refs: [{ usfm: "JOS", ref: "3:1-17" }],
      source: {
        site: "Jordan River",
        confidence: 1000,
        candidates: 1,
        slug: "jordan",
      },
    },
    {
      id: "joshua-gilgal",
      nameEn: "Gilgal",
      nameFr: "Guilgal",
      lng: 35.459969,
      lat: 31.881883,
      descriptionEn:
        "Israelites set up 12 memorial stones, circumcise the males, and celebrate the first Passover in the land.",
      descriptionFr:
        "Les Israélites dressent 12 pierres commémoratives, circoncisent les hommes et célèbrent la première Pâque dans le pays.",
      refs: [{ usfm: "JOS", ref: "4:1-5:12" }],
      source: {
        site: "Khirbet el Mefjir",
        confidence: 556,
        candidates: 6,
        slug: "gilgal-1",
      },
    },
    {
      id: "joshua-jericho",
      nameEn: "Jericho",
      nameFr: "Jéricho",
      lng: 35.444564,
      lat: 31.871719,
      descriptionEn:
        "The Israelites march around the city for seven days, the walls collapse, and the city is destroyed.",
      descriptionFr:
        "Les Israélites tournent autour de la ville pendant sept jours, les murailles s'écroulent et la ville est détruite.",
      refs: [{ usfm: "JOS", ref: "6:1-27" }],
      source: {
        site: "Tell es Sultan",
        confidence: 1000,
        candidates: 1,
        slug: "jericho-1",
      },
    },
    {
      id: "joshua-ai-1",
      nameEn: "Ai (First Attempt)",
      nameFr: "Aï (première tentative)",
      lng: 35.261111,
      lat: 31.916944,
      descriptionEn:
        "The Israelite army is defeated because Achan kept plunder from Jericho.",
      descriptionFr:
        "L'armée d'Israël est vaincue parce qu'Acan a gardé du butin de Jéricho.",
      refs: [{ usfm: "JOS", ref: "7:1-26" }],
      source: {
        site: "Et Tell",
        confidence: 522,
        candidates: 5,
        slug: "ai-1",
      },
    },
    {
      id: "joshua-ai-2",
      nameEn: "Ai (Second Attempt)",
      nameFr: "Aï (seconde tentative)",
      lng: 35.261111,
      lat: 31.916944,
      descriptionEn:
        "Following Achan's execution, Israel successfully ambushes and burns the city.",
      descriptionFr:
        "Après l'exécution d'Acan, Israël tend une embuscade réussie et incendie la ville.",
      refs: [{ usfm: "JOS", ref: "8:1-29" }],
      source: {
        site: "Et Tell",
        confidence: 522,
        candidates: 5,
        slug: "ai-1",
      },
    },
    {
      id: "joshua-ebal-gerizim",
      nameEn: "Mount Ebal / Mount Gerizim",
      nameFr: "Mont Ébal / mont Garizim",
      lng: 35.2733,
      lat: 32.234,
      descriptionEn:
        "Joshua builds a stone altar and reads the blessings and curses of the Law to the nation.",
      descriptionFr:
        "Josué bâtit un autel de pierres et lit à la nation les bénédictions et les malédictions de la Loi.",
      refs: [{ usfm: "JOS", ref: "8:30-35" }],
      source: {
        site: "Mount Ebal",
        confidence: 1000,
        candidates: 1,
        slug: "mount-ebal",
      },
    },
    {
      id: "joshua-gibeon",
      nameEn: "Gibeon",
      nameFr: "Gabaon",
      lng: 35.183351,
      lat: 31.847451,
      descriptionEn:
        "The Gibeonites trick Joshua into a peace treaty; Joshua later defends them from an alliance, and the sun stands still.",
      descriptionFr:
        "Les Gabaonites obtiennent un traité de paix par ruse ; Josué les défend ensuite contre une coalition, et le soleil s'arrête.",
      refs: [{ usfm: "JOS", ref: "9:1-10:15" }],
      source: {
        site: "El Jib",
        confidence: 912,
        candidates: 1,
        slug: "gibeon",
      },
    },
    {
      id: "joshua-makkedah",
      nameEn: "Makkedah",
      nameFr: "Makkéda",
      lng: 34.966564,
      lat: 31.534716,
      descriptionEn:
        "Joshua corners five enemy kings in a cave and executes them, securing the southern region.",
      descriptionFr:
        "Josué enferme cinq rois ennemis dans une caverne et les met à mort, sécurisant la région sud.",
      refs: [{ usfm: "JOS", ref: "10:16-28" }],
      source: {
        site: "Khirbet el Qom",
        confidence: 440,
        candidates: 6,
        slug: "makkedah",
      },
    },
    {
      id: "joshua-merom",
      nameEn: "Waters of Merom",
      nameFr: "Eaux de Mérom",
      lng: 35.437778,
      lat: 32.978889,
      descriptionEn:
        "Joshua launches a surprise attack against a massive northern coalition led by Jabin of Hazor, burning their chariots.",
      descriptionFr:
        "Josué lance une attaque surprise contre une vaste coalition du nord menée par Jabin de Hatsor et brûle leurs chars.",
      refs: [{ usfm: "JOS", ref: "11:1-15" }],
      source: {
        site: "En Meron",
        confidence: 77,
        candidates: 10,
        slug: "waters-of-merom",
      },
    },
  ],
};

const ARK: Journey = {
  id: "ark",
  titleEn: "Trajectory of the Ark of the Covenant",
  titleFr: "Le parcours de l'arche de l'alliance",
  era: "monarchy",
  waypoints: [
    {
      id: "ark-shiloh",
      nameEn: "Shiloh",
      nameFr: "Silo",
      lng: 35.289536,
      lat: 32.055703,
      descriptionEn:
        "The tabernacle's semi-permanent location where the Ark rested during the era of the Judges.",
      descriptionFr:
        "Le lieu semi-permanent du tabernacle, où l'arche reposait à l'époque des Juges.",
      refs: [
        { usfm: "1SA", ref: "3:1-3" },
        { usfm: "1SA", ref: "4:3" },
      ],
      source: {
        site: "Khirbet Seilun",
        confidence: 1000,
        candidates: 1,
        slug: "shiloh",
      },
    },
    {
      id: "ark-ebenezer",
      nameEn: "Ebenezer (Battlefield)",
      nameFr: "Ében-Ézer (champ de bataille)",
      lng: 34.9645,
      lat: 32.1046,
      descriptionEn:
        "The Israelites foolishly bring the Ark into battle; the Philistines defeat them and capture it.",
      descriptionFr:
        "Les Israélites emmènent imprudemment l'arche au combat ; les Philistins les battent et s'en emparent.",
      refs: [{ usfm: "1SA", ref: "4:1-11" }],
      source: {
        site: "Izbet Sartah",
        confidence: 589,
        candidates: 2,
        slug: "ebenezer-1",
      },
    },
    {
      id: "ark-ashdod",
      nameEn: "Ashdod",
      nameFr: "Asdod",
      lng: 34.6578,
      lat: 31.7572,
      descriptionEn:
        "The Ark is placed in the temple of Dagon; the idol repeatedly falls over, and the citizens are struck with tumors.",
      descriptionFr:
        "L'arche est placée dans le temple de Dagon ; l'idole tombe à plusieurs reprises et les habitants sont frappés de tumeurs.",
      refs: [{ usfm: "1SA", ref: "5:1-8" }],
      source: {
        site: "Tel Ashdod",
        confidence: 1000,
        candidates: 1,
        slug: "ashdod",
      },
    },
    {
      id: "ark-gath",
      nameEn: "Gath",
      nameFr: "Gath",
      lng: 34.84694,
      lat: 31.69972,
      descriptionEn:
        "The Philistines move the Ark here, triggering deadly panic and plagues among the people.",
      descriptionFr:
        "Les Philistins y transportent l'arche, déclenchant une panique mortelle et des fléaux parmi le peuple.",
      refs: [{ usfm: "1SA", ref: "5:8-9" }],
      source: {
        site: "Tell es Safi",
        confidence: 850,
        candidates: 6,
        slug: "gath-1",
      },
    },
    {
      id: "ark-ekron",
      nameEn: "Ekron",
      nameFr: "Ékron",
      lng: 34.851944,
      lat: 31.7775,
      descriptionEn:
        "The desperate citizens demand the Ark be removed to stop the destruction of their city.",
      descriptionFr:
        "Les habitants désespérés exigent le renvoi de l'arche pour arrêter la destruction de leur ville.",
      refs: [{ usfm: "1SA", ref: "5:10-12" }],
      source: {
        site: "Tel Miqne",
        confidence: 1000,
        candidates: 1,
        slug: "ekron",
      },
    },
    {
      id: "ark-beth-shemesh",
      nameEn: "Beth Shemesh",
      nameFr: "Beth-Schémesch",
      lng: 34.974744,
      lat: 31.750621,
      descriptionEn:
        "The Philistines return the Ark on a cart pulled by cows; seventy Israelites are struck dead for looking inside it.",
      descriptionFr:
        "Les Philistins renvoient l'arche sur un chariot tiré par des vaches ; soixante-dix Israélites meurent pour avoir regardé dedans.",
      refs: [{ usfm: "1SA", ref: "6:1-21" }],
      source: {
        site: "Tel Bet Shemesh",
        confidence: 864,
        candidates: 1,
        slug: "beth-shemesh-1",
      },
    },
    {
      id: "ark-kiriath-jearim",
      nameEn: "Kiriath Jearim",
      nameFr: "Kirjath-Jearim",
      lng: 35.10378,
      lat: 31.808957,
      descriptionEn:
        "The Ark is moved to the house of Abinadab, where it remains for 20 years.",
      descriptionFr:
        "L'arche est transportée dans la maison d'Abinadab, où elle demeure 20 ans.",
      refs: [{ usfm: "1SA", ref: "7:1-2" }],
      source: {
        site: "Deir el Azar",
        confidence: 1000,
        candidates: 1,
        slug: "kiriath-jearim",
      },
    },
    {
      id: "ark-perez-uzzah",
      nameEn: "Perez Uzzah",
      nameFr: "Pérets-Uzza",
      lng: 35.234167,
      lat: 31.776667,
      descriptionEn:
        "While David transports the Ark on a cart, the oxen stumble, Uzzah touches the Ark to steady it, and is struck dead. Sources place the threshing floor within a kilometre of Jerusalem but no closer, so the exact spot is unknown.",
      descriptionFr:
        "Pendant que David transporte l'arche sur un chariot, les bœufs bronchent ; Uzza touche l'arche pour la retenir et meurt sur le coup. Les sources situent l'aire de battage à moins d'un kilomètre de Jérusalem, sans plus de précision : l'emplacement exact reste inconnu.",
      refs: [{ usfm: "2SA", ref: "6:1-8" }],
      source: {
        site: "Jerusalem",
        confidence: 1000,
        candidates: 1,
        slug: "perez-uzzah",
      },
    },
    {
      id: "ark-obed-edom",
      nameEn: "House of Obed-Edom",
      nameFr: "Maison d'Obed-Édom",
      lng: 35.17,
      lat: 31.79,
      descriptionEn:
        "David leaves the Ark here out of fear; it stays for three months and heavily blesses Obed-Edom's household. No source locates this stop: Scripture never says where Obed-Edom's house stood, only that it lay on the road between Kiriath Jearim and Jerusalem, so this marker is an editorial placement.",
      descriptionFr:
        "David y laisse l'arche par crainte ; elle y reste trois mois et bénit abondamment la maison d'Obed-Édom. Aucune source ne situe cette étape : l'Écriture ne dit pas où se trouvait la maison d'Obed-Édom, seulement qu'elle était sur la route entre Kirjath-Jearim et Jérusalem ; ce marqueur est donc un placement éditorial.",
      refs: [{ usfm: "2SA", ref: "6:9-11" }],
    },
    {
      id: "ark-city-of-david",
      nameEn: "Jerusalem (City of David)",
      nameFr: "Jérusalem (cité de David)",
      lng: 35.235556,
      lat: 31.773611,
      descriptionEn:
        "David successfully brings the Ark into the capital with sacrifices and joyous dancing.",
      descriptionFr:
        "David fait enfin monter l'arche dans la capitale, avec des sacrifices et des danses joyeuses.",
      refs: [{ usfm: "2SA", ref: "6:12-19" }],
      source: {
        site: "City of David",
        confidence: 1000,
        candidates: 1,
        slug: "city-of-david",
      },
    },
    {
      id: "ark-solomons-temple",
      nameEn: "Solomon's Temple",
      nameFr: "Le temple de Salomon",
      lng: 35.235556,
      lat: 31.777778,
      descriptionEn:
        "The Ark is permanently installed in the Holy of Holies, and the glory of the Lord fills the temple.",
      descriptionFr:
        "L'arche est installée à demeure dans le Saint des saints, et la gloire de l'Éternel remplit le temple.",
      refs: [{ usfm: "1KI", ref: "8:1-11" }],
      source: {
        site: "Mount Moriah",
        confidence: 325,
        candidates: 7,
        slug: "moriah",
      },
    },
  ],
};

const PAUL_1: Journey = {
  id: "paul-1",
  titleEn: "Paul's 1st Missionary Journey",
  titleFr: "Premier voyage missionnaire de Paul",
  era: "acts",
  waypoints: [
    {
      id: "paul1-antioch-syria",
      nameEn: "Antioch (Syria)",
      nameFr: "Antioche (Syrie)",
      lng: 36.171743,
      lat: 36.226691,
      descriptionEn:
        "The Holy Spirit calls Barnabas and Saul; the church fasts, prays, and sends them off.",
      descriptionFr:
        "Le Saint-Esprit appelle Barnabas et Saul ; l'église jeûne, prie et les envoie.",
      refs: [{ usfm: "ACT", ref: "13:1-3" }],
      source: {
        site: "Antioch on the Orontes",
        confidence: 1000,
        candidates: 1,
        slug: "antioch-1",
      },
    },
    {
      id: "paul1-seleucia",
      nameEn: "Seleucia",
      nameFr: "Séleucie",
      lng: 35.922,
      lat: 36.124,
      descriptionEn:
        "The coastal port city where Paul and Barnabas board a ship for Cyprus.",
      descriptionFr:
        "Le port côtier où Paul et Barnabas embarquent pour Chypre.",
      refs: [{ usfm: "ACT", ref: "13:4" }],
      source: {
        site: "Seleucia Pieria",
        confidence: 1000,
        candidates: 1,
        slug: "seleucia",
      },
    },
    {
      id: "paul1-salamis",
      nameEn: "Salamis (Cyprus)",
      nameFr: "Salamine (Chypre)",
      lng: 33.901944,
      lat: 35.184944,
      descriptionEn:
        "Paul and Barnabas begin preaching the word of God in the Jewish synagogues.",
      descriptionFr:
        "Paul et Barnabas commencent à annoncer la parole de Dieu dans les synagogues juives.",
      refs: [{ usfm: "ACT", ref: "13:5" }],
      source: {
        site: "Salamis",
        confidence: 1000,
        candidates: 1,
        slug: "salamis",
      },
    },
    {
      id: "paul1-paphos",
      nameEn: "Paphos",
      nameFr: "Paphos",
      lng: 32.404167,
      lat: 34.755667,
      descriptionEn:
        "Paul blinds Elymas the sorcerer, leading the Roman proconsul Sergius Paulus to believe.",
      descriptionFr:
        "Paul frappe de cécité le magicien Élymas, ce qui amène le proconsul romain Sergius Paulus à croire.",
      refs: [{ usfm: "ACT", ref: "13:6-12" }],
      source: {
        site: "New Paphos",
        confidence: 1000,
        candidates: 1,
        slug: "paphos",
      },
    },
    {
      id: "paul1-perga",
      nameEn: "Perga (Pamphylia)",
      nameFr: "Perge (Pamphylie)",
      lng: 30.853686,
      lat: 36.960353,
      descriptionEn:
        "John Mark abruptly leaves the mission group to return to Jerusalem.",
      descriptionFr:
        "Jean-Marc quitte brusquement l'équipe missionnaire pour retourner à Jérusalem.",
      refs: [{ usfm: "ACT", ref: "13:13" }],
      source: {
        site: "Perga",
        confidence: 1000,
        candidates: 1,
        slug: "perga",
      },
    },
    {
      id: "paul1-antioch-pisidia",
      nameEn: "Antioch (Pisidia)",
      nameFr: "Antioche (Pisidie)",
      lng: 31.189167,
      lat: 38.306111,
      descriptionEn:
        "Paul preaches a major sermon; many Gentiles believe, but jealous Jews expel them from the region.",
      descriptionFr:
        "Paul prononce un grand discours ; beaucoup de païens croient, mais des Juifs jaloux les chassent de la région.",
      refs: [{ usfm: "ACT", ref: "13:14-52" }],
      source: {
        site: "Antioch in Pisidia",
        confidence: 1000,
        candidates: 1,
        slug: "antioch-2",
      },
    },
    {
      id: "paul1-iconium",
      nameEn: "Iconium",
      nameFr: "Iconium",
      lng: 32.492331,
      lat: 37.872202,
      descriptionEn:
        "A great number believe the Gospel, but a violent plot to stone the apostles forces them to flee.",
      descriptionFr:
        "Un grand nombre croient à l'Évangile, mais un complot violent visant à lapider les apôtres les force à fuir.",
      refs: [{ usfm: "ACT", ref: "14:1-7" }],
      source: {
        site: "Konya",
        confidence: 1000,
        candidates: 1,
        slug: "iconium",
      },
    },
    {
      id: "paul1-lystra",
      nameEn: "Lystra",
      nameFr: "Lystre",
      lng: 32.3384,
      lat: 37.6017,
      descriptionEn:
        "Paul heals a lame man, causing locals to worship them as Zeus and Hermes; Paul is later stoned and left for dead.",
      descriptionFr:
        "Paul guérit un boiteux, si bien que les habitants les adorent comme Zeus et Hermès ; Paul est ensuite lapidé et laissé pour mort.",
      refs: [{ usfm: "ACT", ref: "14:8-20" }],
      source: {
        site: "Tel Lystra",
        confidence: 1000,
        candidates: 1,
        slug: "lystra",
      },
    },
    {
      id: "paul1-derbe",
      nameEn: "Derbe",
      nameFr: "Derbe",
      lng: 33.361453,
      lat: 37.348569,
      descriptionEn:
        "Paul and Barnabas preach the gospel here and win a large number of disciples without incident.",
      descriptionFr:
        "Paul et Barnabas y prêchent l'Évangile et font un grand nombre de disciples sans incident.",
      refs: [{ usfm: "ACT", ref: "14:20-21" }],
      source: {
        site: "Kerti Hüyük",
        confidence: 860,
        candidates: 3,
        slug: "derbe",
      },
    },
    {
      id: "paul1-return",
      nameEn: "Return via Lystra, Iconium, Pisidian Antioch",
      nameFr: "Retour par Lystre, Iconium et Antioche de Pisidie",
      lng: 32.492331,
      lat: 37.872202,
      descriptionEn:
        "The apostles retrace their dangerous steps to strengthen the new churches and appoint elders. This stop stands for the whole return leg rather than one site, so it carries no source of its own; the marker sits on Iconium, the middle of the three cities.",
      descriptionFr:
        "Les apôtres refont leur dangereux trajet pour affermir les nouvelles églises et établir des anciens. Cette étape représente tout le trajet de retour plutôt qu'un seul site et ne possède donc pas de source propre ; le marqueur est posé sur Iconium, la ville médiane des trois.",
      refs: [{ usfm: "ACT", ref: "14:21-26" }],
    },
    {
      id: "paul1-antioch-return",
      nameEn: "Antioch (Syria)",
      nameFr: "Antioche (Syrie)",
      lng: 36.171743,
      lat: 36.226691,
      descriptionEn:
        "They return to their home church, reporting how God had opened a door of faith to the Gentiles.",
      descriptionFr:
        "Ils retournent à leur église d'envoi et racontent comment Dieu a ouvert aux païens la porte de la foi.",
      refs: [{ usfm: "ACT", ref: "14:26-28" }],
      source: {
        site: "Antioch on the Orontes",
        confidence: 1000,
        candidates: 1,
        slug: "antioch-1",
      },
    },
  ],
};

const PAUL_2: Journey = {
  id: "paul-2",
  titleEn: "Paul's 2nd Missionary Journey",
  titleFr: "Deuxième voyage missionnaire de Paul",
  era: "acts",
  waypoints: [
    {
      id: "paul2-antioch-syria",
      nameEn: "Antioch (Syria)",
      nameFr: "Antioche (Syrie)",
      lng: 36.171743,
      lat: 36.226691,
      descriptionEn:
        "Paul and Barnabas heavily disagree over taking John Mark and separate; Paul chooses Silas.",
      descriptionFr:
        "Paul et Barnabas se divisent violemment au sujet de Jean-Marc et se séparent ; Paul choisit Silas.",
      refs: [{ usfm: "ACT", ref: "15:36-41" }],
      source: {
        site: "Antioch on the Orontes",
        confidence: 1000,
        candidates: 1,
        slug: "antioch-1",
      },
    },
    {
      id: "paul2-derbe-lystra",
      nameEn: "Derbe and Lystra",
      nameFr: "Derbe et Lystre",
      lng: 32.3384,
      lat: 37.6017,
      descriptionEn:
        "Paul recruits Timothy to join the mission and circumcises him to appease the local Jews.",
      descriptionFr:
        "Paul recrute Timothée pour la mission et le circoncit afin de ménager les Juifs de la région.",
      refs: [{ usfm: "ACT", ref: "16:1-5" }],
      source: {
        site: "Tel Lystra",
        confidence: 1000,
        candidates: 1,
        slug: "lystra",
      },
    },
    {
      id: "paul2-troas",
      nameEn: "Troas",
      nameFr: "Troas",
      lng: 26.158611,
      lat: 39.751944,
      descriptionEn:
        'Paul receives a nighttime vision of a man begging him to "come over to Macedonia and help us."',
      descriptionFr:
        "Paul reçoit de nuit la vision d'un homme le suppliant de « passer en Macédoine et de venir à leur secours ».",
      refs: [{ usfm: "ACT", ref: "16:8-10" }],
      source: {
        site: "Alexandria Troas",
        confidence: 1000,
        candidates: 1,
        slug: "troas",
      },
    },
    {
      id: "paul2-philippi",
      nameEn: "Philippi",
      nameFr: "Philippes",
      lng: 24.284576,
      lat: 41.012072,
      descriptionEn:
        "Lydia is converted; Paul casts out a demon, is beaten and imprisoned, an earthquake strikes, and the jailer is saved.",
      descriptionFr:
        "Lydie se convertit ; Paul chasse un démon, est battu et emprisonné, un séisme survient et le geôlier est sauvé.",
      refs: [{ usfm: "ACT", ref: "16:11-40" }],
      source: {
        site: "Philippi",
        confidence: 1000,
        candidates: 1,
        slug: "philippi",
      },
    },
    {
      id: "paul2-thessalonica",
      nameEn: "Thessalonica",
      nameFr: "Thessalonique",
      lng: 22.945767,
      lat: 40.637771,
      descriptionEn:
        "Paul reasons in the synagogue for three weeks; an angry mob attacks the house of Jason.",
      descriptionFr:
        "Paul discute trois semaines dans la synagogue ; une foule en colère attaque la maison de Jason.",
      refs: [{ usfm: "ACT", ref: "17:1-9" }],
      source: {
        site: "Thessaloniki",
        confidence: 1000,
        candidates: 1,
        slug: "thessalonica",
      },
    },
    {
      id: "paul2-berea",
      nameEn: "Berea",
      nameFr: "Bérée",
      lng: 22.2,
      lat: 40.518333,
      descriptionEn:
        "The Berean Jews are commended for eagerly examining the Scriptures daily to verify Paul's teachings.",
      descriptionFr:
        "Les Juifs de Bérée sont loués pour avoir examiné chaque jour les Écritures afin de vérifier l'enseignement de Paul.",
      refs: [{ usfm: "ACT", ref: "17:10-14" }],
      source: {
        site: "Veria",
        confidence: 1000,
        candidates: 1,
        slug: "berea",
      },
    },
    {
      id: "paul2-athens",
      nameEn: "Athens",
      nameFr: "Athènes",
      lng: 23.726738,
      lat: 37.971851,
      descriptionEn:
        'Deeply distressed by idols, Paul debates philosophers and preaches the "Unknown God" at the Areopagus.',
      descriptionFr:
        "Profondément troublé par les idoles, Paul débat avec les philosophes et prêche le « Dieu inconnu » à l'Aréopage.",
      refs: [{ usfm: "ACT", ref: "17:15-34" }],
      source: {
        site: "Athens",
        confidence: 1000,
        candidates: 1,
        slug: "athens",
      },
    },
    {
      id: "paul2-corinth",
      nameEn: "Corinth",
      nameFr: "Corinthe",
      lng: 22.878741,
      lat: 37.905785,
      descriptionEn:
        "Paul meets Aquila and Priscilla, works as a tentmaker, and preaches for a year and a half despite Jewish opposition.",
      descriptionFr:
        "Paul rencontre Aquilas et Priscille, travaille comme fabricant de tentes et prêche un an et demi malgré l'opposition juive.",
      refs: [{ usfm: "ACT", ref: "18:1-17" }],
      source: {
        site: "Corinth",
        confidence: 1000,
        candidates: 1,
        slug: "corinth",
      },
    },
    {
      id: "paul2-ephesus",
      nameEn: "Ephesus",
      nameFr: "Éphèse",
      lng: 27.3407,
      lat: 37.939125,
      descriptionEn:
        "Paul makes a brief stop, reasons in the synagogue, but declines to stay, promising to return.",
      descriptionFr:
        "Paul fait une brève halte, discute dans la synagogue, mais refuse de rester en promettant de revenir.",
      refs: [{ usfm: "ACT", ref: "18:19-21" }],
      source: {
        site: "Ephesus",
        confidence: 1000,
        candidates: 1,
        slug: "ephesus",
      },
    },
    {
      id: "paul2-caesarea-jerusalem",
      nameEn: "Caesarea & Jerusalem",
      nameFr: "Césarée et Jérusalem",
      lng: 34.891667,
      lat: 32.5,
      descriptionEn:
        "Paul lands at the port, travels up to greet the church in Jerusalem, and completes the loop.",
      descriptionFr:
        "Paul débarque au port, monte saluer l'église de Jérusalem et achève la boucle.",
      refs: [{ usfm: "ACT", ref: "18:22" }],
      source: {
        site: "Caesarea Maritima",
        confidence: 1000,
        candidates: 1,
        slug: "caesarea",
      },
    },
    {
      id: "paul2-antioch-return",
      nameEn: "Antioch (Syria)",
      nameFr: "Antioche (Syrie)",
      lng: 36.171743,
      lat: 36.226691,
      descriptionEn:
        "Paul arrives back at his sending church, concluding the second journey.",
      descriptionFr:
        "Paul revient à son église d'envoi, concluant le deuxième voyage.",
      refs: [{ usfm: "ACT", ref: "18:22" }],
      source: {
        site: "Antioch on the Orontes",
        confidence: 1000,
        candidates: 1,
        slug: "antioch-1",
      },
    },
  ],
};

const PAUL_3: Journey = {
  id: "paul-3",
  titleEn: "Paul's 3rd Missionary Journey",
  titleFr: "Troisième voyage missionnaire de Paul",
  era: "acts",
  waypoints: [
    {
      id: "paul3-antioch-syria",
      nameEn: "Antioch (Syria)",
      nameFr: "Antioche (Syrie)",
      lng: 36.171743,
      lat: 36.226691,
      descriptionEn:
        "Paul departs his home base once more to travel through the interior regions.",
      descriptionFr:
        "Paul quitte une fois de plus sa base pour parcourir les régions de l'intérieur.",
      refs: [{ usfm: "ACT", ref: "18:23" }],
      source: {
        site: "Antioch on the Orontes",
        confidence: 1000,
        candidates: 1,
        slug: "antioch-1",
      },
    },
    {
      id: "paul3-galatia-phrygia",
      nameEn: "Galatia and Phrygia",
      nameFr: "Galatie et Phrygie",
      lng: 32.983333,
      lat: 39.266667,
      descriptionEn:
        "Paul moves systematically from place to place, strengthening all the established disciples.",
      descriptionFr:
        "Paul se déplace méthodiquement de lieu en lieu, affermissant tous les disciples déjà établis.",
      refs: [{ usfm: "ACT", ref: "18:23" }],
      source: {
        site: "Galatia",
        confidence: 1000,
        candidates: 1,
        slug: "galatia",
      },
    },
    {
      id: "paul3-ephesus",
      nameEn: "Ephesus",
      nameFr: "Éphèse",
      lng: 27.3407,
      lat: 37.939125,
      descriptionEn:
        "Paul stays for over two years; spectacular miracles occur, magic scrolls are burned, and Demetrius incites a massive riot in the theater.",
      descriptionFr:
        "Paul y reste plus de deux ans ; des miracles spectaculaires ont lieu, des livres de magie sont brûlés, et Démétrius provoque une immense émeute au théâtre.",
      refs: [{ usfm: "ACT", ref: "19:1-41" }],
      source: {
        site: "Ephesus",
        confidence: 1000,
        candidates: 1,
        slug: "ephesus",
      },
    },
    {
      id: "paul3-macedonia-greece",
      nameEn: "Macedonia & Greece (Corinth)",
      nameFr: "Macédoine et Grèce (Corinthe)",
      lng: 22.878741,
      lat: 37.905785,
      descriptionEn:
        "Paul spends three months encouraging the believers; an assassination plot forces him to change his travel route.",
      descriptionFr:
        "Paul passe trois mois à encourager les croyants ; un complot d'assassinat le force à modifier son itinéraire.",
      refs: [{ usfm: "ACT", ref: "20:1-3" }],
      source: {
        site: "Corinth",
        confidence: 1000,
        candidates: 1,
        slug: "corinth",
      },
    },
    {
      id: "paul3-troas",
      nameEn: "Troas",
      nameFr: "Troas",
      lng: 26.158611,
      lat: 39.751944,
      descriptionEn:
        "Paul preaches until midnight; a young man named Eutychus falls from a third-story window, dies, and is resurrected by Paul.",
      descriptionFr:
        "Paul prêche jusqu'à minuit ; un jeune homme nommé Eutychus tombe d'une fenêtre du troisième étage, meurt, et Paul le ressuscite.",
      refs: [{ usfm: "ACT", ref: "20:6-12" }],
      source: {
        site: "Alexandria Troas",
        confidence: 1000,
        candidates: 1,
        slug: "troas",
      },
    },
    {
      id: "paul3-miletus",
      nameEn: "Miletus",
      nameFr: "Milet",
      lng: 27.275556,
      lat: 37.531111,
      descriptionEn:
        'Paul summons the Ephesian elders, warning them of "fierce wolves" in a tearful, final farewell address.',
      descriptionFr:
        "Paul convoque les anciens d'Éphèse et les avertit des « loups cruels » dans un adieu final empreint de larmes.",
      refs: [{ usfm: "ACT", ref: "20:15-38" }],
      source: {
        site: "Miletus",
        confidence: 1000,
        candidates: 1,
        slug: "miletus",
      },
    },
    {
      id: "paul3-tyre",
      nameEn: "Tyre",
      nameFr: "Tyr",
      lng: 35.196111,
      lat: 33.270833,
      descriptionEn:
        "The ship unloads cargo; local believers urgently warn Paul through the Spirit not to proceed to Jerusalem.",
      descriptionFr:
        "Le navire décharge sa cargaison ; les croyants du lieu, par l'Esprit, pressent Paul de ne pas monter à Jérusalem.",
      refs: [{ usfm: "ACT", ref: "21:1-6" }],
      source: {
        site: "Tyre",
        confidence: 1000,
        candidates: 1,
        slug: "tyre",
      },
    },
    {
      id: "paul3-caesarea",
      nameEn: "Caesarea",
      nameFr: "Césarée",
      lng: 34.891667,
      lat: 32.5,
      descriptionEn:
        "The prophet Agabus ties his own hands and feet with Paul's belt, predicting Paul's imminent arrest.",
      descriptionFr:
        "Le prophète Agabus se lie les mains et les pieds avec la ceinture de Paul, annonçant son arrestation imminente.",
      refs: [{ usfm: "ACT", ref: "21:8-14" }],
      source: {
        site: "Caesarea Maritima",
        confidence: 1000,
        candidates: 1,
        slug: "caesarea",
      },
    },
    {
      id: "paul3-jerusalem",
      nameEn: "Jerusalem",
      nameFr: "Jérusalem",
      lng: 35.234167,
      lat: 31.776667,
      descriptionEn:
        "Paul arrives, meets with James, and is recognized in the temple, leading to a violent mob and his arrest by Roman soldiers.",
      descriptionFr:
        "Paul arrive, rencontre Jacques, et est reconnu dans le temple, ce qui déclenche une émeute et son arrestation par les soldats romains.",
      refs: [{ usfm: "ACT", ref: "21:15-36" }],
      source: {
        site: "Jerusalem",
        confidence: 1000,
        candidates: 1,
        slug: "jerusalem",
      },
    },
  ],
};

export const JOURNEYS: Journey[] = [
  EXODUS,
  ABRAHAM,
  DAVID,
  JESUS,
  JOSHUA,
  ARK,
  PAUL_1,
  PAUL_2,
  PAUL_3,
];

export function getJourneyById(id: string): Journey | undefined {
  return JOURNEYS.find((journey) => journey.id === id);
}
