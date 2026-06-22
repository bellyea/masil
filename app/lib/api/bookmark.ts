export async function fetchBookmarkStatus(id: string) {
  const res = await fetch(
    `/api/bookmarks/check?eventId=${id}`
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
      eventId: id,
    }),
  });

  return res.json();
}

export async function fetchBookmarks() {
  const res = await fetch("/api/bookmarks");
  return res.json();
}