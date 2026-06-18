import Link from "next/link";

export default function EventCard({ event }: any) {
  return (
    <Link href={`/events/${event.id}`}>
      <div style={{ border: "1px solid #ddd", padding: 10 }}>
        <h3>{event.title}</h3>
        <p>{event.category}</p>
      </div>
    </Link>
  );
}