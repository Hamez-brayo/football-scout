/*
  Warnings:

  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePicture",
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "currentLocation" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "media" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "profilePhoto" TEXT;
