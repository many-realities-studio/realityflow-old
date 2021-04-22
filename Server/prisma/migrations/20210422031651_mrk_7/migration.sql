/*
  Warnings:

  - A unique constraint covering the columns `[Id]` on the table `vs_graph` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vs_graph.Id_unique" ON "vs_graph"("Id");
