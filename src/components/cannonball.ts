import * as Phaser from "phaser";
import GamePlayScene from "../scenes/gameplay";

export default class Cannonball {
  private sceneRef: GamePlayScene;
  private targetPos: Phaser.Math.Vector2;

  constructor(scene: GamePlayScene) {
    this.sceneRef = scene;
    this.targetPos = new Phaser.Math.Vector2(0, 0);
  }

  shootTo(target: Phaser.Math.Vector2, origin: Phaser.Math.Vector2) {
    const cannonball = this.sceneRef.physics.add.sprite(
      origin.x,
      origin.y,
      "cannonball"
    );

    this.sceneRef.tweens.add({
      targets: cannonball,
      x: target.x,
      y: target.y,
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
            if (b.getBounds().contains(target.x, target.y)) {
              this.sceneRef.roomService.destroyBlock(b.x, b.y);
              block.destroy();
            }
          }
        );
      },
    });
  }

  shoot(originPos: Phaser.Math.Vector2) {
    this.shootTo(this.targetPos, originPos);
  }

  getTargetPosition() {
    return this.targetPos;
  }

  setTargetPosition(target: Phaser.Math.Vector2) {
    this.targetPos = target;
  }
}
