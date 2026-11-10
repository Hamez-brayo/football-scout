CREATE TABLE "TrainingAttempt" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "drillId" TEXT NOT NULL,
    "videoUrl" TEXT,
    "notes" TEXT,
    "resultValue" DOUBLE PRECISION,
    "resultUnit" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TrainingAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TrainingAttempt_ownerId_createdAt_idx" ON "TrainingAttempt"("ownerId", "createdAt");
CREATE INDEX "TrainingAttempt_ownerId_isPublic_createdAt_idx" ON "TrainingAttempt"("ownerId", "isPublic", "createdAt");
ALTER TABLE "TrainingAttempt" ADD CONSTRAINT "TrainingAttempt_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
