"use client";

import { useParams } from "next/navigation";
import { useEvent } from "./hooks/useEvent";
import { useBookmark } from "./hooks/useBookmark";
import { useViewer } from "./hooks/useViewer";
import EventInfo from "./components/EventInfo";
import BookmarkButton from "./components/BookmarkButton";
import EventSkeleton from "./components/EventSkeleton";

export default function EventDetailPage() {
  const { id } = useParams();

  const { data: event, isLoading } = useEvent(id);
  const { data: bookmarkData } = useBookmark(id);

  const viewer = useViewer(id as string);
  
  if (isLoading) return <EventSkeleton />;
  if (!event) return <p>이벤트 없음</p>;

  return (
    <div style={{ padding: 20 }}>
      <p>👀 현재 관람중: {viewer}</p>
      <EventInfo event={event} />

      <BookmarkButton
        id={id as string}
        isBookmarked={bookmarkData?.isBookmarked}
      />
    </div>
  );
}