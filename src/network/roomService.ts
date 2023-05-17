import GamePlayScene from "../scenes/gameplay";
import SocketConnector from "./socket";

export default class RoomService {
  private socketConnection: SocketConnector;

  constructor(scene: GamePlayScene) {
    this.socketConnection = new SocketConnector(scene);
  }

  async createRoom(roomId: string) {
    return await this.socketConnection.createRoom(roomId);
  }

  async joinRoom(roomId: string) {
    return await this.socketConnection.joinRoom(roomId);
  }
}
