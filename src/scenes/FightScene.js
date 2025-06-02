import Phaser from 'phaser';
import InputHandler from '../InputHandler.js';

export default class FightScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FightScene' });
        
        this.isJumpHeld = false;
        this.jumpForce = -160;
        this.jumpHoldTime = 0;
        this.maxJumpDuration = 150;
    }

    preload() {
        this.load.spritesheet('player', 'assets/sprites/ItsaBowser.png', {
            frameWidth: 33,
            frameHeight: 48
        });
    }

    create() {
        this.inputHandler = new InputHandler(this);
        
        this.physics.world.setBounds(0, 0, 256, 240);
        this.physics.world.checkCollision.down = false;
        
        this.player = this.physics.add.sprite(128, 120, 'player');
        this.player.setCollideWorldBounds(true, true, true, false);
        this.player.setBounce(0.1);
        
        this.isJumping = false;
        this.playerSpeed = 120;
        
        // Create ground (invisible)
        this.ground = this.add.rectangle(0, 240, 256, 10, 0x000000, 0).setOrigin(0, 0);
        this.physics.add.existing(this.ground, true);
        this.physics.add.collider(this.player, this.ground, () => {
            this.isJumping = false;
            this.isJumpHeld = false;
            this.jumpHoldTime = 0;
        });
    }

    update() {
        this.inputHandler.update();
        
        this.player.setVelocityX(0);
        
        if (this.inputHandler.isDown('left')) {
            this.moveLeft();
        } else if (this.inputHandler.isDown('right')) {
            this.moveRight();
        }
        
        if (this.inputHandler.justDown('A') && !this.isJumping) {
            this.startJump();
        }
        
        if (this.isJumping && this.isJumpHeld) {
            this.handleJump();
        }
        
        if (this.inputHandler.justUp('A') && this.isJumping) {
            this.cancelJump();
        }
    }

    startJump() {
        if (this.player.body.touching.down) {
            this.isJumping = true;
            this.isJumpHeld = true;
            this.jumpHoldTime = 0;
            this.player.setVelocityY(this.jumpForce);
        }
    }

    handleJump() {
        if (this.jumpHoldTime >= this.maxJumpDuration) {
            this.isJumpHeld = false;
            return;
        }
        
        if (this.inputHandler.isDown('A')) {
            this.jumpHoldTime += this.game.loop.delta;
            
            if (this.player.body.velocity.y < 0) {
                this.player.setVelocityY(this.jumpForce);
            }
        }
    }

    cancelJump() {
        this.isJumpHeld = false;
        if (this.player.body.velocity.y < 0) {
            this.player.setVelocityY(this.player.body.velocity.y * 0.6);
        }
    }

    moveLeft() {
        this.player.setVelocityX(-this.playerSpeed);
        this.player.setFlipX(false);
    }

    moveRight() {
        this.player.setVelocityX(this.playerSpeed);
        this.player.setFlipX(true);
    }
}