import earcut from "earcut";
import { Math as PhaserMath, Scene } from "phaser";
import generatePolygon from "../math/generatePolygon";
import hasAdjSide from "../math/hasAdjSide";

import { Triangle } from "../math/triangleTypes";

export default class Asteroid {
  points: [number, number][];

  constructor(protected scene: Scene) {

    this.points = generatePolygon(
      [0, 0],
      [Math.PI * 1.2, 1.7 * Math.PI],
      [0.4, 0.7],
      PhaserMath.Between(200, 300),
      PhaserMath.FloatBetween(0.1, 0.3),
      PhaserMath.FloatBetween(0.1, 0.2),
      PhaserMath.Between(10, 20)
    );

    const triangles = this.splitToTriangles();
    const colorStep = 255 / (triangles.length);

    for (let i = 0; i<triangles.length; i++) {
      this.drawTriangle(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY-200,
        // @ts-expect-error deez nuts
        triangles[i],
        0x000000 + i * colorStep,
        scene);
    }

    const groups: number[][] = this.groupSubPolygons(triangles);

    const colors = [0xc7adad, 0x663838, 0x82a828, 0x28a888, 0x640b70, 0xb80f2b, 0x075208];  //colors for groups

    for(let i = 0; i<groups.length; i++){
      if(groups[i].length<2)    // groups with 1 triangle are not drawn
        continue;
      for(let j=0; j<groups[i].length; j++) {
          this.drawTriangle(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY+200,
            // @ts-expect-error deez nuts
            triangles[groups[i][j]],
            colors[i],
            scene
          );
      }
    }
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

  drawTriangle(x:number, y:number, coords:number[], col:number, scene: Scene) {
    const graphics = scene.add.graphics();
    graphics.fillStyle(col, 1);
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
  }
}
