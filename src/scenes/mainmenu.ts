import * as Phaser from "phaser";
import UIButton from "../components/uiButton";
import UIInputContainer from "../components/uiInputContainer";
import StartPartyService from "../network/partyCreation";

export default class MainMenuScene extends Phaser.Scene {
  private partyService: StartPartyService;
  private createButton: UIButton;
  private joinButton: UIButton;
  private creditsButton: UIButton;
  private inputContainer: UIInputContainer;

  constructor() {
    super({ key: "MainMenuScene" });
    this.partyService = new StartPartyService();
  }

  create() {
    this.createButton = new UIButton(this, 400, 250, "Create Party", () =>
      this.createPartyClick()
    );
    this.joinButton = new UIButton(
      this,
      400,
      300,
      "Join Party",
      this.joinPartyClick
    );
    this.creditsButton = new UIButton(this, 400, 350, "Credits");
  }

  createPartyClick() {
    this.inputContainer = new UIInputContainer(
      this,
      "Create",
      (roomName: string) => this.startParty(roomName)
    );
  }

  joinPartyClick() {
    console.log("join party clicked");
  }

  async startParty(roomName: string) {
    console.log("start party");
    const res = await this.partyService.createParty(roomName);
    if (res.roomId !== "") {
      console.log("starting scene");
      this.inputContainer.destroy();
      this.createButton.destroy();
      this.joinButton.destroy();
      this.creditsButton.destroy();
      this.game.scene.start("GamePlayScene", {
        roomId: res.roomId,
        isHost: true,
      });
    }
  }
}
