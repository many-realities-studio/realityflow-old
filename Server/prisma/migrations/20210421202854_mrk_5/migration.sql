/*
  Warnings:

  - Made the column `projectId` on table `vs_graph` required. This step will fail if there are existing NULL values in that column.

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
    "references" TEXT NOT NULL,
    "paramIdToObjId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    FOREIGN KEY ("projectId") REFERENCES "project" ("Id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_vs_graph" ("_id", "Id", "Name", "serializedNodes", "edges", "groups", "stackNodes", "pinnedElements", "exposedParameters", "stickyNotes", "position", "scale", "references", "paramIdToObjId", "projectId") SELECT "_id", "Id", "Name", "serializedNodes", "edges", "groups", "stackNodes", "pinnedElements", "exposedParameters", "stickyNotes", "position", "scale", "references", "paramIdToObjId", "projectId" FROM "vs_graph";
DROP TABLE "vs_graph";
ALTER TABLE "new_vs_graph" RENAME TO "vs_graph";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
