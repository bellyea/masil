"use client";

import { useEffect, useRef, useState } from "react";

const HEARTBEAT_INTERVAL_MS = 15_000;

function createViewerSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useViewer(eventId: string) {
  const sessionIdRef = useRef<string>(createViewerSessionId());
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!eventId) return;

    let isMounted = true;

    const heartbeat = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/viewers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId: sessionIdRef.current }),
        });

        if (!response.ok) return;

        const data = await response.json();

        if (isMounted && typeof data.count === "number") {
          setCount(data.count);
        }
      } catch (error) {
        console.error("viewer heartbeat failed", error);
      }
    };

    heartbeat();
    const intervalId = window.setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [eventId]);

  return count;
}