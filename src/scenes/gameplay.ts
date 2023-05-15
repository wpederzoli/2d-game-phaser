import * as Phaser from "phaser";
import { createPlatforms } from "../components/platform";

export default class GamePlayScene extends Phaser.Scene {
  platformBlocks: Phaser.Physics.Arcade.StaticGroup;
  constructor() {
    super({ key: "GamePlayScene" });
  }

  preload() {
    this.load.image("water", "../../assets/water.png");
    this.load.image("wood", "../../assets/wood.png");
  }

  create() {
    const water = this.add.image(0, 0, "water").setOrigin(0);
    const scaleX = (this.game.config.width as number) / water.width;
    const scaleY = (this.game.config.height as number) / water.height;
    const scale = Math.max(scaleX, scaleY);
    water.setScale(scale).setScrollFactor(0);

    this.platformBlocks = createPlatforms(this);
  }
  update() {
    // Update game logic here
  }
}
