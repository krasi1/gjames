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

        // add text for instructions how to play
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, "Use arrow keys to move and space to shoot",
            { fontSize: 30, wordWrap: { width: 600, useAdvancedWrap: true }, align: "center" }).setOrigin(0.5);

        const gemcolors = [
            config.powerUp.fireRateUp.color,
            config.powerUp.damageUp.color,
            config.powerUp.splitShot.color,
            config.powerUp.weaponUpgrade.color
        ]
        for(let i = 0; i<4; i++) {
            const sprite = this.add.sprite(
            this.cameras.main.centerX - 200,
            this.cameras.main.centerY+200 + 70*i,
            "mineral"
            );
            sprite.tint = gemcolors[i];
            sprite.setScale(config.mineral.spriteScale);
        }
        this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY + 185, 
            "FIRE RATE +",
            { fontSize: 40, wordWrap: { width: 600, useAdvancedWrap: true }, align: "left" }).setOrigin(0);
        this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY + 255, 
            "DAMAGE +",
            { fontSize: 40, wordWrap: { width: 600, useAdvancedWrap: true }, align: "left" }).setOrigin(0);
        this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY + 325, 
            "SPLIT SHOT",
            { fontSize: 40, wordWrap: { width: 600, useAdvancedWrap: true }, align: "left" }).setOrigin(0);
        this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY + 395, 
            "WEAPON +",
            { fontSize: 40, wordWrap: { width: 600, useAdvancedWrap: true }, align: "left" }).setOrigin(0);    
        this.input.keyboard.on("keydown-SPACE", () => this.scene.start('GameScene'))
    }

    update(): void {
        this.background.tilePositionY -= config.background.scrollVelocity;
    }

}
