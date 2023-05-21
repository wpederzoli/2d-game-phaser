import GamePlayScene from "../scenes/gameplay";
import SocketConnector from "./socket";

export default class RoomService {
  private socketConnection: SocketConnector;
  private roomId: string;
  private userId: string;
  private isHost: boolean;

  constructor(scene: GamePlayScene, roomId: string, isHost: boolean) {
    this.socketConnection = new SocketConnector(scene);
    this.roomId = roomId;
    this.isHost = isHost;
  }

  getUserId() {
    return this.userId;
  }

  IsHost() {
    return this.isHost;
  }

  async createRoom(roomId: string): Promise<boolean> {
    const room = await this.socketConnection.createRoom(roomId);
    this.roomId = room.roomId;
    this.isHost = true;
    this.userId = room.userId;
    return room.roomId !== "";
  }

  async joinRoom(roomId: string): Promise<boolean> {
    const room = await this.socketConnection.joinRoom(roomId);
    this.roomId = room.roomId;
    this.userId = room.userId;
    return room.roomId !== "";
  }

  sendMovePosition(x: number, y: number) {
    this.socketConnection.sendMovePosition(this.roomId, this.userId, x, y);
  }

  sendShootPosition(target: Phaser.Math.Vector2) {
    this.socketConnection.sendShootPosition(this.roomId, this.userId, target);
  }

  readyToShoot() {
    this.socketConnection.sendReadyToShoot(this.roomId, this.userId);
  }

  sendPlayerMove(move: boolean) {
    this.socketConnection.sendPlayerCanMove(this.roomId, this.userId, move);
  }

  startTurn() {
    this.socketConnection.startCount(this.roomId);
  }

  playerHit() {
    this.socketConnection.sendPlayerHit(this.roomId, this.userId);
  }

  destroyBlock(x: number, y: number) {
    this.socketConnection.removeObject(this.roomId, this.userId, x, y);
  }
}
