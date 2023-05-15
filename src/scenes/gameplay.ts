import * as Phaser from "phaser";
import { createPlatforms, getClickedBlock } from "../components/platform";
import Pirate from "../components/pirate";

export default class GamePlayScene extends Phaser.Scene {
  platformBlocks: Phaser.Physics.Arcade.StaticGroup;
  pirate: Pirate;

  constructor() {
    super({ key: "GamePlayScene" });
  }

  preload() {
    this.load.image("water", "../../assets/water.png");
    this.load.image("wood", "../../assets/wood.png");
    this.load.image("pirate", "../../assets/pirate.png");
  }

  create() {
    const water = this.add.image(0, 0, "water").setOrigin(0);
    const scaleX = (this.game.config.width as number) / water.width;
    const scaleY = (this.game.config.height as number) / water.height;
    const scale = Math.max(scaleX, scaleY);
    water.setScale(scale).setScrollFactor(0);

    this.platformBlocks = createPlatforms(this);
    this.pirate = new Pirate(this, 143, 600, "pirate");
    this.input.on("pointerup", this.setTargetPosition, this);
  }

  setTargetPosition(pointer: Phaser.Input.Pointer) {
    const closestBlock = getClickedBlock(
      new Phaser.Math.Vector2(pointer.x, pointer.y),
      this.platformBlocks
    );

    if (closestBlock) {
      const targetX = closestBlock.x + closestBlock.width / 2 - 32;
      const targetY = closestBlock.y + closestBlock.height / 2 - 38;
      this.pirate.setTargetPosition(targetX, targetY);
    }
  }

  update() {
    this.pirate.update();
  }
}
