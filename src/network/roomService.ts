import GamePlayScene from "../scenes/gameplay";
import SocketConnector from "./socket";

export default class RoomService {
  private socketConnection: SocketConnector;
  private roomId: string;
  private userId: string;
  private isHost: boolean;

  constructor(scene: GamePlayScene) {
    this.socketConnection = new SocketConnector(scene);
    this.roomId = "";
    this.isHost = false;
  }

  getUserId() {
    return this.userId;
  }

  async createRoom(roomId: string): Promise<boolean> {
    const room = await this.socketConnection.createRoom(roomId);
    this.roomId = room.roomId;
    this.isHost = true;
    this.userId = room.userId;
    return roomId !== "";
  }

  async joinRoom(roomId: string): Promise<boolean> {
    const id = await this.socketConnection.joinRoom(roomId);
    this.roomId = id;
    return roomId !== "";
  }

  async sendMovePosition(x: number, y: number) {
    console.log("sending move position %s %s", x, y);
    return await this.socketConnection.sendMovePosition(
      this.roomId,
      this.userId,
      x,
      y
    );
  }
}
