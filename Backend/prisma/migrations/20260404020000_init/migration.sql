-- CreateTable
CREATE TABLE "Verse" (
    "uid" TEXT NOT NULL,
    "text_en" TEXT NOT NULL,
    "text_fr" TEXT NOT NULL,
    "book_name_en" TEXT NOT NULL,
    "book_name_fr" TEXT NOT NULL,

    CONSTRAINT "Verse_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "CrossReference" (
    "id" SERIAL NOT NULL,
    "source_uid" TEXT NOT NULL,
    "target_uid" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "CrossReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrossReference_source_uid_target_uid_key" ON "CrossReference"("source_uid", "target_uid");

-- CreateIndex
CREATE INDEX "CrossReference_source_uid_idx" ON "CrossReference"("source_uid");

-- CreateIndex
CREATE INDEX "CrossReference_target_uid_idx" ON "CrossReference"("target_uid");
