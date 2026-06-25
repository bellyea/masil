import { useInfiniteList } from "@/hooks/useInfiniteList";
import type { EventCardEvent } from "@/components/event/EventCard";

type BookmarkItem = {
  id: string;
  event: EventCardEvent;
};

type BookmarkPage = {
  items: BookmarkItem[];
  nextCursor: string | null;
};

export function useBookmarks() {
  return useInfiniteList<BookmarkPage>({
    key: ["bookmarks"],
    url: "/api/bookmarks",
  });
}
