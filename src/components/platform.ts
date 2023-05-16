import * as Phaser from "phaser";
import GamePlayScene from "../scenes/gameplay";

const PLATFORM_HEIGHT = 6;
const PLATFORM_WIDTH = 4;
const WOOD_SPRITE_SIZE = 64;

export default class Platform {
  private sceneRef: GamePlayScene;
  private platformBlocks: Phaser.Physics.Arcade.StaticGroup;

  constructor(
    scene: GamePlayScene,
    x: number,
    y: number,
    enemy: boolean = false
  ) {
    this.sceneRef = scene;
    this.platformBlocks = scene.physics.add.staticGroup();
    for (let i = 1; i < PLATFORM_HEIGHT; i++) {
      const posY = i * WOOD_SPRITE_SIZE + y;
      for (let j = 1; j < PLATFORM_WIDTH; j++) {
        const posX = j * WOOD_SPRITE_SIZE + x;
        this.createPlatformBlock(posX, posY, enemy);
      }
    }
  }

  private createPlatformBlock(x: number, y: number, enemy: boolean) {
    const block = this.sceneRef.add.sprite(x, y, "wood");
    block.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, block.width, block.height),
      Phaser.Geom.Rectangle.Contains
    );

    !enemy
      ? this.addPlayerControl(block, x, y)
      : this.addEnemyControl(block, x, y);

    this.platformBlocks.add(block);
  }

  private addPlayerControl = (
    block: Phaser.GameObjects.Sprite,
    x: number,
    y: number
  ): void => {
    block.on("pointerover", () => {
      const rect = this.sceneRef.add.rectangle(
        x,
        y,
        block.width,
        block.height,
        0,
        0.2
      );
      rect.setName("hover");
    });
    block.on("pointerout", () => {
      this.sceneRef.children.getByName("hover").destroy();
    });
    block.on("pointerdown", () => {
      if (this.sceneRef.input.activePointer.leftButtonDown()) {
        this.sceneRef.pirate.setMovePosition(x, y - WOOD_SPRITE_SIZE / 2);
      }
    });
  };

  private addEnemyControl = (
    block: Phaser.GameObjects.Sprite,
    x: number,
    y: number
  ): void => {
    block.on("pointerover", () => {
      const rect = this.sceneRef.add.rectangle(
        x,
        y,
        block.width,
        block.height,
        2231,
        0.2
      );
      rect.setName("hover");
    });
    block.on("pointerout", () => {
      this.sceneRef.children.remove(this.sceneRef.children.getByName("hover"));
    });
    block.on("pointerdown", () => {
      if (this.sceneRef.input.activePointer.rightButtonDown()) {
        this.sceneRef.cannonball.shootTo(
          x,
          y,
          this.sceneRef.pirate.getPosition()
        );
      }
    });
  };

  getBlocks() {
    return this.platformBlocks;
  }
}
