import { Server } from "socket.io";
import { viewerStore } from "@/lib/socket-store";

let io: Server;

export function getIO(server?: any) {
  if (!io && server) {
    io = new Server(server, {
      path: "/socket.io",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("connected");

      socket.on("join", (eventId) => {
        socket.join(eventId);
        viewerStore.join(eventId, socket.id);
        
        io.to(eventId).emit("viewer", viewerStore.getCount(eventId));
      });

      socket.on("leave", (eventId) => {
        viewerStore.leave(eventId, socket.id);
        io.to(eventId).emit("viewer", viewerStore.getCount(eventId));
      });

      socket.on("disconnect", () => {
        const affectedEvents = viewerStore.removeSocket(socket.id);
        
        affectedEvents.forEach((eventId) => {
          io.to(eventId).emit("viewer", viewerStore.getCount(eventId));
        });
      });
    });
  }
  return io;
}