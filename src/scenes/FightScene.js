import Phaser from 'phaser';
import InputHandler from '../InputHandler.js';
import Enemy from '../Enemy.js';

export default class FightScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FightScene' });
        
        this.jumpForce = -400;
        this.maxJumpDuration = 300;
        this.gravity = 800;
        this.groundY = 240 - 24;
        this.playerSpeed = 120;
        this.fireballSpeed = 180;
        this.fireballCooldown = 500;
        
        this.playerLives = 3;
        this.isPlayerInvulnerable = false;
        this.isJumping = false;
        this.isJumpHeld = false;
        this.jumpHoldTime = 0;
        this.lastFireballTime = 0;
    }

    preload() {
        this.load.spritesheet('player', 'assets/sprites/ItsaBowser.png', {
            frameWidth: 33,
            frameHeight: 48
        });
        
        this.load.spritesheet('enemy', 'assets/sprites/ItsaMario.png', {
            frameWidth: 16,
            frameHeight: 27
        });

        this.load.image('fireball', 'assets/sprites/fireball.png');
        this.load.image('heart', 'assets/sprites/heart.png');
    }

    create() {
        this.inputHandler = new InputHandler(this);

        this.player = this.add.sprite(128, 120, 'player');
        this.player.velocity = { x: 0, y: 0 };
        this.player.onGround = false;
        this.player.setDepth(1);
        this.player.setOrigin(0.5, 1);
        
        this.enemy = new Enemy(this, 50, 200, 'enemy');
        
        this.fireballs = this.add.group();
        this.enemyProjectiles = this.add.group();

        this.createLivesDisplay();
    }

    createLivesDisplay() {
        this.livesGroup = this.add.group();
        const heartSize = 16;
        const padding = 4;
        
        for (let i = 0; i < this.playerLives; i++) {
            const heart = this.add.image(
                10 + (i * (heartSize + padding)),
                10,
                'heart'
            ).setOrigin(0, 0).setScrollFactor(0);
            this.livesGroup.add(heart);
        }
    }

    updateLivesDisplay() {
        this.livesGroup.clear(true, true);
        const heartSize = 16;
        const padding = 4;
        
        for (let i = 0; i < this.playerLives; i++) {
            const heart = this.add.image(
                10 + (i * (heartSize + padding)),
                10,
                'heart'
            ).setOrigin(0, 0).setScrollFactor(0);
            this.livesGroup.add(heart);
        }
    }

    update(time, delta) {
        this.inputHandler.update();
        this.handlePlayerMovement(delta);
        this.enemy.update(delta);
        this.updateProjectiles(delta);
        this.checkCollisions();
    }

    handlePlayerMovement(delta) {
        this.player.velocity.x = 0;

        if (this.inputHandler.isDown('left')) {
            this.moveLeft();
        } else if (this.inputHandler.isDown('right')) {
            this.moveRight();
        }
        
        if (this.inputHandler.justDown('A') && this.player.onGround) {
            this.startJump();
        }
        
        if (this.isJumping && this.isJumpHeld) {
            this.handleJump(delta);
        }
        
        if (this.inputHandler.justUp('A') && this.isJumping) {
            this.cancelJump();
        }
        
        if (!this.player.onGround) {
            this.player.velocity.y += this.gravity * (delta / 1000);
        }
        
        this.player.x += this.player.velocity.x * (delta / 1000);
        this.player.y += this.player.velocity.y * (delta / 1000);
        
        if (this.player.y >= this.groundY) {
            this.player.y = this.groundY;
            this.player.velocity.y = 0;
            this.player.onGround = true;
            this.isJumping = false;
        } else {
            this.player.onGround = false;
        }
        
        if (this.inputHandler.justDown('B')) {
            this.shootFireball();
        }
    }

    updateProjectiles(delta) {
        this.fireballs.getChildren().forEach(fireball => {
            fireball.x += fireball.velocity.x * (delta / 1000);
            if (fireball.x < -16 || fireball.x > 272) {
                fireball.destroy();
            }
        });
        
        this.enemyProjectiles.getChildren().forEach(proj => {
            proj.x += proj.velocity.x * (delta / 1000);
            proj.y += proj.velocity.y * (delta / 1000);
            if (proj.x < -16 || proj.x > 272 || proj.y < -16 || proj.y > 256) {
                proj.destroy();
            }
        });
    }

    checkCollisions() {
        if (this.checkSpriteCollision(this.player, this.enemy)) {
            this.hitPlayer();
        }
        
        this.fireballs.getChildren().forEach(fireball => {
            if (this.checkSpriteCollision(fireball, this.enemy)) {
                this.enemy.takeHit(fireball);
            }
        });
        
        this.enemyProjectiles.getChildren().forEach(proj => {
            if (this.checkSpriteCollision(proj, this.player)) {
                this.hitPlayerWithProjectile(this.player, proj);
            }
        });
    }

    checkSpriteCollision(sprite1, sprite2) {
        const bounds1 = sprite1.getBounds();
        const bounds2 = sprite2.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2);
    }

    hitPlayer() {
        if (this.isPlayerInvulnerable || this.playerLives <= 0) return;
        
        this.playerLives--;
        this.updateLivesDisplay();
        
        if (this.playerLives <= 0) {
            this.gameOver();
            return;
        }
        
        this.isPlayerInvulnerable = true;
        
        this.tweens.add({
            targets: this.player,
            alpha: 0,
            ease: 'Linear',
            duration: 100,
            repeat: 2,
            yoyo: true,
            onComplete: () => {
                this.player.setAlpha(1);
                this.isPlayerInvulnerable = false;
            }
        });
        
        const knockbackDirection = this.player.x < this.enemy.x ? -1 : 1;
        this.player.velocity.x = 200 * knockbackDirection;
        this.player.velocity.y = -100;
        this.player.onGround = false;
    }

    gameOver() {
        console.log('Game Over');
    }

    startJump() {
        this.isJumping = true;
        this.isJumpHeld = true;
        this.jumpHoldTime = 0;
        this.player.velocity.y = this.jumpForce;
        this.player.onGround = false;
    }

    handleJump(delta) {
        if (this.jumpHoldTime >= this.maxJumpDuration) {
            this.isJumpHeld = false;
            return;
        }
        
        if (this.inputHandler.isDown('A')) {
            this.jumpHoldTime += delta;
            if (this.player.velocity.y < 0) {
                this.player.velocity.y = this.jumpForce * (1 - (this.jumpHoldTime / this.maxJumpDuration));
            }
        }
    }

    cancelJump() {
        this.isJumpHeld = false;
        if (this.player.velocity.y < 0) {
            this.player.velocity.y *= 0.6;
        }
    }

    moveLeft() {
        this.player.velocity.x = -this.playerSpeed;
        this.player.setFlipX(false);
    }

    moveRight() {
        this.player.velocity.x = this.playerSpeed;
        this.player.setFlipX(true);
    }

    shootFireball() {
        const currentTime = this.time.now;
        if (currentTime - this.lastFireballTime < this.fireballCooldown) return;

        this.lastFireballTime = currentTime;

        const fireball = this.add.sprite(this.player.x, this.player.y - 10, 'fireball');
        fireball.velocity = {
            x: this.player.flipX ? this.fireballSpeed : -this.fireballSpeed,
            y: 0
        };
        this.fireballs.add(fireball);
    }

    hitPlayerWithProjectile(player, projectile) {
        projectile.destroy();
        this.hitPlayer();
    }
}