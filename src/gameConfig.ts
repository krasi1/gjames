const config = {
  background: {
    scrollVelocity: 0.2
  },

  player: {
    velocity: 150
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
        frameRate: 20,
        repeat: -1
      }
    }
  }
};

export default config;
