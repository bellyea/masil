"use client";

import { useEffect, useRef } from "react";
import { useBookmarks } from "./hooks/useBookmarks";
import Link from "next/link";
import EventList from "@/app/components/EventList";

export default function BookmarksPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useBookmarks();

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "300px",
      }
    );

    const el = observerRef.current;

    if (el) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  if (isLoading) return <p>로딩중...</p>;

  if (isError) return <p>에러 발생</p>;

  const isEmpty = data?.pages?.[0]?.items?.length === 0;

  return (
    <div style={{ padding: 20 }}>
      <h1>북마크</h1>

      {isEmpty ? (
        <p>북마크 없음</p>
      ) : (
        <EventList
          pages={data?.pages ?? []}
          getItem={(bm) => bm.event}
        />
      )}

      <div ref={observerRef} style={{ height: 40 }} />

      {isFetchingNextPage && <p>더 불러오는 중...</p>}

      {!hasNextPage && <p>마지막 북마크입니다</p>}
    </div>
  );
}