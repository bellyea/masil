import { useInfiniteList } from "@/hooks/useInfiniteList";
import type { EventCardEvent } from "@/components/event/EventCard";

type EventFilter = {
  category?: string;
  keyword?: string;
  status?: string;
};

type EventPage = {
  items: EventCardEvent[];
  nextCursor: string | null;
};

export function useEvents(filter: EventFilter) {
  const { category, keyword, status } = filter;

  return useInfiniteList<EventPage>({
    key: ["events", category ?? "", keyword ?? "", status ?? ""],
    url: "/api/events",
    extraParams: filter,
  });
}
