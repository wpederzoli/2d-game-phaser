import * as Phaser from "phaser";

export default class GamePlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "GamePlayScene" });
  }

  preload() {
    this.load.image("water", "../../assets/water.png");
  }

  create() {
    const water = this.add.sprite(0, 0, "water").setOrigin(0);
    const scaleX = (this.game.config.width as number) / water.width;
    const scaleY = (this.game.config.height as number) / water.height;
    const scale = Math.max(scaleX, scaleY);
    water.setScale(scale).setScrollFactor(0);
  }

  update() {
    // Update game logic here
  }
}
