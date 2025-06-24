const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
// const FRONTEND_URL = "https://chat-app-three-ochre.vercel.app"; // Change to your frontend URL
const FRONTEND_URL = "https://chat-app-three-ochre.vercel.app/"; // Change to your frontend URL in development
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, // Change to your frontend URL in production
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Used to store online users
const userSocketMap = {}; // {userId: socketId}

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  console.log("User ID handshake:", socket.handshake.query.userId); 

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, app, server, getReceiverSocketId };
