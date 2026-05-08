import { z } from "zod";

export const langQuerySchema = z
  .object({
    lang: z.enum(["en", "fr"]).optional(),
  })
  .strict();

export type LangQuery = z.infer<typeof langQuerySchema>;

export const versesParamsSchema = z
  .object({
    book: z.string().trim().min(1).transform((v) => v.toUpperCase()),
    chapter: z.coerce.number().int().min(1),
  })
  .strict();

export type VersesParams = z.infer<typeof versesParamsSchema>;

const uidRegex = /^[A-Z0-9]+\.\d+\.\d+$/i;

export const uidParamSchema = z
  .object({
    verse_uid: z.string().trim().regex(uidRegex).transform((v) => v.toUpperCase()),
  })
  .strict();

export type UidParam = z.infer<typeof uidParamSchema>;

export const verseIdParamSchema = z
  .object({
    verseId: z.string().trim().regex(uidRegex).transform((v) => v.toUpperCase()),
  })
  .strict();

export type VerseIdParam = z.infer<typeof verseIdParamSchema>;
