import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createRoom, joinRoom, activeRooms } from "./room";

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

type PlayerPosition = {
  x: number;
  y: number;
};

const io = new Server(server, {
  cors: { origin: "http://127.0.0.1:8085" },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("createParty", (roomId) => {
    createRoom(roomId, socket.id);
    socket.join(roomId);
    io.to(roomId).emit("partyCreated", roomId, socket.id);
  });

  socket.on("joinParty", (roomId) => {
    if (joinRoom(roomId, socket.id)) {
      socket.join(roomId);
      io.to(roomId).emit("joinedParty", roomId, socket.id);
    }
  });

  socket.on(
    "movePlayer",
    (roomId: string, userId: string, player: PlayerPosition) => {
      io.to(roomId).emit("updatePosition", userId, player);
    }
  );

  socket.on(
    "shootTarget",
    (roomId: string, userId: string, position: { x: number; y: number }) => {
      io.to(roomId).emit("setShootPosition", userId, position);
    }
  );

  socket.on("readyToShoot", (roomId: string, userId: string) => {
    const room = activeRooms.find((r) => r.id === roomId);
    if (room?.playerOne.id === userId) {
      room.playerOne.ready = true;
    }

    if (room?.playerTwo.id === userId) {
      room.playerTwo.ready = true;
    }

    if (room?.playerOne.ready && room?.playerTwo.ready) {
      room.playerOne.ready = false;
      room.playerTwo.ready = false;
      io.to(roomId).emit("shoot");
    }
  });

  socket.on("playerHit", (roomId: string, userId: string) => {
    io.to(roomId).emit("hit", userId);
  });

  socket.on(
    "playerCanMove",
    (roomId: string, userId: string, canMove: boolean) => {
      io.to(roomId).emit("readyToMove", userId, canMove);
    }
  );

  socket.on("startCount", (roomId: string) => {
    let count = 3;
    let countDownInterval = setInterval(() => {
      io.to(roomId).emit("count", count);
      count--;
      if (count < 0) {
        clearInterval(countDownInterval);
        io.to(roomId).emit("playTurn");
      }
    }, 1000);
  });

  socket.on(
    "removeObject",
    (roomId: string, userId: string, x: number, y: number) => {
      io.to(roomId).emit("destroyObject", userId, x, y);
    }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    const roomIndex = activeRooms.findIndex(
      (room) => room.playerOne.id === socket.id
    );
    roomIndex >= 0 && activeRooms.splice(roomIndex, 1);
    console.log("rooms: ", activeRooms);
  });
});

server.listen(port, () => {
  console.log("server running");
});

io.listen(server);
