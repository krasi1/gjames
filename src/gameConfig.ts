const config = {
  gameDuration: 75,
  background: {
    scrollVelocity: 0.2
  },

  player: {
    velocity: 450,
    baseDamage: 13,
    health: 400,

    laserFireRate: 2,

    weapons: {
      1: {
        bulletVelocity: 600,
        bulletScale: 5,
        fireRate: 10,
        tint: 0xffffff
      },
      2: {
        bulletVelocity: 800,
        bulletScale: 6,
        fireRate: 11,
        tint: 0x00ff00
      },
      3: {
        bulletVelocity: 1000,
        bulletScale: 7,
        fireRate: 12,
        tint: 0x00ffff
      },
      4: {
        bulletVelocity: 1200,
        bulletScale: 8,
        fireRate: 14,
        tint: 0xff0000
      }
    }
  },
  playerAnims: {
    ship: {
      frames: {
        start: 0,
        end: 8
      },
      frameConfig: {
        key: "idle",
        frameRate: 20,
        repeat: -1
      }
    },
    engine: {
      frames: {
        start: 0,
        end: 7
      },
      frameConfig: {
        key: "loop",
        frameRate: 15,
        repeat: -1
      }
    },
    destroy: {
      frames: {
        start: 0,
        end: 17
      },
      frameConfig: {
        key: "destroy",
        frameRate: 20
      }
    },
    fire1: {
      frames: {
        start: 0,
        end: 4
      },
      frameConfig: {
        key: "fire1",
        frameRate: 20,
        repeat: -1
      }
    },
    fire2: {
      frames: {
        start: 0,
        end: 3
      },
      frameConfig: {
        key: "fire2",
        frameRate: 20,
        repeat: -1
      }
    }
  },

  boss: {
    health: 4500,
    fireRate: 1,
    velocity: 150
  },
  bossPatterns: {
    patternTwoSplit: {
      fireRate: 2.5,
      velocityX: 200,
      velocityY: 450,
      projectileScale: 0.1
    },
    patternBigStraight: {
      fireRate: 2,
      velocityX: 0,
      velocityY: 350,
      projectileScale: 0.2
    },
    patternRing: {
      fireRate: 1.5,
      velocityX: 300,
      velocityY: 200,
      projectileScale: 0.1
    },
    patternLine: {
      fireRate: 1,
      velocityX: 0,
      velocityY: 120,
      projectileScale: 0.15
    }
  },
  mineral: {
    spriteScale: 0.1,
    spawnChance: 0.2
  },
  powerUp: {
    fireRateUp: {
      mult: 2,
      duration: 25,
      color: 0x1fff5e
    },
    damageUp: {
      mult: 1.4,
      bulletSize: 0.4,
      duration: 25,
      color: 0xc73a45
    },
    splitShot: {
      mult: 1,
      duration: 25,
      color: 0xffd500
    },
    weaponUpgrade: {
      color: 0x3289a8
    }
  }
};

export default config;
