import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { assertSameOrigin } from "@/lib/server/origin";

const VIEWER_TTL_MS = 30_000;

type CountRow = { count: number | bigint };

async function countActiveViewers(eventId: string) {
  const rows = await prisma.$queryRaw<CountRow[]>`
    SELECT COUNT(*)::int AS count
    FROM "EventViewer"
    WHERE "eventId" = ${eventId}
      AND "expiresAt" > NOW()
  `;

  return Number(rows[0]?.count ?? 0);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const count = await countActiveViewers(id);

  return NextResponse.json({ count });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : null;

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const expiresAt = new Date(Date.now() + VIEWER_TTL_MS);

  await prisma.$executeRaw`
    INSERT INTO "EventViewer" ("id", "eventId", "sessionId", "expiresAt", "updatedAt")
    VALUES (${randomUUID()}, ${id}, ${sessionId}, ${expiresAt}, NOW())
    ON CONFLICT ("eventId", "sessionId")
    DO UPDATE SET "expiresAt" = ${expiresAt}, "updatedAt" = NOW()
  `;

  await prisma.$executeRaw`
    DELETE FROM "EventViewer"
    WHERE "eventId" = ${id}
      AND "expiresAt" <= NOW()
  `;

  const count = await countActiveViewers(id);

  return NextResponse.json({ count });
}