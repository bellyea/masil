CREATE TABLE "EventViewer" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventViewer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EventViewer_eventId_sessionId_key" ON "EventViewer"("eventId", "sessionId");

CREATE INDEX "EventViewer_eventId_expiresAt_idx" ON "EventViewer"("eventId", "expiresAt");

ALTER TABLE "EventViewer" ADD CONSTRAINT "EventViewer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;