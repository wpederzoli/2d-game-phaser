import io, { Socket } from "socket.io-client";
import GamePlayScene from "../scenes/gameplay";

const URL = "http://localhost:3000";

export default class SocketConnector {
  private socket: Socket;
  private sceneRef: GamePlayScene;

  constructor(scene: GamePlayScene) {
    this.socket = io(URL);
    this.sceneRef = scene;
    this.setup();
  }

  private setup() {
    this.socket.on("connect", () => {
      console.log("Welcome to the server");
    });

    this.socket.on("userJoined", () => {
      console.log("user joined");
      this.sceneRef.spawnPirate();
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
