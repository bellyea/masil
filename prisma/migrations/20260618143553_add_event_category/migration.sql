-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('EXHIBITION', 'POPUP', 'FESTIVAL', 'PERFORMANCE', 'ETC');

-- AlterTable
ALTER TABLE "Exhibition" ADD COLUMN     "category" "EventCategory" NOT NULL DEFAULT 'ETC';
