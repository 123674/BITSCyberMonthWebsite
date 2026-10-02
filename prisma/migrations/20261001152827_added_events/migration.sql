/*
  Warnings:

  - Added the required column `contactDetails` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventType` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formLink` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentDetails` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventTypeList" AS ENUM ('Completed', 'OnGoing', 'Upcomming');

-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "contactDetails" TEXT NOT NULL,
ADD COLUMN     "eventType" "EventTypeList" NOT NULL,
ADD COLUMN     "formLink" TEXT NOT NULL,
ADD COLUMN     "paymentDetails" TEXT NOT NULL;
