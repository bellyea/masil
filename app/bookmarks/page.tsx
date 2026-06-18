"use client";

import { useQuery } from "@tanstack/react-query";

export default function BookmarksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const res = await fetch("/api/bookmarks?userId=test-user");
      return res.json();
    },
  });

  if (isLoading) return <p>로딩중...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>내 북마크</h1>

      {data?.length === 0 && <p>북마크 없음</p>}

      {data?.map((b: any) => (
        <div key={b.id}>
          <h3>{b.event.title}</h3>
          <p>{b.event.description}</p>
        </div>
      ))}
    </div>
  );
}