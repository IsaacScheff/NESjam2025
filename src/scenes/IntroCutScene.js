import Phaser from 'phaser';
import DialogueHandler from '../DialogueHandler.js';
import InputHandler from '../InputHandler.js';

export default class IntroCutScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroCutScene' });
    }

    preload() {
        this.load.spritesheet('king', 'assets/sprites/king.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('princess', 'assets/sprites/princess.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('dialogueBox', 'assets/sprites/word_box.png');
        this.load.bitmapFont('pixelFont', 'assets/font/pixel_font.png', 'assets/font/pixel.xml');
    }

    create() {
        this.inputHandler = new InputHandler(this);
        
        this.dialogue = new DialogueHandler(this);
        this.dialogue.init();

        this.cameras.main.setBackgroundColor("#bcbcbc");

        this.king = this.add.sprite(220, 120, 'king');
        this.princess = this.add.sprite(106, 140, 'princess');

        // Track if we're waiting for input to proceed
        this.waitingForInput = false;
        
        this.startCutscene();
    }

    startCutscene() {
        // Array of dialogue and actions
        this.cutsceneSequence = [
            // King speaks first
            () => {
                this.king.setFrame(1); // Angry frame
                this.dialogue.write("PRINCESS! HOW DARE YOU DISOBEY ME!");
                this.waitingForInput = true;
            },
            
            // King continues
            () => {
                this.king.setFrame(2); // More angry
                this.dialogue.write("YOU WILL MARRY PRINCE VALDRIN OR FACE BANISHMENT!");
                this.waitingForInput = true;
            },
            
            // Princess reacts
            () => {
                this.princess.setFrame(3); // Shocked frame
                this.dialogue.write("But father! I love another!");
                this.waitingForInput = true;
            },
            
            // King's final line
            () => {
                this.king.setFrame(4); // Yelling frame
                this.dialogue.write("ENOUGH! GUARDS, SEIZE HER!");
                this.waitingForInput = true;
            },
            
            // Princess runs away
            () => {
                this.dialogue.close();
                this.tweens.add({
                    targets: this.princess,
                    x: -50,
                    duration: 2000,
                    onComplete: () => {
                        this.nextCutsceneAction();
                    }
                });
            },
            
            // Transition to title scene
            () => {
                this.scene.start('TitleScene');
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
        
        // Only proceed if we're waiting for input and A is pressed
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