import { prisma } from "@/lib/prisma";
import {
  fetchCultureEventDetail,
  fetchCultureEvents,
} from "../data/culture/fetchCultureEvents";
import {
  buildCultureDescription,
  mapCultureCategory,
  parseCultureDate,
} from "../data/culture/mappers";

export async function syncCultureEvents() {
  const list = await fetchCultureEvents({});
  let successCount = 0;

  for (const item of list) {
    try {
      const detail = await fetchCultureEventDetail(item.id);
      const images = [detail?.image, item.thumbnail].filter(Boolean) as string[];

      await prisma.event.upsert({
        where: { id: item.id },
        update: {
          title: detail?.title ?? item.title,
          venueName: item.place ?? "Unknown",
          category: mapCultureCategory(item.category),
          address: detail?.address ?? null,
          lat: detail?.lat ?? item.lat ?? null,
          lng: detail?.lng ?? item.lng ?? null,
          images,
          description: buildCultureDescription({
            description: detail?.description,
            price: detail?.price,
          }),
          website: detail?.website ?? null,
        },
        create: {
          id: item.id,
          title: detail?.title ?? item.title,
          category: mapCultureCategory(item.category),
          startDate: parseCultureDate(item.startDate),
          endDate: parseCultureDate(item.endDate),
          venueName: item.place ?? "Unknown",
          address: detail?.address ?? null,
          lat: detail?.lat ?? item.lat ?? null,
          lng: detail?.lng ?? item.lng ?? null,
          images,
          description: buildCultureDescription({
            description: detail?.description,
            price: detail?.price,
          }),
          website: detail?.website ?? null,
          viewCount: 0,
          isFeatured: false,
        },
      });

      successCount++;
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Event sync failed: ${item.id}`, error);
    }
  }

  return { inserted: successCount };
}
