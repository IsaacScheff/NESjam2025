import Phaser from 'phaser';
import TitleScene from './scenes/TitleScene.js';
import InputTestScene from './scenes/InputTestScene.js';

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 240,
  scene: [TitleScene, InputTestScene],
  zoom: 3
};

new Phaser.Game(config);
