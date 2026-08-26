import "./loadEnv.js";
import { type CrossReference, PrismaClient, type Verse } from "@prisma/client";

const LOCAL_DOCKER_DATABASE_URL = process.env.LOCAL_DATABASE_URL;
if (!LOCAL_DOCKER_DATABASE_URL) {
  throw new Error(
    "LOCAL_DATABASE_URL is required (local Postgres). Set it in .env; see .env.example.",
  );
}

const REMOTE_DATABASE_URL = process.env.DATABASE_URL;
if (!REMOTE_DATABASE_URL) {
  throw new Error("DATABASE_URL is required in environment");
}

const BATCH_SIZE = 1000;

const localPrisma = new PrismaClient({
  datasources: { db: { url: LOCAL_DOCKER_DATABASE_URL } },
});
const remotePrisma = new PrismaClient({
  datasources: { db: { url: REMOTE_DATABASE_URL } },
});

async function migrateVerses(): Promise<void> {
  console.log("[migrate] Verses: starting");
  let cursor: string | null = null;
  let totalMoved = 0;

  while (true) {
    const rows: Verse[] = await localPrisma.verse.findMany({
      ...(cursor
        ? {
            cursor: { uid: cursor },
            skip: 1,
          }
        : {}),
      take: BATCH_SIZE,
      orderBy: { uid: "asc" },
    });

    if (rows.length === 0) break;

    await remotePrisma.verse.createMany({
      data: rows.map((r: Verse) => ({
        uid: r.uid,
        text_en: r.text_en,
        text_fr: r.text_fr,
        book_name_en: r.book_name_en,
        book_name_fr: r.book_name_fr,
      })),
      skipDuplicates: true,
    });

    totalMoved += rows.length;
    cursor = rows[rows.length - 1]?.uid ?? null;
    if (totalMoved % 5000 === 0) {
      console.log(`[migrate] Verses: processed ${totalMoved}`);
    }
  }

  console.log(`[migrate] Verses: done (${totalMoved} rows processed)`);
}

async function migrateCrossReferences(): Promise<void> {
  console.log("[migrate] CrossReference: starting");
  let cursor: number | null = null;
  let totalMoved = 0;

  while (true) {
    const rows: CrossReference[] = await localPrisma.crossReference.findMany({
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      take: BATCH_SIZE,
      orderBy: { id: "asc" },
    });

    if (rows.length === 0) break;

    await remotePrisma.crossReference.createMany({
      data: rows.map((r: CrossReference) => ({
        source_uid: r.source_uid,
        target_uid: r.target_uid,
        weight: r.weight,
      })),
      skipDuplicates: true,
    });

    totalMoved += rows.length;
    cursor = rows[rows.length - 1]?.id ?? null;
    if (totalMoved % 20000 === 0) {
      console.log(`[migrate] CrossReference: processed ${totalMoved}`);
    }
  }

  console.log(`[migrate] CrossReference: done (${totalMoved} rows processed)`);
}

async function verifyCounts(): Promise<void> {
  const [localVerseCount, localCrossCount, remoteVerseCount, remoteCrossCount] = await Promise.all([
    localPrisma.verse.count(),
    localPrisma.crossReference.count(),
    remotePrisma.verse.count(),
    remotePrisma.crossReference.count(),
  ]);

  console.log("[verify] Local Verse:", localVerseCount);
  console.log("[verify] Remote Verse:", remoteVerseCount);
  console.log("[verify] Local CrossReference:", localCrossCount);
  console.log("[verify] Remote CrossReference:", remoteCrossCount);
  console.log("[verify] Connections table:", "N/A (no Connections model/table in current schema)");

  if (localVerseCount !== remoteVerseCount || localCrossCount !== remoteCrossCount) {
    throw new Error("Row-count mismatch between local and remote tables");
  }
}

async function main() {
  console.log("[migrate] Local source:", LOCAL_DOCKER_DATABASE_URL);
  console.log("[migrate] Remote target:", "DATABASE_URL from environment");

  await migrateVerses();
  await migrateCrossReferences();
  await verifyCounts();

  console.log("[migrate] Success: local data migrated and verified");
}

main()
  .catch((err) => {
    console.error("[migrate] Failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await Promise.all([localPrisma.$disconnect(), remotePrisma.$disconnect()]);
  });
