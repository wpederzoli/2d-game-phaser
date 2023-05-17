import * as Phaser from "phaser";
import Platform from "../components/platform";
import Pirate from "../components/pirate";
import Cannonball from "../components/cannonball";
import RoomService from "../network/roomService";

export default class GamePlayScene extends Phaser.Scene {
  roomService: RoomService;
  platformA: Platform;
  platformB: Platform;
  pirate: Pirate;
  enemy: Pirate;
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

    this.roomService = new RoomService(this);

    this.cannonball = new Cannonball(this);

    this.input.setDefaultCursor("url(../../assets/cursor.png), pointer");
    this.input.mouse?.disableContextMenu();

    const inputElement = document.createElement("input");
    inputElement.type = "text";

    const button = document.createElement("button");
    button.innerHTML = "Create";
    button.onclick = () => this.spawnPlayerOne(inputElement.value);

    const btn = document.createElement("button");
    btn.innerHTML = "Join";
    btn.onclick = () => this.spawnPlayerTwo(inputElement.value);

    Phaser.DOM.AddToDOM(inputElement);
    Phaser.DOM.AddToDOM(button);
    Phaser.DOM.AddToDOM(btn);
  }

  spawnPirate() {
    this.enemy = new Pirate(this, 880, 300, "pirate");
  }

  async spawnPlayerOne(roomId: string) {
    try {
      const res = await this.roomService.createRoom(roomId);
      if (res) {
        this.platformA = new Platform(this, 10, 200);
        this.platformB = new Platform(this, 800, 200, true);
        this.pirate = new Pirate(this, 80, 300, "pirate");
      }
    } catch (e) {
      console.log("error creating room: ", e);
    }
  }

  async spawnPlayerTwo(roomId: string) {
    console.log("joining");
    try {
      const res = await this.roomService.joinRoom(roomId);
      console.log("res: ", res);
      if (res) {
        this.platformA = new Platform(this, 800, 200);
        this.platformB = new Platform(this, 10, 200, true);
        this.pirate = new Pirate(this, 880, 300, "pirate");
        this.enemy = new Pirate(this, 80, 300, "pirate");
      }
    } catch (e) {
      console.log("failed to join room: ", e);
    }
  }

  update() {
    this.pirate?.update();
    this.enemy?.update();
  }
}
