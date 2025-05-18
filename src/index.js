import Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';

const config = {
  type: Phaser.AUTO,
  width: 240,
  height: 256,
  scene: [MainScene]
};

new Phaser.Game(config);
