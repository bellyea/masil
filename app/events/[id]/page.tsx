"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Event = {
  id: string;
  title: string;
  description?: string;
  category: string;
  startDate: string;
  endDate: string;
  website?: string;
};

export default function EventDetailPage() {
  const { id } = useParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);

    const res = await fetch(`/api/events/${id}`);
    const data = await res.json();

    setEvent(data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  if (loading) return <p>로딩중...</p>;

  if (!event) return <p>이벤트가 없습니다 😢</p>;

  return (
    <div style={{ padding: 20 }}>
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