export default function EventInfo({ event }: { event: any }) {
  return (
    <div>
      <h1>{event.title}</h1>

      <p style={{ color: "#666" }}>{event.description}</p>

      <p>
        📅 {new Date(event.startDate).toLocaleDateString()} ~{" "}
        {new Date(event.endDate).toLocaleDateString()}
      </p>

      <p>📌 {event.category}</p>

      {event.website && (
        <a href={event.website} target="_blank">
          공식 사이트
        </a>
      )}
    </div>
  );
}