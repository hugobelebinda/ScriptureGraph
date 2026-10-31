export interface TaggedWord {
  text: string;
  strongsId?: string;
}

export type TaggedVerse = TaggedWord[];

export interface StrongsEntry {
  id: string;
  original_word: string;
  transliteration: string;
  part_of_speech: string;
  definition: string;
  definitionFr?: string;
  glossFr?: string;
}

export interface InterlinearBook {
  book: string;
  dir: "rtl" | "ltr";
  chapters: Record<string, Record<string, { t: string; s?: string }[]>>;
}
