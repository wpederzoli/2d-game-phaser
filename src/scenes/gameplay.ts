import * as Phaser from "phaser";

export default class GamePlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "GamePlayScene" });
  }

  preload() {
    this.load.image("water", "../../assets/water.png");
    this.load.image("wood", "../../assets/wood.png");
  }

  create() {
    const water = this.add.sprite(0, 0, "water").setOrigin(0);
    const scaleX = (this.game.config.width as number) / water.width;
    const scaleY = (this.game.config.height as number) / water.height;
    const scale = Math.max(scaleX, scaleY);
    water.setScale(scale).setScrollFactor(0);

    const wood = this.add.sprite(0, 0, "wood");
    let posX = wood.width / 2;
    let posY = wood.height / 2;
    wood.setX(posX);
    wood.setY(posY);
    for (let i = 0; i < 5; i++) {
      posY += wood.height;
      this.add.sprite(posX, posY, "wood");
    }

    posX += wood.width;
    posY = wood.height / 2;
    this.add.sprite(posX, posY, "wood");

    for (let i = 0; i < 5; i++) {
      posY += wood.height;
      this.add.sprite(posX, posY, "wood");
    }

    posX += wood.width;
    posY = wood.height / 2;
    this.add.sprite(posX, posY, "wood");

    for (let i = 0; i < 5; i++) {
      posY += wood.height;
      this.add.sprite(posX, posY, "wood");
    }

    posX = window.innerWidth - wood.width / 2;
    posY = wood.height / 2;
    this.add.sprite(posX, posY, "wood");

    for (let i = 0; i < 5; i++) {
      posY += wood.height;
      this.add.sprite(posX, posY, "wood");
    }

    posX -= wood.width;
    posY = wood.height / 2;
    this.add.sprite(posX, posY, "wood");

    for (let i = 0; i < 5; i++) {
      posY += wood.height;
      this.add.sprite(posX, posY, "wood");
    }

    posX -= wood.width;
    posY = wood.height / 2;
    this.add.sprite(posX, posY, "wood");

    for (let i = 0; i < 5; i++) {
      posY += wood.height;
      this.add.sprite(posX, posY, "wood");
    }
  }

  update() {
    // Update game logic here
  }
}
