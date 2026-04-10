-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLAYER', 'SCOUT');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('INCOMPLETE', 'JOURNEY_COMPLETED', 'COMPLETE');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('AMATEUR', 'ACADEMY', 'SEMI_PRO', 'PRO');

-- CreateEnum
CREATE TYPE "PreferredFoot" AS ENUM ('LEFT', 'RIGHT', 'BOTH');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "DrillType" AS ENUM ('TECHNICAL', 'ATHLETIC');

-- CreateEnum
CREATE TYPE "DrillSubmissionStatus" AS ENUM ('PENDING', 'VERIFIED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'PLAYER',
    "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "firstName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "phone" TEXT,
    "currentLocation" TEXT,
    "profilePhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryPosition" TEXT,
    "secondaryPositions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentClub" TEXT,
    "preferredFoot" "PreferredFoot",
    "experienceLevel" "ExperienceLevel",
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalAttributes" (
    "id" TEXT NOT NULL,
    "playerProfileId" TEXT NOT NULL,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "wingspanCm" DOUBLE PRECISION,
    "sprintSpeed" DOUBLE PRECISION,
    "staminaScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysicalAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballProfile" (
    "id" TEXT NOT NULL,
    "playerProfileId" TEXT NOT NULL,
    "dominantFoot" "PreferredFoot",
    "playingStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "strongestSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weakFootRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FootballProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "footballProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "durationSec" INTEGER,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProgram" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "positionFocus" TEXT NOT NULL,
    "description" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drill" (
    "id" TEXT NOT NULL,
    "trainingProgramId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "DrillType" NOT NULL,
    "instructions" TEXT NOT NULL,
    "videoUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrillSubmission" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "drillId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "status" "DrillSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrillSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricType" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "unit" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetricType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerStat" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "metricTypeId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shortlist" (
    "id" TEXT NOT NULL,
    "scoutId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerView" (
    "id" TEXT NOT NULL,
    "scoutId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_nationality_idx" ON "User"("nationality");

-- CreateIndex
CREATE INDEX "User_currentLocation_idx" ON "User"("currentLocation");

-- CreateIndex
CREATE INDEX "User_fullName_idx" ON "User"("fullName");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProfile_userId_key" ON "PlayerProfile"("userId");

-- CreateIndex
CREATE INDEX "PlayerProfile_primaryPosition_idx" ON "PlayerProfile"("primaryPosition");

-- CreateIndex
CREATE INDEX "PlayerProfile_currentClub_idx" ON "PlayerProfile"("currentClub");

-- CreateIndex
CREATE INDEX "PlayerProfile_experienceLevel_idx" ON "PlayerProfile"("experienceLevel");

-- CreateIndex
CREATE INDEX "PlayerProfile_isAvailable_primaryPosition_idx" ON "PlayerProfile"("isAvailable", "primaryPosition");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalAttributes_playerProfileId_key" ON "PhysicalAttributes"("playerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "FootballProfile_playerProfileId_key" ON "FootballProfile"("playerProfileId");

-- CreateIndex
CREATE INDEX "Achievement_footballProfileId_date_idx" ON "Achievement"("footballProfileId", "date");

-- CreateIndex
CREATE INDEX "Media_userId_createdAt_idx" ON "Media"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Media_type_idx" ON "Media"("type");

-- CreateIndex
CREATE INDEX "Media_status_idx" ON "Media"("status");

-- CreateIndex
CREATE INDEX "TrainingProgram_level_idx" ON "TrainingProgram"("level");

-- CreateIndex
CREATE INDEX "TrainingProgram_positionFocus_idx" ON "TrainingProgram"("positionFocus");

-- CreateIndex
CREATE INDEX "TrainingProgram_createdById_idx" ON "TrainingProgram"("createdById");

-- CreateIndex
CREATE INDEX "Drill_trainingProgramId_idx" ON "Drill"("trainingProgramId");

-- CreateIndex
CREATE INDEX "Drill_type_idx" ON "Drill"("type");

-- CreateIndex
CREATE INDEX "DrillSubmission_playerId_createdAt_idx" ON "DrillSubmission"("playerId", "createdAt");

-- CreateIndex
CREATE INDEX "DrillSubmission_drillId_createdAt_idx" ON "DrillSubmission"("drillId", "createdAt");

-- CreateIndex
CREATE INDEX "DrillSubmission_status_idx" ON "DrillSubmission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MetricType_key_key" ON "MetricType"("key");

-- CreateIndex
CREATE INDEX "MetricType_displayName_idx" ON "MetricType"("displayName");

-- CreateIndex
CREATE INDEX "PlayerStat_playerId_recordedAt_idx" ON "PlayerStat"("playerId", "recordedAt");

-- CreateIndex
CREATE INDEX "PlayerStat_playerId_metricTypeId_recordedAt_idx" ON "PlayerStat"("playerId", "metricTypeId", "recordedAt");

-- CreateIndex
CREATE INDEX "PlayerStat_metricTypeId_recordedAt_idx" ON "PlayerStat"("metricTypeId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStat_playerId_metricTypeId_recordedAt_key" ON "PlayerStat"("playerId", "metricTypeId", "recordedAt");

-- CreateIndex
CREATE INDEX "Shortlist_scoutId_createdAt_idx" ON "Shortlist"("scoutId", "createdAt");

-- CreateIndex
CREATE INDEX "Shortlist_playerId_createdAt_idx" ON "Shortlist"("playerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Shortlist_scoutId_playerId_key" ON "Shortlist"("scoutId", "playerId");

-- CreateIndex
CREATE INDEX "PlayerView_scoutId_viewedAt_idx" ON "PlayerView"("scoutId", "viewedAt");

-- CreateIndex
CREATE INDEX "PlayerView_playerId_viewedAt_idx" ON "PlayerView"("playerId", "viewedAt");

-- CreateIndex
CREATE INDEX "PlayerView_scoutId_playerId_idx" ON "PlayerView"("scoutId", "playerId");

-- AddForeignKey
ALTER TABLE "PlayerProfile" ADD CONSTRAINT "PlayerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalAttributes" ADD CONSTRAINT "PhysicalAttributes_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballProfile" ADD CONSTRAINT "FootballProfile_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_footballProfileId_fkey" FOREIGN KEY ("footballProfileId") REFERENCES "FootballProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProgram" ADD CONSTRAINT "TrainingProgram_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drill" ADD CONSTRAINT "Drill_trainingProgramId_fkey" FOREIGN KEY ("trainingProgramId") REFERENCES "TrainingProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrillSubmission" ADD CONSTRAINT "DrillSubmission_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrillSubmission" ADD CONSTRAINT "DrillSubmission_drillId_fkey" FOREIGN KEY ("drillId") REFERENCES "Drill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStat" ADD CONSTRAINT "PlayerStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStat" ADD CONSTRAINT "PlayerStat_metricTypeId_fkey" FOREIGN KEY ("metricTypeId") REFERENCES "MetricType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerView" ADD CONSTRAINT "PlayerView_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerView" ADD CONSTRAINT "PlayerView_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

