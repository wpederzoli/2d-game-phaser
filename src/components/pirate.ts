import * as Phaser from "phaser";
import GamePlayScene from "../scenes/gameplay";
import Cannonball from "./cannonball";

export default class Pirate {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private sceneRef: GamePlayScene;
  private isEnemy: boolean;
  private canMove: boolean;
  private cannonball: Cannonball;
  movePosition: Phaser.Math.Vector2 | undefined;

  constructor(
    scene: GamePlayScene,
    x: number,
    y: number,
    texture: string,
    isEnemy?: boolean
  ) {
    this.sceneRef = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
    this.cannonball = new Cannonball(this.sceneRef);
    this.canMove = false;
    this.isEnemy = isEnemy || false;
  }

  setMovePosition(x: number, y: number) {
    this.movePosition = new Phaser.Math.Vector2(x, y);
  }

  setTargetPosition(target: Phaser.Math.Vector2) {
    this.cannonball.setTargetPosition(target);
  }

  shoot() {
    this.cannonball.shoot(
      new Phaser.Math.Vector2(this.sprite.x, this.sprite.y)
    );
  }

  getPosition() {
    return this.sprite.body.position;
  }

  isColliding(x: number, y: number) {
    return this.sprite.getBounds().contains(x, y);
  }

  setCanMove(move: boolean) {
    this.canMove = move;
  }

  destroy() {
    this.sprite.destroy();
  }

  update(): void {
    if (this.movePosition) {
      const { x: targetX, y: targetY } = this.movePosition;
      const distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        targetX,
        targetY
      );

      if (distance < 5) {
        this.sprite.setVelocity(0);
        this.movePosition = undefined;
        this.setCanMove(false);
        if (!this.isEnemy) {
          this.sceneRef.roomService.readyToShoot();
        }
      } else {
        this.canMove &&
          this.sceneRef.physics.moveTo(this.sprite, targetX, targetY, 100);
      }
    }
  }
}
