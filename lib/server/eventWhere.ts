import { Prisma, EventCategory } from "@prisma/client";
import { buildStatusWhere, EventStatus } from "./eventStatus";

type EventFilter = {
  category?: EventCategory;
  keyword?: string;
  status?: EventStatus;
};

export function buildEventWhere({
  category,
  keyword,
  status,
}: EventFilter): Prisma.EventWhereInput {
  const where: Prisma.EventWhereInput = {};

  if (category) where.category = category;

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  Object.assign(where, buildStatusWhere(status));

  return where;
}