import { FX, GameObjects, Scene, Types } from "phaser";
import Player from "../entities/Player";
import Star from "../entities/Star";
import config from "../gameConfig";
import HealthSystem from "../systems/HealthSystem"

import Asteroid from "../entities/Asteroid";

import { BulletGroup, Bullet } from "../systems/BulletSystem";
import { ProjectileGroup, Pattern, Projectile } from "../systems/ProjectileSystem";

export class Game extends Scene {
  background: GameObjects.TileSprite;
  player: Player;
  keys: Types.Input.Keyboard.CursorKeys;
  bgFx: FX.ColorMatrix;
  laserGroup: BulletGroup;
  starBoss: Star;
  bossProjectileGroup: ProjectileGroup;
  healthSystem: HealthSystem
  asteroids: Asteroid[];

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

    this.asteroids = [new Asteroid(this, { x: this.cameras.main.centerX, y: this.cameras.main.centerY })];

    this.player = new Player(this);
    this.starBoss = new Star(this);
    this.bossProjectileGroup = new ProjectileGroup(this);
    this.laserGroup = new BulletGroup(this);
    this.healthSystem.addObject(this.player.sprite, 100, () => this.player.destroy())

    this.starBoss.sprite.body.setCircle(this.starBoss.sprite.width / 2);
    this.starBoss.sprite.body.immovable = true
    this.starBoss.sprite.body.pushable = false

    this.starBoss.sprite.setCollideWorldBounds(true)
    this.healthSystem.addObject(this.starBoss.sprite, 100, () => this.starBoss.sprite.destroy())
    this.healthSystem.addObject(this.player.sprite, 3000, () => this.player.destroy(), () => {
      this.tweens.add({
        targets: this.player.sprite,
        tint: 0xff0000,
        duration: 0.5,
        yoyo: true,
      });
    })


    this.physics.add.collider(this.player.sprite, this.bossProjectileGroup, (player, projectile: Projectile) => {
      if (!projectile.collided) {
        projectile.destroy()
        this.healthSystem.takeDamage(this.player.sprite, 100)
        projectile.collided = true
      }
    })


    this.laserGroup.addObjectToCollideWith(this.starBoss.sprite, (obj, bullet) => {
      bullet.destroy();
      this.tweens.add({
        targets: obj,
        tint: 0xff0000,
        duration: 0.2,
        yoyo: true,
      });
    })

    const destroyAsteroid = (obj: Asteroid["gameObject"], bullet: Bullet) => {
      bullet.destroy();
      const oldAsteroid = this.asteroids.find(asteroid => asteroid.gameObject === obj);

      if(!oldAsteroid) return;

      const newAsteroids = oldAsteroid.destroyAsteroid();
      this.asteroids = this.asteroids.filter(asteroid => asteroid !== oldAsteroid);

      for(const asteroid of newAsteroids) {
        this.asteroids.push(asteroid);
        // @ts-expect-error deez nuts
        this.laserGroup.addObjectToCollideWith(asteroid.gameObject, destroyAsteroid);
      }
    }
    // @ts-expect-error deez nuts
    this.laserGroup.addObjectToCollideWith(this.asteroids[0].gameObject, destroyAsteroid);

    this.keys = this.input.keyboard.createCursorKeys();
  }




  update() {
    this.background.tilePositionY -= config.background.scrollVelocity;
    this.player.update(this.keys);
    this.bossProjectileGroup.fireProjectile(this.cameras.main.centerX, 100, Pattern.Ring);
    if (this.keys.space.isDown) {
      this.laserGroup.fireLaser(
        this.player.sprite.x,
        this.player.sprite.y - 20
      );
    }
  }
}
