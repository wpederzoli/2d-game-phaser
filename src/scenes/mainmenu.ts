import * as Phaser from "phaser";
import UIButton from "../components/uiButton";
import UIInputContainer from "../components/uiInputContainer";
import StartPartyService from "../network/partyCreation";

export default class MainMenuScene extends Phaser.Scene {
  private partyService: StartPartyService;

  constructor() {
    super({ key: "MainMenuScene" });
    this.partyService = new StartPartyService();
  }

  create() {
    new UIButton(this, 400, 250, "Create Party", () => this.createPartyClick());
    new UIButton(this, 400, 300, "Join Party", this.joinPartyClick);
    new UIButton(this, 400, 350, "Credits");
  }

  createPartyClick() {
    new UIInputContainer(this, "Create", (roomName: string) =>
      this.startParty(roomName)
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
      this.game.scene.start("GamePlayScene", {
        roomId: res.roomId,
        isHost: true,
      });
    }
  }
}
