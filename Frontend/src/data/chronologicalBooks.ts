/**
 * **Event-timeline order**: when the story mainly unfolds in biblical history,
 * not the order of books in a printed Bible. Job sits with the patriarchal/wisdom world
 * after Genesis; Psalms largely after David’s narrative; Chronicles recap last in the OT arc.
 */
export type ChronologySection = {
  /** i18n key under `chronology.era.*` */
  eraKey: string;
  books: string[];
};

export const CHRONOLOGY_SECTIONS: ChronologySection[] = [
  {
    eraKey: "patriarchs",
    books: ["GEN", "JOB"],
  },
  {
    eraKey: "moses",
    books: ["EXO", "LEV", "NUM", "DEU"],
  },
  {
    eraKey: "conquestJudges",
    books: ["JOS", "JDG", "RUT"],
  },
  {
    eraKey: "unitedMonarchy",
    books: ["1SA", "2SA"],
  },
  {
    eraKey: "psalms",
    books: ["PSA"],
  },
  {
    eraKey: "dividedMonarchy",
    books: ["1KI", "2KI"],
  },
  {
    eraKey: "wisdomSolomon",
    books: ["PRO", "ECC", "SNG"],
  },
  {
    eraKey: "prophetsAssyrian",
    books: ["OBA", "JOL", "JON", "AMO", "HOS", "MIC", "ISA", "NAM", "HAB", "ZEP"],
  },
  {
    eraKey: "prophetsJudahFall",
    books: ["JER", "LAM"],
  },
  {
    eraKey: "exile",
    books: ["EZK", "DAN"],
  },
  {
    eraKey: "return",
    books: ["EZR", "NEH", "EST", "HAG", "ZEC", "MAL"],
  },
  {
    eraKey: "chroniclesRecap",
    books: ["1CH", "2CH"],
  },
  {
    eraKey: "gospelsActs",
    books: ["MAT", "MRK", "LUK", "JHN", "ACT"],
  },
  {
    eraKey: "epistles",
    books: [
      "1TH",
      "2TH",
      "GAL",
      "1CO",
      "2CO",
      "ROM",
      "EPH",
      "PHP",
      "COL",
      "1TI",
      "TIT",
      "2TI",
      "PHM",
      "HEB",
      "JAS",
      "1PE",
      "2PE",
      "1JN",
      "2JN",
      "3JN",
      "JUD",
    ],
  },
  {
    eraKey: "apocalyptic",
    books: ["REV"],
  },
];
