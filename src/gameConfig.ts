const config = {
  background: {
    scrollVelocity: 0.2
  },

  player: {
    velocity: 200,
    fireRate: 10,
    bulletVelocity: 700,
    bulletScale:5
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
  }
};

export default config;
