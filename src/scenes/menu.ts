import { GameObjects, Scene } from 'phaser';
import config from '../gameConfig';

export default class Menu extends Scene {
    background: GameObjects.TileSprite;

    constructor() {
        super({
            key: 'MenuScene'
        });
    }

    preload(): void {
        //
    }

    create(): void {

        this.background = this.add
            .tileSprite(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                this.game.canvas.width,
                this.game.canvas.height,
                "nebula"
            )
            .setDepth(0);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Press SPACE to play",
            { fontSize: 50, wordWrap: { width: 600, useAdvancedWrap: true }, align: "center" }).setOrigin(0.5);

        this.input.keyboard.on("keydown-SPACE", () => this.scene.start('GameScene'))
    }

    update(): void {
        this.background.tilePositionY -= config.background.scrollVelocity;
    }


}
