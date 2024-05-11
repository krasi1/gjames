import { FX, GameObjects, Physics, Scene, Types } from "phaser";
import Player from "../entities/Player";
import Star from "../entities/Star";
import config from "../gameConfig";
import HealthSystem from "../systems/HealthSystem"

import Asteroid from "../entities/Asteroid";

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
  healthSystem: HealthSystem
  asteroid: Asteroid;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  create(): void {
    this.healthSystem = new HealthSystem(this)
    this.background = this.add
      .tileSprite(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.game.canvas.width,
        this.game.canvas.height,
        "nebula"
      )
      .setDepth(0);

    this.asteroid = new Asteroid(this);

    this.player = new Player(this);
    this.laserGroup = new BulletGroup(this);
    this.starBoss = new Star(this);
    this.bossProjectileGroup = new ProjectileGroup(this);
    this.healthSystem.addObject(this.player.sprite, 100, ()=>this.player.destroy())

    const dummy = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, "sun");
    dummy.body.setCircle(dummy.width / 2);
    dummy.body.setImmovable()
    dummy.setCollideWorldBounds(true)
    this.healthSystem.addObject(dummy, 100, () => dummy.destroy())

    this.laserGroup.addObjectToCollideWith(dummy, (obj, bullet) => {
      bullet.destroy();
      this.tweens.add({
        targets: dummy,
        tint: 0xff0000,
        duration: 0.2,
        yoyo: true,
        onComplete: () => { dummy.clearTint(); }
      });
    })

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
