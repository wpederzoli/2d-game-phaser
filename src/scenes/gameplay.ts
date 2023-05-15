import * as Phaser from "phaser";
import { ASSET_SIZE, createPlatforms } from "../components/platform";

export default class GamePlayScene extends Phaser.Scene {
  platformBlocks: Phaser.Physics.Arcade.StaticGroup;
  pirateOne: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  targetPosition: Phaser.Math.Vector2 | null;

  constructor() {
    super({ key: "GamePlayScene" });
  }

  preload() {
    this.load.image("water", "../../assets/water.png");
    this.load.image("wood", "../../assets/wood.png");
    this.load.image("pirate", "../../assets/pirate.png");
  }

  create() {
    const water = this.add.image(0, 0, "water").setOrigin(0);
    const scaleX = (this.game.config.width as number) / water.width;
    const scaleY = (this.game.config.height as number) / water.height;
    const scale = Math.max(scaleX, scaleY);
    water.setScale(scale).setScrollFactor(0);

    this.platformBlocks = createPlatforms(this);
    this.pirateOne = this.physics.add.sprite(143, 600, "pirate");
    this.pirateOne.setCollideWorldBounds(true);
    this.pirateOne.setGravity(0);

    this.input.on("pointerup", this.setTargetPosition, this);
  }

  setTargetPosition(pointer: Phaser.Input.Pointer) {
    const clickedPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
    let closestBlock: Phaser.Physics.Arcade.Sprite | null = null;
    let closestDistance: number = Number.MAX_VALUE;

    this.platformBlocks.getChildren().forEach((block) => {
      const blockBody = block.body as Phaser.Physics.Arcade.StaticBody;
      const blockPosition = new Phaser.Math.Vector2(
        blockBody.position.x + blockBody.halfWidth,
        blockBody.position.y + blockBody.halfHeight
      );
      const distance = Phaser.Math.Distance.BetweenPoints(
        clickedPosition,
        blockPosition
      );

      if (distance < closestDistance) {
        closestBlock = block as Phaser.Physics.Arcade.Sprite;
        closestDistance = distance;
      }
    });

    if (closestBlock) {
      const targetX = closestBlock.x + closestBlock.width / 2 - 32;
      const targetY = closestBlock.y + closestBlock.height / 2 - 38;
      this.targetPosition = new Phaser.Math.Vector2(targetX, targetY);
    }
  }

  update() {
    if (this.targetPosition) {
      const { x: targetX, y: targetY } = this.targetPosition;
      const distance = Phaser.Math.Distance.Between(
        this.pirateOne.x,
        this.pirateOne.y,
        targetX,
        targetY
      );

      if (distance < 5) {
        this.pirateOne.setVelocity(0);
        this.targetPosition = null;
      } else {
        this.physics.moveTo(this.pirateOne, targetX, targetY, 100);
      }
    }
  }
}
