import io, { Socket } from "socket.io-client";
import GamePlayScene from "../scenes/gameplay";
import { posix } from "path";

const URL = "http://localhost:3000";

type RoomCreationResponse = {
  roomId: string;
  userId: string;
};

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

  async createRoom(roomId: string): Promise<RoomCreationResponse> {
    this.socket.emit("createRoom", roomId);

    return new Promise((resolve) => {
      this.socket.on("roomCreated", (roomInfo: RoomCreationResponse) => {
        console.log("room created");
        resolve(roomInfo);
      });
    });
  }

  async joinRoom(roomId: string): Promise<string> {
    this.socket.emit("joinRoom", roomId);
    return new Promise((resolve) => {
      this.socket.on("joinedRoom", (joinedId: string) => {
        resolve(joinedId);
      });
    });
  }

  async sendMovePosition(
    roomId: string,
    userId: string,
    x: number,
    y: number
  ): Promise<boolean> {
    this.socket.emit("movePlayer", roomId, userId, { x, y });
    return new Promise((resolve) => {
      this.socket.on(
        "updatePosition",
        (userId: string, position: { x: number; y: number }) => {
          console.log("update position");
          if (this.sceneRef.roomService.getUserId() !== userId) {
            console.log("position: ", position.x, position.y);
            this.sceneRef.enemy.setMovePosition(position.x, position.y);
          }
          resolve(true);
        }
      );
    });
  }
}
