import UIText from "./uiText";
import UIButton from "./uiButton";
import GamePlayScene from "../scenes/gameplay";

export default class GamePlayUI {
  private sceneRef: GamePlayScene;
  private text: UIText;
  private left_bottom_txt: UIText;
  private right_bottom_txt: UIText;
  private count: UIText;
  private starButton: UIButton;

  constructor(scene: GamePlayScene, isHost: boolean) {
    const initalText = isHost ? "Waiting for players" : "Ready to start";
    const moveText = "Left click to select destination";
    const shootText = "Right click to select target";
    this.sceneRef = scene;
    this.text = new UIText(scene, scene.cameras.main.width / 2, 25, initalText);
    const leftInitialTxt = isHost ? moveText : shootText;
    this.left_bottom_txt = new UIText(
      scene,
      160,
      scene.cameras.main.height - 80,
      leftInitialTxt,
      20
    );
    const rightInitialTxt = isHost ? shootText : moveText;
    this.right_bottom_txt = new UIText(
      scene,
      scene.cameras.main.width - 160,
      scene.cameras.main.height - 80,
      rightInitialTxt,
      20
    );
  }

  updateText(text: string, fontSize?: number) {
    this.text.update(text, fontSize);
  }

  updateCount(count: string) {
    if (!this.count) {
      this.count = new UIText(
        this.sceneRef,
        this.sceneRef.cameras.main.width / 2,
        125,
        "10"
      );
    }
    this.count.update(count);
  }

  showStartButton(show: boolean) {
    if (show) {
      this.starButton = new UIButton(
        this.sceneRef,
        this.sceneRef.cameras.main.width / 2,
        225,
        "Start",
        () => this.sceneRef.roomService.startGame()
      );
    } else {
      this.starButton && this.starButton.destroy();
    }
  }
}
