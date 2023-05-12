import * as Phaser from "phaser";
import GamePlayScene from "./scenes/gameplay";

const config: Phaser.Types.Core.GameConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [GamePlayScene],
};

export default new Phaser.Game(config);
