ALTER TABLE "User" ADD COLUMN "playerSearchEnabled" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "User_userType_playerSearchEnabled_idx" ON "User"("userType", "playerSearchEnabled");
