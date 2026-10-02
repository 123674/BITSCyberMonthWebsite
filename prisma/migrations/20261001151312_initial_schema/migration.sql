-- CreateEnum
CREATE TYPE "ModeList" AS ENUM ('Online', 'Offline', 'Mixed');

-- CreateTable
CREATE TABLE "Events" (
    "eventID" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "mode" "ModeList" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("eventID")
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminID" TEXT NOT NULL,
    "userNameEncrypted" TEXT NOT NULL,
    "userNameIv" TEXT NOT NULL,
    "userNameAuthTag" TEXT NOT NULL,
    "userNameKeyVersion" INTEGER NOT NULL DEFAULT 0,
    "emailEncrypted" TEXT NOT NULL,
    "emailIv" TEXT,
    "emailAuthTag" TEXT,
    "emailKeyVersion" INTEGER NOT NULL DEFAULT 0,
    "emailBlindIndex" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_emailEncrypted_key" ON "Admin"("emailEncrypted");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_emailBlindIndex_key" ON "Admin"("emailBlindIndex");
