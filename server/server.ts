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

const activeRooms: Room[] = [];

const io = new Server(server, {
  cors: { origin: "http://127.0.0.1:8085" },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("createRoom", (roomId) => {
    activeRooms.push({ id: roomId, playerOne: socket.id, playerTwo: "" });
    console.log("roomCreated: ", activeRooms);
  });

  socket.on("joinRoom", (roomId) => {
    const room = activeRooms.find((room) => room.id === roomId);
    if (room) room.playerTwo = socket.id;
    console.log("joining room: ", activeRooms);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    const roomIndex = activeRooms.findIndex(
      (room) => room.playerOne === socket.id || room.playerTwo === socket.id
    );
    activeRooms.splice(roomIndex, 1);
    console.log("rooms: ", activeRooms);
  });
});

server.listen(port, () => {
  console.log("server running");
});

io.listen(server);
