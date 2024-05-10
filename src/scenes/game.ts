import { Scene, Math as PhaserMath } from 'phaser';
import generatePolygon from '../math/generatePolygon';
import earcut from 'earcut';

export class Game extends Scene {
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  create(): void {

    const points = generatePolygon(
      [0,0],
      [Math.PI * 1.2, 1.7 * Math.PI],
      [0.4, 0.7],
      PhaserMath.Between(200, 300), 
      PhaserMath.FloatBetween(0.1, 0.3), 
      PhaserMath.FloatBetween(0.1, 0.2), 
      5
    );

    const pointsFlat = points.flatMap(p => p);
    const triangleIndices: number[] = earcut(pointsFlat);

    const colorStep = 255 / (triangleIndices.length * 3) ;

    this.add.polygon(this.cameras.main.centerX, this.cameras.main.centerY, points, 0xff0000);
    for(let i = 0; i < triangleIndices.length; i += 3) {
      const triangle = [
        points[triangleIndices[i]],
        points[triangleIndices[i + 1]],
        points[triangleIndices[i + 2]]
      ];

      this.add.polygon(this.cameras.main.centerX, this.cameras.main.centerY, triangle, 0x000000 + i * colorStep);
    }


    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY,"GJAMES", {fontSize: 50, backgroundColor: "000000"}).setOrigin(0.5);

  }
}
