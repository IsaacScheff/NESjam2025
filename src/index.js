import Phaser from 'phaser';
import TitleScene from './scenes/TitleScene.js';
import InputTestScene from './scenes/InputTestScene.js';
import FightScene from './scenes/FightScene.js';

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 240,
  scene: [FightScene, TitleScene, InputTestScene],
  zoom: 3,
  pixelArt: true,
  input: {
        gamepad: true
  },
};

new Phaser.Game(config);
