import UIText from "./uiText";
import UIButton from "./uiButton";
import GamePlayScene from "../scenes/gameplay";

export default class GamePlayUI {
  private sceneRef: GamePlayScene;
  private text: UIText;
  private count: UIText;
  private starButton: UIButton;

  constructor(scene: GamePlayScene, isHost: boolean) {
    const initalText = isHost ? "Waiting for players" : "Ready to start";
    this.sceneRef = scene;
    this.text = new UIText(scene, scene.cameras.main.width / 2, 25, initalText);
    this.count = new UIText(scene, scene.cameras.main.width / 2, 125, "3");
  }

  updateText(text: string) {
    this.text.update(text);
  }

  updateCount(count: string) {
    this.count.update(count);
  }

  showStartButton(show: boolean) {
    if (show) {
      this.starButton = new UIButton(
        this.sceneRef,
        this.sceneRef.cameras.main.width / 2,
        225,
        "Start",
        () => this.sceneRef.roomService.startTurn()
      );
    }
  }
}
