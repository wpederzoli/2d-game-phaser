import * as Phaser from "phaser";

export default class UIInputContainer {
  private container: HTMLElement;

  constructor(
    scene: Phaser.Scene,
    header: string,
    actionText: string,
    actionCb: (name: string) => void
  ) {
    this.container = document.createElement("div");
    const inputField = document.createElement("input");
    const title = document.createElement("h3");
    const btnsContainer = document.createElement("div");
    const btnCreate = document.createElement("button");
    btnCreate.innerHTML = actionText;
    btnCreate.onclick = () => actionCb(inputField.value);
    const btnCancel = document.createElement("button");

    const gameCanvas = scene.game.canvas;
    const gameContainer = gameCanvas.parentElement;
    gameContainer?.appendChild(this.container);

    const divStyles = this.container.style;
    divStyles.position = "absolute";
    divStyles.left = scene.cameras.main.width / 2 - 200 + "px";
    divStyles.top = scene.cameras.main.height / 2 - 150 + "px";
    divStyles.backgroundColor = "#37377efa";
    divStyles.width = "400px";
    divStyles.height = "300px";
    divStyles.border = "1px solid white";
    divStyles.borderRadius = "20px";
    divStyles.display = "flex";
    divStyles.flexDirection = "column";
    divStyles.justifyContent = "center";
    divStyles.alignItems = "center";

    title.innerHTML = header;
    const titleStyles = title.style;
    titleStyles.color = "#ffff";
    titleStyles.fontSize = "25px";
    titleStyles.fontFamily = "fantasy";

    inputField.placeholder = "Enter a party name";
    const inputStyles = inputField.style;
    inputStyles.width = "75%";
    inputStyles.height = "10%";
    inputStyles.borderRadius = "25px";
    inputStyles.textAlign = "center";
    inputStyles.fontSize = "20px";
    inputStyles.fontFamily = "fantasy";
    inputStyles.paddingTop = "8px";

    const btnsContainerStyles = btnsContainer.style;
    btnsContainerStyles.display = "flex";
    btnsContainerStyles.padding = "25px";
    btnsContainerStyles.justifyContent = "space-between";
    btnsContainerStyles.alignItems = "center";
    btnsContainerStyles.flexDirection = "row";
    btnsContainerStyles.flexWrap = "nowrap";
    btnsContainerStyles.width = "75%";

    const btnCancelStyles = btnCancel.style;
    btnCancelStyles.width = "40%";
    btnCancelStyles.color = "white";
    btnCancelStyles.backgroundColor = "#1c1c53";
    btnCancelStyles.border = "1px solid white";
    btnCancelStyles.borderRadius = "6px";
    btnCancelStyles.height = "35px";
    btnCancelStyles.fontFamily = "fantasy";

    btnCancel.onmouseover = () => {
      btnCancelStyles.backgroundColor = "rgb(83 83 176)";
      btnCancelStyles.cursor = "pointer";
    };

    btnCancel.onmouseout = () => {
      btnCancelStyles.backgroundColor = "#1c1c53";
    };

    btnCancel.onclick = () => {
      this.container.remove();
    };

    const btnCreateStyles = btnCreate.style;
    btnCreateStyles.width = btnCancelStyles.width;
    btnCreateStyles.color = btnCancelStyles.color;
    btnCreateStyles.backgroundColor = btnCancelStyles.backgroundColor;
    btnCreateStyles.border = btnCancelStyles.border;
    btnCreateStyles.borderRadius = btnCancelStyles.borderRadius;
    btnCreateStyles.height = btnCancelStyles.height;
    btnCreateStyles.fontFamily = btnCancelStyles.fontFamily;

    btnCreate.onmouseover = () => {
      btnCreateStyles.backgroundColor = "rgb(83 83 176)";
      btnCreateStyles.cursor = "pointer";
    };
    btnCreate.onmouseout = () => {
      btnCreateStyles.backgroundColor = "#1c1c53";
    };

    btnCancel.innerHTML = "Cancel";

    this.container.appendChild(title);
    this.container.appendChild(inputField);
    this.container.appendChild(btnsContainer);
    btnsContainer.appendChild(btnCancel);
    btnsContainer.appendChild(btnCreate);
  }

  destroy() {
    this.container.remove();
  }
}
