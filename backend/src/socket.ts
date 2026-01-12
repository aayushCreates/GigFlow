import { Server } from "socket.io";
import http from "http";

let socketServer: Server;

export const initServer = (server: http.Server) => {
  socketServer = new Server(server, {
    cors: {
      origin: [`${process.env.FRONTEND_URL}`],
      credentials: true,
    },
  });

  socketServer.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socketServer.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return socketServer;
};

export const socketConnection = () => {
    if (!socketServer) throw new Error("Socket not initialized");
    return socketServer;
  };