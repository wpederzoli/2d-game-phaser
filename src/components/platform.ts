import * as Phaser from "phaser";
import GamePlayScene from "../scenes/gameplay";

export const PLATFORM_HEIGHT = 6;
export const PLATFORM_WIDTH = 4;
export const WOOD_SPRITE_SIZE = 64;
export const LEFT_PLATFORM_POS = { x: 0, y: WOOD_SPRITE_SIZE * 3 };
export const RIGHT_PLATFORM_POS = {
  x: WOOD_SPRITE_SIZE * 13,
  y: WOOD_SPRITE_SIZE * 3,
};

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

    this.addPlayerControl(block, x, y, enemy);

    this.platformBlocks.add(block);
  }

  private addPlayerControl = (
    block: Phaser.GameObjects.Sprite,
    x: number,
    y: number,
    enemy: boolean
  ): void => {
    block.on("pointerover", () => {
      const rect = this.sceneRef.add.rectangle(
        x,
        y,
        block.width,
        block.height,
        !enemy ? 0 : 23252,
        0.2
      );
      rect.setName("hover");
    });
    block.on("pointerout", () => {
      this.sceneRef.children.getByName("hover")?.destroy();
    });
    block.on("pointerdown", async () => {
      if (!enemy && this.sceneRef.input.activePointer.leftButtonDown()) {
        this.sceneRef.pirate?.setMovePosition(x, y - WOOD_SPRITE_SIZE / 2);
        this.sceneRef.pirate?.findPath();
        this.sceneRef.roomService.sendMovePosition(x, y - WOOD_SPRITE_SIZE / 2);
        const selectRect = this.sceneRef.add.rectangle(
          x,
          y,
          block.width,
          block.height,
          12123,
          0.5
        );
        this.sceneRef.children
          .getChildren()
          .forEach((child) => child.name === "selected" && child.destroy());
        selectRect.setName("selected");
      }

      if (enemy && this.sceneRef.input.activePointer.rightButtonDown()) {
        const newPos = new Phaser.Math.Vector2(x, y);
        this.sceneRef.pirate.setTargetPosition(newPos);
        this.sceneRef.roomService.sendShootPosition(newPos);
        const selectRect = this.sceneRef.add.rectangle(
          x,
          y,
          block.width,
          block.height,
          34345,
          0.5
        );
        this.sceneRef.children
          .getChildren()
          .forEach((child) => child.name === "targetSelect" && child.destroy());
        selectRect.setName("targetSelect");
      }
    });
  };

  getBlocks() {
    return this.platformBlocks;
  }

  removeElementAt(x: number, y: number) {
    let block: Phaser.GameObjects.GameObject;
    this.getBlocks()
      .getChildren()
      .forEach((b: Phaser.Physics.Arcade.Sprite) => {
        if (b.x === x && b.y === y) {
          block = b as Phaser.GameObjects.GameObject;
        }
      });

    block && block.destroy();
  }
}
