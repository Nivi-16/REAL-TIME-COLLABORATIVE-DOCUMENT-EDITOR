const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const ROOM_ID = "collab-room";

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.join(ROOM_ID);

  const updateUserCount = () => {
    const room = io.sockets.adapter.rooms.get(ROOM_ID);
    const count = room ? room.size : 0;
    io.to(ROOM_ID).emit("user-count", count);
  };

  updateUserCount();

  socket.on("send-changes", (data) => {
    socket.to(ROOM_ID).emit("receive-changes", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    updateUserCount();
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
