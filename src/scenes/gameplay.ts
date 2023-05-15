import * as Phaser from "phaser";
import { createPlatforms, getClickedBlock } from "../components/platform";
import Pirate from "../components/pirate";
import Cannonball from "../components/cannonball";

export default class GamePlayScene extends Phaser.Scene {
  platformBlocks: Phaser.Physics.Arcade.StaticGroup;
  pirate: Pirate;
  cannonball: Cannonball;

  constructor() {
    super({ key: "GamePlayScene" });
  }

  preload() {
    this.load.image("water", "../../assets/water.png");
    this.load.image("wood", "../../assets/wood.png");
    this.load.image("pirate", "../../assets/pirate.png");
    this.load.image("cannonball", "../../assets/cannonball.png");
  }

  create() {
    const water = this.add.image(0, 0, "water").setOrigin(0);
    const scaleX = (this.game.config.width as number) / water.width;
    const scaleY = (this.game.config.height as number) / water.height;
    const scale = Math.max(scaleX, scaleY);
    water.setScale(scale).setScrollFactor(0);

    this.platformBlocks = createPlatforms(this);
    this.pirate = new Pirate(this, 143, 600, "pirate");
    this.cannonball = new Cannonball(this, this.platformBlocks);

    this.input.mouse.disableContextMenu();
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        const block = getClickedBlock(pointer.position, this.platformBlocks);
        if (block) {
          this.cannonball.shootTo(block.x, block.y, this.pirate.getPosition());
        }
      }
      if (pointer.leftButtonDown()) {
        this.setTargetPosition(pointer);
      }
    });
  }

  setTargetPosition(pointer: Phaser.Input.Pointer) {
    const closestBlock = getClickedBlock(
      new Phaser.Math.Vector2(pointer.x, pointer.y),
      this.platformBlocks
    );

    if (closestBlock) {
      const targetX = closestBlock.x + closestBlock.width / 2 - 32;
      const targetY = closestBlock.y + closestBlock.height / 2 - 38;
      this.pirate.setMovePosition(targetX, targetY);
    }
  }

  update() {
    this.pirate.update();
  }
}
