/*
  Warnings:

  - You are about to drop the column `position` on the `FootballProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "isAvailableForTrials" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferredRegions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "willingToRelocate" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FootballProfile" DROP COLUMN "position",
ADD COLUMN     "currentClub" TEXT,
ADD COLUMN     "playingStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "primaryPosition" TEXT,
ADD COLUMN     "secondaryPositions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "PhysicalAttributes" ADD COLUMN     "fitnessLevel" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "preferredFoot" "PreferredFoot" DEFAULT 'RIGHT';
