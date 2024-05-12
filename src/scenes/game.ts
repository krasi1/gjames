import { FX, GameObjects, Scene, Types } from "phaser";
import Player from "../entities/Player";
import Star from "../entities/Star";
import centroid from "../math/centroid";
import HealthSystem from "../systems/HealthSystem";

import Asteroid from "../entities/Asteroid";
import Background from "../entities/Background";
import { Mineral } from "../entities/Mineral";

import config from "../gameConfig";
import { BulletGroup } from "../systems/BulletSystem";
import { Projectile } from "../systems/ProjectileSystem";

export class Game extends Scene {
  background: Background;
  player: Player;
  keys: Types.Input.Keyboard.CursorKeys;
  bgFx: FX.ColorMatrix;
  laserGroup: BulletGroup;
  starBoss: Star;
  healthSystem: HealthSystem;
  asteroids: Asteroid[];
  minerals: Mineral[];
  invisibleSideWalls: GameObjects.Rectangle[];
  invisibleVerticalWalls: GameObjects.Rectangle[];
  topTriggerWall: GameObjects.Rectangle;
  spawnAsteroids = true;

  constructor() {
    super({
      key: "GameScene"
    });
  }
  
  create(): void {
    this.background = new Background(this);
    this.healthSystem = new HealthSystem(this);

    const spawnPoints = [
      this.cameras.main.centerX - 500,
      this.cameras.main.centerX,
      this.cameras.main.centerX + 500
    ];
    this.asteroids = [];

    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => {
        if (!this.spawnAsteroids) return;
        for (const x of spawnPoints) {
          const asteroid = new Asteroid(this, { x, y: -200 });
          this.asteroids.push(asteroid);
          this.hookAsteroidToGameFeatures(asteroid);
        }
      }
    });
    this.starBoss = new Star(this);

    this.time.addEvent({
      delay: config.gameDuration * 1000,
      callback: () => {
        this.spawnAsteroids = false;
        this.starBoss.playIntroSequence(this.initBoss.bind(this));
      }
    });
    this.minerals = [];

    this.laserGroup = new BulletGroup(this);
    this.createInvisibleWalls();
    // add asteroids to health system
    for (const asteroid of this.asteroids) {
      this.hookAsteroidToGameFeatures(asteroid);
    }

    this.player = new Player(this);

    this.healthSystem.addObject(
      this.player.sprite,
      3000,
      () => this.player.destroy(),
      () => {
        this.tweens.add({
          targets: this.player.sprite,
          tint: 0xff0000,
          duration: 0.5,
          yoyo: true
        });
      }
    );

    this.keys = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on("keydown-W", () => this.laserGroup.upgradeWeapon());
  }

  destroyAsteroid = (oldAsteroid: Asteroid) => {
    if (!oldAsteroid) return;
    const oldPoint = {
      x: oldAsteroid.gameObject.x,
      y: oldAsteroid.gameObject.y
    };

    const mineral = new Mineral(
      this,
      oldPoint.x,
      oldPoint.y,
      Phaser.Math.Between(2, 2)
    );
    mineral?.sprite.body.setCircle(mineral?.sprite.width / 2);
    this.physics.add.collider(this.player.sprite, mineral?.sprite, () => {
      mineral?.destroyMineral(this.laserGroup);
    });
    this.minerals.push(mineral);

    const newAsteroids = oldAsteroid.destroyAsteroid();
    this.asteroids = this.asteroids.filter(
      (asteroid) => asteroid !== oldAsteroid
    );

    for (const asteroid of newAsteroids) {
      const p = centroid(asteroid.points);
      const oldVector = new Phaser.Math.Vector2(oldPoint.x, oldPoint.y);
      const newVector = new Phaser.Math.Vector2(
        oldPoint.x + p[0],
        oldPoint.y + p[1]
      );

      // add force to get away from the center of the destroyed asteroid
      const force = newVector.subtract(oldVector).normalize().scale(500);
      // @ts-expect-error deez nuts
      asteroid.gameObject.body.setVelocity(force.x, force.y);

      this.asteroids.push(asteroid);
      this.hookAsteroidToGameFeatures(asteroid);
    }
  };

  private createInvisibleWalls() {
    const offsetOffscreen = 400;

    const wallColor = 0xff0000;
    const wallAlpha = 0;

    this.invisibleSideWalls = [
      this.add
        .rectangle(
          0,
          this.cameras.main.centerY,
          1,
          this.game.canvas.height + offsetOffscreen,
          wallColor,
          wallAlpha
        )
        .setOrigin(0, 0.5),
      this.add
        .rectangle(
          this.game.canvas.width,
          this.cameras.main.centerY,
          1,
          this.game.canvas.height + offsetOffscreen,
          wallColor,
          wallAlpha
        )
        .setOrigin(1, 0.5)
    ];
    this.invisibleVerticalWalls = [
      this.add
        .rectangle(
          this.cameras.main.centerX,
          -offsetOffscreen,
          this.game.canvas.width,
          1,
          wallColor,
          wallAlpha
        )
        .setOrigin(0.5, 0),
      this.add
        .rectangle(
          this.cameras.main.centerX,
          this.game.canvas.height + offsetOffscreen,
          this.game.canvas.width,
          1,
          wallColor,
          wallAlpha
        )
        .setOrigin(0.5, 1)
    ];

    this.topTriggerWall = this.add
      .rectangle(
        this.cameras.main.centerX,
        0,
        this.game.canvas.width,
        1,
        wallColor,
        wallAlpha
      )
      .setOrigin(0.5, 0);

    this.invisibleSideWalls.forEach((wall) => this.physics.add.existing(wall));
    this.invisibleVerticalWalls.forEach((wall) =>
      this.physics.add.existing(wall)
    );
    this.physics.add.existing(this.topTriggerWall);

    // make walls immovable
    this.invisibleSideWalls.forEach((wall) => {
      // @ts-expect-error deez nuts
      wall.body.immovable = true;
      // @ts-expect-error deez nuts
      wall.body.pushable = false;
    });
    this.invisibleVerticalWalls.forEach((wall) => {
      // @ts-expect-error deez nuts
      wall.body.immovable = true;
      // @ts-expect-error deez nuts
      wall.body.pushable = false;
    });
    // @ts-expect-error deez nuts
    this.topTriggerWall.body.immovable = true;
    // @ts-expect-error deez nuts
    this.topTriggerWall.body.pushable = false;
  }

  private hookAsteroidToGameFeatures(asteroid: Asteroid) {
    this.player.collidesWith(asteroid.gameObject, "collider", 400, () => {
      this.healthSystem.takeDamage(this.player.sprite, 300);
      this.tweens.add({
        targets: this.player.sprite,
        tint: 0xff0000,
        duration: 0.5,
        yoyo: true
      });
    });
    this.healthSystem.addObject(asteroid.gameObject, 100, () =>
      this.destroyAsteroid(asteroid)
    );
    // @ts-expect-error deez nuts
    this.laserGroup.addObjectToCollideWith(asteroid.gameObject, (_, bullet) => {
      if (!this.laserGroup.laserEnabled) bullet.destroy();
      if (
        this.laserGroup.laserEnabled &&
        this.time.now - this.laserGroup.lastFired < this.laserGroup.fireRate
      )
        return;
      this.healthSystem.takeDamage(asteroid.gameObject, 10);
      // tint the asteroid red
      this.tweens.add({
        targets: asteroid.gameObject,
        alpha: 0.3,
        duration: 0.2,
        yoyo: true
      });
    });

    const wallColliders = this.invisibleSideWalls;
    this.physics.add.overlap(asteroid.gameObject, wallColliders, (asteroid) => {
      console.log("collided with wall");
      // @ts-expect-error deez nuts
      asteroid.body.setVelocityX(-1 * asteroid.body.velocity.x);
    });

    const destroyAsteroidCb = (asteroid: Asteroid["gameObject"]) => {
      console.log("destroyed asteroid after leaving the screen");
      asteroid.destroy();
      this.asteroids = this.asteroids.filter((a) => a.gameObject !== asteroid);
      this.healthSystem.trackedObjects.delete(asteroid);
    };

    const [topWall, bottomWall] = this.invisibleVerticalWalls;

    // add collision with top wall after touching the top trigger wall once
    // and remove collision with the trigger wall
    const tempCollider = this.physics.add.overlap(
      asteroid.gameObject,
      this.topTriggerWall,
      () => {
        console.log("collided with top trigger wall");
        this.physics.add.overlap(
          asteroid.gameObject,
          topWall,
          //@ts-expect-error deez nuts
          destroyAsteroidCb
        );
        this.physics.world.removeCollider(tempCollider);
      }
    );

    // add collision with bottom wall + destroy asteroid
    this.physics.add.overlap(
      asteroid.gameObject,
      bottomWall,
      //@ts-expect-error deez nuts
      destroyAsteroidCb
    );
  }

  update() {
    this.background.update();
    this.player.update(this.keys);
    this.starBoss.fire();
    if (this.keys.space.isDown) {
      this.laserGroup.fireBullets(
        this.player.sprite.x,
        this.player.sprite.y - 20,
        this.player.sprite
      );
    } else this.laserGroup.stopFiringLaser();
  }

  initBoss() {
    this.starBoss.sprite.body.setCircle(this.starBoss.sprite.width / 2);
    this.starBoss.sprite.body.pushable = false;
    this.healthSystem.addObject(this.starBoss.sprite, 10000, () =>
      this.starBoss.sprite.destroy()
    );
    this.player.collidesWith(this.starBoss.sprite, "collider", 400, () => {
      this.healthSystem.takeDamage(this.player.sprite, 500);
    });
    this.laserGroup.addObjectToCollideWith(
      this.starBoss.sprite,
      (obj, bullet) => {
        if (!this.laserGroup.laserEnabled) bullet.destroy();
        else if (
          this.time.now - this.laserGroup.lastFired <
          this.laserGroup.fireRate
        ) {
          this.laserGroup.lastFired = this.time.now;
          return;
        }

        this.tweens.add({
          targets: obj,
          tint: 0xff0000,
          duration: 0.2,
          yoyo: true
        });
      }
    );
    this.physics.add.collider(
      this.player.sprite,
      this.starBoss.projectileGroup,
      (player, projectile: Projectile) => {
        if (!projectile.collided) {
          projectile.destroy();
          this.healthSystem.takeDamage(this.player.sprite, 100);
          projectile.collided = true;
        }
      }
    );
    this.starBoss.isActive = true;
  }
}
