import * as Phaser from "phaser";

const PLATFORM_HEIGHT = 6;
const PLATFORM_WIDTH = 4;
export const ASSET_SIZE = 64;
const PLATFORM_INITIAL_X = 820;
const PLATFORM_INITIAL_Y = 300;

export const createPlatforms = (scene: Phaser.Scene) => {
  const platformBlocks = scene.physics.add.staticGroup();

  for (let i = 1; i < PLATFORM_HEIGHT; i++) {
    const posY = i * ASSET_SIZE + PLATFORM_INITIAL_Y;
    for (let j = 1; j < PLATFORM_WIDTH; j++) {
      const posX = j * ASSET_SIZE;
      platformBlocks.create(posX, posY, "wood");
    }
  }

  for (let i = 1; i < PLATFORM_HEIGHT; i++) {
    const posY = i * ASSET_SIZE + PLATFORM_INITIAL_Y;
    for (let j = 1; j < PLATFORM_WIDTH; j++) {
      const posX = j * ASSET_SIZE + PLATFORM_INITIAL_X;
      platformBlocks.create(posX, posY, "wood");
    }
  }

  return platformBlocks;
};
