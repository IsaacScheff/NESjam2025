import Phaser from 'phaser';
import InputHandler from '../InputHandler.js';

export default class InputTestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InputTestScene' });
  }

  preload() {
    this.load.bitmapFont('pixelFont', 'assets/font/pixel_font.png', 'assets/font/pixel.xml');
  }

  create() {
    this.inputHandler = new InputHandler(this);
    
    this.buttonText = this.add.bitmapText(
      this.scale.width / 2, 
      this.scale.height / 2 - 20, 
      'pixelFont', 
      'Press any button', 
      8
    ).setOrigin(0.5);
    
    this.instructionText = this.add.bitmapText(
      this.scale.width / 2, 
      this.scale.height / 2 + 40, 
      'pixelFont', 
      'Keyboard: Arrow keys, \nZ(A), X(B), \nEnter(Start), \nSpace(Select)', 
      8
    ).setOrigin(0.5);
    
    this.lastPressed = null;
    this.lastPressedTime = 0;
  }

  update() {
    this.inputHandler.update();

    const buttons = ['up', 'down', 'left', 'right', 'A', 'B', 'start', 'select'];
    const currentTime = this.time.now;
    
    for (const button of buttons) {
      if (this.inputHandler.justDown(button)) {
        if (button !== this.lastPressed || currentTime - this.lastPressedTime > 500) {
          this.buttonText.setText(`Pressed: ${button.toUpperCase()}`);
          this.lastPressed = button;
          this.lastPressedTime = currentTime;
        }
      }
    }
    
    if (this.inputHandler.justUp(this.lastPressed)) {
      if (currentTime - this.lastPressedTime > 500) {
        this.buttonText.setText('Press any button');
        this.lastPressed = null;
      }
    }
  }
}