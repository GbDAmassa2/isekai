-- CreateTable
CREATE TABLE "manga_rewards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mangaId" TEXT NOT NULL,
    "mangaTitle" TEXT NOT NULL,
    "episode" INTEGER NOT NULL,
    "experience" INTEGER,
    "abilities" JSONB,
    "items" JSONB,
    "titles" JSONB,
    "attributes" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "manga_rewards_mangaId_episode_key" ON "manga_rewards"("mangaId", "episode");
