import * as Phaser from "phaser";
import GamePlayScene from "./scenes/gameplay";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1080,
  height: 810,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  fps: {
    min: 30,
  },
  scene: [GamePlayScene],
};

export default new Phaser.Game(config);
