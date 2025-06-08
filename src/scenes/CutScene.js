import Phaser from 'phaser';
import DialogueHandler from '../DialogueHandler.js';
import InputHandler from '../InputHandler.js';

export default class CutScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CutScene' });
    }

    preload() {
        this.load.bitmapFont('pixelFont', 'assets/font/pixel_font.png', 'assets/font/pixel.xml');
        this.load.image('dialogueBox', 'assets/sprites/word_box.png');
    }

    create() {
        this.inputHandler = new InputHandler(this);
        
        this.dialogue = new DialogueHandler(this);
        this.dialogue.init();
        
        this.dialogue.write("Hello, world! This is a test dialogue.\nMore dialogue here", () => {
            console.log("Dialogue finished!");
        });
    }

    update() {
        this.inputHandler.update();
        
        if (this.dialogue.isOpen()) {
            if (this.inputHandler.justDown('A')) {
                if (this.dialogue.isAnimating()) {
                    this.dialogue.skipAnimation();
                } else {
                    this.dialogue.close();
                }
            }
        }
    }
}