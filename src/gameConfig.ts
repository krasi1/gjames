const config = {
  background: {
    scrollVelocity: 0.2
  },

  player: {
    velocity: 200,
    fireRate: 10,
    bulletVelocity: 700,
    bulletScale:3
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
        frameRate: 15 ,
        repeat: -1
      }
    },
    fire1:{
      frames: {
        start: 0,
        end: 4
      },
      frameConfig: {
        key: "fire1",
        frameRate: 20,
        repeat: -1
      }
    }
  },

  boss: {
    health: 20,
    fireRate: 1
  },
  bossPatterns: {
    patternTwoSplit: {
      fireRate: 1.3,
      velocityX: 300,
      velocityY: 600,
      projectileScale: 0.1
    },
    patternBigStraight: {
      fireRate: 1,
      velocityX: 0,
      velocityY: 700,
      projectileScale: 0.2
    },
    patternRing: {
      fireRate: 0.5,
      velocityX: 300,
      velocityY: 200,
      projectileScale: 0.1
    },
    patternLine: {
      fireRate: 0.3,
      velocityX: 0,
      velocityY: 200,
      projectileScale: 0.2
    }
  }
};

export default config;
