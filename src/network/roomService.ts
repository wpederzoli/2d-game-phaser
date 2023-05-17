import SocketConnector from "./socket";

export default class RoomService {
  private socketConnection: SocketConnector;

  constructor() {
    this.socketConnection = new SocketConnector();
  }

  async createRoom(roomId: string) {
    return await this.socketConnection.createRoom(roomId);
  }

  async joinRoom(roomId: string) {
    return await this.socketConnection.joinRoom(roomId);
  }
}
