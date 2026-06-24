import { prisma } from "@/lib/prisma";

export async function getEventDetail(id: string) {
  return prisma.event.findUnique({
    where: {
      id,
    },
  });
}