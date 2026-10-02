/*
  Warnings:

  - Changed the type of `bannerLink` on the `Events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "bannerLink",
ADD COLUMN     "bannerLink" JSONB NOT NULL;
