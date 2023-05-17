import io, { Socket } from "socket.io-client";

const URL = "http://localhost:3000";

export default class SocketConnector {
  private socket: Socket;

  constructor() {
    this.socket = io(URL);
    this.setup();
  }

  private setup() {
    this.socket.on("connect", () => {
      console.log("Welcome to the server");
    });
  }

  async createRoom(roomId: string): Promise<boolean> {
    this.socket.emit("createRoom", roomId);

    return new Promise((resolve) => {
      this.socket.on("roomCreated", (createdId: string) => {
        resolve(createdId === roomId);
      });
    });
  }

  async joinRoom(roomId: string): Promise<boolean> {
    this.socket.emit("joinRoom", roomId);
    return new Promise((resolve) => {
      this.socket.on("joinedRoom", (joinedId: string) => {
        resolve(joinedId === roomId && roomId !== "");
      });
    });
  }
}
