import { decodeHtmlEntities } from "@/lib/text/decodeHtmlEntities";

type DetailEvent = {
  title: string;
  description?: string | null;
  category?: string;
  venueName?: string | null;
  startDate?: string;
  endDate?: string;
};

type EventInfoProps = {
  event: DetailEvent;
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
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export default function EventInfo({ event }: EventInfoProps) {
  const category = event.category
    ? categoryLabels[event.category] ?? event.category
    : "문화";
  const title = decodeHtmlEntities(event.title);

  return (
    <section className="event-info" aria-label="행사 상세 정보">
      <span className="event-info__category">{category}</span>
      <h1>{title}</h1>

      <dl className="event-info__facts">
        <div>
          <dt>장소</dt>
          <dd>{event.venueName ?? "장소 확인 중"}</dd>
        </div>
        <div>
          <dt>기간</dt>
          <dd>
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </dd>
        </div>
      </dl>

      {event.description ? (
        <p className="event-info__description">{decodeHtmlEntities(event.description)}</p>
      ) : (
        <p className="event-info__description muted">
          상세 설명은 아직 준비되지 않았어요.
        </p>
      )}
    </section>
  );
}
