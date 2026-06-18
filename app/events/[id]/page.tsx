"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

  const queryClient = useQueryClient();

  const { data: bookmarkData } = useQuery({
    queryKey: ["bookmark", id],
    queryFn: async () => {
      const res = await fetch(
        `/api/bookmarks/check?userId=test-user&eventId=${id}`
      );
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        body: JSON.stringify({
          userId: "test-user",
          eventId: id,
        }),
      });
      return res.json();
    },

    onMutate: async () => {
      // 🔥 optimistic update
      await queryClient.cancelQueries({ queryKey: ["bookmark", id] });

      const prev = queryClient.getQueryData(["bookmark", id]);

      queryClient.setQueryData(["bookmark", id], (old: any) => ({
        isBookmarked: !old?.isBookmarked,
      }));

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["bookmark", id], ctx?.prev);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) return <p>로딩중...</p>;

  if (!event) return <p>이벤트가 없습니다 😢</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{event.title}</h1>

      <button onClick={() => mutation.mutate()}>
        {bookmarkData?.isBookmarked ? "❤️ 북마크됨" : "🤍 북마크"}
      </button>

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