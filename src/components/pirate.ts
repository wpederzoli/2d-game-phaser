import * as Phaser from "phaser";
import GamePlayScene from "../scenes/gameplay";
import Cannonball from "./cannonball";
import { WOOD_SPRITE_SIZE } from "./platform";

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
    this.getNextBlock();
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

  getNextBlock() {
    console.log("find next block");
    console.log("pirate w: ", this.sprite.width);
    console.log("pirate: ", this.sprite.x);
    console.log("dest: ", this.movePosition.x);
    console.log("pirate y: ", this.sprite.y);
    console.log("dest y: ", this.movePosition.y);
    const blocks = this.sceneRef.platformA.getBlocks().getChildren();
    if (
      this.movePosition.x > this.sprite.x &&
      this.movePosition.y === this.sprite.y
    ) {
      console.log("move right");
    }
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

      if (distance < 2) {
        this.sprite.setVelocity(0);
        this.movePosition = undefined;
        this.setCanMove(false);
        if (!this.isEnemy) {
          this.sceneRef.roomService.readyToShoot();
        }
        this.sprite.body.reset(targetX, targetY);
      } else {
        this.canMove &&
          this.sceneRef.physics.moveTo(this.sprite, targetX, targetY, 100);
      }
    }
  }
}
