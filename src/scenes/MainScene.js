import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.bitmapFont('pixelFont', 'assets/font/pixel_font.png', 'assets/font/pixel.xml');
  }

  create() {
    this.add.bitmapText(this.scale.width / 2, this.scale.height / 2, 'pixelFont', 'Hello NES-style webgame!', 8).setOrigin(0.5);
  }

  update() {
    // Update game objects here
  }
}

export default MainScene;
