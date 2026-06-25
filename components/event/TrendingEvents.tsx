/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { decodeHtmlEntities } from "@/lib/text/decodeHtmlEntities";

type TrendingEvent = {
  id: string;
  title: string;
  category?: string;
  venueName?: string;
  startDate?: string;
  endDate?: string;
  images?: string[];
  viewers?: number;
};

type TrendingResponse = {
  type: "trending" | "fallback";
  items: TrendingEvent[];
};

function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return "일정 확인 중";

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(new Date(startDate))} - ${formatter.format(
    new Date(endDate)
  )}`;
}

export default function TrendingEvents() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading } = useQuery<TrendingResponse>({
    queryKey: ["trending"],
    queryFn: () => fetch("/api/events/trending").then((response) => response.json()),
    refetchInterval: 5000,
  });

  const events = useMemo(() => data?.items ?? [], [data?.items]);
  const activeEvent = events[activeIndex % Math.max(events.length, 1)];

  useEffect(() => {
    if (events.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % events.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [events.length]);

  if (isLoading) {
    return (
      <section className="trending-card soft-panel" aria-label="트렌딩 이벤트 로딩">
        <div className="trending-image skeleton-surface" />
        <div className="trending-content">
          <p className="home-eyebrow">불러오는 중</p>
          <h2>오늘의 문화 마실을 준비하고 있어요</h2>
        </div>
      </section>
    );
  }

  if (!activeEvent) {
    return (
      <section className="trending-card soft-panel" aria-label="트렌딩 이벤트 없음">
        <div className="trending-placeholder" aria-hidden="true">
          ◌
        </div>
        <div className="trending-content">
          <p className="home-eyebrow">아직 비어 있어요</p>
          <h2>이벤트 데이터를 동기화하면 이곳에 추천 카드가 나타나요</h2>
          <Link href="/events" className="trending-link">
            행사 모아보기
          </Link>
        </div>
      </section>
    );
  }

  const image = activeEvent.images?.[0];
  const title = decodeHtmlEntities(activeEvent.title);

  return (
    <section className="trending-card soft-panel" aria-label="트렌딩 이벤트">
      <Link href={`/events/${activeEvent.id}`} className="trending-image-wrap">
        {image ? (
          <img src={image} alt="" className="trending-image" />
        ) : (
          <div className="trending-placeholder" aria-hidden="true">
            ◌
          </div>
        )}
      </Link>

      <div className="trending-content">
        <div className="trending-meta-row">
          <span className="trend-badge">
            {data?.type === "trending" ? "지금 보는 중" : "새로 들어온 행사"}
          </span>
          {typeof activeEvent.viewers === "number" && (
            <span className="viewer-pill">{activeEvent.viewers}명</span>
          )}
        </div>

        <Link href={`/events/${activeEvent.id}`} className="trending-title-link">
          <h2>{title}</h2>
        </Link>

        <dl className="trending-details">
          <div>
            <dt>장소</dt>
            <dd>{activeEvent.venueName ?? "장소 확인 중"}</dd>
          </div>
          <div>
            <dt>기간</dt>
            <dd>{formatDateRange(activeEvent.startDate, activeEvent.endDate)}</dd>
          </div>
        </dl>

        <div className="trending-dots" aria-label="트렌딩 카드 순서">
          {events.map((event, index) => (
            <button
              key={event.id}
              type="button"
              aria-label={`${index + 1}번째 이벤트 보기`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}



