import * as Phaser from "phaser";

export default class UIButton {
  private btn: HTMLElement;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    cb?: () => void
  ) {
    this.btn = document.createElement("button");
    this.btn.innerHTML = text;

    const gameCanvas = scene.game.canvas;
    const gameContainer = gameCanvas.parentElement;
    gameContainer.appendChild(this.btn);

    const btnStyle = this.btn.style;
    btnStyle.position = "absolute";
    btnStyle.left = x + "px";
    btnStyle.top = y + "px";
    btnStyle.backgroundColor = "#ffffff";
    btnStyle.color = "#000000";
    btnStyle.padding = "10px 20px";
    btnStyle.border = "none";
    btnStyle.cursor = "pointer";
    btnStyle.fontSize = "16px";
    btnStyle.fontWeight = "bold";
    btnStyle.width = `${scene.cameras.default.width / 4}px`;
    btnStyle.borderRadius = "10px";

    this.btn.onmouseover = () => {
      btnStyle.backgroundColor = "#fffada";
    };

    this.btn.onmouseout = () => {
      btnStyle.backgroundColor = "#ffffff";
    };

    this.btn.addEventListener("click", () => {
      cb && cb();
    });
  }

  destroy() {
    this.btn.remove();
  }
}
