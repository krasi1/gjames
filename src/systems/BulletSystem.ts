import { GameObjects, Physics, Scene } from "phaser";
import config from "../gameConfig";

export class BulletGroup extends Physics.Arcade.Group {
  lastFired = 0;
  scene: Scene;
  fireRate: number;
  laser: GameObjects.Sprite
  firing = false
  laserEnabled = false
  bulletConfig = config.player.weapons[1]
  currentLevel = 1
  maxLevel = 5

  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.scene = scene;
    this.createMultiple({
      classType: Bullet,
      frameQuantity: 30,
      active: false,
      visible: false,
      key: "bolt"
    });

    this.laser = this.scene.physics.add.sprite(0, 0, "fire2").setDepth(1)
    this.laser.scaleY = 30;
    this.laser.scaleX = 5;

    this.laser.visible = false




    this.fireRate = 1000 / this.bulletConfig.fireRate;



    const fire1 = {
      frames: scene.anims.generateFrameNumbers("fire1", {
        ...config.playerAnims.fire1.frames
      }),
      ...config.playerAnims.fire1.frameConfig
    };
    const fire2 = {
      frames: scene.anims.generateFrameNumbers("fire2", {
        ...config.playerAnims.fire2.frames
      }),
      ...config.playerAnims.fire2.frameConfig
    };
    scene.anims.create(fire1);
    scene.anims.create(fire2);

  }

  fireBullets(x, y, playerSprite) {

    if (this.laserEnabled) {

      this.fireLaser(playerSprite)
      return
    }
    if (this.scene.time.now - this.lastFired > this.fireRate) {
      const bullet = this.getFirstDead(true) as Bullet;
      if (bullet) {
        bullet.setScale(this.bulletConfig.bulletScale);
        bullet.setTint(this.bulletConfig.tint)
        bullet.play("fire1");
        bullet.fire(x, y, this.bulletConfig.bulletVelocity);
        this.lastFired = this.scene.time.now;
      }
    }
  }

  fireLaser(playerSprite: GameObjects.Sprite) {
    this.laser.x = playerSprite.x
    this.laser.y = playerSprite.y - 600
    if (!this.firing) {
      this.laser.visible = true
      this.laser.play("fire2")
      this.firing = true
    }


  }

  addObjectToCollideWith(object: Physics.Arcade.Sprite, cb: (object, bullet: Bullet) => void) {
    this.scene.physics.add.overlap(object, this, cb);
    this.scene.physics.add.overlap(object, this.laser, cb)

  }

  upgradeWeapon() {
    if (this.currentLevel !== this.maxLevel) this.currentLevel++

    if (this.currentLevel === this.maxLevel) {
      this.laserEnabled = true
      this.fireRate = 1000 / config.player.laserFireRate
    }
    this.bulletConfig = config.player.weapons[Math.min(this.currentLevel, 4)]
    this.fireRate = 1000 / this.bulletConfig.fireRate
  }

  stopFiringLaser() {
    this.firing = false
    this.laser.visible = false
  }
}

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "fire1");
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
  fire(x, y, velocity) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityY(-velocity);
  }
}
