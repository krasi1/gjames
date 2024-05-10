import { Scene, Math as PhaserMath } from 'phaser';
import generatePolygon from '../math/generatePolygon';

export class Game extends Scene {
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  create(): void {

    const points = generatePolygon([0,0],
      [Math.PI * 1.2, 1.7 * Math.PI],
      [0.4, 0.7],
      PhaserMath.Between(200, 300), 
      PhaserMath.FloatBetween(0.1, 0.3), 
      PhaserMath.FloatBetween(0.1, 0.2), 
      PhaserMath.Between(10, 20)
    );

    this.add.polygon(this.cameras.main.centerX, this.cameras.main.centerY, points, 0xff0000);

    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY,"GJAMES", {fontSize: 50, backgroundColor: "000000"}).setOrigin(0.5);

  }
}
