import { GameObjects, Scene } from "phaser";
import config from "../gameConfig";

export default class Background {
  main: GameObjects.TileSprite;
  tinted: GameObjects.TileSprite;
  constructor(protected scene: Scene) {
    this.main = scene.add
      .tileSprite(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY,
        scene.game.canvas.width,
        scene.game.canvas.height,
        "nebula"
      )
      .setDepth(0);
    this.tinted = scene.add
      .tileSprite(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY,
        scene.game.canvas.width,
        scene.game.canvas.height,
        "nebula"
      )
      .setDepth(0);

    this.tinted.tint = 0xff0000; // full red tint for the background
    this.tinted.alpha = 0; // transparent at the start
  }

  update() {
    const frameRate = this.scene.game.loop.actualFps;

    const step = 1 / (config.gameDuration * frameRate);
    this.main.tilePositionY -= config.background.scrollVelocity;
    this.tinted.tilePositionY -= config.background.scrollVelocity;
    this.tinted.alpha += step; // tinted background gets revealed gradually
  }
}
