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
    this.createButton = new UIButton(
      this,
      this.cameras.main.width / 2,
      250,
      "Create Party",
      () => this.createPartyClick()
    );
    this.joinButton = new UIButton(
      this,
      this.cameras.main.width / 2,
      300,
      "Join Party",
      () => this.joinPartyClick()
    );
    this.creditsButton = new UIButton(
      this,
      this.cameras.main.width / 2,
      350,
      "Credits"
    );
  }

  createPartyClick() {
    this.inputContainer = new UIInputContainer(
      this,
      "New Party",
      "Create",
      (roomName: string) => this.startParty(roomName)
    );
  }

  joinPartyClick() {
    this.inputContainer = new UIInputContainer(
      this,
      "Join Party",
      "Join",
      (roomName: string) => this.joinParty(roomName)
    );
  }

  async startParty(roomName: string) {
    const res = await this.partyService.createParty(roomName);
    if (res.roomId !== "") {
      this.clearUI();
      this.game.scene.start("GamePlayScene", {
        connection: this.partyService.getSocket(),
        roomId: res.roomId,
        userId: res.userId,
        isHost: true,
      });
    }
  }

  async joinParty(roomName: string) {
    const res = await this.partyService.joinParty(roomName);
    if (res.roomId !== "") {
      this.clearUI();
      this.game.scene.start("GamePlayScene", {
        connection: this.partyService.getSocket(),
        roomId: res.roomId,
        userId: res.userId,
        isHost: false,
      });
    }
  }

  clearUI() {
    this.inputContainer.destroy();
    this.createButton.destroy();
    this.joinButton.destroy();
    this.creditsButton.destroy();
  }
}
