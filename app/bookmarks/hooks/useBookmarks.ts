import { useInfiniteList } from "@/hooks/useInfiniteList";

export function useBookmarks() {
  return useInfiniteList({
    key: ["bookmarks"],
    url: "/api/bookmarks",
  });
}