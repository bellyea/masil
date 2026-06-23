"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useViewer(eventId: string) {
  const socketRef = useRef<Socket | null>(null);
  const joinedRef = useRef(false);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket = io({
      path: "/socket.io",
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (!joinedRef.current) {
        socket.emit("join", eventId);
        joinedRef.current = true;
      }
    });

    socket.on("viewer", (value: number) => {
      setCount(value);
    });

    return () => {
      socket.emit("leave", eventId);
      socket.disconnect();
      joinedRef.current = false;
    };
  }, [eventId]);

  return count;
}