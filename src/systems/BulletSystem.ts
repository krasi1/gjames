import { Physics, Scene } from "phaser";
import config from "../gameConfig";

export class BulletGroup extends Physics.Arcade.Group {
  lastFired = 0;
  scene: Scene;
  fireRate: number;

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

    this.fireRate = 1000 / config.player.fireRate;

    const fire1 = {
      frames: scene.anims.generateFrameNumbers("fire1", {
        ...config.playerAnims.fire1.frames
      }),
      ...config.playerAnims.fire1.frameConfig
    };
    scene.anims.create(fire1);
  }

  fireLaser(x, y) {
    if (this.scene.time.now - this.lastFired > this.fireRate) {
      const laser = this.getFirstDead(true) as Bullet;
      if (laser) {
        laser.setScale(config.player.bulletScale);
        laser.play("fire1");
        laser.fire(x, y);
        this.lastFired = this.scene.time.now;
      }
    }
  }

  addObjectToCollideWith(object: Physics.Arcade.Sprite, cb: (object, bullet: Bullet) => void) {
    this.scene.physics.add.collider(object, this, cb)
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
  fire(x, y) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityY(-config.player.bulletVelocity);
  }
}
