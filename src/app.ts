import 'phaser';
import Boot from './scenes/boot';
import Preload from './scenes/preload';
import { Game as GameScene } from './scenes/game';
import { Physics } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Demo Game',

  scene: [Boot, Preload, GameScene],
  physics: {
    default: "arcade",
    arcade:{
      
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    width: 1000,
    height: 1000,
    max: {
      width: 1000,
      height: 1000
    }
  }
};

window.addEventListener('load', () => {
  window['game'] = new Phaser.Game(config);
});
