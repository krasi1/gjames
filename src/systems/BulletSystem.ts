import { GameObjects, Physics, Scene } from "phaser";
import config from "../gameConfig";

export class BulletGroup extends Physics.Arcade.Group {
  lastFired = 0;
  scene: Scene;
  laser: GameObjects.Sprite;
  firing = false;
  laserEnabled = false;
  bulletConfig = config.player.weapons[1];
  bulletSizeMult = 1;
  currentLevel = 1;
  maxLevel = 4;
  damageMult = 1;
  fireRateMult = 1;
  numShots = 1;

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

    this.laser = this.scene.physics.add.sprite(0, 0, "fire2").setDepth(1);
    this.laser.scaleY = 30;
    this.laser.scaleX = 5;

    this.laser.visible = false;

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
      this.fireLaser(playerSprite);
      return;
    }
    if (this.scene.time.now - this.lastFired > this.fireRate) {
      for(let i = 1; i <= this.numShots; i++) {
        const half = (this.numShots+1)/2;
        const flip = -1*(i<=half?1:-1);
        const bullet = this.getFirstDead(true) as Bullet;
        if (bullet) {
          bullet.setScale(this.bulletConfig.bulletScale*this.bulletSizeMult);
          bullet.setTint(this.bulletConfig.tint);
          bullet.play("fire1");
          bullet.fire(x, y,
            flip*this.bulletConfig.bulletVelocity*Math.abs(half-i)/3,
            this.bulletConfig.bulletVelocity);
        }
      }
      this.lastFired = this.scene.time.now;
    }
  }

  fireLaser(playerSprite: GameObjects.Sprite) {
    this.laser.x = playerSprite.x;
    this.laser.y = playerSprite.y - 600;
    console.log(this.laser);
    if (!this.firing) {
      this.laser.visible = true;
      this.laser.play("fire2");
      this.firing = true;
    }
  }

  get damage() {
    return config.player.baseDamage * this.damageMult;
  }

  get fireRate() {
    return 1000 / (this.bulletConfig.fireRate * this.fireRateMult);
  }

  addObjectToCollideWith(
    object: Physics.Arcade.Sprite,
    cb: (object, bullet: Bullet) => void
  ) {
    this.scene.physics.add.overlap(object, this, cb);
    this.scene.physics.add.overlap(object, this.laser, cb);
  }

  upgradeWeapon() {
    if (this.currentLevel !== this.maxLevel) this.currentLevel++;

    // if (this.currentLevel === this.maxLevel) {
    //   this.laserEnabled = true;
    //   this.fireRate = 1000 / config.player.laserFireRate;
    // }
    this.bulletConfig = config.player.weapons[Math.min(this.currentLevel, 4)];
  }

  stopFiringLaser() {
    this.firing = false;
    this.laser.visible = false;
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
  fire(x, y, velocityX, velocityY) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(velocityX, -velocityY);
  }
}
