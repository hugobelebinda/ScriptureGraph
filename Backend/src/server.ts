import "./loadEnv.js";
import { Prisma } from "@prisma/client";
import cors from "cors";
import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "./db.js";
import {
  langQuerySchema,
  uidParamSchema,
  verseIdParamSchema,
  versesParamsSchema,
} from "./schemas/apiSchemas.js";

type VerseRow = {
  uid: string;
  text_en: string;
  text_fr: string;
  book_name_en: string;
  book_name_fr: string;
};

type EdgeRow = {
  source_uid: string;
  target_uid: string;
  weight: number;
  depth: number;
};

type CytoscapeNode = {
  data: {
    id: string;
    uid: string;
    book: string;
    label: string;
    text_en: string;
    text_fr: string;
    book_name_en: string;
    book_name_fr: string;
    distance: number;
  };
};

type CytoscapeEdge = {
  data: {
    id: string;
    source: string;
    target: string;
    weight: number;
    depth: number;
  };
};

type RankedFeedItem = {
  uid: string;
  distance: number;
  book: string;
  text_en: string;
  text_fr: string;
  book_name_en: string;
  book_name_fr: string;
  relevance: number;
};

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

const generalLimiter = rateLimit({
  windowMs: 60_000,
  max: 180,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down." },
});

const heavyReadLimiter = rateLimit({
  windowMs: 60_000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many graph queries, please retry in a moment." },
});

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "HEAD"],
  }),
);
app.use(express.json());
app.use(generalLimiter);

function normalizeBook(book: string): string {
  return book.trim().toUpperCase();
}

function verseSortKey(uid: string): number {
  const parts = uid.split(".");
  const v = parts[2];
  return v ? parseInt(v, 10) : 0;
}

function normalizeVerseUid(uid: string): string {
  return uid.trim().toUpperCase();
}

function isUid(uid: string): boolean {
  return /^[A-Z0-9]+\.\d+\.\d+$/i.test(uid);
}

function bookFromUid(uid: string): string {
  return uid.split(".")[0] ?? "UNK";
}

async function ensureCrossReferenceCompositeIndex(): Promise<void> {
  const idxRows = await prisma.$queryRaw<{ indexname: string; indexdef: string }[]>(Prisma.sql`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND lower(tablename) = lower('CrossReference')
  `);

  const hasComposite = idxRows.some((row) => {
    const def = row.indexdef.replace(/\s+/g, " ").toLowerCase();
    return def.includes("(source_uid, target_uid)") || def.includes("(\"source_uid\", \"target_uid\")");
  });

  if (!hasComposite) {
    await prisma.$executeRawUnsafe(
      'CREATE INDEX IF NOT EXISTS "idx_crossreference_source_target" ON "CrossReference" ("source_uid", "target_uid")',
    );
    console.log("[db] Created idx_crossreference_source_target");
  } else {
    console.log("[db] Composite index on (source_uid, target_uid) already present");
  }
}

function rankFeed(
  centerUid: string,
  edgeRows: EdgeRow[],
  nodes: CytoscapeNode[],
): {
  feed: RankedFeedItem[];
  core_uids: string[];
  strong_uids: string[];
  all_uids: string[];
} {
  const relevanceByUid = new Map<string, number>();
  const directWeightByUid = new Map<string, number>();
  for (const edge of edgeRows) {
    const target = edge.target_uid;
    if (target === centerUid) continue;
    const depthFactor = edge.depth === 1 ? 1 : 0.55;
    const score = edge.weight * depthFactor;
    const prev = relevanceByUid.get(target) ?? 0;
    if (score > prev) relevanceByUid.set(target, score);

    // Tiers shown in graph are based on direct links from center verse.
    if (edge.depth === 1 && edge.source_uid === centerUid) {
      const prevDirect = directWeightByUid.get(target) ?? Number.NEGATIVE_INFINITY;
      if (edge.weight > prevDirect) directWeightByUid.set(target, edge.weight);
    }
  }

  const feed = nodes
    .filter((n) => n.data.uid !== centerUid)
    .map((node) => ({
      uid: node.data.uid,
      distance: node.data.distance,
      book: node.data.book,
      text_en: node.data.text_en,
      text_fr: node.data.text_fr,
      book_name_en: node.data.book_name_en,
      book_name_fr: node.data.book_name_fr,
      relevance: relevanceByUid.get(node.data.uid) ?? 0,
    }))
    .sort((a, b) => {
      if (b.relevance !== a.relevance) return b.relevance - a.relevance;
      if (a.distance !== b.distance) return a.distance - b.distance;
      return a.uid.localeCompare(b.uid);
    });

  const directRankedUids = [...directWeightByUid.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    })
    .map(([uid]) => uid);

  const core_uids = directRankedUids.slice(0, 10);
  const strong_uids = directRankedUids.slice(10, 25);
  const all_uids = feed.map((f) => f.uid);

  return { feed, core_uids, strong_uids, all_uids };
}

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/api/verses/:book/:chapter", async (req: Request, res: Response) => {
  const parsedParams = versesParamsSchema.safeParse(req.params);
  const parsedQuery = langQuerySchema.safeParse(req.query);
  if (!parsedParams.success || !parsedQuery.success) {
    res.status(400).json({ error: "Invalid book or chapter" });
    return;
  }
  const { book, chapter } = parsedParams.data;
  const lang = parsedQuery.data.lang ?? "en";

  try {
    const rows = await prisma.verse.findMany({
      where: { uid: { startsWith: `${book}.${chapter}.` } },
    });
    rows.sort((a: VerseRow, b: VerseRow) => verseSortKey(a.uid) - verseSortKey(b.uid));

    const book_name = lang === "fr" ? (rows[0]?.book_name_fr ?? null) : (rows[0]?.book_name_en ?? null);

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
});

const CONNECTIONS_LIMIT = 500;

app.get("/api/connections/:verse_uid", heavyReadLimiter, async (req: Request, res: Response) => {
  const parsedParams = uidParamSchema.safeParse(req.params);
  const parsedQuery = langQuerySchema.safeParse(req.query);
  if (!parsedParams.success || !parsedQuery.success) {
    res.status(400).json({ error: "Invalid verse_uid (expected e.g. JHN.3.16)" });
    return;
  }
  const lang = parsedQuery.data.lang ?? "en";
  const normalized = parsedParams.data.verse_uid;

  try {
    const links = await prisma.crossReference.findMany({
      where: { source_uid: normalized },
      orderBy: [{ weight: "desc" }, { target_uid: "asc" }],
      take: CONNECTIONS_LIMIT,
    });

    const targets = [...new Set(links.map((l: { target_uid: string }) => l.target_uid))];
    const verseRows: VerseRow[] =
      targets.length > 0
        ? await prisma.verse.findMany({
            where: { uid: { in: targets } },
          })
        : [];
    const byUid = new Map<string, VerseRow>(verseRows.map((v: VerseRow) => [v.uid, v]));

    res.json({
      source_uid: normalized,
      lang,
      connections: links.map((l: { target_uid: string; weight: number }) => {
        const v = byUid.get(l.target_uid);
        return {
          target_uid: l.target_uid,
          weight: l.weight,
          text: v ? (lang === "fr" ? v.text_fr : v.text_en) : null,
          book_name: v ? (lang === "fr" ? v.book_name_fr : v.book_name_en) : null,
        };
      }),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/cross-references/:verseId", heavyReadLimiter, async (req: Request, res: Response) => {
  const parsedParams = verseIdParamSchema.safeParse(req.params);
  const parsedQuery = langQuerySchema.safeParse(req.query);
  if (!parsedParams.success || !parsedQuery.success) {
    res.status(400).json({ error: "Invalid verseId (expected e.g. JHN.3.16)" });
    return;
  }
  const lang = parsedQuery.data.lang ?? "en";
  const centerUid = parsedParams.data.verseId;

  try {
    const edgeRows = await prisma.$queryRaw<EdgeRow[]>(Prisma.sql`
      WITH RECURSIVE walk AS (
        SELECT
          cr.source_uid,
          cr.target_uid,
          cr.weight,
          1::int AS depth
        FROM "CrossReference" cr
        WHERE cr.source_uid = ${centerUid}

        UNION ALL

        SELECT
          cr.source_uid,
          cr.target_uid,
          cr.weight,
          walk.depth + 1
        FROM "CrossReference" cr
        INNER JOIN walk ON cr.source_uid = walk.target_uid
        WHERE walk.depth < 2
      ),
      dedup AS (
        SELECT
          source_uid,
          target_uid,
          MAX(weight)::int AS weight,
          MIN(depth)::int AS depth
        FROM walk
        GROUP BY source_uid, target_uid
      )
      SELECT source_uid, target_uid, weight, depth
      FROM dedup
      ORDER BY depth ASC, weight DESC, source_uid ASC, target_uid ASC
      LIMIT 6000
    `);

    const uidSet = new Set<string>([centerUid]);
    for (const edge of edgeRows) {
      uidSet.add(edge.source_uid);
      uidSet.add(edge.target_uid);
    }

    const verseRows = await prisma.verse.findMany({
      where: { uid: { in: [...uidSet] } },
    });
    const verseByUid = new Map(verseRows.map((row) => [row.uid, row]));

    const distance = new Map<string, number>();
    distance.set(centerUid, 0);
    for (const edge of edgeRows) {
      const srcDistance = distance.get(edge.source_uid);
      if (srcDistance === undefined) continue;
      const nextDistance = Math.min(2, srcDistance + 1);
      const prev = distance.get(edge.target_uid);
      if (prev === undefined || nextDistance < prev) {
        distance.set(edge.target_uid, nextDistance);
      }
    }

    const nodes: CytoscapeNode[] = [...uidSet]
      .filter((uid) => verseByUid.has(uid))
      .map((uid) => {
        const verse = verseByUid.get(uid) as VerseRow;
        return {
          data: {
            id: uid,
            uid,
            book: bookFromUid(uid),
            label: uid,
            text_en: verse.text_en,
            text_fr: verse.text_fr,
            book_name_en: verse.book_name_en,
            book_name_fr: verse.book_name_fr,
            distance: distance.get(uid) ?? (uid === centerUid ? 0 : 2),
          },
        };
      });

    const edges: CytoscapeEdge[] = edgeRows
      .filter((edge) => verseByUid.has(edge.source_uid) && verseByUid.has(edge.target_uid))
      .map((edge) => ({
        data: {
          id: `${edge.source_uid}->${edge.target_uid}`,
          source: edge.source_uid,
          target: edge.target_uid,
          weight: edge.weight,
          depth: edge.depth,
        },
      }));

    const ranking = rankFeed(centerUid, edgeRows, nodes);

    res.json({
      center_uid: centerUid,
      lang,
      ranking_method: "weight_depth_v1",
      ranking_lens: {
        description:
          "Data-driven relevance using cross-reference weight with depth penalty. Not a theological authority ranking.",
        depth_factor: { depth_1: 1, depth_2: 0.55 },
      },
      stats: {
        nodes: nodes.length,
        edges: edges.length,
      },
      graph: { nodes, edges },
      feed: ranking.feed,
      ranking: {
        core_uids: ranking.core_uids,
        strong_uids: ranking.strong_uids,
        all_uids: ranking.all_uids,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
});

async function start() {
  await ensureCrossReferenceCompositeIndex();
  app.listen(PORT, () => {
    console.log(`API http://localhost:${PORT}`);
    console.log(`CORS origin: ${FRONTEND_ORIGIN}`);
  });
}

const isServerlessRuntime = process.env.VERCEL === "1" || process.env.VERCEL === "true";

if (!isServerlessRuntime) {
  start().catch((error) => {
    console.error("Failed to start API:", error);
    process.exit(1);
  });
} else {
  ensureCrossReferenceCompositeIndex().catch((error) => {
    // In serverless mode, don't crash process on cold-start setup checks.
    console.error("Index check failed during serverless boot:", error);
  });
}

export default app;
