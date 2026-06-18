import { useQuery } from "@tanstack/react-query";

export function useBookmark(id: string | string[] | undefined) {
  return useQuery({
    queryKey: ["bookmark", id],
    queryFn: async () => {
      const res = await fetch(
        `/api/bookmarks/check?userId=test-user&eventId=${id}`
      );
      return res.json();
    },
    enabled: !!id,
  });
}