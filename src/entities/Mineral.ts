import { Physics, Scene } from "phaser";
import config from "../gameConfig";
import { BulletGroup } from "../systems/BulletSystem";

export enum PowerUpType {
    FireRateUp,
    DamageUp,
    SplitShot,
    WeaponUpgrade
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
            config.powerUp.weaponUpgrade.color];
        this.sprite = scene.physics.add.sprite(
            x, y,
            "mineral"
          );
        this.sprite.tint = this.colors[this.type];
        this.sprite.setScale(config.mineral.spriteScale);
        this.effects.push(this.fireRateUp);
        this.effects.push(this.damageUp);
        this.effects.push(this.splitShot);
        this.effects.push(this.weaponUpgrade);
    }

    fireRateUp(laserGroup) {
        console.log('Triggered Fire Rate Up');
        const mult = config.powerUp.fireRateUp.mult;
        laserGroup.fireRate/=mult;      // currently effect is permanent
        // const dur = config.powerUp.fireRateUp.duration;
        // TODO: make effect last for dur amount of time
    }

    damageUp(laserGroup: BulletGroup) {
        console.log('Triggered Damage Up');
        // const mult = config.powerUp.damageUp.mult;
        // const dur = config.powerUp.damageUp.duration;
        // TODO: up player's damage depending on mult for dur amount of time
    }

    splitShot(laserGroup: BulletGroup) {
        console.log('Triggered Split Shot');
        // const mult = config.powerUp.splitShot.mult;
        // const dur = config.powerUp.splitShot.duration;
        // TODO: make player shoot mult bullets at a time for dur amount of time
    }

    weaponUpgrade() {
        console.log('Triggered Weapon Upgrade');
        // TODO: upgrade player's weapon
    }

    destroyMineral(laserGroup: BulletGroup) {
        this.effects[this.type](laserGroup);
        this.sprite.destroy();
    }
}