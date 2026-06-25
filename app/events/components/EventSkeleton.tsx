export default function EventSkeleton() {
  return (
    <div className="event-grid" aria-label="행사 목록 로딩">
      {Array.from({ length: 6 }).map((_, index) => (
        <article key={index} className="event-card soft-panel">
          <div className="event-card__media skeleton-surface" />
          <div className="event-card__body">
            <span className="skeleton-line short" />
            <span className="skeleton-line title" />
            <span className="skeleton-line" />
          </div>
        </article>
      ))}
    </div>
  );
}
