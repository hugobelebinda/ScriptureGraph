/**
 * Forty biblical cities and the events that happened in them, for the Cities page.
 *
 * The point of this file is restraint. Jerusalem alone is named in 955 verses, so an
 * exhaustive list would be unreadable; every city here is a deliberate selection and
 * says so through `curated`. Three things keep the reading load down:
 *
 *  - `weight` ranks each event. Only `headline` events carry prose, and the page shows
 *    those by default. `notable` and `reference` events stay behind a disclosure.
 *  - `reference` events are a label and a verse range, nothing more. Their scripture
 *    text is fetched from the backend on demand rather than being authored here.
 *  - EVENT_BUDGET caps the total per tier, reference events included.
 *
 * Coordinates and `source` come from the OpenBible.info Bible Geocoding dataset
 * (CC BY 4.0, https://github.com/openbibleinfo/Bible-Geocoding-Data), the same
 * provenance the Journey Visualizer uses. Run `scripts/seed-cities.ts` to re-derive
 * them and `scripts/verify-cities.ts` to check this file for consistency.
 */

import type { ScriptureRef, WaypointSource } from "./journeysData";
import { ASIA_MINOR, GREECE_ROME, MESOPOTAMIA, SYRIA } from "./citiesEast";
import { COAST, GALILEE } from "./citiesRest";

export type CityTier = "primary" | "major" | "notable" | "minor";

/** How much of the page an event earns. Only `headline` events get authored prose. */
export type EventWeight = "headline" | "notable" | "reference";

export type CityPeriod =
  | "patriarchs"
  | "exodusConquest"
  | "judges"
  | "unitedMonarchy"
  | "dividedMonarchy"
  | "exileReturn"
  | "gospels"
  | "earlyChurch";

export type CityRegion =
  | "judea"
  | "jordanValley"
  | "samaria"
  | "galilee"
  | "coast"
  | "syria"
  | "mesopotamia"
  | "asiaMinor"
  | "greeceRome";

/** Narrative order, which is also the order the page renders period sections in. */
export const CITY_PERIODS: CityPeriod[] = [
  "patriarchs",
  "exodusConquest",
  "judges",
  "unitedMonarchy",
  "dividedMonarchy",
  "exileReturn",
  "gospels",
  "earlyChurch",
];

/** Roughly north-to-south, then outward from the land. */
export const CITY_REGIONS: CityRegion[] = [
  "judea",
  "jordanValley",
  "samaria",
  "galilee",
  "coast",
  "syria",
  "mesopotamia",
  "asiaMinor",
  "greeceRome",
];

/**
 * Hard caps on the total event count per tier, not targets to fill. A city at its
 * maximum is by definition showing a selection, so `verify-cities.ts` requires it to
 * be marked `curated`.
 */
export const EVENT_BUDGET: Record<CityTier, { min: number; max: number }> = {
  primary: { min: 16, max: 25 },
  major: { min: 8, max: 15 },
  notable: { min: 5, max: 10 },
  // A minimum of one, because places like Emmaus really do appear once.
  minor: { min: 1, max: 6 },
};

export type CityEvent = {
  id: string;
  period: CityPeriod;
  weight: EventWeight;
  /** The row label, always written in both languages. */
  labelEn: string;
  labelFr: string;
  /** Headline events only. Everything else is label plus references. */
  descriptionEn?: string;
  descriptionFr?: string;
  refs: ScriptureRef[];
};

export type City = {
  id: string;
  nameEn: string;
  nameFr: string;
  lng: number;
  lat: number;
  tier: CityTier;
  region: CityRegion;
  /** One line of "what this place is", always written. */
  blurbEn: string;
  blurbFr: string;
  source?: WaypointSource;
  /**
   * True when `events` is a selection rather than a full record, which is the case
   * for every city dense enough to overflow its budget. The page then shows a note
   * saying so, worded by tier unless overridden below.
   */
  curated?: boolean;
  coverageNoteEn?: string;
  coverageNoteFr?: string;
  events: CityEvent[];
};

const JUDEA: City[] = [
  {
    id: "jerusalem",
    nameEn: "Jerusalem",
    nameFr: "Jérusalem",
    lng: 35.234167,
    lat: 31.776667,
    tier: "primary",
    region: "judea",
    blurbEn:
      "A Jebusite hill fort that David turned into the capital of Israel, and the city where the temple stood, fell, rose again, and where the church began.",
    blurbFr:
      "Une forteresse jébusienne dont David fit la capitale d'Israël, et la ville où le temple fut bâti, détruit, puis relevé, et où l'Église est née.",
    source: {
      site: "Jerusalem",
      confidence: 1000,
      candidates: 1,
      slug: "jerusalem",
    },
    curated: true,
    events: [
      {
        id: "jerusalem-melchizedek",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Melchizedek, king of Salem, blesses Abram",
        labelFr: "Melchisédek, roi de Salem, bénit Abram",
        refs: [{ usfm: "GEN", ref: "14:17-24" }],
      },
      {
        id: "jerusalem-moriah",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Abraham is stopped from sacrificing Isaac on Moriah",
        labelFr: "Abraham est arrêté avant de sacrifier Isaac sur Moriah",
        refs: [
          { usfm: "GEN", ref: "22:1-19" },
          { usfm: "2CH", ref: "3:1" },
        ],
      },
      {
        id: "jerusalem-adoni-zedek",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "Its king leads five kings against Gibeon and loses",
        labelFr: "Son roi mène cinq rois contre Gabaon et perd",
        refs: [{ usfm: "JOS", ref: "10:1-27" }],
      },
      {
        id: "jerusalem-jebusites-hold",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "Judah burns the city, but the Jebusites keep the citadel",
        labelFr: "Juda brûle la ville, mais les Jébusiens gardent la citadelle",
        refs: [
          { usfm: "JOS", ref: "15:63" },
          { usfm: "JDG", ref: "1:8" },
        ],
      },
      {
        id: "jerusalem-david-captures",
        period: "unitedMonarchy",
        weight: "headline",
        labelEn: "David captures the stronghold of Zion",
        labelFr: "David s'empare de la forteresse de Sion",
        descriptionEn:
          "The Jebusites are so confident in their walls that they taunt David with the blind and the lame manning them. Joab goes up the water shaft anyway. David makes the captured stronghold his residence, and a city that had belonged to no tribe becomes the capital of all twelve.",
        descriptionFr:
          "Les Jébusiens se croient si bien protégés par leurs murailles qu'ils raillent David en y postant les aveugles et les boiteux. Joab passe malgré tout par le canal d'eau. David fait de la forteresse conquise sa résidence, et une ville qui n'appartenait à aucune tribu devient la capitale des douze.",
        refs: [
          { usfm: "2SA", ref: "5:6-10" },
          { usfm: "1CH", ref: "11:4-9" },
        ],
      },
      {
        id: "jerusalem-uzzah",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "Uzzah dies steadying the ark on the road up",
        labelFr: "Uzza meurt en retenant l'arche sur la montée",
        refs: [{ usfm: "2SA", ref: "6:1-8" }],
      },
      {
        id: "jerusalem-ark-arrives",
        period: "unitedMonarchy",
        weight: "notable",
        labelEn: "The ark enters the city of David, and David dances before it",
        labelFr: "L'arche entre dans la cité de David, et David danse devant elle",
        refs: [{ usfm: "2SA", ref: "6:12-19" }],
      },
      {
        id: "jerusalem-davidic-covenant",
        period: "unitedMonarchy",
        weight: "notable",
        labelEn: "God promises David a house and a throne that will not end",
        labelFr: "Dieu promet à David une maison et un trône sans fin",
        refs: [{ usfm: "2SA", ref: "7:1-17" }],
      },
      {
        id: "jerusalem-absalom",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "Absalom's revolt drives David out barefoot over the Kidron",
        labelFr: "La révolte d'Absalom chasse David pieds nus par le Cédron",
        refs: [{ usfm: "2SA", ref: "15:13-30" }],
      },
      {
        id: "jerusalem-temple-dedicated",
        period: "unitedMonarchy",
        weight: "headline",
        labelEn: "Solomon dedicates the temple",
        labelFr: "Salomon dédie le temple",
        descriptionEn:
          "Seven years of building end with the ark carried into the inner sanctuary and a cloud so thick the priests cannot stay at their posts. Solomon prays that even foreigners who pray toward this house will be heard, which fixes the city as the place Israel turns to face for the next four centuries.",
        descriptionFr:
          "Sept ans de travaux s'achèvent : l'arche est portée dans le sanctuaire intérieur et une nuée si épaisse l'emplit que les prêtres ne peuvent tenir leur service. Salomon demande que même l'étranger qui priera vers cette maison soit exaucé, et la ville devient pour quatre siècles le point vers lequel Israël se tourne.",
        refs: [
          { usfm: "1KI", ref: "8:1-11" },
          { usfm: "2CH", ref: "7:1-3" },
        ],
      },
      {
        id: "jerusalem-hezekiah-tunnel",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Hezekiah cuts a tunnel to bring the spring inside the walls",
        labelFr: "Ézéchias creuse un tunnel pour amener la source dans les murs",
        refs: [
          { usfm: "2KI", ref: "20:20" },
          { usfm: "2CH", ref: "32:30" },
        ],
      },
      {
        id: "jerusalem-sennacherib",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Sennacherib besieges the city and withdraws without taking it",
        labelFr: "Sanchérib assiège la ville et se retire sans la prendre",
        refs: [
          { usfm: "2KI", ref: "18:17-19:37" },
          { usfm: "ISA", ref: "37:1-38" },
        ],
      },
      {
        id: "jerusalem-josiah-reform",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "A book found during temple repairs sets off Josiah's reform",
        labelFr:
          "Un livre trouvé pendant les réparations du temple déclenche la réforme de Josias",
        refs: [{ usfm: "2KI", ref: "22:1-23:25" }],
      },
      {
        id: "jerusalem-fall",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Nebuchadnezzar breaks the walls and burns the temple",
        labelFr: "Nebucadnetsar abat les murs et brûle le temple",
        descriptionEn:
          "After eighteen months of siege the famine breaks the city. The walls come down, the temple and palace burn, the bronze pillars are cut up for scrap, and the population is marched to Babylon. Everything the city had claimed for itself is gone at once.",
        descriptionFr:
          "Après dix-huit mois de siège, la famine a raison de la ville. Les murailles tombent, le temple et le palais brûlent, les colonnes de bronze sont débitées, et la population est déportée à Babylone. Tout ce dont la ville se réclamait disparaît d'un coup.",
        refs: [
          { usfm: "2KI", ref: "25:1-21" },
          { usfm: "LAM", ref: "1:1-11" },
        ],
      },
      {
        id: "jerusalem-second-temple",
        period: "exileReturn",
        weight: "notable",
        labelEn: "The returned exiles rebuild the temple, and the old men weep",
        labelFr:
          "Les exilés revenus rebâtissent le temple, et les vieillards pleurent",
        refs: [
          { usfm: "EZR", ref: "3:8-13" },
          { usfm: "EZR", ref: "6:14-18" },
        ],
      },
      {
        id: "jerusalem-nehemiah-walls",
        period: "exileReturn",
        weight: "notable",
        labelEn: "Nehemiah rebuilds the walls in fifty-two days",
        labelFr: "Néhémie relève les murailles en cinquante-deux jours",
        refs: [
          { usfm: "NEH", ref: "2:11-20" },
          { usfm: "NEH", ref: "6:15-16" },
        ],
      },
      {
        id: "jerusalem-ezra-reads-law",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Ezra reads the law aloud at the Water Gate",
        labelFr: "Esdras lit la loi à haute voix à la porte des Eaux",
        refs: [{ usfm: "NEH", ref: "8:1-12" }],
      },
      {
        id: "jerusalem-triumphal-entry",
        period: "gospels",
        weight: "notable",
        labelEn: "Jesus rides in from Olivet while the crowds spread their cloaks",
        labelFr:
          "Jésus entre depuis le mont des Oliviers tandis que la foule étend ses vêtements",
        refs: [
          { usfm: "MAT", ref: "21:1-11" },
          { usfm: "LUK", ref: "19:28-44" },
        ],
      },
      {
        id: "jerusalem-temple-cleansing",
        period: "gospels",
        weight: "reference",
        labelEn: "Jesus overturns the money-changers' tables in the temple courts",
        labelFr:
          "Jésus renverse les tables des changeurs dans les cours du temple",
        refs: [{ usfm: "MAT", ref: "21:12-17" }],
      },
      {
        id: "jerusalem-last-supper",
        period: "gospels",
        weight: "notable",
        labelEn: "The Passover meal in an upper room",
        labelFr: "Le repas de la Pâque dans une chambre haute",
        refs: [
          { usfm: "LUK", ref: "22:7-23" },
          { usfm: "JHN", ref: "13:1-17" },
        ],
      },
      {
        id: "jerusalem-crucifixion",
        period: "gospels",
        weight: "headline",
        labelEn: "Jesus is crucified at Golgotha",
        labelFr: "Jésus est crucifié à Golgotha",
        descriptionEn:
          "Condemned by the Sanhedrin and sentenced by Pilate, Jesus is executed outside the wall between two criminals. The gospels mark the hours: darkness at noon, the cry of dereliction, the temple curtain torn from top to bottom.",
        descriptionFr:
          "Condamné par le sanhédrin et livré par Pilate, Jésus est exécuté hors des murs entre deux malfaiteurs. Les évangiles en marquent les heures : les ténèbres à midi, le cri de l'abandon, le voile du temple déchiré du haut en bas.",
        refs: [
          { usfm: "MAT", ref: "27:32-56" },
          { usfm: "JHN", ref: "19:16-30" },
        ],
      },
      {
        id: "jerusalem-resurrection",
        period: "gospels",
        weight: "headline",
        labelEn: "The tomb is found empty on the third day",
        labelFr: "Le tombeau est trouvé vide le troisième jour",
        descriptionEn:
          "Women arriving at dawn with burial spices find the stone rolled back and the body gone. Over the following weeks the risen Jesus is seen in the city and around it, and the disciples who had scattered at his arrest start saying publicly that death did not hold him.",
        descriptionFr:
          "Des femmes venues à l'aube avec des aromates trouvent la pierre roulée et le corps absent. Dans les semaines qui suivent, Jésus ressuscité est vu dans la ville et aux alentours, et les disciples dispersés lors de son arrestation se mettent à dire publiquement que la mort ne l'a pas retenu.",
        refs: [
          { usfm: "MAT", ref: "28:1-10" },
          { usfm: "JHN", ref: "20:1-18" },
        ],
      },
      {
        id: "jerusalem-pentecost",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "The Spirit comes at Pentecost and the church begins here",
        labelFr: "L'Esprit vient à la Pentecôte et l'Église naît ici",
        descriptionEn:
          "Fifty days after the Passover, pilgrims from across the empire hear Galileans speaking their own languages. Peter preaches in the open, three thousand are baptised, and the movement that had been a group of frightened disciples in a locked room becomes a public community in the city that had executed its leader.",
        descriptionFr:
          "Cinquante jours après la Pâque, des pèlerins venus de tout l'empire entendent des Galiléens parler leurs propres langues. Pierre prêche en public, trois mille personnes sont baptisées, et ce qui n'était qu'un groupe de disciples effrayés derrière une porte fermée devient une communauté publique, dans la ville même qui avait exécuté son maître.",
        refs: [{ usfm: "ACT", ref: "2:1-41" }],
      },
      {
        id: "jerusalem-stephen",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Stephen is stoned outside the city, with Saul consenting",
        labelFr: "Étienne est lapidé hors de la ville, avec l'accord de Saul",
        refs: [{ usfm: "ACT", ref: "7:54-60" }],
      },
      {
        id: "jerusalem-council",
        period: "earlyChurch",
        weight: "notable",
        labelEn:
          "The council decides Gentile believers need not be circumcised",
        labelFr:
          "Le concile décide que les croyants païens n'ont pas à être circoncis",
        refs: [{ usfm: "ACT", ref: "15:1-29" }],
      },
    ],
  },
  {
    id: "bethlehem",
    nameEn: "Bethlehem",
    nameFr: "Bethléem",
    lng: 35.207639,
    lat: 31.704306,
    tier: "major",
    region: "judea",
    blurbEn:
      "A small town in the Judean hills, remembered as the home of Ruth and Boaz, the place David was anointed, and the birthplace of Jesus.",
    blurbFr:
      "Une petite ville des collines de Judée, connue comme le pays de Ruth et de Boaz, le lieu de l'onction de David et la ville où naquit Jésus.",
    source: {
      site: "Bethlehem",
      confidence: 1000,
      candidates: 1,
      slug: "bethlehem-1",
    },
    curated: true,
    events: [
      {
        id: "bethlehem-rachel",
        period: "patriarchs",
        weight: "reference",
        labelEn: "Rachel dies bearing Benjamin and is buried on the road here",
        labelFr:
          "Rachel meurt en enfantant Benjamin et est enterrée sur la route d'ici",
        refs: [{ usfm: "GEN", ref: "35:16-20" }],
      },
      {
        id: "bethlehem-ruth-gleans",
        period: "judges",
        weight: "notable",
        labelEn: "Naomi comes home empty, and Ruth gleans in Boaz's field",
        labelFr:
          "Naomi rentre les mains vides, et Ruth glane dans le champ de Boaz",
        refs: [
          { usfm: "RUT", ref: "1:19-22" },
          { usfm: "RUT", ref: "2:1-23" },
        ],
      },
      {
        id: "bethlehem-ruth-boaz",
        period: "judges",
        weight: "notable",
        labelEn: "Boaz redeems Ruth, and their son Obed becomes David's grandfather",
        labelFr:
          "Boaz rachète Ruth, et leur fils Obed devient le grand-père de David",
        refs: [{ usfm: "RUT", ref: "4:9-17" }],
      },
      {
        id: "bethlehem-levite",
        period: "judges",
        weight: "reference",
        labelEn: "A Levite's concubine leaves him and returns to her father here",
        labelFr:
          "La concubine d'un Lévite le quitte et revient ici chez son père",
        refs: [{ usfm: "JDG", ref: "19:1-2" }],
      },
      {
        id: "bethlehem-david-anointed",
        period: "unitedMonarchy",
        weight: "headline",
        labelEn: "Samuel anoints the youngest son of Jesse",
        labelFr: "Samuel oint le plus jeune fils d'Isaï",
        descriptionEn:
          "Sent to find a king among Jesse's sons, Samuel works through seven of them before asking whether there is another. David is out with the sheep. He is brought in and anointed in front of his brothers, on the explicit principle that God does not see as people see.",
        descriptionFr:
          "Envoyé chercher un roi parmi les fils d'Isaï, Samuel en passe sept en revue avant de demander s'il en reste un autre. David est aux champs avec les brebis. On le fait venir et il reçoit l'onction devant ses frères, sur ce principe énoncé sans détour : Dieu ne voit pas comme les hommes voient.",
        refs: [{ usfm: "1SA", ref: "16:1-13" }],
      },
      {
        id: "bethlehem-well",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "Three of David's men break the Philistine line for water from its well",
        labelFr:
          "Trois hommes de David percent les lignes philistines pour l'eau de son puits",
        refs: [{ usfm: "2SA", ref: "23:13-17" }],
      },
      {
        id: "bethlehem-rehoboam-fortifies",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Rehoboam fortifies it among the towns defending Judah",
        labelFr: "Roboam la fortifie parmi les villes qui défendent Juda",
        refs: [{ usfm: "2CH", ref: "11:5-6" }],
      },
      {
        id: "bethlehem-micah",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Micah says the ruler of Israel will come from this least of towns",
        labelFr:
          "Michée annonce que le dominateur d'Israël sortira de cette bourgade insignifiante",
        refs: [{ usfm: "MIC", ref: "5:2" }],
      },
      {
        id: "bethlehem-return",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Its people are counted among those who come back from Babylon",
        labelFr:
          "Ses habitants figurent parmi ceux qui reviennent de Babylone",
        refs: [
          { usfm: "EZR", ref: "2:21" },
          { usfm: "NEH", ref: "7:26" },
        ],
      },
      {
        id: "bethlehem-nativity",
        period: "gospels",
        weight: "headline",
        labelEn: "Jesus is born and laid in a manger",
        labelFr: "Jésus naît et est couché dans une crèche",
        descriptionEn:
          "A census brings Joseph back to his ancestral town, where there is no room for them. The birth is announced first to shepherds working the night shift in the surrounding fields, which is a pointed choice of first audience.",
        descriptionFr:
          "Un recensement ramène Joseph dans la ville de ses ancêtres, où il ne trouve pas de place. La naissance est annoncée d'abord à des bergers qui veillent la nuit dans les champs voisins, un choix de premiers témoins qui n'est pas anodin.",
        refs: [{ usfm: "LUK", ref: "2:1-20" }],
      },
      {
        id: "bethlehem-magi",
        period: "gospels",
        weight: "headline",
        labelEn: "The magi arrive, and Herod kills the town's children",
        labelFr: "Les mages arrivent, et Hérode fait tuer les enfants de la ville",
        descriptionEn:
          "Scholars from the east ask Herod where the king has been born; his own advisers answer from Micah. The visitors bring gifts and leave by another road, and Herod, outmanoeuvred, orders every boy under two in the district killed.",
        descriptionFr:
          "Des savants venus d'Orient demandent à Hérode où est né le roi ; ses propres conseillers répondent en citant Michée. Les visiteurs offrent leurs présents puis repartent par un autre chemin, et Hérode, joué, ordonne de tuer tous les garçons de moins de deux ans du district.",
        refs: [{ usfm: "MAT", ref: "2:1-18" }],
      },
    ],
  },
  {
    id: "hebron",
    nameEn: "Hebron",
    nameFr: "Hébron",
    lng: 35.10222,
    lat: 31.525087,
    tier: "major",
    region: "judea",
    blurbEn:
      "The highest town in Judah, where Abraham bought a burial cave and where David reigned for seven years before taking Jerusalem.",
    blurbFr:
      "La ville la plus haute de Juda, où Abraham acheta une grotte funéraire et où David régna sept ans avant de prendre Jérusalem.",
    source: {
      site: "Tel Rumeida",
      confidence: 1000,
      candidates: 1,
      slug: "hebron",
    },
    curated: true,
    events: [
      {
        id: "hebron-mamre",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Abram settles by the oaks of Mamre and builds an altar",
        labelFr: "Abram s'établit près des chênes de Mamré et bâtit un autel",
        refs: [{ usfm: "GEN", ref: "13:18" }],
      },
      {
        id: "hebron-machpelah",
        period: "patriarchs",
        weight: "headline",
        labelEn: "Abraham buys the cave of Machpelah to bury Sarah",
        labelFr: "Abraham achète la grotte de Macpéla pour y enterrer Sara",
        descriptionEn:
          "Abraham refuses the offer of the field as a gift and insists on paying four hundred shekels in front of witnesses at the town gate. It is the only piece of Canaan he ever owns, and he buys it to bury his wife in.",
        descriptionFr:
          "Abraham refuse qu'on lui offre le champ et exige de payer quatre cents sicles devant témoins, à la porte de la ville. C'est le seul morceau de Canaan qu'il possédera jamais, et il l'achète pour y enterrer sa femme.",
        refs: [{ usfm: "GEN", ref: "23:1-20" }],
      },
      {
        id: "hebron-patriarch-burials",
        period: "patriarchs",
        weight: "reference",
        labelEn: "Isaac, Rebekah, Leah and Jacob are buried in the same cave",
        labelFr: "Isaac, Rebecca, Léa et Jacob sont enterrés dans la même grotte",
        refs: [
          { usfm: "GEN", ref: "49:29-32" },
          { usfm: "GEN", ref: "50:13" },
        ],
      },
      {
        id: "hebron-spies",
        period: "exodusConquest",
        weight: "notable",
        labelEn: "The spies cut grapes nearby and report giants in the town",
        labelFr:
          "Les espions coupent du raisin près d'ici et signalent des géants dans la ville",
        refs: [{ usfm: "NUM", ref: "13:22-33" }],
      },
      {
        id: "hebron-taken",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "Joshua takes the town and kills its king",
        labelFr: "Josué prend la ville et tue son roi",
        refs: [{ usfm: "JOS", ref: "10:36-37" }],
      },
      {
        id: "hebron-caleb",
        period: "exodusConquest",
        weight: "notable",
        labelEn: "Caleb claims it at eighty-five and drives out the sons of Anak",
        labelFr:
          "Caleb la réclame à quatre-vingt-cinq ans et en chasse les fils d'Anak",
        refs: [{ usfm: "JOS", ref: "14:6-15" }],
      },
      {
        id: "hebron-city-of-refuge",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "It is set apart as a city of refuge for the Levites",
        labelFr: "Elle est mise à part comme ville de refuge pour les Lévites",
        refs: [
          { usfm: "JOS", ref: "20:7" },
          { usfm: "JOS", ref: "21:11-13" },
        ],
      },
      {
        id: "hebron-david-king",
        period: "unitedMonarchy",
        weight: "headline",
        labelEn: "David is anointed king here, first over Judah and then over all Israel",
        labelFr:
          "David y est oint roi, d'abord sur Juda, puis sur tout Israël",
        descriptionEn:
          "After Saul's death David asks where to go and is sent to Hebron, where the men of Judah anoint him. He rules from here for seven and a half years, through the long war with Saul's house, until the northern tribes come and make the same covenant with him.",
        descriptionFr:
          "Après la mort de Saül, David demande où aller et est envoyé à Hébron, où les hommes de Juda lui donnent l'onction. Il y règne sept ans et demi, pendant la longue guerre contre la maison de Saül, jusqu'à ce que les tribus du nord viennent conclure avec lui la même alliance.",
        refs: [
          { usfm: "2SA", ref: "2:1-4" },
          { usfm: "2SA", ref: "5:1-5" },
        ],
      },
      {
        id: "hebron-abner",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "Joab murders Abner at the gate, and David walks behind the bier",
        labelFr:
          "Joab assassine Abner à la porte, et David marche derrière le cercueil",
        refs: [{ usfm: "2SA", ref: "3:26-32" }],
      },
      {
        id: "hebron-absalom",
        period: "unitedMonarchy",
        weight: "notable",
        labelEn: "Absalom has himself proclaimed king in his father's old capital",
        labelFr:
          "Absalom se fait proclamer roi dans l'ancienne capitale de son père",
        refs: [{ usfm: "2SA", ref: "15:7-12" }],
      },
      {
        id: "hebron-rehoboam",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Rehoboam fortifies it against Egypt",
        labelFr: "Roboam la fortifie face à l'Égypte",
        refs: [{ usfm: "2CH", ref: "11:5-10" }],
      },
    ],
  },
  {
    id: "gibeon",
    nameEn: "Gibeon",
    nameFr: "Gabaon",
    lng: 35.183351,
    lat: 31.847451,
    tier: "notable",
    region: "judea",
    blurbEn:
      "A Canaanite town that talked its way out of destruction, then housed the tabernacle until Solomon's temple was built.",
    blurbFr:
      "Une ville cananéenne qui échappa à la destruction par la ruse, puis abrita le tabernacle jusqu'à la construction du temple de Salomon.",
    source: {
      site: "El Jib",
      confidence: 912,
      candidates: 1,
      slug: "gibeon",
    },
    curated: true,
    events: [
      {
        id: "gibeon-treaty",
        period: "exodusConquest",
        weight: "headline",
        labelEn: "The Gibeonites trick Joshua into a treaty",
        labelFr: "Les Gabaonites obtiennent une alliance par la ruse",
        descriptionEn:
          "Knowing what happened to Jericho and Ai, they arrive in worn-out sandals with mouldy bread, claiming to be from a distant country. Joshua makes peace without consulting God. When the deception comes out three days later the treaty still holds, because an oath is an oath.",
        descriptionFr:
          "Sachant ce qui est arrivé à Jéricho et à Aï, ils se présentent avec des sandales usées et du pain moisi, se disant venus d'un pays lointain. Josué fait la paix sans consulter Dieu. Quand la ruse est découverte trois jours plus tard, l'alliance tient quand même : un serment est un serment.",
        refs: [{ usfm: "JOS", ref: "9:3-27" }],
      },
      {
        id: "gibeon-sun-stands",
        period: "exodusConquest",
        weight: "headline",
        labelEn: "Joshua defends the town, and the sun stands still over it",
        labelFr: "Josué défend la ville, et le soleil s'arrête au-dessus d'elle",
        descriptionEn:
          "Five Amorite kings besiege Gibeon for having gone over to Israel. Joshua marches all night from Gilgal, routs them, and asks for daylight to finish the pursuit. The account says there was no day like it before or since.",
        descriptionFr:
          "Cinq rois amoréens assiègent Gabaon pour être passée du côté d'Israël. Josué monte de Guilgal en marchant toute la nuit, les met en déroute et demande du jour pour achever la poursuite. Le récit précise qu'il n'y eut jamais de journée pareille, ni avant ni depuis.",
        refs: [{ usfm: "JOS", ref: "10:1-14" }],
      },
      {
        id: "gibeon-pool",
        period: "unitedMonarchy",
        weight: "notable",
        labelEn: "Twelve of Saul's men and twelve of David's fight to the death by the pool",
        labelFr:
          "Douze hommes de Saül et douze de David s'affrontent à mort près de l'étang",
        refs: [{ usfm: "2SA", ref: "2:12-17" }],
      },
      {
        id: "gibeon-saul-oath",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "A famine is traced to Saul's breach of the old Gibeonite oath",
        labelFr:
          "Une famine est imputée à la rupture par Saül du vieux serment envers Gabaon",
        refs: [{ usfm: "2SA", ref: "21:1-9" }],
      },
      {
        id: "gibeon-amasa",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "Joab kills Amasa by the great stone here",
        labelFr: "Joab tue Amasa près de la grande pierre d'ici",
        refs: [{ usfm: "2SA", ref: "20:8-13" }],
      },
      {
        id: "gibeon-tabernacle",
        period: "unitedMonarchy",
        weight: "notable",
        labelEn: "The tabernacle and the bronze altar stand here while the ark is in Jerusalem",
        labelFr:
          "Le tabernacle et l'autel de bronze s'y trouvent tandis que l'arche est à Jérusalem",
        refs: [
          { usfm: "1CH", ref: "16:39-40" },
          { usfm: "1CH", ref: "21:29" },
        ],
      },
      {
        id: "gibeon-solomon-dream",
        period: "unitedMonarchy",
        weight: "headline",
        labelEn: "Solomon asks for wisdom instead of long life or wealth",
        labelFr: "Salomon demande la sagesse plutôt que la vie ou la richesse",
        descriptionEn:
          "Solomon sacrifices at the great high place here, and in a dream is offered whatever he asks for. He asks for a listening heart to govern with, and the account treats the request itself as the proof that he had it.",
        descriptionFr:
          "Salomon sacrifie sur le grand haut lieu qui s'y trouve, et en songe il lui est offert tout ce qu'il demandera. Il demande un cœur capable d'écouter pour gouverner, et le récit traite la demande elle-même comme la preuve qu'il l'avait déjà.",
        refs: [{ usfm: "1KI", ref: "3:4-15" }],
      },
      {
        id: "gibeon-wall-repair",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Men of Gibeon help rebuild the wall of Jerusalem",
        labelFr:
          "Des hommes de Gabaon aident à relever la muraille de Jérusalem",
        refs: [{ usfm: "NEH", ref: "3:7" }],
      },
    ],
  },
  {
    id: "beersheba",
    nameEn: "Beersheba",
    nameFr: "Beer-Schéba",
    lng: 34.840833,
    lat: 31.244722,
    tier: "notable",
    region: "judea",
    blurbEn:
      "A well on the edge of the desert that became the southern marker of the land, and the place each of the patriarchs stopped to dig and swear.",
    blurbFr:
      "Un puits en bordure du désert devenu la borne sud du pays, et l'étape où chacun des patriarches creusa et jura.",
    source: {
      site: "Tel Beer Sheva",
      confidence: 823,
      candidates: 2,
      slug: "beersheba-1",
    },
    curated: true,
    events: [
      {
        id: "beersheba-hagar",
        period: "patriarchs",
        weight: "reference",
        labelEn: "Hagar and Ishmael run out of water in the wilderness here",
        labelFr: "Agar et Ismaël manquent d'eau dans le désert d'ici",
        refs: [{ usfm: "GEN", ref: "21:14-19" }],
      },
      {
        id: "beersheba-oath",
        period: "patriarchs",
        weight: "headline",
        labelEn: "Abraham and Abimelech swear over a disputed well",
        labelFr: "Abraham et Abimélec jurent au sujet d'un puits contesté",
        descriptionEn:
          "Abraham complains that Abimelech's men have seized a well he dug. They cut a treaty, seven ewe lambs change hands as proof of ownership, and the place takes its name from the oath. Abraham plants a tamarisk and stays on as a resident foreigner.",
        descriptionFr:
          "Abraham se plaint que les gens d'Abimélec se sont emparés d'un puits qu'il avait creusé. Ils concluent un traité, sept jeunes brebis changent de mains comme preuve de propriété, et le lieu tire son nom du serment. Abraham y plante un tamaris et y demeure comme étranger.",
        refs: [{ usfm: "GEN", ref: "21:22-34" }],
      },
      {
        id: "beersheba-isaac",
        period: "patriarchs",
        weight: "headline",
        labelEn: "Isaac digs again where his father dug, and God renews the promise",
        labelFr:
          "Isaac creuse là où son père avait creusé, et Dieu renouvelle la promesse",
        descriptionEn:
          "Driven from one well after another by Philistine herdsmen, Isaac comes to Beersheba, where God tells him not to be afraid. He builds an altar, pitches his tent, and his servants strike water the same day, and then Abimelech arrives to swear the same kind of treaty his father had.",
        descriptionFr:
          "Chassé d'un puits après l'autre par les bergers philistins, Isaac arrive à Beer-Schéba, où Dieu lui dit de ne pas craindre. Il bâtit un autel, dresse sa tente, et ses serviteurs trouvent de l'eau le jour même ; puis Abimélec vient conclure le même genre de traité que du temps de son père.",
        refs: [{ usfm: "GEN", ref: "26:23-33" }],
      },
      {
        id: "beersheba-jacob",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Jacob sacrifices here before going down to Egypt",
        labelFr: "Jacob y sacrifie avant de descendre en Égypte",
        refs: [{ usfm: "GEN", ref: "46:1-5" }],
      },
      {
        id: "beersheba-dan-to",
        period: "judges",
        weight: "reference",
        labelEn: "\"From Dan to Beersheba\" becomes the standard span of the land",
        labelFr:
          "« De Dan à Beer-Schéba » devient la mesure habituelle du pays",
        refs: [
          { usfm: "JDG", ref: "20:1" },
          { usfm: "2SA", ref: "24:2" },
        ],
      },
      {
        id: "beersheba-samuel-sons",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "Samuel's sons judge here and take bribes",
        labelFr: "Les fils de Samuel y jugent et se laissent corrompre",
        refs: [{ usfm: "1SA", ref: "8:1-3" }],
      },
      {
        id: "beersheba-elijah",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Elijah leaves his servant here and walks into the desert to die",
        labelFr:
          "Élie y laisse son serviteur et marche dans le désert pour y mourir",
        refs: [{ usfm: "1KI", ref: "19:3-8" }],
      },
      {
        id: "beersheba-amos",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Amos names its shrine among the ones not to cross over to",
        labelFr:
          "Amos cite son sanctuaire parmi ceux vers lesquels il ne faut pas passer",
        refs: [{ usfm: "AMO", ref: "5:5" }],
      },
    ],
  },
  {
    id: "bethany",
    nameEn: "Bethany",
    nameFr: "Béthanie",
    lng: 35.255903,
    lat: 31.771661,
    tier: "minor",
    region: "judea",
    blurbEn:
      "A village on the far side of the Mount of Olives, less than an hour from Jerusalem, where Jesus stayed with friends.",
    blurbFr:
      "Un village de l'autre côté du mont des Oliviers, à moins d'une heure de Jérusalem, où Jésus logeait chez des amis.",
    source: {
      site: "Al Eizariya",
      confidence: 889,
      candidates: 1,
      slug: "bethany-1",
    },
    events: [
      {
        id: "bethany-martha-mary",
        period: "gospels",
        weight: "reference",
        labelEn: "Martha works while Mary sits and listens",
        labelFr: "Marthe s'active tandis que Marie s'assied et écoute",
        refs: [{ usfm: "LUK", ref: "10:38-42" }],
      },
      {
        id: "bethany-lazarus",
        period: "gospels",
        weight: "headline",
        labelEn: "Jesus raises Lazarus after four days in the tomb",
        labelFr: "Jésus relève Lazare après quatre jours au tombeau",
        descriptionEn:
          "Jesus deliberately waits two days before coming, arrives to open reproach from both sisters, and weeps at the tomb. Then he has the stone taken away and calls Lazarus out. It is the act that decides the authorities to have him killed.",
        descriptionFr:
          "Jésus attend délibérément deux jours avant de venir, arrive sous le reproche ouvert des deux sœurs, et pleure devant le tombeau. Puis il fait ôter la pierre et appelle Lazare dehors. C'est cet acte qui décide les autorités à le faire mourir.",
        refs: [{ usfm: "JHN", ref: "11:1-44" }],
      },
      {
        id: "bethany-anointing",
        period: "gospels",
        weight: "notable",
        labelEn: "Mary pours out a year's wages of perfume on his feet",
        labelFr: "Marie répand sur ses pieds un parfum valant un an de salaire",
        refs: [
          { usfm: "JHN", ref: "12:1-8" },
          { usfm: "MRK", ref: "14:3-9" },
        ],
      },
      {
        id: "bethany-lodging",
        period: "gospels",
        weight: "reference",
        labelEn: "He lodges here each night of his last week and walks in each morning",
        labelFr:
          "Il y passe chaque nuit de sa dernière semaine et monte chaque matin",
        refs: [{ usfm: "MAT", ref: "21:17" }],
      },
      {
        id: "bethany-ascension",
        period: "gospels",
        weight: "headline",
        labelEn: "Jesus blesses the disciples here and is taken up",
        labelFr: "Jésus y bénit les disciples et est enlevé",
        descriptionEn:
          "Luke ends his gospel where the road from Jerusalem crests the Mount of Olives: Jesus lifts his hands to bless them, and while he is still blessing them he is parted from them. The disciples walk back into the city.",
        descriptionFr:
          "Luc achève son évangile là où la route de Jérusalem franchit le mont des Oliviers : Jésus lève les mains pour les bénir, et pendant qu'il les bénit encore, il est séparé d'eux. Les disciples redescendent vers la ville.",
        refs: [{ usfm: "LUK", ref: "24:50-53" }],
      },
    ],
  },
  {
    id: "lachish",
    nameEn: "Lachish",
    nameFr: "Lakis",
    lng: 34.849167,
    lat: 31.565278,
    tier: "minor",
    region: "judea",
    blurbEn:
      "Judah's strongest fortress after Jerusalem, guarding the western approach, and the last town standing in two different invasions.",
    blurbFr:
      "La plus forte place de Juda après Jérusalem, gardant l'accès occidental, et la dernière ville debout lors de deux invasions.",
    source: {
      site: "Tell ed Duweir",
      confidence: 1000,
      candidates: 1,
      slug: "lachish",
    },
    events: [
      {
        id: "lachish-joshua",
        period: "exodusConquest",
        weight: "notable",
        labelEn: "Joshua takes it on the second day of the siege",
        labelFr: "Josué la prend le second jour du siège",
        refs: [{ usfm: "JOS", ref: "10:31-33" }],
      },
      {
        id: "lachish-amaziah",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "King Amaziah flees here from a conspiracy and is killed",
        labelFr: "Le roi Amatsia s'y réfugie devant un complot et y est tué",
        refs: [{ usfm: "2KI", ref: "14:19" }],
      },
      {
        id: "lachish-sennacherib",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Sennacherib runs his campaign against Judah from here",
        labelFr: "Sanchérib mène de là sa campagne contre Juda",
        descriptionEn:
          "The Assyrian king takes Lachish and makes it his headquarters, and it is from here that he sends his officers to demand Jerusalem's surrender and receives Hezekiah's tribute. The siege is also the subject of the carved reliefs Sennacherib put up in his palace at Nineveh.",
        descriptionFr:
          "Le roi assyrien prend Lakis et en fait son quartier général ; c'est de là qu'il envoie ses officiers exiger la reddition de Jérusalem et qu'il reçoit le tribut d'Ézéchias. Ce siège est aussi le sujet des reliefs sculptés que Sanchérib fit poser dans son palais de Ninive.",
        refs: [
          { usfm: "2KI", ref: "18:14-17" },
          { usfm: "2CH", ref: "32:9" },
        ],
      },
      {
        id: "lachish-jeremiah",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "It and Azekah are the only fortified towns left as Babylon closes in",
        labelFr:
          "Elle et Azéka sont les seules villes fortes qui restent quand Babylone approche",
        refs: [{ usfm: "JER", ref: "34:7" }],
      },
      {
        id: "lachish-resettled",
        period: "exileReturn",
        weight: "reference",
        labelEn: "It is resettled by returning Judeans",
        labelFr: "Elle est repeuplée par des Judéens de retour",
        refs: [{ usfm: "NEH", ref: "11:30" }],
      },
    ],
  },
  {
    id: "emmaus",
    nameEn: "Emmaus",
    nameFr: "Emmaüs",
    lng: 35.16419,
    lat: 31.79289,
    tier: "minor",
    region: "judea",
    blurbEn:
      "A village about seven miles from Jerusalem, known for a single afternoon's walk on the day of the resurrection.",
    blurbFr:
      "Un village à une dizaine de kilomètres de Jérusalem, connu pour une seule marche, l'après-midi du jour de la résurrection.",
    source: {
      site: "Qalunya",
      confidence: 338,
      candidates: 6,
      slug: "emmaus",
    },
    events: [
      {
        id: "emmaus-road",
        period: "gospels",
        weight: "headline",
        labelEn: "Two disciples walk with a stranger and recognise him at supper",
        labelFr:
          "Deux disciples marchent avec un inconnu et le reconnaissent à table",
        descriptionEn:
          "Leaving Jerusalem on the day the tomb was found empty, two disciples talk over the news with a traveller who explains the scriptures to them the whole way without saying who he is. They press him to stay for the night, and they know him the moment he breaks the bread. They walk the whole seven miles back that same evening.",
        descriptionFr:
          "Quittant Jérusalem le jour où le tombeau a été trouvé vide, deux disciples commentent la nouvelle avec un voyageur qui leur explique les Écritures pendant tout le trajet sans dire qui il est. Ils le pressent de rester pour la nuit, et ils le reconnaissent à l'instant où il rompt le pain. Ils refont les dix kilomètres en sens inverse le soir même.",
        refs: [{ usfm: "LUK", ref: "24:13-35" }],
      },
    ],
  },
];

const JORDAN_VALLEY: City[] = [
  {
    id: "jericho",
    nameEn: "Jericho",
    nameFr: "Jéricho",
    lng: 35.444564,
    lat: 31.871719,
    tier: "major",
    region: "jordanValley",
    blurbEn:
      "An oasis city by the Jordan, the first town Israel faced west of the river and the last stop on the pilgrim road up to Jerusalem.",
    blurbFr:
      "Une ville-oasis près du Jourdain, la première place forte qu'Israël affronta à l'ouest du fleuve et la dernière étape de la route des pèlerins vers Jérusalem.",
    source: {
      site: "Tell es Sultan",
      confidence: 1000,
      candidates: 1,
      slug: "jericho-1",
    },
    curated: true,
    events: [
      {
        id: "jericho-rahab",
        period: "exodusConquest",
        weight: "headline",
        labelEn: "Rahab hides the two spies on her roof",
        labelFr: "Rahab cache les deux espions sur son toit",
        descriptionEn:
          "Two men sent to scout the city lodge with a prostitute whose house is built into the wall. She hides them under drying flax, sends the king's search party the wrong way, and bargains for her family's lives with a scarlet cord in the window. She and her household are the only ones spared.",
        descriptionFr:
          "Deux hommes envoyés en reconnaissance logent chez une prostituée dont la maison est bâtie dans la muraille. Elle les cache sous du lin qui sèche, oriente à faux les envoyés du roi, et négocie la vie des siens contre un cordon écarlate à la fenêtre. Elle et sa maison seront les seules épargnées.",
        refs: [{ usfm: "JOS", ref: "2:1-21" }],
      },
      {
        id: "jericho-jordan-crossing",
        period: "exodusConquest",
        weight: "notable",
        labelEn: "Israel crosses the Jordan opposite the city and camps at Gilgal",
        labelFr:
          "Israël traverse le Jourdain en face de la ville et campe à Guilgal",
        refs: [{ usfm: "JOS", ref: "3:14-4:18" }],
      },
      {
        id: "jericho-walls",
        period: "exodusConquest",
        weight: "headline",
        labelEn: "The walls come down after seven days of marching",
        labelFr: "Les murailles tombent après sept jours de marche",
        descriptionEn:
          "For six days the army circles the shut city once a day in silence. On the seventh they go round seven times, the priests sound the horns, the people shout, and the wall falls flat. Nothing is taken as plunder; the metal goes to the treasury and the rest is burned.",
        descriptionFr:
          "Six jours durant, l'armée fait chaque jour un tour de la ville fermée, en silence. Le septième, elle en fait sept, les prêtres sonnent des cors, le peuple crie, et la muraille s'écroule sur place. Rien n'est pris comme butin : le métal va au trésor et le reste est brûlé.",
        refs: [{ usfm: "JOS", ref: "6:1-21" }],
      },
      {
        id: "jericho-achan",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "Achan takes plunder from the city and the next attack fails",
        labelFr:
          "Acan prend du butin de la ville et l'attaque suivante échoue",
        refs: [{ usfm: "JOS", ref: "7:1-26" }],
      },
      {
        id: "jericho-curse",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "Joshua curses whoever rebuilds it",
        labelFr: "Josué maudit quiconque la rebâtira",
        refs: [{ usfm: "JOS", ref: "6:26" }],
      },
      {
        id: "jericho-ehud",
        period: "judges",
        weight: "notable",
        labelEn: "Eglon of Moab holds the City of Palms until Ehud kills him",
        labelFr:
          "Églon de Moab tient la ville des Palmiers jusqu'à ce qu'Éhud le tue",
        refs: [{ usfm: "JDG", ref: "3:12-30" }],
      },
      {
        id: "jericho-envoys",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "David's humiliated envoys wait here until their beards grow back",
        labelFr:
          "Les envoyés humiliés de David y attendent que leur barbe repousse",
        refs: [{ usfm: "2SA", ref: "10:4-5" }],
      },
      {
        id: "jericho-hiel",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Hiel of Bethel rebuilds it and the old curse is recalled",
        labelFr:
          "Hiel de Béthel la rebâtit et l'ancienne malédiction est rappelée",
        refs: [{ usfm: "1KI", ref: "16:34" }],
      },
      {
        id: "jericho-elisha-water",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Elijah is taken up beyond it, and Elisha heals its spring",
        labelFr: "Élie est enlevé au-delà, et Élisée assainit sa source",
        descriptionEn:
          "The prophets of Jericho watch Elijah and Elisha walk out through the parted river, and watch Elisha come back alone with the cloak. His first act on returning is domestic rather than spectacular: the city's water is bad, so he throws salt into the spring and it is fit to drink.",
        descriptionFr:
          "Les prophètes de Jéricho voient Élie et Élisée sortir par le fleuve ouvert, puis voient Élisée revenir seul avec le manteau. Son premier geste au retour est domestique plutôt que spectaculaire : l'eau de la ville est mauvaise, il jette du sel dans la source et elle devient potable.",
        refs: [{ usfm: "2KI", ref: "2:1-22" }],
      },
      {
        id: "jericho-zedekiah",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Zedekiah is overtaken on the plains here as his army scatters",
        labelFr:
          "Sédécias est rejoint dans la plaine d'ici tandis que son armée se disperse",
        refs: [{ usfm: "2KI", ref: "25:5" }],
      },
      {
        id: "jericho-wall-builders",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Its men build a section of Jerusalem's wall",
        labelFr: "Ses hommes bâtissent une section de la muraille de Jérusalem",
        refs: [{ usfm: "NEH", ref: "3:2" }],
      },
      {
        id: "jericho-bartimaeus",
        period: "gospels",
        weight: "notable",
        labelEn: "A blind beggar keeps shouting until Jesus stops for him",
        labelFr:
          "Un mendiant aveugle crie sans s'arrêter jusqu'à ce que Jésus s'arrête pour lui",
        refs: [{ usfm: "MRK", ref: "10:46-52" }],
      },
      {
        id: "jericho-zacchaeus",
        period: "gospels",
        weight: "headline",
        labelEn: "Zacchaeus climbs a tree and gets an unwanted guest",
        labelFr: "Zachée grimpe à un arbre et se retrouve avec un hôte imprévu",
        descriptionEn:
          "The chief tax collector of a wealthy customs town, too short to see over the crowd, climbs a sycamore. Jesus stops under it and invites himself to dinner, to general disgust. Zacchaeus responds by giving away half his estate and repaying what he had extorted fourfold.",
        descriptionFr:
          "Chef des collecteurs d'impôts d'une riche ville de douane, trop petit pour voir par-dessus la foule, il monte sur un sycomore. Jésus s'arrête dessous et s'invite chez lui, au scandale général. Zachée répond en donnant la moitié de ses biens et en rendant au quadruple ce qu'il avait extorqué.",
        refs: [{ usfm: "LUK", ref: "19:1-10" }],
      },
    ],
  },
  {
    id: "sodom",
    nameEn: "Sodom",
    nameFr: "Sodome",
    lng: 35.449223,
    lat: 31.20849,
    tier: "major",
    region: "jordanValley",
    blurbEn:
      "A city of the Jordan plain destroyed in Abraham's lifetime, and afterwards the standard biblical byword for a place past saving. Its site is genuinely unknown; this marker follows the leading proposal south of the Dead Sea.",
    blurbFr:
      "Une ville de la plaine du Jourdain détruite du temps d'Abraham, devenue ensuite la référence biblique de la ville perdue. Son emplacement est réellement inconnu ; ce marqueur suit l'hypothèse la mieux appuyée, au sud de la mer Morte.",
    source: {
      site: "south of the Lisan",
      confidence: 386,
      candidates: 5,
      slug: "sodom",
    },
    curated: true,
    events: [
      {
        id: "sodom-lot-chooses",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Lot looks at the well-watered plain and chooses it",
        labelFr: "Lot regarde la plaine bien arrosée et la choisit",
        refs: [{ usfm: "GEN", ref: "13:10-13" }],
      },
      {
        id: "sodom-four-kings",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Its king loses a battle in the valley, and Abram rescues Lot",
        labelFr:
          "Son roi perd une bataille dans la vallée, et Abram délivre Lot",
        refs: [{ usfm: "GEN", ref: "14:8-16" }],
      },
      {
        id: "sodom-abraham-bargains",
        period: "patriarchs",
        weight: "headline",
        labelEn: "Abraham bargains God down from fifty righteous men to ten",
        labelFr:
          "Abraham fait descendre le compte de cinquante justes à dix",
        descriptionEn:
          "Told what is about to happen, Abraham argues on the city's behalf, and the argument is a moral one: should the judge of all the earth sweep away the innocent with the guilty? He works the number down in stages, from fifty to ten, and is never refused.",
        descriptionFr:
          "Averti de ce qui va arriver, Abraham plaide pour la ville, et son argument est moral : le juge de toute la terre ferait-il périr l'innocent avec le coupable ? Il fait baisser le nombre par étapes, de cinquante à dix, et ne se voit jamais refuser.",
        refs: [{ usfm: "GEN", ref: "18:16-33" }],
      },
      {
        id: "sodom-lots-visitors",
        period: "patriarchs",
        weight: "notable",
        labelEn: "The men of the city surround Lot's door",
        labelFr: "Les hommes de la ville entourent la porte de Lot",
        refs: [{ usfm: "GEN", ref: "19:1-11" }],
      },
      {
        id: "sodom-destruction",
        period: "patriarchs",
        weight: "headline",
        labelEn: "Fire falls on the plain, and Lot's wife looks back",
        labelFr: "Le feu tombe sur la plaine, et la femme de Lot regarde en arrière",
        descriptionEn:
          "Lot has to be taken by the hand and pulled out of the city, still bargaining about which town he will flee to. Sulphur and fire fall on the plain behind him. His wife stops to look and is left there, and in the morning Abraham stands on the ridge and sees the smoke going up.",
        descriptionFr:
          "Il faut prendre Lot par la main et le tirer hors de la ville, alors qu'il négocie encore le lieu de son refuge. Le soufre et le feu tombent sur la plaine derrière lui. Sa femme s'arrête pour regarder et reste là ; au matin, Abraham se tient sur la hauteur et voit monter la fumée.",
        refs: [{ usfm: "GEN", ref: "19:15-29" }],
      },
      {
        id: "sodom-isaiah",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Isaiah addresses Jerusalem's rulers as rulers of Sodom",
        labelFr:
          "Ésaïe s'adresse aux chefs de Jérusalem comme aux chefs de Sodome",
        refs: [{ usfm: "ISA", ref: "1:9-10" }],
      },
      {
        id: "sodom-ezekiel",
        period: "exileReturn",
        weight: "notable",
        labelEn: "Ezekiel names its sin as pride and ignoring the poor",
        labelFr:
          "Ézéchiel définit son péché comme l'orgueil et l'oubli du pauvre",
        refs: [{ usfm: "EZK", ref: "16:49-50" }],
      },
      {
        id: "sodom-lamentations",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Lamentations says Jerusalem's punishment was worse than its own",
        labelFr:
          "Les Lamentations disent que le châtiment de Jérusalem fut plus grand que le sien",
        refs: [{ usfm: "LAM", ref: "4:6" }],
      },
      {
        id: "sodom-capernaum-comparison",
        period: "gospels",
        weight: "notable",
        labelEn: "Jesus says it would have repented, and Capernaum will fare worse",
        labelFr:
          "Jésus dit qu'elle se serait repentie, et que Capernaüm sera traitée plus durement",
        refs: [{ usfm: "MAT", ref: "11:23-24" }],
      },
      {
        id: "sodom-warning",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "The letters keep it as a standing example",
        labelFr: "Les épîtres en font un exemple permanent",
        refs: [
          { usfm: "2PE", ref: "2:6" },
          { usfm: "JUD", ref: "1:7" },
        ],
      },
    ],
  },
];

const SAMARIA: City[] = [
  {
    id: "samaria",
    nameEn: "Samaria",
    nameFr: "Samarie",
    lng: 35.195,
    lat: 32.276111,
    tier: "primary",
    region: "samaria",
    blurbEn:
      "A capital built from nothing by Omri, the seat of the northern kingdom for two centuries, and the city whose fall in 722 BC ended Israel as a state.",
    blurbFr:
      "Une capitale bâtie de rien par Omri, siège du royaume du Nord pendant deux siècles, et la ville dont la chute en 722 av. J.-C. mit fin à Israël comme État.",
    source: {
      site: "Samaria",
      confidence: 1000,
      candidates: 1,
      slug: "samaria-1",
    },
    curated: true,
    events: [
      {
        id: "samaria-omri-founds",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Omri buys a hill and builds a capital on it",
        labelFr: "Omri achète une colline et y bâtit une capitale",
        descriptionEn:
          "Omri pays two talents of silver for the hill of Shemer and names the city after its owner. Unlike Shechem or Tirzah it belongs to the dynasty rather than to a tribe, which makes it defensible in every sense, and it stays the northern capital until the Assyrians take it.",
        descriptionFr:
          "Omri paie deux talents d'argent pour la colline de Schemer et donne à la ville le nom de son propriétaire. Contrairement à Sichem ou à Thirtsa, elle appartient à la dynastie et non à une tribu, ce qui la rend défendable à tous les sens du mot ; elle restera la capitale du Nord jusqu'à la prise assyrienne.",
        refs: [{ usfm: "1KI", ref: "16:23-24" }],
      },
      {
        id: "samaria-ahab-temple",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Ahab builds a temple for Baal here, and a house inlaid with ivory",
        labelFr:
          "Achab y bâtit un temple pour Baal, et une maison incrustée d'ivoire",
        refs: [
          { usfm: "1KI", ref: "16:31-33" },
          { usfm: "1KI", ref: "22:39" },
        ],
      },
      {
        id: "samaria-benhadad-siege",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Ben-hadad besieges it with thirty-two kings and is routed",
        labelFr:
          "Ben-Hadad l'assiège avec trente-deux rois et est mis en déroute",
        refs: [{ usfm: "1KI", ref: "20:1-21" }],
      },
      {
        id: "samaria-micaiah",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Four hundred prophets promise victory at the gate, and one does not",
        labelFr:
          "Quatre cents prophètes promettent la victoire à la porte, et un seul s'y refuse",
        refs: [{ usfm: "1KI", ref: "22:1-28" }],
      },
      {
        id: "samaria-ahab-buried",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Ahab is brought back dead from Ramoth-gilead and buried here",
        labelFr:
          "Achab est ramené mort de Ramoth en Galaad et enterré ici",
        refs: [{ usfm: "1KI", ref: "22:37" }],
      },
      {
        id: "samaria-ahaziah",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Ahaziah falls through an upper lattice and sends to Baal-zebub",
        labelFr:
          "Achazia tombe par le treillis de sa chambre haute et consulte Baal-Zebub",
        refs: [{ usfm: "2KI", ref: "1:2-4" }],
      },
      {
        id: "samaria-naaman",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Naaman arrives with a letter and an escort, and is sent to wash in the Jordan",
        labelFr:
          "Naaman arrive avec une lettre et une escorte, et est renvoyé se laver dans le Jourdain",
        refs: [{ usfm: "2KI", ref: "5:1-14" }],
      },
      {
        id: "samaria-blinded-army",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Elisha leads a blinded army into the city and feeds it",
        labelFr: "Élisée conduit dans la ville une armée aveuglée et la nourrit",
        descriptionEn:
          "An Aramean force sent to seize Elisha is struck blind, and he walks it straight through the gates of the enemy capital. The king of Israel asks twice whether he should kill them. Elisha tells him to set bread and water before them and send them home, and the raids stop.",
        descriptionFr:
          "Une troupe araméenne envoyée pour saisir Élisée est frappée d'aveuglement, et il la conduit tout droit aux portes de la capitale ennemie. Le roi d'Israël demande deux fois s'il doit les tuer. Élisée lui dit de leur servir du pain et de l'eau et de les renvoyer chez eux, et les incursions cessent.",
        refs: [{ usfm: "2KI", ref: "6:18-23" }],
      },
      {
        id: "samaria-famine-siege",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "A siege reduces the city to famine, and four lepers find the camp empty",
        labelFr:
          "Un siège réduit la ville à la famine, et quatre lépreux trouvent le camp vide",
        descriptionEn:
          "The blockade drives prices to the point where a donkey's head sells for silver and two women make a pact to eat their sons. Then four lepers, with nothing left to lose, walk out to the Aramean camp at dusk and find it abandoned. The relief is so complete that the officer who mocked the prophecy is trampled in the gateway.",
        descriptionFr:
          "Le blocus fait monter les prix au point qu'une tête d'âne se vend contre de l'argent et que deux femmes s'entendent pour manger leurs fils. Puis quatre lépreux, n'ayant plus rien à perdre, sortent au crépuscule vers le camp araméen et le trouvent abandonné. La délivrance est si complète que l'officier qui avait raillé la prophétie est piétiné sous la porte.",
        refs: [{ usfm: "2KI", ref: "6:24-7:20" }],
      },
      {
        id: "samaria-jehu-purge",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Jehu destroys Ahab's family and the worshippers of Baal in the city",
        labelFr:
          "Jéhu extermine la famille d'Achab et les adorateurs de Baal dans la ville",
        refs: [{ usfm: "2KI", ref: "10:17-28" }],
      },
      {
        id: "samaria-prophets-indict",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "The prophets set its ivory couches and its calf against the ruin to come",
        labelFr:
          "Les prophètes opposent ses lits d'ivoire et son veau à la ruine qui vient",
        refs: [
          { usfm: "AMO", ref: "6:1-7" },
          { usfm: "HOS", ref: "8:5-6" },
          { usfm: "MIC", ref: "1:6-7" },
        ],
      },
      {
        id: "samaria-fall",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Assyria takes the city after a three-year siege and deports Israel",
        labelFr:
          "L'Assyrie prend la ville après trois ans de siège et déporte Israël",
        descriptionEn:
          "Hoshea stops paying tribute and turns to Egypt. The Assyrian army comes, holds the hill for three years, and takes it in 722 BC. The population is resettled across the empire, and the northern kingdom simply stops existing. The account gives the reasons at length: this was two centuries in the making.",
        descriptionFr:
          "Osée cesse de payer le tribut et se tourne vers l'Égypte. L'armée assyrienne vient, tient la colline trois ans, et l'emporte en 722 av. J.-C. La population est dispersée à travers l'empire, et le royaume du Nord cesse simplement d'exister. Le récit en donne longuement les raisons : deux siècles y avaient conduit.",
        refs: [{ usfm: "2KI", ref: "17:5-6" }],
      },
      {
        id: "samaria-resettled",
        period: "exileReturn",
        weight: "notable",
        labelEn: "Foreign peoples are settled in its towns and taught to fear the Lord",
        labelFr:
          "Des peuples étrangers sont installés dans ses villes et instruits à craindre l'Éternel",
        refs: [{ usfm: "2KI", ref: "17:24-33" }],
      },
      {
        id: "samaria-letter-to-artaxerxes",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Its officials write to the king to stop the rebuilding of Jerusalem",
        labelFr:
          "Ses fonctionnaires écrivent au roi pour faire arrêter la reconstruction de Jérusalem",
        refs: [{ usfm: "EZR", ref: "4:8-24" }],
      },
      {
        id: "samaria-philip",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Philip preaches here, and the old barrier gives way",
        labelFr: "Philippe y prêche, et la vieille barrière cède",
        descriptionEn:
          "Scattered by the persecution in Jerusalem, Philip goes to the city Judeans avoided and is heard gladly. Peter and John are sent up to confirm what has happened. For a movement that began at a Passover in Jerusalem, this is the first deliberate step outside its own people.",
        descriptionFr:
          "Dispersé par la persécution de Jérusalem, Philippe va dans la ville que les Judéens évitaient, et on l'écoute volontiers. Pierre et Jean sont envoyés pour confirmer ce qui s'y est passé. Pour un mouvement né lors d'une Pâque à Jérusalem, c'est le premier pas délibéré hors de son propre peuple.",
        refs: [{ usfm: "ACT", ref: "8:5-17" }],
      },
      {
        id: "samaria-simon",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Simon the magician offers money for the power he has seen",
        labelFr:
          "Simon le magicien offre de l'argent pour le pouvoir qu'il a vu",
        refs: [{ usfm: "ACT", ref: "8:18-24" }],
      },
    ],
  },
  {
    id: "shechem",
    nameEn: "Shechem",
    nameFr: "Sichem",
    lng: 35.281944,
    lat: 32.213611,
    tier: "major",
    region: "samaria",
    blurbEn:
      "A pass between Mount Ebal and Mount Gerizim where Israel repeatedly renewed, and repeatedly broke, its covenants.",
    blurbFr:
      "Un col entre le mont Ébal et le mont Garizim, où Israël renouvela — et rompit — ses alliances à plusieurs reprises.",
    source: {
      site: "Tell Balatah",
      confidence: 1000,
      candidates: 1,
      slug: "shechem",
    },
    curated: true,
    events: [
      {
        id: "shechem-abram-altar",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Abram's first stop in Canaan, at the oak of Moreh",
        labelFr: "Première halte d'Abram en Canaan, au chêne de Moré",
        refs: [{ usfm: "GEN", ref: "12:6-7" }],
      },
      {
        id: "shechem-jacob-buys",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Jacob buys a plot of ground and builds an altar on it",
        labelFr: "Jacob achète une parcelle de terrain et y bâtit un autel",
        refs: [{ usfm: "GEN", ref: "33:18-20" }],
      },
      {
        id: "shechem-dinah",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Simeon and Levi answer Dinah's rape with a massacre",
        labelFr:
          "Siméon et Lévi répondent au viol de Dina par un massacre",
        refs: [{ usfm: "GEN", ref: "34:1-31" }],
      },
      {
        id: "shechem-buried-gods",
        period: "patriarchs",
        weight: "reference",
        labelEn: "Jacob buries the household's foreign gods under the oak",
        labelFr:
          "Jacob enterre sous le chêne les dieux étrangers de sa maison",
        refs: [{ usfm: "GEN", ref: "35:2-4" }],
      },
      {
        id: "shechem-joseph-sent",
        period: "patriarchs",
        weight: "reference",
        labelEn: "Joseph is sent here to look for his brothers",
        labelFr: "Joseph y est envoyé chercher ses frères",
        refs: [{ usfm: "GEN", ref: "37:12-14" }],
      },
      {
        id: "shechem-blessing-curse",
        period: "exodusConquest",
        weight: "headline",
        labelEn: "The blessing and the curse are read from the two mountains",
        labelFr: "La bénédiction et la malédiction sont lues des deux montagnes",
        descriptionEn:
          "Joshua builds an altar on Ebal and reads the whole law aloud with the nation drawn up in the valley between the two ridges, half facing one mountain and half the other. The setting does the teaching: the terms are read out in a place where you can see both outcomes at once.",
        descriptionFr:
          "Josué bâtit un autel sur l'Ébal et lit toute la loi à haute voix, le peuple rangé dans la vallée entre les deux crêtes, une moitié face à une montagne et l'autre face à l'autre. Le lieu enseigne autant que le texte : les termes sont proclamés là où l'on voit d'un seul regard les deux issues.",
        refs: [{ usfm: "JOS", ref: "8:30-35" }],
      },
      {
        id: "shechem-joshua-covenant",
        period: "exodusConquest",
        weight: "headline",
        labelEn: "Joshua makes the people choose, and sets up a stone as witness",
        labelFr:
          "Josué met le peuple devant un choix et dresse une pierre en témoin",
        descriptionEn:
          "At the end of his life Joshua gathers the tribes here and tells them plainly to pick whom they will serve, warning them they are not able to serve the Lord. They insist. He writes the terms down, sets a large stone under the oak, and tells them the stone has heard everything.",
        descriptionFr:
          "À la fin de sa vie, Josué rassemble ici les tribus et leur dit sans détour de choisir qui elles serviront, en les avertissant qu'elles n'en sont pas capables. Elles insistent. Il écrit les termes, dresse une grande pierre sous le chêne, et leur dit que cette pierre a tout entendu.",
        refs: [{ usfm: "JOS", ref: "24:1-28" }],
      },
      {
        id: "shechem-joseph-bones",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "Joseph's bones are buried in the plot Jacob bought",
        labelFr:
          "Les os de Joseph sont enterrés dans la parcelle achetée par Jacob",
        refs: [{ usfm: "JOS", ref: "24:32" }],
      },
      {
        id: "shechem-abimelech-king",
        period: "judges",
        weight: "notable",
        labelEn: "Abimelech is made king with temple silver, and Jotham shouts a fable from Gerizim",
        labelFr:
          "Abimélec est fait roi avec l'argent du temple, et Jotham crie une fable depuis le Garizim",
        refs: [{ usfm: "JDG", ref: "9:1-21" }],
      },
      {
        id: "shechem-abimelech-destroys",
        period: "judges",
        weight: "notable",
        labelEn: "Abimelech razes the city that crowned him and sows it with salt",
        labelFr:
          "Abimélec rase la ville qui l'a couronné et y sème du sel",
        refs: [{ usfm: "JDG", ref: "9:22-49" }],
      },
      {
        id: "shechem-kingdom-splits",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Rehoboam refuses to lighten the load, and the kingdom splits",
        labelFr:
          "Roboam refuse d'alléger la charge, et le royaume se divise",
        descriptionEn:
          "The northern tribes come here to ask Solomon's son for relief. He takes three days, ignores the older counsellors, and promises to be harsher than his father. Ten tribes walk out, and Israel is two kingdoms from that afternoon on.",
        descriptionFr:
          "Les tribus du nord viennent ici demander un allègement au fils de Salomon. Il prend trois jours, écarte l'avis des anciens et promet d'être plus dur que son père. Dix tribus s'en vont, et Israël est deux royaumes à partir de cet après-midi.",
        refs: [{ usfm: "1KI", ref: "12:1-19" }],
      },
      {
        id: "shechem-jeroboam-capital",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Jeroboam rebuilds it as his first capital",
        labelFr: "Jéroboam la rebâtit comme première capitale",
        refs: [{ usfm: "1KI", ref: "12:25" }],
      },
      {
        id: "shechem-woman-at-well",
        period: "gospels",
        weight: "headline",
        labelEn: "Jesus talks with a Samaritan woman at Jacob's well",
        labelFr: "Jésus parle avec une Samaritaine au puits de Jacob",
        descriptionEn:
          "Resting at the well beside the plot Jacob had bought, Jesus asks a Samaritan woman for a drink, which breaks two conventions at once. The conversation turns to her five husbands and then to where God should be worshipped, with Gerizim standing in plain view above them.",
        descriptionFr:
          "Assis au puits, près de la parcelle achetée par Jacob, Jésus demande à boire à une Samaritaine, ce qui rompt deux convenances d'un coup. L'entretien passe de ses cinq maris à la question du lieu où il faut adorer, le Garizim se dressant sous leurs yeux.",
        refs: [{ usfm: "JHN", ref: "4:1-42" }],
      },
    ],
  },
  {
    id: "shiloh",
    nameEn: "Shiloh",
    nameFr: "Silo",
    lng: 35.289536,
    lat: 32.055703,
    tier: "notable",
    region: "samaria",
    blurbEn:
      "Israel's sanctuary for the whole period of the judges, until the ark was carried out of it to a battle and never came back.",
    blurbFr:
      "Le sanctuaire d'Israël durant toute la période des juges, jusqu'au jour où l'arche en sortit pour une bataille et n'y revint jamais.",
    source: {
      site: "Khirbet Seilun",
      confidence: 1000,
      candidates: 1,
      slug: "shiloh",
    },
    curated: true,
    events: [
      {
        id: "shiloh-tent-set-up",
        period: "exodusConquest",
        weight: "headline",
        labelEn: "The tent of meeting is pitched here and the land divided by lot",
        labelFr:
          "La tente d'assignation y est dressée et le pays partagé par le sort",
        descriptionEn:
          "With the fighting largely over, the tabernacle is set up at Shiloh and the remaining land is surveyed and allotted in front of it. For the next three centuries this hill, not Jerusalem, is where Israel goes to appear before God.",
        descriptionFr:
          "Les combats étant pour l'essentiel terminés, le tabernacle est dressé à Silo et le reste du pays est relevé puis attribué par le sort devant lui. Pendant les trois siècles suivants, c'est sur cette colline, et non à Jérusalem, qu'Israël se présente devant Dieu.",
        refs: [{ usfm: "JOS", ref: "18:1-10" }],
      },
      {
        id: "shiloh-daughters",
        period: "judges",
        weight: "reference",
        labelEn: "Benjaminites carry off the girls dancing at the yearly feast",
        labelFr:
          "Des Benjamites enlèvent les filles qui dansent à la fête annuelle",
        refs: [{ usfm: "JDG", ref: "21:19-23" }],
      },
      {
        id: "shiloh-hannah",
        period: "judges",
        weight: "headline",
        labelEn: "Hannah prays without a sound and is taken for drunk",
        labelFr: "Anne prie sans un mot et on la croit ivre",
        descriptionEn:
          "Childless and taunted for it, Hannah prays at the doorpost with her lips moving and no voice, until Eli tells her to put the wine away. She vows that if she is given a son she will give him back, and when Samuel is weaned she brings him here and leaves him.",
        descriptionFr:
          "Sans enfant et raillée pour cela, Anne prie près du poteau de la porte, les lèvres remuant sans voix, jusqu'à ce qu'Éli lui dise de renoncer au vin. Elle promet que si un fils lui est donné, elle le rendra ; et Samuel sevré, elle l'amène ici et l'y laisse.",
        refs: [{ usfm: "1SA", ref: "1:9-28" }],
      },
      {
        id: "shiloh-elis-sons",
        period: "judges",
        weight: "notable",
        labelEn: "Eli's sons take the sacrifices by force and he does not stop them",
        labelFr:
          "Les fils d'Éli prennent les sacrifices de force et il ne les arrête pas",
        refs: [{ usfm: "1SA", ref: "2:12-25" }],
      },
      {
        id: "shiloh-samuel-called",
        period: "judges",
        weight: "headline",
        labelEn: "A boy hears his name in the night and thinks it is Eli",
        labelFr: "Un enfant entend son nom dans la nuit et croit que c'est Éli",
        descriptionEn:
          "The account notes that word from God was rare in those days. Samuel, sleeping near the ark, is called three times before Eli works out what is happening and tells him how to answer. The first message he is given is against the household he serves in.",
        descriptionFr:
          "Le récit précise que la parole de Dieu était rare en ces jours-là. Samuel, qui dort près de l'arche, est appelé trois fois avant qu'Éli comprenne ce qui arrive et lui apprenne comment répondre. Le premier message qu'il reçoit est dirigé contre la maison où il sert.",
        refs: [{ usfm: "1SA", ref: "3:1-21" }],
      },
      {
        id: "shiloh-ark-lost",
        period: "judges",
        weight: "headline",
        labelEn: "The ark is carried out to battle and does not come back",
        labelFr: "L'arche est emportée au combat et ne revient pas",
        descriptionEn:
          "Losing to the Philistines, Israel fetches the ark from Shiloh as a guarantee of victory and loses far worse. Eli's two sons are killed with it, and when the news reaches the old priest he falls backwards and breaks his neck. Shiloh's centuries as the sanctuary end in a single afternoon.",
        descriptionFr:
          "En train de perdre contre les Philistins, Israël fait venir l'arche de Silo comme gage de victoire et subit une défaite bien pire. Les deux fils d'Éli sont tués avec elle, et à la nouvelle le vieux prêtre tombe en arrière et se brise la nuque. Les siècles de Silo comme sanctuaire s'achèvent en un après-midi.",
        refs: [{ usfm: "1SA", ref: "4:1-22" }],
      },
      {
        id: "shiloh-ahijah",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Jeroboam's wife comes here in disguise to consult Ahijah",
        labelFr:
          "La femme de Jéroboam y vient déguisée pour consulter Achija",
        refs: [{ usfm: "1KI", ref: "14:1-18" }],
      },
      {
        id: "shiloh-jeremiah-warning",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Jeremiah tells the temple crowd to go and look at what became of Shiloh",
        labelFr:
          "Jérémie dit à la foule du temple d'aller voir ce qu'est devenue Silo",
        refs: [{ usfm: "JER", ref: "7:12-14" }],
      },
    ],
  },
  {
    id: "bethel",
    nameEn: "Bethel",
    nameFr: "Béthel",
    lng: 35.241389,
    lat: 31.922778,
    tier: "major",
    region: "samaria",
    blurbEn:
      "The place Jacob named \"house of God\" after a dream, and which the northern kingdom later turned into a state sanctuary with a golden calf in it.",
    blurbFr:
      "Le lieu que Jacob nomma « maison de Dieu » après un songe, et dont le royaume du Nord fit plus tard un sanctuaire d'État abritant un veau d'or.",
    source: {
      site: "Beitin",
      confidence: 716,
      candidates: 3,
      slug: "bethel-1",
    },
    curated: true,
    events: [
      {
        id: "bethel-abram-altar",
        period: "patriarchs",
        weight: "reference",
        labelEn: "Abram pitches his tent and builds an altar east of the town",
        labelFr:
          "Abram dresse sa tente et bâtit un autel à l'est de la ville",
        refs: [{ usfm: "GEN", ref: "12:8" }],
      },
      {
        id: "bethel-lot-parts",
        period: "patriarchs",
        weight: "reference",
        labelEn: "Abram and Lot come back here and agree to separate",
        labelFr: "Abram et Lot y reviennent et conviennent de se séparer",
        refs: [{ usfm: "GEN", ref: "13:1-11" }],
      },
      {
        id: "bethel-jacobs-dream",
        period: "patriarchs",
        weight: "headline",
        labelEn: "Jacob sleeps on a stone and sees a stairway to heaven",
        labelFr: "Jacob dort sur une pierre et voit un escalier vers le ciel",
        descriptionEn:
          "Running from his brother with nothing, Jacob stops for the night and dreams of a ramp between earth and heaven with traffic on it. He wakes convinced the place is a gate, sets up his pillow as a pillar, names it the house of God, and negotiates: if he is kept safe, this God will be his.",
        descriptionFr:
          "Fuyant son frère sans rien, Jacob s'arrête pour la nuit et rêve d'une rampe dressée entre la terre et le ciel, avec un va-et-vient dessus. Il s'éveille convaincu que le lieu est une porte, dresse sa pierre en monument, le nomme maison de Dieu, et négocie : s'il est gardé, ce Dieu sera le sien.",
        refs: [{ usfm: "GEN", ref: "28:10-22" }],
      },
      {
        id: "bethel-jacob-returns",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Jacob comes back decades later to build the altar he promised",
        labelFr:
          "Jacob revient des décennies plus tard bâtir l'autel qu'il avait promis",
        refs: [{ usfm: "GEN", ref: "35:1-15" }],
      },
      {
        id: "bethel-ai",
        period: "exodusConquest",
        weight: "notable",
        labelEn: "Israel is beaten at neighbouring Ai, then takes it by ambush",
        labelFr:
          "Israël est battu devant Aï, la ville voisine, puis la prend par embuscade",
        refs: [
          { usfm: "JOS", ref: "7:2-5" },
          { usfm: "JOS", ref: "8:1-29" },
        ],
      },
      {
        id: "bethel-deborah",
        period: "judges",
        weight: "reference",
        labelEn: "Deborah judges Israel under a palm on the road south of it",
        labelFr:
          "Débora juge Israël sous un palmier sur la route au sud de la ville",
        refs: [{ usfm: "JDG", ref: "4:5" }],
      },
      {
        id: "bethel-benjamin-war",
        period: "judges",
        weight: "reference",
        labelEn: "Israel inquires of God here during the war with Benjamin",
        labelFr:
          "Israël y consulte Dieu pendant la guerre contre Benjamin",
        refs: [{ usfm: "JDG", ref: "20:18-28" }],
      },
      {
        id: "bethel-samuel-circuit",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "Samuel includes it in his yearly circuit of judging",
        labelFr:
          "Samuel l'inclut dans sa tournée annuelle pour juger Israël",
        refs: [{ usfm: "1SA", ref: "7:16" }],
      },
      {
        id: "bethel-golden-calf",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Jeroboam sets up a golden calf and a festival of his own",
        labelFr: "Jéroboam y installe un veau d'or et une fête de son cru",
        descriptionEn:
          "Worried that pilgrimage to Jerusalem will pull his subjects back to the south, Jeroboam builds shrines at Bethel and Dan, appoints priests who are not Levites, and moves the autumn festival by a month. The books of Kings treat this single decision as the flaw that eventually brings the northern kingdom down.",
        descriptionFr:
          "Craignant que le pèlerinage à Jérusalem ramène ses sujets vers le sud, Jéroboam bâtit des sanctuaires à Béthel et à Dan, institue des prêtres qui ne sont pas Lévites, et décale d'un mois la fête d'automne. Les livres des Rois font de cette seule décision le vice qui finira par ruiner le royaume du Nord.",
        refs: [{ usfm: "1KI", ref: "12:26-33" }],
      },
      {
        id: "bethel-man-of-god",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "A prophet denounces the altar, then dies for believing a lie",
        labelFr:
          "Un prophète dénonce l'autel, puis meurt pour avoir cru un mensonge",
        refs: [{ usfm: "1KI", ref: "13:1-32" }],
      },
      {
        id: "bethel-elisha-boys",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Boys on the road up mock Elisha's bald head",
        labelFr:
          "Des garçons sur la montée se moquent du crâne chauve d'Élisée",
        refs: [{ usfm: "2KI", ref: "2:23-24" }],
      },
      {
        id: "bethel-amos-expelled",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Amos is told to take his preaching somewhere other than the king's sanctuary",
        labelFr:
          "On dit à Amos d'aller prêcher ailleurs qu'au sanctuaire du roi",
        refs: [{ usfm: "AMO", ref: "7:10-13" }],
      },
      {
        id: "bethel-josiah-destroys",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Josiah pulls the altar down and burns the bones on it",
        labelFr: "Josias abat l'autel et y brûle les ossements",
        descriptionEn:
          "Three centuries after Jeroboam built it, Josiah comes north, breaks the altar, burns the graves of its priests on it, and deliberately spares one tomb, the man of God who had spoken against the place when it was new. The narrative closes a loop it opened in 1 Kings 13.",
        descriptionFr:
          "Trois siècles après Jéroboam, Josias monte au nord, brise l'autel, y brûle les ossements de ses prêtres, et épargne délibérément un tombeau : celui de l'homme de Dieu qui avait parlé contre ce lieu quand il était neuf. Le récit referme une boucle ouverte en 1 Rois 13.",
        refs: [{ usfm: "2KI", ref: "23:15-20" }],
      },
    ],
  },
];

export const CITIES: City[] = [
  ...JUDEA,
  ...JORDAN_VALLEY,
  ...SAMARIA,
  ...GALILEE,
  ...COAST,
  ...SYRIA,
  ...MESOPOTAMIA,
  ...ASIA_MINOR,
  ...GREECE_ROME,
];
