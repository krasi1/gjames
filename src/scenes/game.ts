import { Scene } from 'phaser';

export class Game extends Scene {
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  create(): void {




    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY,"GJAMES", {fontSize: 50, backgroundColor: "000000"}).setOrigin(0.5);

  }
}
