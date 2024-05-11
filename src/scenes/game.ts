import { FX, GameObjects, Scene, Types, Math as PhaserMath } from "phaser";
import Player from "../entities/Player";
import Star from "../entities/Star";
import config from "../gameConfig";

//import Asteroid from "../entities/Asteroid";

import { BulletGroup } from "../systems/BulletSystem";
import { ProjectileGroup, Pattern } from "../systems/ProjectileSystem";

export class Game extends Scene {
  background: GameObjects.TileSprite;
  player: Player;
  keys: Types.Input.Keyboard.CursorKeys;
  bgFx: FX.ColorMatrix;
  laserGroup: BulletGroup;
  starBoss: Star;
  bossProjectileGroup: ProjectileGroup;

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

    //new Asteroid(this);

    this.player = new Player(this);
    this.laserGroup = new BulletGroup(this);
    this.starBoss = new Star(this);
    this.bossProjectileGroup = new ProjectileGroup(this);
    this.keys = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.background.tilePositionY -= config.background.scrollVelocity;
    this.player.update(this.keys);
    this.bossProjectileGroup.fireProjectile(this.cameras.main.centerX, 100, Pattern.TwoSplit);
    if (this.keys.space.isDown) {
      this.laserGroup.fireLaser(
        this.player.sprite.x,
        this.player.sprite.y - 20
      );
    }
  }
}
