import { EventCategory } from "@prisma/client";

export function isEventCategory(value: string | null): value is EventCategory {
  return Object.values(EventCategory).includes(value as EventCategory);
}