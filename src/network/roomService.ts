import { Socket } from "socket.io-client";
import GamePlayScene from "../scenes/gameplay";
import SocketConnector from "./socket";

export default class RoomService {
  private socketConnection: SocketConnector;
  private roomId: string;
  private userId: string;
  private isHost: boolean;

  constructor(
    scene: GamePlayScene,
    connection: Socket,
    roomId: string,
    userId: string,
    isHost: boolean
  ) {
    this.socketConnection = new SocketConnector(connection, scene);
    this.roomId = roomId;
    this.userId = userId;
    this.isHost = isHost;
  }

  getUserId() {
    return this.userId;
  }

  IsHost() {
    return this.isHost;
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

  startGame() {
    this.socketConnection.startGame(this.roomId);
  }

  playerHit() {
    this.socketConnection.sendPlayerHit(this.roomId, this.userId);
  }

  destroyBlock(x: number, y: number) {
    this.socketConnection.removeObject(this.roomId, this.userId, x, y);
  }
}
