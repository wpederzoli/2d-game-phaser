import express from "express";
import http from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

type Room = {
  id: string;
  playerOne: Player;
  playerTwo: Player;
};

type Player = {
  id: string;
  ready: boolean;
};

type PlayerPosition = {
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
    activeRooms.push({
      id: roomId,
      playerOne: { id: socket.id, ready: false },
      playerTwo: { id: "", ready: false },
    });
    console.log("roomCreated: ", activeRooms);
    socket.join(roomId);
    socket.emit("roomCreated", { roomId, userId: socket.id });
  });

  socket.on("joinRoom", (roomId) => {
    const room = activeRooms.find((room) => room.id === roomId);
    if (room) {
      room.playerTwo.id = socket.id;
      socket.join(roomId);
      io.to(roomId).emit("userJoined", socket.id);
    }

    socket.emit("joinedRoom", {
      roomId: room ? room?.id : "",
      userId: socket.id,
    });
    console.log("joining room: ", activeRooms);
  });

  socket.on(
    "movePlayer",
    (roomId: string, userId: string, player: PlayerPosition) => {
      io.to(roomId).emit("updatePosition", userId, player);
    }
  );

  socket.on("readyToShoot", (roomId: string, userId: string) => {
    const room = activeRooms.find((r) => r.id === roomId);
    console.log(
      "p1 ready: %s, p2 ready; %s",
      room?.playerOne.ready,
      room?.playerTwo.ready
    );
    if (room?.playerOne.id === userId) {
      room.playerOne.ready = true;
    }

    if (room?.playerTwo.id === userId) {
      room.playerTwo.ready = true;
    }

    if (room?.playerOne.ready && room?.playerTwo.ready) {
      console.log("both players ready");
      room.playerOne.ready = false;
      room.playerTwo.ready = false;
      io.to(roomId).emit("shoot");
    }
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
