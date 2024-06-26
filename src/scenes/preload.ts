/**
 * @author       cloakedninjas (https://github.com/cloakedninjas)
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Scene } from "phaser";
import * as manifest from "../../assets/manifest.json";
import ProgressBar from "../lib/progress-bar";

export default class Preload extends Scene {
  private downloadedSize: number;
  private progressBar: ProgressBar;

  constructor() {
    super({
      key: "PreloadScene"
    });
  }

  preload(): void {
    this.downloadedSize = 0;
    this.progressBar = new ProgressBar(this, 0.5, 0.66, manifest.totalSize);

    this.load.image("nebula", "assets/image/nebula.png");
    this.load.image("ship", "assets/image/ship.png");
    this.load.image("sun", "assets/image/sun.png");

    this.load.spritesheet("engine", "assets/spritesheet/shipEngine.png", {
      frameWidth: 128,
      frameHeight: 128,
      startFrame: 0,
      endFrame: 8
    });
    this.load.spritesheet("shipIdle", "assets/spritesheet/shipIdle.png", {
      frameWidth: 128,
      frameHeight: 128,
      startFrame: 0,
      endFrame: 9
    });
    this.load.spritesheet("fire1", "assets/spritesheet/bolt.png", {
      frameWidth: 9,
      frameHeight: 9,
      startFrame: 0,
      endFrame: 5
    });
    this.load.spritesheet("fire2", "assets/spritesheet/laser.png", {
      frameWidth: 18,
      frameHeight: 38,
      startFrame: 0,
      endFrame: 3
    });
    this.load.spritesheet("destroy", "assets/spritesheet/destroy.png", {
      frameWidth: 128,
      frameHeight: 128,
      startFrame: 0,
      endFrame: 17
    });
    this.load.image("star", "assets/image/star.png");
    this.load.image("projectile", "assets/image/projectile.png");
    this.load.image("mineral", "assets/image/gem.png");

  }

  create(): void {
    this.scene.start("MenuScene");
  }
}
