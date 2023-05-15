import * as Phaser from "phaser";

export default class Pirate {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private sceneRef: Phaser.Scene;
  targetPosition: Phaser.Math.Vector2 | null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.sceneRef = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravity(0);
  }

  setTargetPosition(x: number, y: number) {
    this.targetPosition = new Phaser.Math.Vector2(x, y);
  }

  update(): void {
    if (this.targetPosition) {
      const { x: targetX, y: targetY } = this.targetPosition;
      const distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        targetX,
        targetY
      );

      if (distance < 5) {
        this.sprite.setVelocity(0);
        this.targetPosition = null;
      } else {
        this.sceneRef.physics.moveTo(this.sprite, targetX, targetY, 100);
      }
    }
  }
}
