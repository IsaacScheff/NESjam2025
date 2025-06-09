import Phaser from 'phaser';
import TitleScene from './scenes/TitleScene.js';
import InputTestScene from './scenes/InputTestScene.js';
import FightScene from './scenes/FightScene.js';
import CutScene from './scenes/CutScene.js';
import IntroCutScene from './scenes/IntroCutScene.js';
import GortargIntroScene from './scenes/GortargIntroScene.js';

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 240,
  scene: [IntroCutScene, GortargIntroScene, FightScene, TitleScene, InputTestScene],
  zoom: 3,
  pixelArt: true,
  input: {
        gamepad: true
  },
};

new Phaser.Game(config);
