import Phaser from 'phaser';
import DialogueHandler from '../DialogueHandler.js';
import InputHandler from '../InputHandler.js';

export default class GortargIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GortargIntroScene' });
    }

    preload() {
        this.load.spritesheet('princess', 'assets/sprites/princess.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('gortarg', 'assets/sprites/ItsaBowser.png', { frameWidth: 32, frameHeight: 64 });
        this.load.image('dialogueBox', 'assets/sprites/word_box.png');
        this.load.bitmapFont('pixelFont', 'assets/font/pixel_font.png', 'assets/font/pixel.xml');
    }

    create() {
        this.inputHandler = new InputHandler(this);
        this.dialogue = new DialogueHandler(this);
        this.dialogue.init();

        this.cameras.main.setBackgroundColor("#226622"); //change color

        this.princess = this.add.sprite(100, 140, 'princess');
        this.gortarg = this.add.sprite(220, 140, 'gortarg');

        this.waitingForInput = false;
        this.startCutscene();
    }

    startCutscene() {
        this.cutsceneSequence = [
            // Princess runs up to Gortarg
            () => {
                this.tweens.add({
                    targets: this.princess,
                    x: 150,
                    duration: 1000,
                    onComplete: () => {
                        this.nextCutsceneAction();
                    }
                });
            },
            
            // Princess delivers news
            () => {
                this.dialogue.write("Gortarg! My father is forcing me to marry Prince Valdrin!");
                this.waitingForInput = true;
            },
            
            // Gortarg reacts
            () => {
                this.dialogue.write("What?! That pompous noble? Never!");
                this.waitingForInput = true;
            },
            
            // Princess continues
            () => {
                this.dialogue.write("We must run away together tonight!");
                this.waitingForInput = true;
            },
            
            // Gortarg agrees
            () => {
                this.dialogue.write("I'll protect you with my life. Let's go!");
                this.waitingForInput = true;
            },
            
            // Transition to next scene
            () => {
                this.scene.start('FightScene');
            }
        ];

        this.currentAction = 0;
        this.nextCutsceneAction();
    }

    nextCutsceneAction() {
        if (this.currentAction < this.cutsceneSequence.length) {
            this.waitingForInput = false;
            this.cutsceneSequence[this.currentAction]();
            this.currentAction++;
        }
    }

    update() {
        this.inputHandler.update();
        
        if (this.waitingForInput && this.inputHandler.justDown('A')) {
            if (this.dialogue.isOpen()) {
                if (this.dialogue.isAnimating()) {
                    this.dialogue.skipAnimation();
                } else {
                    this.dialogue.close();
                    this.nextCutsceneAction();
                }
            }
        }
    }
}