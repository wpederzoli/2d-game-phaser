import * as Phaser from "phaser";

export default class Cannonball {
  private sceneRef: Phaser.Scene;
  private platformBlocks: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene, blocks: Phaser.Physics.Arcade.StaticGroup) {
    this.sceneRef = scene;
    this.platformBlocks = blocks;
  }

  shootTo(targetX: number, targetY: number, origin: Phaser.Math.Vector2) {
    const cannonball = this.sceneRef.physics.add.sprite(
      origin.x,
      origin.y,
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
      onUpdate: () => {
        this.sceneRef.physics.overlap(
          cannonball,
          this.platformBlocks,
          (_, block: Phaser.Physics.Arcade.Sprite) => {
            if (block.getBounds().contains(targetX, targetY)) {
              block.destroy();
            }
          }
        );
      },
    });
  }
}
