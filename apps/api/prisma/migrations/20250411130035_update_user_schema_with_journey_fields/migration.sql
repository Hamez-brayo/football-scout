/*
  Warnings:

  - The `registrationStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `FootballProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('INCOMPLETE', 'JOURNEY_COMPLETED', 'COMPLETE');

-- CreateEnum
CREATE TYPE "PlayingStatus" AS ENUM ('PLAYING', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO');

-- CreateEnum
CREATE TYPE "PreferredFoot" AS ENUM ('LEFT', 'RIGHT', 'BOTH');

-- CreateEnum
CREATE TYPE "ProfessionalFocus" AS ENUM ('PLAYER_DEVELOPMENT', 'TEAM_OPERATIONS', 'TALENT_DISCOVERY', 'CLUB_MANAGEMENT');

-- DropForeignKey
ALTER TABLE "FootballProfile" DROP CONSTRAINT "FootballProfile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agencyName" TEXT,
ADD COLUMN     "clubName" TEXT,
ADD COLUMN     "clubRole" TEXT,
ADD COLUMN     "coverPhoto" TEXT,
ADD COLUMN     "currentClub" TEXT,
ADD COLUMN     "dateOfBirth" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "documents" TEXT[],
ADD COLUMN     "experienceLevel" "ExperienceLevel",
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "playingStatus" "PlayingStatus",
ADD COLUMN     "position" TEXT,
ADD COLUMN     "preferredFoot" "PreferredFoot",
ADD COLUMN     "professionalFocus" "ProfessionalFocus",
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "specialties" TEXT[],
ADD COLUMN     "videos" TEXT[],
ADD COLUMN     "yearsExperience" INTEGER,
DROP COLUMN "registrationStatus",
ADD COLUMN     "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'INCOMPLETE';

-- DropTable
DROP TABLE "FootballProfile";
