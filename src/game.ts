import * as Phaser from "phaser";
import GamePlayScene from "./scenes/gameplay";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1080,
  height: 810,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [GamePlayScene],
};

export default new Phaser.Game(config);
