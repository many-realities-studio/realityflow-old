-- CreateTable
CREATE TABLE "behaviour" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Id" TEXT NOT NULL,
    "TypeOfTrigger" TEXT NOT NULL,
    "TriggerObjectId" TEXT NOT NULL,
    "TargetObjectId" TEXT NOT NULL,
    "ProjectId" TEXT NOT NULL,
    "NextBehaviour" TEXT NOT NULL,
    "Action" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "db_object" (
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

-- CreateTable
CREATE TABLE "project" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Description" TEXT NOT NULL,
    "DateModified" INTEGER NOT NULL,
    "ProjectName" TEXT NOT NULL,
    "ownerUsername" TEXT,
    FOREIGN KEY ("ownerUsername") REFERENCES "user" ("Username") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "Username" TEXT NOT NULL PRIMARY KEY,
    "Password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "vs_graph" (
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
    "projectId" TEXT,
    FOREIGN KEY ("projectId") REFERENCES "project" ("Id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "db_object.Id_unique" ON "db_object"("Id");
