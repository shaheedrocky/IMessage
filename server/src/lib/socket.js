import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const allowed_origin = process.env.FRONTEND_URL || "http://localhost:5173";
const io = new Server(server, { cors: { origin: [allowed_origin] } });

function getRecieverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing", ({ receiverId, isTyping }) => {
    if (userId && receiverId) {
      const receiverSocketId = getRecieverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId: userId, isTyping });
      }
    }
  });

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export {server, app, io, getRecieverSocketId}
