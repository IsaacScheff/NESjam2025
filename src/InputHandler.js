export default class InputHandler {
    constructor(scene) {
        this.scene = scene;
        this.gamepad = null;
        this.gamepadButtons = [];
        this.hasGamepadSupport = false;
        this.keys = {};

        /*
            Default keys can be changed here
            for example; 
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
        */
        this.keyMappings = {
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            A: Phaser.Input.Keyboard.KeyCodes.Z,
            B: Phaser.Input.Keyboard.KeyCodes.X,
            start: Phaser.Input.Keyboard.KeyCodes.ENTER,
            select: Phaser.Input.Keyboard.KeyCodes.SPACE
        };

        // Default gamepad button mappings (Xbox-style layout)
        this.gamepadMappings = {
            up: 12,    // D-pad up
            down: 13,  // D-pad down
            left: 14,  // D-pad left
            right: 15, // D-pad right
            A: 0,      // A button (bottom face)
            B: 1,      // B button (right face)
            start: 9,  // Start button
            select: 8  // Back/Select button
        };

        this.initKeyboard();
        this.setupGamepad();
    }

    initKeyboard() {
        if (!this.scene.input || !this.scene.input.keyboard) {
            console.warn('Keyboard input not available in this scene');
            this.createDummyKeys();
            return;
        }

        for (const [button, keyCode] of Object.entries(this.keyMappings)) {
            try {
                this.keys[button] = this.scene.input.keyboard.addKey(keyCode);
            } catch (e) {
                console.warn(`Failed to initialize key ${button}:`, e);
                this.createDummyKey(button);
            }
        }
    }

    createDummyKeys() {
        for (const button in this.keyMappings) {
            this.createDummyKey(button);
        }
    }

    createDummyKey(button) {
        this.keys[button] = { 
            isDown: false,
            _justDown: false,
            _justUp: false,
            isUp: true
        };
    }

    setupGamepad() {
        if (!this.scene.input || !this.scene.input.gamepad) {
            this.hasGamepadSupport = false;
            return;
        }

        this.hasGamepadSupport = true;
        
        if (this.scene.input.gamepad.total > 0) {
            this.gamepad = this.scene.input.gamepad.pad1;
        }

        this.scene.input.gamepad.once('connected', (pad) => {
            this.gamepad = pad;
            console.log('Gamepad connected:', pad.id);
        });

        this.scene.input.gamepad.once('disconnected', (pad) => {
            if (this.gamepad === pad) {
                this.gamepad = null;
                console.log('Gamepad disconnected');
            }
        });
    }

    justDown(button) {
        if (!this.keys[button] || !this.keyMappings[button]) return false;

        if (this.keys[button]._justDown !== undefined) {
            if (Phaser.Input.Keyboard.JustDown(this.keys[button])) {
                return true;
            }
        }

        if (this.hasGamepadSupport && this.gamepad && this.gamepadMappings[button] !== undefined) {
            const buttonIndex = this.gamepadMappings[button];
            
            if (this.gamepad.buttons && buttonIndex < this.gamepad.buttons.length) {
                const isDown = this.gamepad.buttons[buttonIndex].pressed;
                const wasDown = this.gamepadButtons[buttonIndex];
                this.gamepadButtons[buttonIndex] = isDown;
                return isDown && !wasDown;
            }
        }

        return false;
    }

    isDown(button) {
        if (!this.keys[button] || !this.keyMappings[button]) return false;

        if (this.keys[button].isDown !== undefined) {
            if (this.keys[button].isDown) {
                return true;
            }
        }

        if (this.hasGamepadSupport && this.gamepad && this.gamepadMappings[button] !== undefined) {
            const buttonIndex = this.gamepadMappings[button];
            
            if (this.gamepad.buttons && buttonIndex < this.gamepad.buttons.length) {
                return this.gamepad.buttons[buttonIndex].pressed;
            }
        }

        return false;
    }

    justUp(button) {
        if (!this.keys[button] || !this.keyMappings[button]) return false;

        if (this.keys[button]._justUp !== undefined) {
            if (Phaser.Input.Keyboard.JustUp(this.keys[button])) {
                return true;
            }
        }

        if (this.hasGamepadSupport && this.gamepad && this.gamepadMappings[button] !== undefined) {
            const buttonIndex = this.gamepadMappings[button];
            
            if (this.gamepad.buttons && buttonIndex < this.gamepad.buttons.length) {
                const isDown = this.gamepad.buttons[buttonIndex].pressed;
                const wasDown = this.gamepadButtons[buttonIndex];
                this.gamepadButtons[buttonIndex] = isDown;
                return !isDown && wasDown;
            }
        }

        return false;
    }

    update() {
        if (this.hasGamepadSupport && this.gamepad) {
            for (const [button, index] of Object.entries(this.gamepadMappings)) {
                if (this.gamepad.buttons && index < this.gamepad.buttons.length) {
                    this.gamepadButtons[index] = this.gamepad.buttons[index].pressed;
                }
            }
        }
    }

    setKeyMapping(button, keyCode) {
        if (!this.keyMappings[button]) {
            console.warn(`Button ${button} doesn't exist in mappings`);
            return;
        }

        this.keyMappings[button] = keyCode;
        
        if (this.keys[button] && this.scene.input.keyboard) {
            this.scene.input.keyboard.removeKey(this.keys[button]);
        }
        
        if (this.scene.input.keyboard) {
            this.keys[button] = this.scene.input.keyboard.addKey(keyCode);
        } else {
            this.createDummyKey(button);
        }
    }

    setGamepadMapping(button, buttonIndex) {
        if (!this.gamepadMappings[button]) {
            console.warn(`Button ${button} doesn't exist in gamepad mappings`);
            return;
        }
        this.gamepadMappings[button] = buttonIndex;
    }
}