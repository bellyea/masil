export async function fetchBookmarkStatus(id: string) {
  const res = await fetch(
    `/api/bookmarks/check?userId=test-user&eventId=${id}`
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
      userId: "test-user",
      eventId: id,
    }),
  });

  return res.json();
}

export async function fetchBookmarks() {
  const res = await fetch("/api/bookmarks?userId=test-user");
  return res.json();
}