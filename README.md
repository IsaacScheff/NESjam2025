# NES-Style Phaser Boilerplate

A ready-to-use boilerplate for creating NES-style web games using Phaser 3 with robust input handling.

## Features
- NES-style input system (A/B buttons, Start/Select, D-pad), keyboard/controller inputs can be edited in InputHandler.js 
- Dual input support (keyboard + gamepad)
- Easy configuration of key/button mappings
- Free pixel art font included from Public Pixel Font by GGBotNet, can be swaped out as desired in /src/assets/font
- Input test scene included
- 256×240 resolution matching NES, if you would rather 256x224 this can be changed in /src/index.js
- Webpack pre-configured

## Setup

1. Clone the repository:
   `git clone https://github.com/IsaacScheff/NES_boilerplate.git`

2. Install dependencies:
   `npm install`

3. Start development server:
   `npm start`

4. Open http://localhost:8080 in your browser

## Building
Create production build:
`npm run build`

This will create a /dist folder\
For uploading to itch.io compress this folder

## Input Handling
Check inputs in your game with the InputHandler class:

```javascript
update() {
  if (this.inputHandler.justDown('A')) {
    player.jump();
  }
}
```

## Contact
Feel free to contact me with question or suggestions,\
IsaacScheff@gmail.com\
discord: FakeIsaacWolf