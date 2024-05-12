import { Physics, Scene } from "phaser";
import config from "../gameConfig";
import { ProjectileGroup } from "../systems/ProjectileSystem";
//import { BulletGroup } from "../systems/BulletSystem";
//import config from "../gameConfig";

export default class Star {
  sprite: Physics.Arcade.Sprite;
  projectileGroup: ProjectileGroup;
  isActive = false;
  velocity = config.boss.velocity;

  constructor(protected scene: Scene) {
    this.sprite = scene.physics.add
      .sprite(scene.cameras.main.centerX, -300, "star")
      .setName("BOSS");
    this.projectileGroup = new ProjectileGroup(scene);
    scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        this.velocity = -this.velocity;
      }
    });
  }

  playIntroSequence(onComplete: () => void) {
    this.scene.tweens.add({
      targets: this.sprite,
      y: 100,
      duration: 2500,
      ease: "Cubic",
      yoyo: false,
      repeat: 0,
      onComplete
    });
  }

  update() {
    if (this.isActive) this.sprite.setVelocityX(this.velocity);
  }

  fire() {
    if (!this.isActive) return;
    this.projectileGroup.fireProjectile(this.sprite.x, 100);
  }

  destroy() {
    this.isActive = false;
    this.scene.tweens.add({
      targets: this.sprite,
      y: "-=400",
      duration: 2000,
      ease: "Linear",
      onComplete:()=>{
        this.scene.tweens.add({
          targets: this.scene.cameras.main,
          alpha: 0,
          duration: 5000,

          onComplete: () => {
            this.scene.scene.start("MenuScene");
          }
        });
      }
    });

    this.scene.tweens.add({
      targets: this.sprite,
      x: "+=10",
      duration: 100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }
}
