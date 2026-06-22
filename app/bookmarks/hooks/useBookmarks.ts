import { useInfiniteQuery } from "@tanstack/react-query";

export function useBookmarks() {
  return useInfiniteQuery({
    queryKey: ["bookmarks"],

    initialPageParam: undefined,

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      if (pageParam) params.set("cursor", pageParam);

      const res = await fetch(`/api/bookmarks?${params.toString()}`);
      return res.json();
    },

    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ?? undefined,
  });
}