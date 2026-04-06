import "./loadEnv.js";
import cors from "cors";
import express, { type Request, type Response } from "express";
import { prisma } from "./db.js";

/** Matches `Verse` rows returned by Prisma (avoids brittle re-exports in tooling). */
type VerseRow = {
  uid: string;
  text_en: string;
  text_fr: string;
  book_name_en: string;
  book_name_fr: string;
};

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

function parseLang(q: unknown): "en" | "fr" {
  return q === "fr" ? "fr" : "en";
}

function normalizeBook(book: string): string {
  return book.trim().toUpperCase();
}

function verseSortKey(uid: string): number {
  const parts = uid.split(".");
  const v = parts[2];
  return v ? parseInt(v, 10) : 0;
}

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

/**
 * GET /api/verses/:book/:chapter?lang=en|fr
 * `book` is USFM (e.g. GEN, JHN, 1CO). `lang` picks displayed `text` / `book_name`.
 */
app.get(
  "/api/verses/:book/:chapter",
  async (req: Request, res: Response) => {
    const book = normalizeBook(req.params.book ?? "");
    const chapter = parseInt(req.params.chapter ?? "", 10);
    const lang = parseLang(req.query.lang);

    if (!book || !Number.isFinite(chapter) || chapter < 1) {
      res.status(400).json({ error: "Invalid book or chapter" });
      return;
    }

    try {
      const rows = await prisma.verse.findMany({
        where: { uid: { startsWith: `${book}.${chapter}.` } },
      });
      rows.sort(
        (a: VerseRow, b: VerseRow) => verseSortKey(a.uid) - verseSortKey(b.uid),
      );

      const book_name =
        lang === "fr"
          ? (rows[0]?.book_name_fr ?? null)
          : (rows[0]?.book_name_en ?? null);

      res.json({
        book,
        chapter,
        lang,
        book_name,
        verses: rows.map((v: VerseRow) => ({
          uid: v.uid,
          text: lang === "fr" ? v.text_fr : v.text_en,
          text_en: v.text_en,
          text_fr: v.text_fr,
        })),
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Database error" });
    }
  },
);

const CONNECTIONS_LIMIT = 500;

/**
 * GET /api/connections/:verse_uid?lang=en|fr
 * `verse_uid` is one path segment, e.g. JHN.3.16 (dots allowed; only `/` splits segments).
 */
app.get(
  "/api/connections/:verse_uid",
  async (req: Request, res: Response) => {
    const source_uid = req.params.verse_uid ?? "";
    const lang = parseLang(req.query.lang);

    if (!source_uid || !/^[A-Z0-9]+\.\d+\.\d+$/i.test(source_uid)) {
      res.status(400).json({ error: "Invalid verse_uid (expected e.g. JHN.3.16)" });
      return;
    }

    const normalized = source_uid.toUpperCase();

    try {
      const links = await prisma.crossReference.findMany({
        where: { source_uid: normalized },
        orderBy: [{ weight: "desc" }, { target_uid: "asc" }],
        take: CONNECTIONS_LIMIT,
      });

      const targets = [
        ...new Set(links.map((l: { target_uid: string }) => l.target_uid)),
      ];
      const verseRows: VerseRow[] =
        targets.length > 0
          ? await prisma.verse.findMany({
              where: { uid: { in: targets } },
            })
          : [];
      const byUid = new Map<string, VerseRow>(
        verseRows.map((v: VerseRow) => [v.uid, v]),
      );

      res.json({
        source_uid: normalized,
        lang,
        connections: links.map((l: { target_uid: string; weight: number }) => {
          const v = byUid.get(l.target_uid);
          return {
            target_uid: l.target_uid,
            weight: l.weight,
            text: v
              ? lang === "fr"
                ? v.text_fr
                : v.text_en
              : null,
            book_name: v
              ? lang === "fr"
                ? v.book_name_fr
                : v.book_name_en
              : null,
          };
        }),
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Database error" });
    }
  },
);

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
  console.log(`CORS origin: ${FRONTEND_ORIGIN}`);
});
