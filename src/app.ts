import 'phaser';
import Boot from './scenes/boot';
import Preload from './scenes/preload';
import Menu from './scenes/menu';

import { Game as GameScene } from './scenes/game';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Demo Game',

  scene: [Boot, Preload, Menu, GameScene],
  physics: {
    default: "arcade",
    arcade: {

    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
    max: {
      width: 1920,
      height: 1080
    }
  }
};

window.addEventListener('load', () => {
  window['game'] = new Phaser.Game(config);
});
