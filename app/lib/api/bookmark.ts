import { getCurrentUserId } from "@/app/lib/user";

export async function fetchBookmarkStatus(id: string) {
  const userId = getCurrentUserId();

  const res = await fetch(
    `/api/bookmarks/check?userId=${userId}&eventId=${id}`
  );
  return res.json();
}

export async function toggleBookmark(id: string) {
  const res = await fetch("/api/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: getCurrentUserId(),
      eventId: id,
    }),
  });

  return res.json();
}

export async function fetchBookmarks() {
  const userId = getCurrentUserId();

  const res = await fetch(`/api/bookmarks?userId=${userId}`);
  return res.json();
}