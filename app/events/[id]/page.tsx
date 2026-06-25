/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { useEvent } from "./hooks/useEvent";
import { useBookmark } from "./hooks/useBookmark";
import { useViewer } from "./hooks/useViewer";
import EventInfo from "./components/EventInfo";
import BookmarkButton from "../../../components/bookmark/BookmarkButton";
import EventSkeleton from "./components/EventSkeleton";

export default function EventDetailPage() {
  const { id } = useParams();
  const eventId = id as string;

  const { data: event, isLoading } = useEvent(eventId);
  const { data: bookmarkData } = useBookmark(eventId);
  const viewer = useViewer(eventId);

  if (isLoading) return <EventSkeleton />;

  if (!event) {
    return (
      <main className="detail-page masil-page">
        <p className="state-message soft-panel">행사를 찾을 수 없어요.</p>
      </main>
    );
  }

  const mapQuery = event.lat && event.lng
    ? `${event.lat},${event.lng}`
    : event.address ?? event.venueName ?? event.title;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;

  return (
    <main className="detail-page masil-page">
      <section className="detail-shell masil-shell">
        <div className="detail-main soft-panel">
          <div className="detail-hero-image">
            {event.images?.[0] ? (
              <img src={event.images[0]} alt="" />
            ) : (
              <div className="detail-image-placeholder" aria-hidden="true">
                ◌
              </div>
            )}
          </div>

          <div className="detail-content">
            <div className="viewer-count" aria-label="현재 보고 있는 사용자 수">
              <span aria-hidden="true">●</span>
              지금 {viewer}명이 보고 있어요
            </div>

            <EventInfo event={event} />

            <div className="detail-actions">
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noreferrer"
                  className="detail-link"
                >
                  예매/상세 페이지 열기
                </a>
              )}
              <BookmarkButton
                id={eventId}
                isBookmarked={bookmarkData?.isBookmarked}
              />
            </div>
          </div>
        </div>

        <aside className="location-panel soft-panel" aria-label="행사 위치 정보">
          <p className="home-eyebrow">위치</p>
          <h2>{event.venueName ?? "장소 확인 중"}</h2>
          <p>{event.address ?? "주소 정보가 아직 준비되지 않았어요."}</p>
          <div className="map-frame" aria-label="행사 위치 지도">
            <iframe
              title={`${event.venueName ?? event.title} 지도`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="map-card">
            <span aria-hidden="true">⌖</span>
            <strong>{event.venueName ?? "행사 위치"}</strong>
            <small>{event.lat && event.lng ? `${event.lat.toFixed(4)}, ${event.lng.toFixed(4)}` : event.address ?? "지도에서 위치를 확인해 보세요."}</small>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer">
              지도에서 보기
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}


