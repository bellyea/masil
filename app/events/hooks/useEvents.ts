import { useInfiniteList } from "@/hooks/useInfiniteList";

export function useEvents(filter: any) {
  return useInfiniteList({
    key: ["events", filter],
    url: "/api/events",
    extraParams: filter,
  });
}