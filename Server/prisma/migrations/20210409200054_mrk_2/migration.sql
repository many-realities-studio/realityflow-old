/*
  Warnings:

  - You are about to alter the column `X` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `Y` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `Z` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `Q_x` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `Q_y` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `Q_z` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `Q_w` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `S_x` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `S_y` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `S_z` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `R` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `G` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `B` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `A` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_db_object" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "X" REAL NOT NULL,
    "Y" REAL NOT NULL,
    "Z" REAL NOT NULL,
    "Q_x" REAL NOT NULL,
    "Q_y" REAL NOT NULL,
    "Q_z" REAL NOT NULL,
    "Q_w" REAL NOT NULL,
    "S_x" REAL NOT NULL,
    "S_y" REAL NOT NULL,
    "S_z" REAL NOT NULL,
    "R" REAL NOT NULL,
    "G" REAL NOT NULL,
    "B" REAL NOT NULL,
    "A" REAL NOT NULL,
    "Prefab" TEXT NOT NULL,
    "projectId" TEXT,
    FOREIGN KEY ("projectId") REFERENCES "project" ("Id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_db_object" ("_id", "Id", "Name", "X", "Y", "Z", "Q_x", "Q_y", "Q_z", "Q_w", "S_x", "S_y", "S_z", "R", "G", "B", "A", "Prefab", "projectId") SELECT "_id", "Id", "Name", "X", "Y", "Z", "Q_x", "Q_y", "Q_z", "Q_w", "S_x", "S_y", "S_z", "R", "G", "B", "A", "Prefab", "projectId" FROM "db_object";
DROP TABLE "db_object";
ALTER TABLE "new_db_object" RENAME TO "db_object";
CREATE UNIQUE INDEX "db_object.Id_unique" ON "db_object"("Id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
