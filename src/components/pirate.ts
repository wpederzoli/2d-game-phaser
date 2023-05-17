import * as Phaser from "phaser";

export default class Pirate {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private sceneRef: Phaser.Scene;
  movePosition: Phaser.Math.Vector2 | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.sceneRef = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
  }

  setMovePosition(x: number, y: number) {
    this.movePosition = new Phaser.Math.Vector2(x, y);
  }

  getPosition() {
    return this.sprite.body?.position;
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
      } else {
        this.sceneRef.physics.moveTo(this.sprite, targetX, targetY, 100);
      }
    }
  }
}
