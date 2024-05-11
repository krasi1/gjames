import { GameObjects, Physics, Scene, Types } from "phaser";
import config from "../gameConfig";

export default class Player {
  sprite: Physics.Arcade.Sprite;
  engineAnim: GameObjects.Sprite;

  constructor(scene: Scene) {
    this.sprite = scene.physics.add.sprite(
      scene.cameras.main.centerX,
      scene.cameras.main.centerY + 300,
      "shipIdle"
    );
    this.sprite.body?.setSize(this.sprite.width / 2, this.sprite.height / 2);
    this.sprite.setCollideWorldBounds(true);

    const engineLoop = {
      frames: scene.anims.generateFrameNumbers("engine", {
        ...config.playerAnims.engine.frames
      }),
      ...config.playerAnims.engine.frameConfig
    };

    scene.anims.create(engineLoop);

    this.engineAnim = scene.add.sprite(
      this.sprite.x,
      this.sprite.y + 5,
      "engine"
    );
    this.engineAnim.play("loop");
  }

  update(keys: Types.Input.Keyboard.CursorKeys) {
    const { left, right, up, down } = keys;

    this.engineAnim.setPosition(this.sprite.x, this.sprite.y + 5);

    if (left.isDown) {
      this.sprite.setVelocityX(-config.player.velocity);
    } else if (right.isDown) {
      this.sprite.setVelocityX(config.player.velocity);
    } else this.sprite.setVelocityX(0);

    if (down.isDown) {
      this.sprite.setVelocityY(config.player.velocity);
    } else if (up.isDown) {
      this.sprite.setVelocityY(-config.player.velocity);
    } else this.sprite.setVelocityY(0);
  }

  destroy() {
    this.sprite.destroy()
    this.engineAnim.destroy()
  }
}
