/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import BookmarkButton from "@/components/bookmark/BookmarkButton";
import { decodeHtmlEntities } from "@/lib/text/decodeHtmlEntities";

export type EventCardEvent = {
  id: string;
  title: string;
  category?: string;
  venueName?: string;
  address?: string | null;
  images?: string[];
  website?: string | null;
  startDate?: string;
  endDate?: string;
  isBookmarked?: boolean;
};

type Props = {
  event: EventCardEvent;
};

const categoryLabels: Record<string, string> = {
  EXHIBITION: "전시",
  THEATER: "공연",
  MUSICAL: "뮤지컬",
  PERFORMANCE: "공연",
  FESTIVAL: "축제",
  ETC: "기타",
};

function formatDate(value?: string) {
  if (!value) return "일정 확인 중";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function EventCard({ event }: Props) {
  const image = event.images?.[0];
  const title = decodeHtmlEntities(event.title);
  const category = event.category ? categoryLabels[event.category] ?? event.category : "문화";

  return (
    <article className="event-card soft-panel">
      <div className="event-card__media">
        <Link href={`/events/${event.id}`} aria-label={`${title} 상세 보기`}>
          {image ? (
            <img src={image} alt="" />
          ) : (
            <div className="event-card__placeholder" aria-hidden="true">
              ◌
            </div>
          )}
        </Link>
        <div className="event-card__actions">
          <BookmarkButton id={event.id} isBookmarked={event.isBookmarked} compact />
          {event.website && (
            <a
              className="icon-button"
              href={event.website}
              target="_blank"
              rel="noreferrer"
              aria-label="예매 또는 공식 페이지 열기"
              title="예매/상세"
            >
              ↗
            </a>
          )}
        </div>
      </div>

      <Link href={`/events/${event.id}`} className="event-card__body">
        <span className="event-card__category">{category}</span>
        <h3>{title}</h3>
        <p>{event.venueName ?? event.address ?? "장소 확인 중"}</p>
        <time>
          {formatDate(event.startDate)} - {formatDate(event.endDate)}
        </time>
      </Link>
    </article>
  );
}



