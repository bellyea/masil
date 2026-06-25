"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function useViewer(eventId: string) {
  const socketRef = useRef<Socket | null>(null);
  const joinedRef = useRef(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!eventId) return;

    const socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", eventId);
      joinedRef.current = true;
      setCount((current) => Math.max(current, 1));
    });

    socket.on("viewer", (value: number) => {
      setCount(value);
    });

    socket.on("connect_error", (error) => {
      console.error("viewer socket connection failed", error.message);
    });

    return () => {
      if (joinedRef.current) {
        socket.emit("leave", eventId);
      }

      socket.disconnect();
      socketRef.current = null;
      joinedRef.current = false;
    };
  }, [eventId]);

  return count;
}
