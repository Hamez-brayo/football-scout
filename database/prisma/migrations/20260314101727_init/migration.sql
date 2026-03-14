-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('TALENT', 'AGENT', 'CLUB');

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

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'IDENTITY_VERIFIED', 'COACH_VERIFIED', 'FULLY_VERIFIED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "nickname" TEXT,
    "fullName" TEXT,
    "dateOfBirth" TEXT,
    "nationality" TEXT,
    "phone" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentLocation" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "profilePhoto" TEXT,
    "coverPhoto" TEXT,
    "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mediaUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "userType" "UserType",
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "playingStatus" "PlayingStatus",
    "experienceLevel" "ExperienceLevel",
    "professionalFocus" "ProfessionalFocus",
    "position" TEXT,
    "currentClub" TEXT,
    "preferredFoot" "PreferredFoot",
    "agencyName" TEXT,
    "yearsExperience" INTEGER,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "clubName" TEXT,
    "clubRole" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalAttributes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "wingspan" DOUBLE PRECISION,
    "fitnessLevel" INTEGER NOT NULL DEFAULT 0,
    "preferredFoot" "PreferredFoot" DEFAULT 'RIGHT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysicalAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryPosition" TEXT,
    "secondaryPositions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentClub" TEXT,
    "previousClubs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "playingStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "strongFoot" "PreferredFoot",
    "experience" "ExperienceLevel",
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
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isAvailableForTrials" BOOLEAN NOT NULL DEFAULT false,
    "preferredRegions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "willingToRelocate" BOOLEAN NOT NULL DEFAULT false,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLinks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacySettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileVisibility" TEXT NOT NULL DEFAULT 'public',
    "contactInfoVisibility" TEXT NOT NULL DEFAULT 'private',
    "mediaVisibility" TEXT NOT NULL DEFAULT 'public',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivacySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalAttributes_userId_key" ON "PhysicalAttributes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FootballProfile_userId_key" ON "FootballProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_userId_key" ON "Availability"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLinks_userId_key" ON "SocialLinks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivacySettings_userId_key" ON "PrivacySettings"("userId");

-- AddForeignKey
ALTER TABLE "PhysicalAttributes" ADD CONSTRAINT "PhysicalAttributes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballProfile" ADD CONSTRAINT "FootballProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_footballProfileId_fkey" FOREIGN KEY ("footballProfileId") REFERENCES "FootballProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLinks" ADD CONSTRAINT "SocialLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivacySettings" ADD CONSTRAINT "PrivacySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
