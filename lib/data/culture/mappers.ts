import { EventCategory } from "@prisma/client";

export function mapCultureCategory(category?: string): EventCategory {
  if (!category) return EventCategory.ETC;

  if (category.includes("전시")) return EventCategory.EXHIBITION;
  if (category.includes("연극")) return EventCategory.THEATER;
  if (category.includes("뮤지컬") || category.includes("오페라")) {
    return EventCategory.MUSICAL;
  }
  if (category.includes("행사") || category.includes("축제")) {
    return EventCategory.FESTIVAL;
  }
  if (
    category.includes("공연") ||
    category.includes("음악") ||
    category.includes("콘서트") ||
    category.includes("국악") ||
    category.includes("무용") ||
    category.includes("발레")
  ) {
    return EventCategory.PERFORMANCE;
  }

  return EventCategory.ETC;
}

export function parseCultureDate(date: string): Date {
  if (/^\d{8}$/.test(date)) {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);

    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  }

  return new Date(date);
}

export function buildCultureDescription(args: {
  description?: string;
  price?: string;
}) {
  const parts = [args.description, args.price ? `가격: ${args.price}` : undefined]
    .map((part) => part?.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join("\n\n") : null;
}
