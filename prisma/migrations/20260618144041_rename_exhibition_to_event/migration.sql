/*
  Warnings:

  - You are about to drop the `Exhibition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Exhibition";

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL DEFAULT 'ETC',
    "description" TEXT,
    "thumbnail" TEXT,
    "website" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
