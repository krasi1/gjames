import { GameObjects, Physics, Scene, Types } from "phaser";
//import { BulletGroup } from "../systems/BulletSystem";
//import config from "../gameConfig";

export default class Star {
    sprite: Physics.Arcade.Sprite;

    constructor(scene: Scene) {
        this.sprite = scene.physics.add.sprite(
            scene.cameras.main.centerX,
            100,
            "star"
          );
    }
}