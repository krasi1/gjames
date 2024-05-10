import { Math as PhaserMath } from "phaser";
import generatePolygon from "../math/generatePolygon";
import earcut from "earcut";
import { Scene, GameObjects, Physics, Types } from "phaser";
import config from "../gameConfig";

export class Game extends Scene {
  background: GameObjects.TileSprite;
  player: Physics.Arcade.Sprite;
  keys: Types.Input.Keyboard.CursorKeys;
  constructor() {
    super({
      key: "GameScene",
    });
  }

  create(): void {
    this.background = this.add
      .tileSprite(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.game.canvas.width,
        this.game.canvas.height,
        "nebula"
      )
      .setDepth(0);

    const points = generatePolygon(
      [0, 0],
      [Math.PI * 1.2, 1.7 * Math.PI],
      [0.4, 0.7],
      PhaserMath.Between(200, 300),
      PhaserMath.FloatBetween(0.1, 0.3),
      PhaserMath.FloatBetween(0.1, 0.2),
      PhaserMath.Between(10, 20)
    );

    const pointsFlat = points.flatMap((p) => p);
    const triangleIndices: number[] = earcut(pointsFlat);

    const colorStep = 255 / (triangleIndices.length * 3);

    for (let i = 0; i < triangleIndices.length; i += 3) {
      const triangle = [
        points[triangleIndices[i]],
        points[triangleIndices[i + 1]],
        points[triangleIndices[i + 2]],
      ];

      const graphics = this.add.graphics();
      graphics.fillStyle(0x000000 + i * colorStep, 1);
      graphics.fillTriangle(
        triangle[0][0],
        triangle[0][1],
        triangle[1][0],
        triangle[1][1],
        triangle[2][0],
        triangle[2][1]
      );
      graphics.closePath();
      graphics.setPosition(
        this.cameras.main.centerX,
        this.cameras.main.centerY
      );
    }
    this.player = this.physics.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "ship"
    );
    this.player.body.setSize(this.player.width / 2, this.player.height / 2);

    this.player.setCollideWorldBounds(true);

    this.keys = this.input.keyboard.createCursorKeys();
    console.log(this.keys);
  }

  update() {
    this.background.tilePositionY += config.background.scrollVelocity;

    const { left, right, up, down } = this.keys;

    if (up.isDown) {
      this.player.setVelocityY(-100);
    }
    if (down.isDown) {
      this.player.setVelocityY(100);
    }
    if (left.isDown) {
      this.player.setVelocityX(-100);
    }
    if (right.isDown) {
      this.player.setVelocityX(100);
    }
  }
}
