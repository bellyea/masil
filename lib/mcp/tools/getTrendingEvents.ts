import { prisma } from "@/lib/prisma";
import { viewerStore } from "@/lib/socket-store";
import { buildActiveEventWhere } from "@/lib/server/eventStatus";

const TRENDING_LIMIT = 5;

export async function getTrendingEvents() {
  const viewerMap = viewerStore.getMap();

  const ranked = Array.from(viewerMap.entries()).map(
    ([eventId, sockets]) => ({
      eventId,
      viewers: sockets.size,
    })
  );

  ranked.sort((a, b) => b.viewers - a.viewers);

  const top = ranked.slice(0, TRENDING_LIMIT);

  const ids = top.map((e) => e.eventId);

  if (ids.length === 0) {
    const latestEvents = await prisma.event.findMany({
      where: buildActiveEventWhere(),
      take: TRENDING_LIMIT,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      type: "fallback",
      items: latestEvents,
    };
  }

  const events = await prisma.event.findMany({
    where: {
      ...buildActiveEventWhere(),
      id: {
        in: ids,
      },
    },
  });

  const result = events.map((event) => ({
    ...event,
    viewers:
      viewerMap.get(event.id)?.size ?? 0,
  }));

  result.sort((a, b) => b.viewers - a.viewers);

  return {
    type: "trending",
    items: result,
  };
}