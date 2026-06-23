"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useViewer(eventId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    socketRef.current = io({
      path: "/socket.io",
    });

    const socket = socketRef.current;

    socket.emit("join", eventId);

    socket.on("viewer", (value: number) => {
      setCount(value);
    });

    return () => {
      socket.emit("leave", eventId);
      socket.disconnect();
    };
  }, [eventId]);

  return count;
}