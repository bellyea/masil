import EventCard from "./EventCard";

type Props = {
  pages: any[];
  getItem?: (item: any) => any; // 👈 추가
};

export default function EventList({ pages, getItem }: Props) {
  return (
    <div>
      {pages.map((page, i) => (
        <div key={i}>
          {page.items.map((item: any) => {
            const event = getItem ? getItem(item) : item;

            return <EventCard key={event.id} event={event} />;
          })}
        </div>
      ))}
    </div>
  );
}