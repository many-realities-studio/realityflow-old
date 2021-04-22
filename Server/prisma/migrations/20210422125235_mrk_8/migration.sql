/*
  Warnings:

  - A unique constraint covering the columns `[Id]` on the table `db_object` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "db_object.Id_unique" ON "db_object"("Id");
