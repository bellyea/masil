"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import EventCard from "./components/EventCard";
import FilterBar from "./components/FilterBar";


type Event = {
  id: string;
  title: string;
  description?: string;
  category: string;
  startDate: string;
  endDate: string;
};

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 1. 필터 상태
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
    keyword: searchParams.get("keyword") || "",
  });
  const [loading, setLoading] = useState(false);

  // 2. 이벤트 데이터
  const [events, setEvents] = useState<Event[]>([]);

  // 3. API 호출 함수
  const fetchEvents = async () => {
    setLoading(true);

    const params = new URLSearchParams();

    if (filters.category) params.set("category", filters.category);
    if (filters.status) params.set("status", filters.status);
    if (filters.keyword) params.set("keyword", filters.keyword);

    const res = await fetch(`/api/events?${params}`);
    const data = await res.json();

    setEvents(data);
    setLoading(false);
  };

  // 4. filters 바뀔 때마다 자동 호출
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.category) params.set("category", filters.category);
    if (filters.status) params.set("status", filters.status);
    if (filters.keyword) params.set("keyword", filters.keyword);

    router.push(`/events?${params.toString()}`);

    fetchEvents();
  }, [filters]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Events</h1>

      {/* ===== 필터 버튼 ===== */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* ===== 검색 ===== */}
      <input
        placeholder="검색..."
        onChange={(e) =>
          setFilters({ ...filters, keyword: e.target.value })
        }
        style={{ marginBottom: 20 }}
      />

      {/* ===== 리스트 ===== */}
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      {loading && <p>로딩중...</p>}
      {!loading && events.length === 0 && (
        <p>이벤트가 없습니다 😢</p>
      )}
    </div>
  );
}