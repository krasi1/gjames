import { Physics, Scene } from "phaser";
import { Pattern, ProjectileGroup } from "../systems/ProjectileSystem";
//import { BulletGroup } from "../systems/BulletSystem";
//import config from "../gameConfig";

export default class Star {
  sprite: Physics.Arcade.Sprite;
  projectileGroup: ProjectileGroup;
  isActive = false;

  constructor(protected scene: Scene) {
    this.sprite = scene.physics.add
      .sprite(scene.cameras.main.centerX, -300, "star")
      .setName("BOSS");
    this.projectileGroup = new ProjectileGroup(scene);
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

  fire() {
    if (!this.isActive) return;
    this.projectileGroup.fireProjectile(
      this.scene.cameras.main.centerX,
      100,
      Pattern.Ring
    );
  }
}
