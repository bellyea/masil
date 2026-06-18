"use client";

import { useQuery } from "@tanstack/react-query";

const fetchBookmarks = async () => {
  const res = await fetch("/api/bookmarks?userId=test-user");
  return res.json();
};

export default function BookmarksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  });

  if (isLoading) return <p>로딩중...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>북마크</h1>

      {data?.length === 0 && <p>비어있음</p>}

      {data?.map((b: any) => (
        <div key={b.id}>
          <h3>{b.event.title}</h3>
        </div>
      ))}
    </div>
  );
}