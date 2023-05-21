import * as Phaser from "phaser";
import Platform, {
  LEFT_PLATFORM_POS,
  RIGHT_PLATFORM_POS,
  WOOD_SPRITE_SIZE,
} from "../components/platform";
import Pirate, { LEFT_PIRATE_POS } from "../components/pirate";
import RoomService from "../network/roomService";

export default class GamePlayScene extends Phaser.Scene {
  roomService: RoomService;
  platformA: Platform;
  platformB: Platform;
  pirate: Pirate;
  enemy: Pirate;

  constructor() {
    super({ key: "GamePlayScene" });
  }

  init(args: { roomId: string; isHost: boolean }) {
    this.roomService = new RoomService(this, args.roomId, args.isHost);
    this.spawnPlayer();
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

    const btn2 = document.createElement("button");
    btn2.innerHTML = "Play";
    btn2.onclick = () => this.roomService.startTurn();

    const countText = document.createElement("div");
    countText.id = "countText";
    countText.innerHTML = "3";

    Phaser.DOM.AddToDOM(inputElement);
    Phaser.DOM.AddToDOM(button);
    Phaser.DOM.AddToDOM(btn);
    Phaser.DOM.AddToDOM(btn2);
    Phaser.DOM.AddToDOM(countText);
  }

  updateCountDown(count: number) {
    document.getElementById("countText").innerHTML = count.toString();
  }

  spawnPirate(x: number, y: number) {
    this.enemy = new Pirate(this, x, y, "pirate", true);
  }

  spawnPlayer() {
    console.log("Spawning player one");
    this.platformA = new Platform(
      this,
      LEFT_PLATFORM_POS.x,
      LEFT_PLATFORM_POS.y
    );
    this.platformB = new Platform(
      this,
      RIGHT_PLATFORM_POS.x,
      RIGHT_PLATFORM_POS.y,
      true
    );
    this.pirate = new Pirate(
      this,
      LEFT_PIRATE_POS.x,
      LEFT_PLATFORM_POS.y,
      "pirate"
    );
  }

  async spawnPlayerOne(roomId: string) {
    try {
      const res = await this.roomService.createRoom(roomId);
      if (res) {
        this.platformA = new Platform(this, 0, WOOD_SPRITE_SIZE * 3);
        this.platformB = new Platform(
          this,
          WOOD_SPRITE_SIZE * 13,
          WOOD_SPRITE_SIZE * 3,
          true
        );
        this.pirate = new Pirate(
          this,
          WOOD_SPRITE_SIZE,
          WOOD_SPRITE_SIZE * 3 + WOOD_SPRITE_SIZE / 2,
          "pirate"
        );
      }
    } catch (e) {
      console.log("error creating room: ", e);
    }
  }

  async spawnPlayerTwo(roomId: string) {
    try {
      const res = await this.roomService.joinRoom(roomId);
      if (res) {
        this.platformA = new Platform(
          this,
          WOOD_SPRITE_SIZE * 13,
          WOOD_SPRITE_SIZE * 3
        );
        this.platformB = new Platform(this, 0, WOOD_SPRITE_SIZE * 3, true);
        this.pirate = new Pirate(
          this,
          WOOD_SPRITE_SIZE * 16,
          WOOD_SPRITE_SIZE * 3.5,
          "pirate"
        );
        this.enemy = new Pirate(
          this,
          WOOD_SPRITE_SIZE,
          WOOD_SPRITE_SIZE * 3.5,
          "pirate",
          true
        );
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
