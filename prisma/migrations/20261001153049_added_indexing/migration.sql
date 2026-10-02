/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventSlug]` on the table `Events` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventSlug` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "eventSlug" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Events_title_key" ON "Events"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Events_eventSlug_key" ON "Events"("eventSlug");

-- CreateIndex
CREATE INDEX "Events_title_eventSlug_idx" ON "Events"("title", "eventSlug");
