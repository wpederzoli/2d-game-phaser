import * as Phaser from "phaser";
import GamePlayScene from "../scenes/gameplay";

export default class Cannonball {
  private sceneRef: GamePlayScene;

  constructor(scene: GamePlayScene) {
    this.sceneRef = scene;
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
          this.sceneRef.platformB?.getBlocks(),
          async (_, block): Promise<void> => {
            const b = block as Phaser.Physics.Arcade.Sprite;
            if (b.getBounds().contains(targetX, targetY)) {
              this.sceneRef.roomService.destroyBlock(b.x, b.y);
              block.destroy();
            }
          }
        );
      },
    });
  }
}
