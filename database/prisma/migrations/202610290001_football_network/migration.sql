-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserType" ADD VALUE 'SCOUT';
ALTER TYPE "UserType" ADD VALUE 'COACH';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biography" TEXT,
ADD COLUMN     "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "headline" TEXT;

-- CreateTable
CREATE TABLE "NetworkOrganisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "website" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkOrganisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkConnection" (
    "id" TEXT NOT NULL,
    "pairKey" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkMessage" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NetworkMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkPost" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NetworkPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkOpportunity" (
    "id" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "organisationId" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "applicationUrl" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NetworkOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrgMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrgMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "NetworkConnection_pairKey_key" ON "NetworkConnection"("pairKey");

-- CreateIndex
CREATE INDEX "NetworkConnection_requesterId_createdAt_idx" ON "NetworkConnection"("requesterId", "createdAt");

-- CreateIndex
CREATE INDEX "NetworkConnection_recipientId_createdAt_idx" ON "NetworkConnection"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "NetworkMessage_connectionId_createdAt_idx" ON "NetworkMessage"("connectionId", "createdAt");

-- CreateIndex
CREATE INDEX "NetworkPost_createdAt_idx" ON "NetworkPost"("createdAt");

-- CreateIndex
CREATE INDEX "NetworkOpportunity_status_expiresAt_createdAt_idx" ON "NetworkOpportunity"("status", "expiresAt", "createdAt");

-- CreateIndex
CREATE INDEX "_OrgMembers_B_index" ON "_OrgMembers"("B");

-- AddForeignKey
ALTER TABLE "NetworkOrganisation" ADD CONSTRAINT "NetworkOrganisation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkConnection" ADD CONSTRAINT "NetworkConnection_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkConnection" ADD CONSTRAINT "NetworkConnection_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkMessage" ADD CONSTRAINT "NetworkMessage_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "NetworkConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkMessage" ADD CONSTRAINT "NetworkMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkPost" ADD CONSTRAINT "NetworkPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkOpportunity" ADD CONSTRAINT "NetworkOpportunity_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkOpportunity" ADD CONSTRAINT "NetworkOpportunity_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "NetworkOrganisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrgMembers" ADD CONSTRAINT "_OrgMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "NetworkOrganisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrgMembers" ADD CONSTRAINT "_OrgMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
