import * as Phaser from "phaser";

export default class Cannonball {
  private sceneRef: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.sceneRef = scene;
  }

  shootTo(targetX: number, targetY: number, origin: Phaser.Math.Vector2) {
    const cannonball = this.sceneRef.add.sprite(
      origin.x,
      origin.y + 32,
      "cannonball"
    );

    this.sceneRef.tweens.add({
      targets: cannonball,
      x: targetX,
      y: targetY,
      duration: 1000,
      onComplete: () => {
        cannonball.destroy();
      },
    });
  }
}
