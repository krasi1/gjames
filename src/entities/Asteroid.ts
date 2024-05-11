import earcut from "earcut";
import { Math as PhaserMath, Scene } from "phaser";
import generatePolygon from "../math/generatePolygon";
import hasAdjSide from "../math/hasAdjSide";

import { Triangle } from "../math/triangleTypes";
import * as _ from "lodash";

export default class Asteroid {
  points: [number, number][];
  gameObject: Phaser.GameObjects.Container;
  triangles: Triangle[];
  triangleColors: number[];

  constructor(
    protected scene: Scene,
    public position: { x: number; y: number },
    _points?: [number, number][],
    _triangles?: Triangle[],
    _triangleColors?: number[]
  ) {
    this.points = _points ?? generatePolygon(
      [0, 0],
      [Math.PI * 1.2, 1.7 * Math.PI],
      [0.4, 0.7],
      PhaserMath.Between(200, 300),
      PhaserMath.FloatBetween(0.1, 0.3),
      PhaserMath.FloatBetween(0.1, 0.2),
      PhaserMath.Between(10, 20)
    );

    this.triangles = _triangles ?? this.splitToTriangles();
    const colorStep = 255 / (this.triangles.length);
    this.triangleColors = _triangleColors ?? Array.from({ length: this.triangles.length }, (_, i) => 0x000000 + i * colorStep);

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;
    for(const point of this.points) {
      minX = Math.min(minX, point[0]);
      minY = Math.min(minY, point[1]);
      maxX = Math.max(maxX, point[0]);
      maxY = Math.max(maxY, point[1]);
    }
    const polyWidth = maxX - minX;
    const polyHeight = maxY - minY;

    const triangleContainer = this.scene.add.container(this.position.x, this.position.y);
    for (let i = 0; i < this.triangles.length; i++) {
      const triangleObject = this.createTriangle(
        0,
        0,
        // @ts-expect-error deez nuts
        this.triangles[i],
        this.triangleColors[i]
        );

      triangleContainer.add(triangleObject);
    }
    triangleContainer.setSize(polyWidth, polyHeight);
    this.scene.physics.world.enable(triangleContainer);

    const containerBody = triangleContainer.body as Phaser.Physics.Arcade.Body;
    containerBody.setVelocity(100, 100);
    containerBody.setCollideWorldBounds(true, 1, 1, true);

    this.gameObject = triangleContainer;
  }

  destroyAsteroid() {
    const groups: number[][] = this.groupSubPolygons(this.triangles);
    const newAsteroids: Asteroid[] = [];

    for(let i = 0; i<groups.length; i++){
      if(groups[i].length<2)    // groups with 1 triangle are not drawn
        continue;

      const triangles: Triangle[] = [];
      const triangleColors: number[] = [];
      const flatPoints: number[] = [];
      for(let j=0; j<groups[i].length; j++) {
        triangles.push(this.triangles[groups[i][j]]);
        triangleColors.push(this.triangleColors[groups[i][j]]);
          const trianglePoints = _.flatten(this.triangles[groups[i][j]]);
          flatPoints.push(...trianglePoints);
        }
        const newPoints = _.uniqWith(flatPoints, _.isEqual);
        const asteroid = new Asteroid(this.scene,{ ...this.gameObject.body.position } ,newPoints, triangles, triangleColors);
        newAsteroids.push(asteroid);
    }

    this.gameObject.destroy();

    return newAsteroids;
  }

  private groupSubPolygons(triangles: Triangle[]) {
    const adjMatrix: number[][] = [];

    for (let i = 0; i < triangles.length; i++) {
      adjMatrix[i] = [];
      const tri1 = triangles[i];
      for (let j = 0; j < triangles.length; j++) {
        const tri2 = triangles[j];
        adjMatrix[i][j] = hasAdjSide(tri1, tri2) ? 1 : 0;
      }
    }

    let grp = 0; //group index
    let drawn = 0; //number of triangles drawn
    let ingrp = 0; //number of triangles in current group
    let foundAdj = false;
    const groups: number[][] = [];
    groups[0] = [];
    for (let i = triangles.length - 1; i >= 0; i--) {
      adjMatrix[i][i] = 0; //mark triangle as drawn
      groups[grp][ingrp] = i; //add triangle index to group
      drawn++;
      ingrp++;
      if (drawn == triangles.length) // all triangles have been drawn -> break
        break;
      if (ingrp % 5 == 0) { // example max group size is 5
        ingrp = 0;
        grp++;
        groups[grp] = [];
      }
      foundAdj = false;
      for (let j = triangles.length - 1; j >= 0; j--) {
        if (adjMatrix[i][j] == 1 && adjMatrix[j][j] == 1) { // found adjacent and not drawn
          i = j + 1;
          foundAdj = true;
          break;
        }
      }
      if (!foundAdj) {
        for (let j = 0; j < triangles.length; j++) {
          if (adjMatrix[j][j] == 1) { // found not drawn
            i = j + 1;
            if (ingrp != 0) { // if current group is not empty create new group
              ingrp = 0;
              grp++;
              groups[grp] = [];
            }
            break;
          }
        }
      }
    }
    return groups;
  }

  splitToTriangles() {
    const pointsFlat = this.points.flatMap((p) => p);
    const triangleIndices: number[] = earcut(pointsFlat);
    const triangles: Triangle[] = [];

    for (let i = 0; i < triangleIndices.length; i += 3) {
      const triangle: Triangle = [
        this.points[triangleIndices[i]],
        this.points[triangleIndices[i + 1]],
        this.points[triangleIndices[i + 2]]
      ];

      triangles[i/3] = triangle;
    }

    return triangles;
  }

  createTriangle(x:number, y:number, coords:number[], color:number) {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillTriangle(
      coords[0][0],
      coords[0][1],
      coords[1][0],
      coords[1][1],
      coords[2][0],
      coords[2][1]
    );
    graphics.closePath();
    graphics.setPosition(x, y);

    return graphics;
  }

  update() {
    // do nothing
    // console.log("Asteroid update", this.body.position.x, this.body.position.y);
  }
}
