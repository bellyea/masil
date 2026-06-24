"use client";

import { useQuery } from "@tanstack/react-query";

export default function TrendingEvents() {
  const { data, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () =>
      fetch("/api/events/trending").then((r) => r.json()),
    refetchInterval: 5000,
  });

  if (isLoading) return <p>loading...</p>;

  return (
    <div>
      <h2>🔥 Trending Events</h2>

      {data?.type === "fallback" && (
        <p>현재 관람 데이터가 부족하여 최신 이벤트를 표시합니다.</p>
      )}

      <ul>
        {data?.items.map((event: any) => (
          <li key={event.id}>
            {event.title}
            {data.type === "trending" && ` 👀 ${event.viewers}`}
          </li>
        ))}
      </ul>
    </div>
  );
}