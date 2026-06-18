import { useQuery } from "@tanstack/react-query";
import { fetchBookmarkStatus } from "@/app/lib/api/bookmark";

export function useBookmark(id: string | string[] | undefined) {
  return useQuery({
    queryKey: ["bookmark", id],
    queryFn: () => fetchBookmarkStatus(id as string),
    enabled: !!id,
  });
}
