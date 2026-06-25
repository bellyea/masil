import { Server } from "socket.io";
import { viewerStore } from "./socket-store";
import type { Server as HttpServer } from "http";

let io: Server | undefined;

export function getIO(server?: HttpServer) {
  if (!io && server) {
    io = new Server(server, {
      path: "/socket.io",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      socket.on("join", (eventId: string) => {
        socket.join(eventId);
        viewerStore.join(eventId, socket.id);
        io?.to(eventId).emit("viewer", viewerStore.getCount(eventId));
      });

      socket.on("leave", (eventId: string) => {
        viewerStore.leave(eventId, socket.id);
        io?.to(eventId).emit("viewer", viewerStore.getCount(eventId));
      });

      socket.on("disconnect", () => {
        const affectedEvents = viewerStore.removeSocket(socket.id);

        affectedEvents.forEach((eventId) => {
          io?.to(eventId).emit("viewer", viewerStore.getCount(eventId));
        });
      });
    });
  }

  return io;
}
