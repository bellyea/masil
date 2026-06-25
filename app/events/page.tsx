import { Suspense } from "react";

import EventSkeleton from "./components/EventSkeleton";
import EventsClient from "./EventsClient";

export default function EventsPage() {
  return (
    <Suspense fallback={<EventSkeleton />}>
      <EventsClient />
    </Suspense>
  );
}