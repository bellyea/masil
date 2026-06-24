import { prisma } from "@/lib/prisma";
import { EventCategory } from "@prisma/client";

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