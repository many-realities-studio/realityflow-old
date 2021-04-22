/*
  Warnings:

  - You are about to alter the column `X` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `Y` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `Z` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `Q_x` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `Q_y` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `Q_z` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `Q_w` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `S_x` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `S_y` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `S_z` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `R` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `G` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `B` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `A` on the `db_object` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - Added the required column `paramIdToObjId` to the `vs_graph` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "db_object.Id_unique";

-- DropIndex
DROP INDEX "user.Username_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_db_object" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "X" INTEGER NOT NULL,
    "Y" INTEGER NOT NULL,
    "Z" INTEGER NOT NULL,
    "Q_x" INTEGER NOT NULL,
    "Q_y" INTEGER NOT NULL,
    "Q_z" INTEGER NOT NULL,
    "Q_w" INTEGER NOT NULL,
    "S_x" INTEGER NOT NULL,
    "S_y" INTEGER NOT NULL,
    "S_z" INTEGER NOT NULL,
    "R" INTEGER NOT NULL,
    "G" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    "A" INTEGER NOT NULL,
    "Prefab" TEXT NOT NULL,
    "projectId" TEXT,
    FOREIGN KEY ("projectId") REFERENCES "project" ("Id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_db_object" ("_id", "Id", "Name", "X", "Y", "Z", "Q_x", "Q_y", "Q_z", "Q_w", "S_x", "S_y", "S_z", "R", "G", "B", "A", "Prefab", "projectId") SELECT "_id", "Id", "Name", "X", "Y", "Z", "Q_x", "Q_y", "Q_z", "Q_w", "S_x", "S_y", "S_z", "R", "G", "B", "A", "Prefab", "projectId" FROM "db_object";
DROP TABLE "db_object";
ALTER TABLE "new_db_object" RENAME TO "db_object";
CREATE TABLE "new_vs_graph" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "serializedNodes" TEXT NOT NULL,
    "edges" TEXT NOT NULL,
    "groups" TEXT NOT NULL,
    "stackNodes" TEXT NOT NULL,
    "pinnedElements" TEXT NOT NULL,
    "exposedParameters" TEXT NOT NULL,
    "stickyNotes" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "scale" TEXT NOT NULL,
    "references" TEXT NOT NULL,
    "paramIdToObjId" TEXT NOT NULL,
    "projectId" TEXT,
    FOREIGN KEY ("projectId") REFERENCES "project" ("Id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_vs_graph" ("_id", "Id", "Name", "serializedNodes", "edges", "groups", "stackNodes", "pinnedElements", "exposedParameters", "stickyNotes", "position", "scale", "references", "projectId") SELECT "_id", "Id", "Name", "serializedNodes", "edges", "groups", "stackNodes", "pinnedElements", "exposedParameters", "stickyNotes", "position", "scale", "references", "projectId" FROM "vs_graph";
DROP TABLE "vs_graph";
ALTER TABLE "new_vs_graph" RENAME TO "vs_graph";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
