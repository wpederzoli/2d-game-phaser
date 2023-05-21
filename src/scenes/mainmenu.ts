import * as Phaser from "phaser";
import UIButton from "../components/uiButton";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
  }

  create() {
    new UIButton(this, 400, 250, "Create Party", this.createPartyClick);
    new UIButton(this, 400, 300, "Join Party");
    new UIButton(this, 400, 350, "Credits");
  }

  createPartyClick() {
    console.log("create party clicked");
  }

  joinPartyClick() {
    console.log("join party clicked");
  }
}
