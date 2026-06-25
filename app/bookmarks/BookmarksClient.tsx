"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useBookmarks } from "./hooks/useBookmarks";
import EventList from "@/components/event/EventList";
import EventSkeleton from "@/app/events/components/EventSkeleton";

export default function BookmarksClient() {
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
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const totalVisible = data?.pages.reduce((sum, page) => sum + page.items.length, 0) ?? 0;

  return (
    <main className="bookmarks-page masil-page">
      <section className="bookmarks-shell masil-shell">
        <header className="events-hero soft-panel">
          <p className="home-eyebrow">Bookmarks</p>
          <div>
            <h1>저장한 마실을 모아봤어요</h1>
            <p>마음에 담아둔 전시와 공연만 가볍게 다시 확인할 수 있어요.</p>
          </div>
        </header>

        {isLoading && <EventSkeleton />}

        {isError && (
          <p className="state-message soft-panel">북마크를 불러오지 못했어요.</p>
        )}

        {!isLoading && !isError && totalVisible === 0 && (
          <div className="empty-panel soft-panel">
            <h2>아직 저장한 행사가 없어요</h2>
            <p>행사 목록에서 하트를 눌러 나만의 마실 목록을 만들어보세요.</p>
            <Link href="/events" className="primary-action">행사 보러가기</Link>
          </div>
        )}

        {!isLoading && !isError && totalVisible > 0 && (
          <>
            <EventList pages={data?.pages ?? []} getItem={(bm) => ({ ...bm.event, isBookmarked: true })} />
            <div ref={observerRef} style={{ height: 40 }} />
            {isFetchingNextPage && <p className="list-status">더 불러오는 중...</p>}
            {!hasNextPage && <p className="list-status">저장한 행사를 모두 둘러봤어요.</p>}
          </>
        )}
      </section>
    </main>
  );
}

