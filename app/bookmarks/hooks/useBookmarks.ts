import { useInfiniteQuery } from "@tanstack/react-query";

export function useBookmarks(userId: string) {
  return useInfiniteQuery({
    queryKey: ["bookmarks", userId],

    initialPageParam: undefined,

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      if (pageParam) params.set("cursor", pageParam);
      params.set("userId", userId);

      const res = await fetch(`/api/bookmarks?${params.toString()}`);
      return res.json();
    },

    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ?? undefined,
  });
}