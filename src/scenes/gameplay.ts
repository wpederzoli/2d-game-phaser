import * as Phaser from "phaser";
import Platform from "../components/platform";
import Pirate from "../components/pirate";
import Cannonball from "../components/cannonball";

export default class GamePlayScene extends Phaser.Scene {
  platform: Platform;
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

    this.platform = new Platform(this, 10, 200);
    this.pirate = new Pirate(this, 80, 300, "pirate");
    this.cannonball = new Cannonball(this, this.platform.getBlocks());

    this.input.setDefaultCursor("url(../../assets/cursor.png), pointer");
    this.input.mouse.disableContextMenu();
  }

  update() {
    this.pirate.update();
  }
}
