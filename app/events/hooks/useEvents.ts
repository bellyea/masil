import { useInfiniteList } from "@/hooks/useInfiniteList";

export function useEvents(filter: any) {
  const { category, keyword, status } = filter;

  return useInfiniteList({
    key: ["events", category ?? "", keyword ?? "", status ?? ""],
    url: "/api/events",
    extraParams: filter,
  });
}