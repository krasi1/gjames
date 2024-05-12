import { Scene } from "phaser";

export default class HealthBar extends Phaser.GameObjects.Container {
  background: Phaser.GameObjects.Graphics;
  bar: Phaser.GameObjects.Graphics;
  value: number;
  constructor(
    public scene: Scene,
    width,
    height,
    protected initialValue
  ) {
    super(scene);

    this.width = width;
    this.height = height;

    this.background = scene.add.graphics();
    this.background.fillStyle(0x000000, 0.7);
    this.background.fillRect(0, 0, width, height);
    this.add(this.background);

    this.bar = scene.add.graphics();
    this.bar.fillStyle(0x00aa00, 1);
    this.bar.fillRect(5, 5, width - 10, height - 10);
    this.add(this.bar);

    this.value = initialValue;

    this.setPosition(30 , scene.cameras.main.height - height / 2 - 30);

    this.setDepth(3)

    scene.add.existing(this);
  }

  shrink(value: number) {
    const newRatio = (this.value - value) / this.initialValue;
    this.value = this.value - value;

    this.scene.tweens.add({
      targets: this.bar,
      scaleX: (Math.max(newRatio, 0)),
      duration: 300
    });
  }
}
