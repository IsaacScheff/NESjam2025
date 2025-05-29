import Phaser from 'phaser';
import InputHandler from '../InputHandler.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {
    this.load.bitmapFont('pixelFont', 'assets/font/pixel_font.png', 'assets/font/pixel.xml');
  }

  create() {
    this.inputHandler = new InputHandler(this);
    
    this.titleText = this.add.bitmapText(
      this.scale.width / 2, 
      this.scale.height / 2 - 20, 
      'pixelFont', 
      'NES-STYLE GAME', 
      8
    ).setOrigin(0.5);
    
    this.pressStartText = this.add.bitmapText(
      this.scale.width / 2, 
      this.scale.height / 2 + 20, 
      'pixelFont', 
      'PRESS START', 
      8
    ).setOrigin(0.5);
  }

  update() {
    this.inputHandler.update();
    
    if (this.inputHandler.justDown('start')) {
      this.scene.start('InputTestScene');
    }
  }
}