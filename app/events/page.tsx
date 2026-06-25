"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEvents } from "./hooks/useEvents";
import EventSkeleton from "./components/EventSkeleton";
import EventList from "../../components/event/EventList";

const categories = [
  { value: "", label: "전체" },
  { value: "EXHIBITION", label: "전시" },
  { value: "THEATER", label: "공연" },
  { value: "MUSICAL", label: "뮤지컬" },
  { value: "PERFORMANCE", label: "무대" },
  { value: "FESTIVAL", label: "축제" },
  { value: "ETC", label: "기타" },
];

const statuses = [
  { value: "", label: "모든 일정" },
  { value: "ONGOING", label: "진행 중" },
  { value: "UPCOMING", label: "예정" },
  { value: "ENDED", label: "종료" },
];

function updateParam(params: URLSearchParams, key: string, value: string) {
  if (value) params.set(key, value);
  else params.delete(key);
}

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") ?? "";
  const keyword = searchParams.get("keyword") ?? "";
  const status = searchParams.get("status") ?? "";
  const [keywordInput, setKeywordInput] = useState(keyword);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useEvents({ category, keyword, status });

  const observerRef = useRef<HTMLDivElement | null>(null);

  const totalVisible = useMemo(
    () => data?.pages.reduce((sum, page) => sum + page.items.length, 0) ?? 0,
    [data?.pages]
  );

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

  useEffect(() => {
    if (!hasNextPage) return;

    const isScrollable =
      document.documentElement.scrollHeight > window.innerHeight;

    if (!isScrollable) {
      fetchNextPage();
    }
  }, [data, hasNextPage, fetchNextPage]);

  const pushFilters = (next: { category?: string; status?: string; keyword?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    updateParam(params, "category", next.category ?? category);
    updateParam(params, "status", next.status ?? status);
    updateParam(params, "keyword", next.keyword ?? keyword);
    router.push(`/events?${params.toString()}`);
  };

  return (
    <main className="events-page masil-page">
      <section className="events-shell masil-shell">

        <section className="filter-panel soft-panel" aria-label="행사 필터">
          <form
            className="search-row"
            onSubmit={(event) => {
              event.preventDefault();
              pushFilters({ keyword: keywordInput.trim() });
            }}
          >
            <input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder="지역이나 행사명을 검색해보세요"
              aria-label="지역이나 행사명 검색"
            />
            <button type="submit">검색</button>
          </form>

          <div className="filter-group" aria-label="카테고리 선택">
            {categories.map((item) => (
              <button
                key={item.value || "all"}
                type="button"
                className="pill-button"
                data-active={category === item.value}
                onClick={() => pushFilters({ category: item.value })}
              >
                {item.label}
              </button>
            ))}
            {category && (
              <button
                type="button"
                className="filter-clear-button"
                aria-label="카테고리 필터 해제"
                onClick={() => pushFilters({ category: "" })}
              >
                ×
              </button>
            )}
          </div>

          <div className="filter-group filter-group--status" aria-label="일정 상태 선택">
            {statuses.map((item) => (
              <button
                key={item.value || "all-status"}
                type="button"
                className="pill-button"
                data-active={status === item.value}
                onClick={() => pushFilters({ status: item.value })}
              >
                {item.label}
              </button>
            ))}
            {status && (
              <button
                type="button"
                className="filter-clear-button"
                aria-label="일정 상태 필터 해제"
                onClick={() => pushFilters({ status: "" })}
              >
                ×
              </button>
            )}
          </div>
        </section>

        {isLoading && <EventSkeleton />}

        {isError && (
          <p className="state-message soft-panel">
            데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        )}

        {!isLoading && !isError && totalVisible === 0 && (
          <p className="state-message soft-panel">검색 결과가 없어요.</p>
        )}

        {!isLoading && !isError && totalVisible > 0 && (
          <>
            <EventList pages={data?.pages ?? []} />
            <div ref={observerRef} style={{ height: 40 }} />
            {isFetchingNextPage && <p className="list-status">더 불러오는 중...</p>}
            {!hasNextPage && <p className="list-status">마지막 행사까지 둘러봤어요.</p>}
          </>
        )}
      </section>
    </main>
  );
}
