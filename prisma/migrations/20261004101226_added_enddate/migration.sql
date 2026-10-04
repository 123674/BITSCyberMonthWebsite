/*
  Warnings:

  - Made the column `emailIv` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailAuthTag` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailBlindIndex` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `endDate` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "userNameEncrypted" DROP NOT NULL,
ALTER COLUMN "userNameIv" DROP NOT NULL,
ALTER COLUMN "userNameAuthTag" DROP NOT NULL,
ALTER COLUMN "emailIv" SET NOT NULL,
ALTER COLUMN "emailAuthTag" SET NOT NULL,
ALTER COLUMN "emailBlindIndex" SET NOT NULL;

-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Admin_adminID_idx" ON "Admin"("adminID");
