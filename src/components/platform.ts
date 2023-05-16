import * as Phaser from "phaser";

const PLATFORM_HEIGHT = 6;
const PLATFORM_WIDTH = 4;
const WOOD_SPRITE_SIZE = 64;
const PLATFORM_INITIAL_X = 820;
const PLATFORM_INITIAL_Y = 300;

export const createPlatforms = (scene: Phaser.Scene) => {
  const platformBlocks = scene.physics.add.staticGroup();

  for (let i = 1; i < PLATFORM_HEIGHT; i++) {
    const posY = i * WOOD_SPRITE_SIZE + PLATFORM_INITIAL_Y;
    for (let j = 1; j < PLATFORM_WIDTH; j++) {
      const posX = j * WOOD_SPRITE_SIZE;
      platformBlocks.create(posX, posY, "wood");
    }
  }

  for (let i = 1; i < PLATFORM_HEIGHT; i++) {
    const posY = i * WOOD_SPRITE_SIZE + PLATFORM_INITIAL_Y;
    for (let j = 1; j < PLATFORM_WIDTH; j++) {
      const posX = j * WOOD_SPRITE_SIZE + PLATFORM_INITIAL_X;
      platformBlocks.create(posX, posY, "wood");
    }
  }

  return platformBlocks;
};

export const getClickedBlock = (
  clickPosition: Phaser.Math.Vector2,
  blocks: Phaser.Physics.Arcade.StaticGroup
): Phaser.Physics.Arcade.Sprite | null => {
  let closestBlock: Phaser.Physics.Arcade.Sprite | null = null;
  let closestDistance: number = Number.MAX_VALUE;

  blocks.getChildren().forEach((block) => {
    const blockBody = block.body as Phaser.Physics.Arcade.StaticBody;
    const blockPosition = new Phaser.Math.Vector2(
      blockBody.position.x + blockBody.halfWidth,
      blockBody.position.y + blockBody.halfHeight
    );
    const distance = Phaser.Math.Distance.BetweenPoints(
      clickPosition,
      blockPosition
    );

    if (distance < closestDistance) {
      closestBlock = block as Phaser.Physics.Arcade.Sprite;
      closestDistance = distance;
    }
  });

  return closestBlock;
};
