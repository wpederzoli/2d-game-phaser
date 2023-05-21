import * as Phaser from "phaser";
import UIButton from "../components/uiButton";
import UIInputContainer from "../components/uiInputContainer";

export default class MainMenuScene extends Phaser.Scene {
  private inputContainer: UIInputContainer | undefined;

  constructor() {
    super({ key: "MainMenuScene" });
  }

  create() {
    new UIButton(this, 400, 250, "Create Party", () => this.createPartyClick());
    new UIButton(this, 400, 300, "Join Party", this.joinPartyClick);
    new UIButton(this, 400, 350, "Credits");
  }

  createPartyClick() {
    this.inputContainer = new UIInputContainer(this);
  }

  joinPartyClick() {
    console.log("join party clicked");
  }
}
