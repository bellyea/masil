"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useEvents } from "./hooks/useEvents";
import EventSkeleton from "./components/EventSkeleton";
import EventList from "../../components/event/EventList";

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") ?? "";
  const keyword = searchParams.get("keyword") ?? "";
  const status = searchParams.get("status") ?? "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useEvents({ category, keyword, status });

  // ===== Intersection Observer (개선된 방식) =====
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "300px",
      },
    );

    const el = observerRef.current;

    if (el) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!hasNextPage) return;

    const isScrollable =
      document.documentElement.scrollHeight > window.innerHeight;

    if (!isScrollable) {
      fetchNextPage();
    }
  }, [data, hasNextPage, fetchNextPage]);

  // ===== 데이터 상태 처리 =====
  if (isLoading) return <EventSkeleton />;
  if (isError) return <p style={{ padding: 20 }}>데이터 로딩 실패 😢</p>;

  const isEmpty = data?.pages?.[0]?.items?.length === 0;

  return (
    <div style={{ padding: 20 }}>
      {/* ===== FILTER UI (항상 유지) ===== */}
      <select
        value={category}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) params.set("category", e.target.value);
          else params.delete("category");
          router.push(`?${params.toString()}`);
        }}
      >
        <option value="">전체</option>
        <option value="EXHIBITION">전시</option>
        <option value="POPUP">팝업</option>
      </select>

      <select
        value={status}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) params.set("status", e.target.value);
          else params.delete("status");
          router.push(`?${params.toString()}`);
        }}
      >
        <option value="">전체</option>
        <option value="UPCOMING">예정</option>
        <option value="ONGOING">진행중</option>
        <option value="ENDED">종료</option>
      </select>

      <input
        placeholder="검색..."
        value={keyword}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) params.set("keyword", e.target.value);
          else params.delete("keyword");
          router.push(`?${params.toString()}`);
        }}
        style={{ marginTop: 10 }}
      />

      {/* ===== LIST 또는 EMPTY VIEW ===== */}
      {isEmpty ? (
        <p style={{ padding: 20, textAlign: "center" }}>검색 결과 없음</p>
      ) : (
        <div>
          <EventList pages={data?.pages ?? []} />

          {/* 하단 옵저버 및 로딩 표시 */}
          <div ref={observerRef} style={{ height: 40 }} />
          {isFetchingNextPage && (
            <p style={{ textAlign: "center" }}>더 불러오는 중...</p>
          )}

          {!hasNextPage && (
            <p style={{ textAlign: "center" }}>마지막 이벤트입니다 🎉</p>
          )}
        </div>
      )}
    </div>
  );
}
