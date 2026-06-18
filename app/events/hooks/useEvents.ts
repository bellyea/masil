import { useInfiniteQuery } from "@tanstack/react-query";

type Filter = {
  category?: string;
  keyword?: string;
  status?: string;
};

export function useEvents(filter: Filter) {
  return useInfiniteQuery({
    queryKey: ["events", filter],

    initialPageParam: undefined,

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      if (pageParam) params.set("cursor", pageParam);

      if (filter.category) params.set("category", filter.category);
      if (filter.keyword) params.set("keyword", filter.keyword);
      if (filter.status) params.set("status", filter.status);

      const res = await fetch(`/api/events?${params.toString()}`);
      return res.json();
    },

    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ?? undefined,
  });
}