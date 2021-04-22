/*
  Warnings:

  - You are about to drop the column `references` on the `vs_graph` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "paramIdToObjId" TEXT NOT NULL,
    "projectId" TEXT,
    FOREIGN KEY ("projectId") REFERENCES "project" ("Id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_vs_graph" ("_id", "Id", "Name", "serializedNodes", "edges", "groups", "stackNodes", "pinnedElements", "exposedParameters", "stickyNotes", "position", "scale", "paramIdToObjId", "projectId") SELECT "_id", "Id", "Name", "serializedNodes", "edges", "groups", "stackNodes", "pinnedElements", "exposedParameters", "stickyNotes", "position", "scale", "paramIdToObjId", "projectId" FROM "vs_graph";
DROP TABLE "vs_graph";
ALTER TABLE "new_vs_graph" RENAME TO "vs_graph";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
