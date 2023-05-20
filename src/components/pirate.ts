import * as Phaser from "phaser";
import GamePlayScene from "../scenes/gameplay";

export default class Pirate {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private sceneRef: GamePlayScene;
  private canMove: boolean;
  movePosition: Phaser.Math.Vector2 | undefined;

  constructor(scene: GamePlayScene, x: number, y: number, texture: string) {
    this.sceneRef = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
    this.canMove = false;
  }

  setMovePosition(x: number, y: number) {
    this.movePosition = new Phaser.Math.Vector2(x, y);
  }

  getPosition() {
    return this.sprite.body.position;
  }

  setCanMove(move: boolean) {
    this.canMove = move;
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
      } else {
        this.canMove &&
          this.sceneRef.physics.moveTo(this.sprite, targetX, targetY, 100);
      }
    }
  }
}
