import earcut from "earcut";
import { Math as PhaserMath, Scene } from "phaser";
import generatePolygon from "../math/generatePolygon";

export default class Asteroid {
  constructor(protected scene: Scene) {
    const points = generatePolygon(
      [0, 0],
      [Math.PI * 1.2, 1.7 * Math.PI],
      [0.4, 0.7],
      PhaserMath.Between(200, 300),
      PhaserMath.FloatBetween(0.1, 0.3),
      PhaserMath.FloatBetween(0.1, 0.2),
      PhaserMath.Between(10, 20)
    );

    const pointsFlat = points.flatMap((p) => p);
    const triangleIndices: number[] = earcut(pointsFlat);

    const colorStep = 255 / (triangleIndices.length * 3);

    for (let i = 0; i < triangleIndices.length; i += 3) {
      const triangle = [
        points[triangleIndices[i]],
        points[triangleIndices[i + 1]],
        points[triangleIndices[i + 2]]
      ];

      const graphics = scene.add.graphics();
      graphics.fillStyle(0x000000 + i * colorStep, 1);
      graphics.fillTriangle(
        triangle[0][0],
        triangle[0][1],
        triangle[1][0],
        triangle[1][1],
        triangle[2][0],
        triangle[2][1]
      );
      graphics.closePath();
      graphics.setPosition(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY
      );
    }
  }
}
