import { GameObjects, Scene, Types } from "phaser";
import Player from "../entities/Player";
import config from "../gameConfig";

import Asteroid from "../entities/Asteroid";

export class Game extends Scene {
  background: GameObjects.TileSprite;
  player: Player;
  keys: Types.Input.Keyboard.CursorKeys;
  constructor() {
    super({
      key: "GameScene"
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

    new Asteroid(this);

    this.player = new Player(this);

    this.keys = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.background.tilePositionY -= config.background.scrollVelocity;
    this.player.update(this.keys);
  }
}
