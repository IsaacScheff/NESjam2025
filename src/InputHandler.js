export function setupGamepad(scene) {
    // Check if any gamepad is already connected
    if (scene.input.gamepad.total > 0) {
        scene.gamepad = scene.input.gamepad.pad1;
        console.log('Gamepad connected!');
    } else {
        //console.log('No gamepad connected at start.');
    }

    // Listen for gamepad connection
    scene.input.gamepad.once('connected', (pad) => {
        scene.gamepad = pad;
        console.log('Gamepad connected during scene!');
    });

    // Optional: Listen for gamepad disconnection
    scene.input.gamepad.once('disconnected', (pad) => {
        if (scene.gamepad === pad) {
            scene.gamepad = null;
            console.log('Gamepad disconnected!');
        }
    });
}