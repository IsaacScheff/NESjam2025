// Enemy.js
import Phaser from 'phaser';

export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        scene.add.existing(this);

        this.velocity = { x: 50, y: 0 };
        this.onGround = true;
        this.setOrigin(0.5, 1); // Anchor to bottom center
        this.canMove = true;
        this.isInvulnerable = false;
        
        this.sceneRef = scene;
        
        // Set up AI behavior timer
        this.aiTimer = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 3000),
            loop: true,
            callback: this.aiBehavior,
            callbackScope: this
        });
    }

    update(delta) {
        if (!this.canMove) {
            if (!this.onGround) {
                this.velocity.y += this.sceneRef.gravity * (delta / 1000);
            }
            
            this.y += this.velocity.y * (delta / 1000);
            
            if (this.y >= this.sceneRef.groundY) {
                this.y = this.sceneRef.groundY;
                this.velocity.y = 0;
                this.onGround = true;
            } else {
                this.onGround = false;
            }
            return;
        }

        this.x += this.velocity.x * (delta / 1000);
        
        // Simple boundary check
        if (this.x < 16 || this.x > 240) {
            this.velocity.x *= -1;
        }
        
        if (!this.onGround) {
            this.velocity.y += this.sceneRef.gravity * (delta / 1000);
        }
        
        this.y += this.velocity.y * (delta / 1000);
        
        if (this.y >= this.sceneRef.groundY) {
            this.y = this.sceneRef.groundY;
            this.velocity.y = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
    }

    aiBehavior() {
        if (this.onGround) {
            this.jump();
            this.sceneRef.time.delayedCall(300, this.shoot.bind(this), [], this);
        }
    }

    jump() {
        this.velocity.y = -180;
        this.onGround = false;
    }

    shoot() {
        this.canMove = false;
        const previousVelocityX = this.velocity.x;
        this.velocity.x = 0;

        const directions = [
            { x: 100, y: 0 },
            { x: -100, y: 0 },
            { x: 0, y: 100 },
            { x: 0, y: -100 },
            { x: 50, y: -50 },
            { x: -50, y: 50 },
            { x: 50, y: 50 },
            { x: -50, y: -50 },
        ];

        directions.forEach(dir => {
            const proj = this.sceneRef.add.sprite(this.x, this.y - 10, 'fireball');
            proj.velocity = { x: dir.x, y: dir.y };
            this.sceneRef.enemyProjectiles.add(proj);
        });

        this.sceneRef.time.delayedCall(1000, () => {
            this.canMove = true;
            this.velocity.x = previousVelocityX;
        });
    }

    takeHit(source) {
        if (this.isInvulnerable) return;

        source.destroy();
        this.isInvulnerable = true;

        this.sceneRef.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            ease: 'Linear',
            duration: 100,
            repeat: 3,
            yoyo: true,
            onComplete: () => {
                this.setAlpha(1);
                this.isInvulnerable = false;
            }
        });
    }
}