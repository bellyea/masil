import Link from "next/link";

type Props = {
  event: any;
};

export default function EventCard({ event }: Props) {
  return (
    <Link
      href={`/events/${event.id}`}
      style={{
        display: "block",
        padding: 12,
        borderBottom: "1px solid #eee",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <h3>{event.title}</h3>
      <p style={{ color: "#666" }}>{event.category}</p>
    </Link>
  );
}