import * as Phaser from "phaser";
import { Socket } from "socket.io-client";
import Platform, {
  LEFT_PLATFORM_POS,
  RIGHT_PLATFORM_POS,
} from "../components/platform";
import Pirate, {
  LEFT_PIRATE_POS,
  RIGHT_PIRATE_POS,
} from "../components/pirate";
import RoomService from "../network/roomService";
import GamePlayUI from "../components/gamePlayUI";

export default class GamePlayScene extends Phaser.Scene {
  roomService: RoomService;
  gameOver: boolean;
  platformA: Platform;
  platformB: Platform;
  pirate: Pirate;
  enemy: Pirate;
  ui: GamePlayUI;

  constructor() {
    super({ key: "GamePlayScene" });
    this.gameOver = false;
  }

  init(args: {
    connection: Socket;
    roomId: string;
    userId: string;
    isHost: boolean;
  }) {
    this.roomService = new RoomService(
      this,
      args.connection,
      args.roomId,
      args.userId,
      args.isHost
    );
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

    this.spawnPlayer();

    this.input.setDefaultCursor("url(../../assets/cursor.png), pointer");
    this.input.mouse?.disableContextMenu();

    this.ui = new GamePlayUI(this, this.roomService.IsHost());
  }

  spawnEnemyPirate() {
    this.enemy = new Pirate(
      this,
      RIGHT_PIRATE_POS.x,
      RIGHT_PIRATE_POS.y,
      "pirate",
      true
    );
  }

  spawnPlayer() {
    if (this.roomService.IsHost()) {
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
        LEFT_PIRATE_POS.y,
        "pirate"
      );
    } else {
      this.platformA = new Platform(
        this,
        RIGHT_PLATFORM_POS.x,
        RIGHT_PLATFORM_POS.y
      );
      this.platformB = new Platform(
        this,
        LEFT_PLATFORM_POS.x,
        LEFT_PLATFORM_POS.y,
        true
      );
      this.enemy = new Pirate(
        this,
        LEFT_PIRATE_POS.x,
        LEFT_PIRATE_POS.y,
        "pirate",
        true
      );
      this.pirate = new Pirate(
        this,
        RIGHT_PIRATE_POS.x,
        RIGHT_PIRATE_POS.y,
        "pirate"
      );
    }
  }

  update() {
    this.pirate?.update();
    this.enemy?.update();
  }
}
