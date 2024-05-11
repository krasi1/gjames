import { Physics, Scene } from "phaser";
import config from "../gameConfig";

export enum Pattern {
    BigStraight,
    TwoSplit,
    Ring,
    Line
}

export class ProjectileGroup extends Physics.Arcade.Group {
  lastFired = 0;
  scene: Scene;
  fireRate: number;

  // attack patterns:
  // 0 - single big shot going straight down
  // 1 - double split shot
  // 2 - "ring" shot (more like volley)
  // 3 - multiple projectiles at once in a line
  attackPatterns : { (x: number, y: number): void; }[] = [];

  constructor(scene: Scene) {
    super(scene.physics.world, scene);
    this.scene = scene;
    this.attackPatterns.push(this.patternBigStraight);
    this.attackPatterns.push(this.patternTwoSplit);
    this.attackPatterns.push(this.patternRing);
    this.attackPatterns.push(this.patternLine);
    this.createMultiple({
      classType: Projectile,
      frameQuantity: 30,
      active: false,
      visible: false,
      key: "projectile"
    });

    this.fireRate = 1000 / config.boss.fireRate;

  }

fireProjectile(x: number, y: number, pattern: number) {
    this.attackPatterns[pattern](x, y);
}

patternTwoSplit = (x: number, y: number) => {
    this.fireRate = 1000 / config.bossPatterns.patternTwoSplit.fireRate;
    if (this.scene.time.now - this.lastFired > this.fireRate) {
        for(let i = 0; i<2; i++) {
            const flip = -1*(i%2?1:-1);
            const projectile = this.getFirstDead(true) as Projectile;
            if(projectile) {
                projectile.setScale(config.bossPatterns.patternTwoSplit.projectileScale);
                projectile.fire(x, y,
                    config.bossPatterns.patternTwoSplit.velocityX*flip,
                    config.bossPatterns.patternTwoSplit.velocityY);
            }
        }
        this.lastFired = this.scene.time.now;
    }
  }

  patternBigStraight = (x: number, y: number) => {
    this.fireRate = 1000 / config.bossPatterns.patternBigStraight.fireRate;
    if (this.scene.time.now - this.lastFired > this.fireRate) {
        const projectile = this.getFirstDead(true) as Projectile;
        if (projectile) {
        projectile.setScale(config.bossPatterns.patternBigStraight.projectileScale);
        projectile.fire(x, y,
            config.bossPatterns.patternBigStraight.velocityX,
            config.bossPatterns.patternBigStraight.velocityY
        );
        this.lastFired = this.scene.time.now;
        }
    }
  }

  patternRing = (x: number, y:number) => {
    this.fireRate = 1000 / config.bossPatterns.patternRing.fireRate;
    if (this.scene.time.now - this.lastFired > this.fireRate) {
        for(let i = 1; i<8; i++) {
            const flip = -1*(i/2<=2?1:-1);
            const projectile = this.getFirstDead(true) as Projectile;
            if (projectile) {
                projectile.setScale(config.bossPatterns.patternRing.projectileScale);
                projectile.fire(x, y,
                    config.bossPatterns.patternRing.velocityX*flip*Math.abs(4-i),
                    config.bossPatterns.patternRing.velocityY*(4-Math.abs(4-i))
            );
            this.lastFired = this.scene.time.now;
            }
        }
    }
  }

  patternLine = (x: number, y: number) => {
    this.fireRate = 1000 / config.bossPatterns.patternLine.fireRate;
    if (this.scene.time.now - this.lastFired > this.fireRate) {
        for(let i = 2; i<7; i++) {
            const projectile = this.getFirstDead(true) as Projectile;
            if (projectile) {
                projectile.setScale(config.bossPatterns.patternLine.projectileScale);
                projectile.fire(x, y,
                    config.bossPatterns.patternLine.velocityX,
                    config.bossPatterns.patternLine.velocityY*i
            );
            this.lastFired = this.scene.time.now;
            }
        }
    }
  }
}

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  collided = false
  constructor(scene, x, y) {
    super(scene, x, y, "projectile");
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y >= this.scene.cameras.main.height ||
        this.x <= 0 ||
        this.x >= this.scene.cameras.main.width) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
  fire(x, y, velocityX, velocityY) {
    this.body?.reset(x, y);
    this.collided = false
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(velocityX, velocityY);
  }



}
