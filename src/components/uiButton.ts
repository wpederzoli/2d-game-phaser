import * as Phaser from "phaser";

export default class UIButton {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    cb?: () => void
  ) {
    const btn = document.createElement("button");
    btn.innerHTML = text;

    const gameCanvas = scene.game.canvas;
    const gameContainer = gameCanvas.parentElement;
    gameContainer.appendChild(btn);

    const btnStyle = btn.style;
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

    btn.onmouseover = () => {
      btnStyle.backgroundColor = "#fffada";
    };

    btn.onmouseout = () => {
      btnStyle.backgroundColor = "#ffffff";
    };

    btn.addEventListener("click", () => {
      cb && cb();
    });
  }
}
