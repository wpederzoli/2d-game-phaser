import * as Phaser from "phaser";
import GamePlayScene from "../scenes/gameplay";
import Cannonball from "./cannonball";
import { WOOD_SPRITE_SIZE } from "./platform";

type PathNode = {
  position: Phaser.Math.Vector2;
  gScore: number;
  hScore: number;
  fScore: number;
  parent: PathNode;
};

export default class Pirate {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private sceneRef: GamePlayScene;
  private isEnemy: boolean;
  private canMove: boolean;
  private cannonball: Cannonball;
  private path: Phaser.Math.Vector2[];
  movePosition: Phaser.Math.Vector2 | undefined;

  constructor(
    scene: GamePlayScene,
    x: number,
    y: number,
    texture: string,
    isEnemy?: boolean
  ) {
    this.sceneRef = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
    this.cannonball = new Cannonball(this.sceneRef);
    this.canMove = false;
    this.isEnemy = isEnemy || false;
    this.path = [];
  }

  setMovePosition(x: number, y: number) {
    this.movePosition = new Phaser.Math.Vector2(x, y);
    this.findPath();
  }

  setTargetPosition(target: Phaser.Math.Vector2) {
    this.cannonball.setTargetPosition(target);
  }

  shoot() {
    this.cannonball.shoot(
      new Phaser.Math.Vector2(this.sprite.x, this.sprite.y)
    );
  }

  getPosition() {
    return this.sprite.body.position;
  }

  findPath() {
    console.log("finding path");
    const frontiers: PathNode[] = [];
    const visited: PathNode[] = [];

    const start = {
      position: new Phaser.Math.Vector2(
        this.sprite.x,
        this.sprite.y + WOOD_SPRITE_SIZE / 2
      ),
      gScore: 0,
      hScore: 0,
      fScore: 0,
      parent: null,
    };

    frontiers.push(start);

    while (frontiers.length > 0) {
      const current = this.findLowestFScoreNode(frontiers);
      const index = frontiers.indexOf(current);
      index > -1 && frontiers.splice(index, 1);
      visited.push(current);

      if (this.isDestination(current.position)) {
        console.log("is destination");
        this.path = this.reconstructPath(current);
        frontiers.splice(0, frontiers.length);
        return;
      }

      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (visited.includes(neighbor)) {
          continue;
        }

        const tentativeGScore =
          current.gScore + this.calculateDistance(current, neighbor);

        if (!frontiers.includes(neighbor)) {
          frontiers.push(neighbor);
        }

        neighbor.parent = current;
        neighbor.gScore = tentativeGScore;
        neighbor.hScore = this.calculateHScore(neighbor);
        neighbor.fScore = neighbor.gScore + neighbor.hScore;
      }
    }
  }

  calculateHScore(node: PathNode) {
    return (
      Math.abs(node.position.x - this.movePosition.x) +
      Math.abs(node.position.y - this.movePosition.y)
    );
  }

  calculateDistance(a: PathNode, b: PathNode) {
    return Phaser.Math.Distance.Between(
      a.position.x,
      a.position.y,
      b.position.x,
      b.position.y
    );
  }

  getNeighbors(node: PathNode) {
    const neighbors: PathNode[] = [];

    const rightNeighborPos = new Phaser.Math.Vector2(
      node.position.x + WOOD_SPRITE_SIZE,
      node.position.y
    );
    if (this.isValidNeighbor(rightNeighborPos)) {
      const rightNeigh = {
        position: rightNeighborPos,
        gScore: 0,
        hScore: 0,
        fScore: 0,
        parent: null,
      };
      neighbors.push(rightNeigh);
    }

    const leftNeighborPos = new Phaser.Math.Vector2(
      node.position.x - WOOD_SPRITE_SIZE,
      node.position.y
    );
    if (this.isValidNeighbor(leftNeighborPos)) {
      const leftNeigh = {
        position: leftNeighborPos,
        gScore: 0,
        hScore: 0,
        fScore: 0,
        parent: null,
      };
      neighbors.push(leftNeigh);
    }

    const topNeighborPos = new Phaser.Math.Vector2(
      node.position.x,
      node.position.y - WOOD_SPRITE_SIZE
    );
    if (this.isValidNeighbor(topNeighborPos)) {
      const topNeigh = {
        position: topNeighborPos,
        gScore: 0,
        hScore: 0,
        fScore: 0,
        parent: null,
      };
      neighbors.push(topNeigh);
    }

    const bottomNeighborPos = new Phaser.Math.Vector2(
      node.position.x,
      node.position.y + WOOD_SPRITE_SIZE
    );
    if (this.isValidNeighbor(bottomNeighborPos)) {
      const bottomNeigh = {
        position: bottomNeighborPos,
        gScore: 0,
        hScore: 0,
        fScore: 0,
        parent: null,
      };
      neighbors.push(bottomNeigh);
    }

    return neighbors;
  }

  isValidNeighbor(pos: Phaser.Math.Vector2) {
    const blocks = this.isEnemy
      ? this.sceneRef.platformB.getBlocks().getChildren()
      : this.sceneRef.platformA.getBlocks().getChildren();

    const block = blocks.find((b: Phaser.Physics.Arcade.Sprite) => {
      return b.x === pos.x && b.y === pos.y;
    });
    return block !== undefined;
  }

  isDestination(position: Phaser.Math.Vector2) {
    return (
      position.x === this.movePosition.x &&
      position.y - WOOD_SPRITE_SIZE / 2 === this.movePosition.y
    );
  }

  reconstructPath(node: PathNode) {
    const path: Phaser.Math.Vector2[] = [];
    while (node !== null) {
      path.unshift(node.position);
      node = node.parent;
    }

    return path;
  }

  findLowestFScoreNode(nodes: PathNode[]) {
    let lowestFScore = Infinity;
    let lowestFScoreNode = null;
    for (const node of nodes) {
      if (node.fScore < lowestFScore) {
        lowestFScore = node.fScore;
        lowestFScoreNode = node;
      }
    }

    return lowestFScoreNode;
  }

  isColliding(x: number, y: number) {
    return this.sprite.getBounds().contains(x, y);
  }

  setCanMove(move: boolean) {
    this.canMove = move;
  }

  destroy() {
    this.sprite.destroy();
  }

  update(): void {
    if (this.movePosition && this.path.length > 0) {
      const { x: targetX, y: targetY } = this.path[0];
      const distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        targetX,
        targetY - WOOD_SPRITE_SIZE / 2
      );

      if (distance < 5) {
        this.path.splice(0, 1);
        if (this.path.length === 0) {
          this.sprite.setVelocity(0);
          this.movePosition = undefined;
          this.setCanMove(false);
          if (!this.isEnemy) {
            this.sceneRef.roomService.readyToShoot();
          }
        }
        this.sprite.body.reset(targetX, targetY - WOOD_SPRITE_SIZE / 2);
      } else {
        this.canMove &&
          this.sceneRef.physics.moveTo(
            this.sprite,
            targetX,
            targetY - WOOD_SPRITE_SIZE / 2,
            100
          );
      }
    }
  }
}
