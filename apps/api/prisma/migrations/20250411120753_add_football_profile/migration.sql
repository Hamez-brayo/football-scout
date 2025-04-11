-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('TALENT', 'AGENT', 'CLUB');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "UserType";

-- CreateTable
CREATE TABLE "FootballProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "preferredFoot" TEXT NOT NULL DEFAULT 'RIGHT',
    "experienceLevel" TEXT,
    "experience" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FootballProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FootballProfile_userId_key" ON "FootballProfile"("userId");

-- AddForeignKey
ALTER TABLE "FootballProfile" ADD CONSTRAINT "FootballProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
