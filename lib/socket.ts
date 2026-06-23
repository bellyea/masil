import { Server } from "socket.io";

let io: Server;

export function getIO(server?: any) {
  if (!io && server) {
    io = new Server(server, {
      path: "/socket.io",
      cors: {
        origin: "*",
      },
    });

    const viewerMap = new Map<string, number>();

    io.on("connection", (socket) => {
      console.log("connected");

      socket.on("join", (eventId: string) => {
        socket.join(eventId);

        const current = viewerMap.get(eventId) || 0;
        const next = current + 1;

        viewerMap.set(eventId, next);

        io.to(eventId).emit("viewer", next);
      });

      socket.on("leave", (eventId: string) => {
        socket.leave(eventId);

        const current = viewerMap.get(eventId) || 1;
        const next = Math.max(current - 1, 0);

        viewerMap.set(eventId, next);

        io.to(eventId).emit("viewer", next);
      });
    });
  }

  return io;
}