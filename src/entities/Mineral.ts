import { Physics, Scene } from "phaser";
import config from "../gameConfig";
import { BulletGroup } from "../systems/BulletSystem";
import { after } from "../utils";

export enum PowerUpType {
  FireRateUp,
  DamageUp,
  SplitShot,
  WeaponUpgrade,
}

export class Mineral {
  sprite: Physics.Arcade.Sprite;
  type: PowerUpType;
  duration: number = 0;
  colors: number[];
  effects: { (laserGroup): void }[] = [];

  constructor(
    protected scene: Scene,
    x: number,
    y: number,
    _type: PowerUpType
  ) {
    this.type = _type;
    this.colors = [
      config.powerUp.fireRateUp.color,
      config.powerUp.damageUp.color,
      config.powerUp.splitShot.color,
      config.powerUp.weaponUpgrade.color
    ];
    this.sprite = scene.physics.add.sprite(x, y, "mineral");
    this.sprite.tint = this.colors[this.type];
    this.sprite.setScale(config.mineral.spriteScale);
    this.effects.push(this.fireRateUp);
    this.effects.push(this.damageUp);
    this.effects.push(this.splitShot);
    this.effects.push(this.weaponUpgrade);
  }

  fireRateUp(laserGroup: BulletGroup) {
    console.log("Triggered Fire Rate Up");
    const mult = config.powerUp.fireRateUp.mult;
    const dur = config.powerUp.fireRateUp.duration;
    laserGroup.fireRateMult = mult;
    after(dur, () => (laserGroup.fireRateMult = 1));
  }

  damageUp(laserGroup: BulletGroup) {
    console.log("Triggered Damage Up");
    const mult = config.powerUp.damageUp.mult;
    const dur = config.powerUp.damageUp.duration;
    laserGroup.damageMult = mult;
    after(dur, () => (laserGroup.damageMult = 1));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  splitShot(laserGroup: BulletGroup) {
    console.log("Triggered Split Shot");
    // const mult = config.powerUp.splitShot.mult;
    // const dur = config.powerUp.splitShot.duration;
    // TODO: make player shoot mult bullets at a time for dur amount of time
  }

  weaponUpgrade(laserGroup: BulletGroup) {
    laserGroup.upgradeWeapon();
  }

  destroyMineral(laserGroup: BulletGroup) {
    this.effects[this.type](laserGroup);
    this.sprite.destroy();
  }
}
