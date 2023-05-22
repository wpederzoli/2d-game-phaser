import io, { Socket } from "socket.io-client";
import GamePlayScene from "../scenes/gameplay";

export default class SocketConnector {
  private socket: Socket;
  private sceneRef: GamePlayScene;

  constructor(connection: Socket, scene: GamePlayScene) {
    this.socket = connection;
    this.sceneRef = scene;
    this.setup();
  }

  private setup() {
    this.socket.on("connect", () => {
      console.log("Welcome to the server");
    });

    this.socket.on("joinedParty", (userId: string) => {
      console.log("joined party: ", userId);
      if (this.sceneRef.roomService.getUserId() !== userId) {
        this.sceneRef.spawnEnemyPirate();
      }
    });

    this.socket.on(
      "updatePosition",
      (userId: string, position: { x: number; y: number }) => {
        if (this.sceneRef.roomService.getUserId() !== userId) {
          this.sceneRef.enemy.setMovePosition(position.x, position.y);
        }
      }
    );

    this.socket.on("readyToMove", (userId: string, canMove: boolean) => {
      if (this.sceneRef.roomService.getUserId() !== userId) {
        this.sceneRef.enemy.setCanMove(canMove);
      }
    });

    this.socket.on("destroyObject", (userId: string, x: number, y: number) => {
      if (this.sceneRef.roomService.getUserId() !== userId) {
        this.sceneRef.platformA.removeElementAt(x, y);
      }
    });

    this.socket.on("count", (count: number) => {
      this.sceneRef.updateCountDown(count);
    });

    this.socket.on("playTurn", () => {
      this.sceneRef.pirate.setCanMove(true);
      this.sceneRef.enemy.setCanMove(true);
    });

    this.socket.on(
      "setShootPosition",
      (userId: string, target: Phaser.Math.Vector2) => {
        if (this.sceneRef.roomService.getUserId() !== userId) {
          this.sceneRef.enemy.setTargetPosition(target);
        }
      }
    );

    this.socket.on("shoot", () => {
      this.sceneRef.pirate.shoot();
      this.sceneRef.enemy.shoot();
    });

    this.socket.on("hit", (userId: string) => {
      if (this.sceneRef.roomService.getUserId() !== userId) {
        this.sceneRef.pirate.destroy();
      }
    });
  }

  sendMovePosition(roomId: string, userId: string, x: number, y: number) {
    this.socket.emit("movePlayer", roomId, userId, { x, y });
  }

  sendPlayerCanMove(roomId: string, userId: string, canMove: boolean) {
    this.socket.emit("playerCanMove", roomId, userId, canMove);
  }

  startCount(roomId: string) {
    this.socket.emit("startCount", roomId);
  }

  sendShootPosition(
    roomId: string,
    userId: string,
    target: Phaser.Math.Vector2
  ) {
    this.socket.emit("shootTarget", roomId, userId, target);
  }

  sendReadyToShoot(roomId: string, userId: string) {
    this.socket.emit("readyToShoot", roomId, userId);
  }

  sendTriggerCannon(
    roomId: string,
    userId: string,
    origin: Phaser.Math.Vector2
  ) {
    this.socket.emit("triggerCannon", roomId, userId, origin);
  }

  sendPlayerHit(roomId: string, userId: string) {
    this.socket.emit("playerHit", roomId, userId);
  }

  removeObject(roomId: string, userId: string, x: number, y: number) {
    this.socket.emit("removeObject", roomId, userId, x, y);
  }
}
