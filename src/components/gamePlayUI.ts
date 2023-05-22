import * as Phaser from "phaser";
import UIText from "./uiText";

export default class GamePlayUI {
  private text: UIText;
  private count: UIText;

  constructor(scene: Phaser.Scene, isHost: boolean) {
    const initalText = isHost ? "Waiting for players" : "Ready to start";
    this.text = new UIText(scene, scene.cameras.main.width / 2, 25, initalText);
    this.count = new UIText(scene, scene.cameras.main.width / 2, 125, "3");
  }

  updateText(text: string) {
    this.text.update(text);
  }

  updateCount(count: string) {
    this.count.update(count);
  }
}
