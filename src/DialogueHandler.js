export default class DialogueHandler {
    constructor(scene) {
        this.scene = scene;
        this.isVisible = false;
        this.currentText = '';
        this.dialogueBox = null;
        this.textObject = null;
        this.callback = null;
        this.typingSpeed = 30; // milliseconds per character
        this.typingTimer = null;
        this.currentCharIndex = 0;

        this.boxY = 64;
        this.boxX = 128;
        
        this.style = {
            boxTexture: 'dialogueBox', // key of the sprite/image for the box
            font: 'pixelFont', // bitmap font key
            fontSize: 8,
            padding: 8,
            boxWidth: 200,
            boxHeight: 80,
            boxX: null, // null = center
            boxY: null, // null = bottom with some margin
            textColor: '#ffffff',
            animateText: true
        };
    }
    
    init(styleOverrides = {}) {
        this.style = {...this.style, ...styleOverrides};
        
        if (this.style.boxX === null) {
            this.style.boxX = this.boxX;
        }
        if (this.style.boxY === null) {
            this.style.boxY = this.boxY;
        }
        
        this.dialogueBox = this.scene.add.sprite(
            this.style.boxX,
            this.style.boxY,
            this.style.boxTexture
        ).setOrigin(0.5).setVisible(false);
        
        this.textObject = this.scene.add.bitmapText(
            this.style.boxX - this.style.boxWidth / 2 + this.style.padding,
            this.style.boxY - this.style.boxHeight / 2 + this.style.padding,
            this.style.font,
            '',
            this.style.fontSize
        ).setTint(Phaser.Display.Color.HexStringToColor(this.style.textColor).color)
         .setMaxWidth(this.style.boxWidth - this.style.padding * 2)
         .setVisible(false);
    }
    
    write(text, callback = null) {
        if (this.isVisible) {
            return;
        }
        
        this.currentText = text;
        this.callback = callback;
        this.isVisible = true;
        this.currentCharIndex = 0;
        
        this.dialogueBox.setVisible(true);
        this.textObject.setVisible(true);
        
        if (this.style.animateText) {
            this.textObject.setText('');
            this.typingTimer = this.scene.time.addEvent({
                delay: this.typingSpeed,
                callback: this.typeNextCharacter,
                callbackScope: this,
                loop: true
            });
        } else {
            this.textObject.setText(text);
        }
    }
    
    typeNextCharacter() {
        if (this.currentCharIndex < this.currentText.length) {
            this.textObject.setText(this.currentText.substring(0, this.currentCharIndex + 1));
            this.currentCharIndex++;
        } else {
            this.typingTimer.destroy();
            this.typingTimer = null;
        }
    }
    
    skipAnimation() {
        if (this.typingTimer) {
            this.typingTimer.destroy();
            this.typingTimer = null;
            this.textObject.setText(this.currentText);
        }
    }
    
    close() {
        if (!this.isVisible) return;
        
        if (this.typingTimer) {
            this.typingTimer.destroy();
            this.typingTimer = null;
        }
        
        this.dialogueBox.setVisible(false);
        this.textObject.setVisible(false);
        this.isVisible = false;
        
        if (this.callback) {
            this.callback();
            this.callback = null;
        }
    }
    
    isOpen() {
        return this.isVisible;
    }
    
    isAnimating() {
        return this.typingTimer !== null;
    }
}