import { GameObjects, Physics, Scene, Types } from "phaser";
import config from "../gameConfig";
import { after } from "../utils";

export default class Player {
  sprite: Physics.Arcade.Sprite;
  engineAnim: GameObjects.Sprite;
  destroyAnim: GameObjects.Sprite;
  destroyed = false;
  isColliding = false;

  constructor(protected scene: Scene) {
    this.sprite = scene.physics.add.sprite(
      scene.cameras.main.centerX,
      scene.cameras.main.centerY + 300,
      "shipIdle"
    );
    this.sprite.body?.setSize(this.sprite.width / 2, this.sprite.height / 2);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(2);

    const engineLoop = {
      frames: scene.anims.generateFrameNumbers("engine", {
        ...config.playerAnims.engine.frames
      }),
      ...config.playerAnims.engine.frameConfig
    };

    const destroyConf = {
      frames: scene.anims.generateFrameNumbers("destroy", {
        ...config.playerAnims.destroy.frames
      }),
      ...config.playerAnims.destroy.frameConfig
    };

    scene.anims.create(engineLoop);
    scene.anims.create(destroyConf);

    this.engineAnim = scene.add.sprite(
      this.sprite.x,
      this.sprite.y + 5,
      "engine"
    );
    this.destroyAnim = scene.add.sprite(0, 0, "desroy").setVisible(false);
    this.engineAnim.play("loop");
  }

  update(keys: Types.Input.Keyboard.CursorKeys) {
    if (this.destroyed) return;
    const { left, right, up, down } = keys;

    this.engineAnim.setPosition(this.sprite.x, this.sprite.y + 5);

    if (this.isColliding) return;
    if (left.isDown) {
      this.sprite.setVelocityX(-config.player.velocity);
    } else if (right.isDown) {
      this.sprite.setVelocityX(config.player.velocity);
    }

    if (up.isDown) {
      this.sprite.setVelocityY(-config.player.velocity);
    } else if (down.isDown) {
      this.sprite.setVelocityY(config.player.velocity);
    }

    if (!left.isDown && !right.isDown) {
      this.sprite.setVelocityX(0);
    }

    if (!up.isDown && !down.isDown) {
      this.sprite.setVelocityY(0);
    }
  }

  collidesWith(
    obj: GameObjects.Sprite | GameObjects.Container,
    collisionType: "collider" | "overlap",
    pushBackForce: number,
    cb: () => void
  ) {
    this.scene.physics.add[collisionType](obj, this.sprite, () => {
      const directionX = this.sprite.x - obj.x;
      const directionY = this.sprite.y - obj.y;
      const length = Math.sqrt(
        directionX * directionX + directionY * directionY
      );

      const normalX = directionX / length;
      const normalY = directionY / length;

      this.isColliding = true;

      this.sprite.setVelocity(normalX * pushBackForce, normalY * pushBackForce);

      cb();

      after(0.2, () => {
        this.isColliding = false;
        this.sprite.setVelocity(0);
      });
    });
  }

  destroy() {
    this.destroyed = true;
    this.destroyAnim.visible = true;
    this.sprite.visible = false;
    this.engineAnim.visible = false;
    this.destroyAnim.setPosition(this.sprite.x, this.sprite.y);
    this.destroyAnim.play("destroy");
    // this.sprite.destroy();
    // this.engineAnim.destroy();
  }
}
