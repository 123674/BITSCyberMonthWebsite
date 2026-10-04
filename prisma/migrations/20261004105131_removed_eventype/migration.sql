/*
  Warnings:

  - You are about to drop the column `eventType` on the `Events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "eventType";

-- DropEnum
DROP TYPE "EventTypeList";
