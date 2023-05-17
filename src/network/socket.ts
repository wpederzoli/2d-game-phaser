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
  }

  async createRoom(roomId: string): Promise<RoomCreationResponse> {
    this.socket.emit("createRoom", roomId);

    this.socket.on("userJoined", () => {
      console.log("user joined");
      this.sceneRef.spawnPirate(880, 300);
    });
    return new Promise((resolve) => {
      this.socket.on("roomCreated", (roomInfo: RoomCreationResponse) => {
        console.log("room created: ", roomInfo);
        resolve(roomInfo);
      });
    });
  }

  async joinRoom(roomId: string): Promise<RoomCreationResponse> {
    this.socket.emit("joinRoom", roomId);
    return new Promise((resolve) => {
      this.socket.on("joinedRoom", (roomInfo: RoomCreationResponse) => {
        console.log("joined room event: ", roomInfo);
        resolve(roomInfo);
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

  async removeObject(
    roomId: string,
    userId: string,
    x: number,
    y: number
  ): Promise<void> {
    console.log("remove object called: %s %s", x, y);
    this.socket.emit("removeObject", roomId, userId, x, y);
    return new Promise((resolve) => {
      this.socket.on(
        "destroyObject",
        (userId: string, x: number, y: number) => {
          if (this.sceneRef.roomService.getUserId() !== userId) {
            console.log("remove element");
            this.sceneRef.platformA.removeElementAt(x, y);
          }
          resolve();
        }
      );
    });
    // return new Promise (resolve => {
    //   this.socket.on("destroyObject", (userId: string, objectIndex: number) => {
    //   if (this.sceneRef.roomService.getUserId() !== userId) {
    //     console.log("destroy object: ", objectIndex);
    //     this.sceneRef.children.getAt(objectIndex).destroy();
    //   }
    // }
    // });
  }
}
