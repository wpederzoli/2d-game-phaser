import express from "express";
import http from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

type Room = {
  id: string;
  playerOne: string;
  playerTwo: string;
};

type Player = {
  x: number;
  y: number;
};

const activeRooms: Room[] = [];

const io = new Server(server, {
  cors: { origin: "http://127.0.0.1:8085" },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("createRoom", (roomId) => {
    activeRooms.push({ id: roomId, playerOne: socket.id, playerTwo: "" });
    console.log("roomCreated: ", activeRooms);
    socket.join(roomId);
    socket.emit("roomCreated", { roomId, userId: socket.id });
  });

  socket.on("joinRoom", (roomId) => {
    const room = activeRooms.find((room) => room.id === roomId);
    if (room) {
      room.playerTwo = socket.id;
      socket.join(roomId);
      io.to(roomId).emit("userJoined", socket.id);
    }

    socket.emit("joinedRoom", { roomId, userId: socket.id });
    console.log("joining room: ", activeRooms);
  });

  socket.on("movePlayer", (roomId: string, userId: string, player: Player) => {
    io.to(roomId).emit("updatePosition", userId, player);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    const roomIndex = activeRooms.findIndex(
      (room) => room.playerOne === socket.id
    );
    roomIndex >= 0 && activeRooms.splice(roomIndex, 1);
    console.log("rooms: ", activeRooms);
  });
});

server.listen(port, () => {
  console.log("server running");
});

io.listen(server);
