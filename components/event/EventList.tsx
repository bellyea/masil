import EventCard, { type EventCardEvent } from "./EventCard";

type EventPage<TItem> = {
  items: TItem[];
};

type Props<TItem> = {
  pages: EventPage<TItem>[];
  getItem?: (item: TItem) => EventCardEvent;
};

export default function EventList<TItem = EventCardEvent>({
  pages,
  getItem,
}: Props<TItem>) {
  const events = pages.flatMap((page) =>
    page.items.map((item) => (getItem ? getItem(item) : (item as EventCardEvent)))
  );

  return (
    <div className="event-grid" aria-label="행사 목록">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

