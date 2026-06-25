import { prisma } from "@/lib/prisma";
import { EventCategory } from "@prisma/client";
import { buildActiveEventWhere } from "@/lib/server/eventStatus";

type SearchEventsParams = {
  keyword?: string;
  category?: EventCategory;
};

export async function searchEvents({
  keyword,
  category,
}: SearchEventsParams) {
  return prisma.event.findMany({
    where: {
      ...buildActiveEventWhere(),

      ...(keyword && {
        title: {
          contains: keyword,
          mode: "insensitive",
        },
      }),

      ...(category && {
        category,
      }),
    },

    take: 5,
  });
}