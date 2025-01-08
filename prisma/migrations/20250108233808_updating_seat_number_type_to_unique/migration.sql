-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tables" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 8,
    "owner" INTEGER,
    "eventId" INTEGER NOT NULL,
    "isTaken" BOOLEAN NOT NULL DEFAULT false,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tables_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tables" ("createdAt", "eventId", "id", "isPaid", "isTaken", "number", "owner", "seats", "updatedAt") SELECT "createdAt", "eventId", "id", "isPaid", "isTaken", "number", "owner", "seats", "updatedAt" FROM "Tables";
DROP TABLE "Tables";
ALTER TABLE "new_Tables" RENAME TO "Tables";
CREATE UNIQUE INDEX "Tables_number_key" ON "Tables"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
