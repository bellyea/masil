import { NextResponse } from "next/server";
import { viewerStore } from "@/lib/socket-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const viewerMap = viewerStore.getMap();

  const ranked = Array.from(viewerMap.entries()).map(
    ([eventId, sockets]) => ({
      eventId,
      viewers: sockets.size,
    })
  );

  ranked.sort((a, b) => b.viewers - a.viewers);

  const top = ranked.slice(0, 10);

  const ids = top.map((e) => e.eventId);

  const events = await prisma.event.findMany({
    where: {
      id: { in: ids },
    },
  });

  const result = events.map((event) => ({
    ...event,
    viewers:
      viewerMap.get(event.id)?.size ?? 0,
  }));

  result.sort((a, b) => b.viewers - a.viewers);

  return NextResponse.json(result);
}