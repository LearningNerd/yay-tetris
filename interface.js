import {Tetris} from "./tetris.js"
import {MOVES, KEYS, KEY_MAP} from "./constants.js"
import {FRAMES_PER_SECOND, KEY_MOVE_MAP, OVERRIDE_KEYS} from "./config.js"

// Track when a key was initially pressed down (used for repeating moves after a delay)
let keyDownTimestamp = 0;

// Keep track of which keys are currently being pressed
let pressedKeys = {};

  // Params for drawing:
  const rows = 20, cols = 10;
  const blockSize = 25;

  const frameRate = 60; // frames per second
  const loopIntervalMillis = 50; // Game loop speed (tick every X milliseconds)
  const keyRepeatDelay = 120; // milliseconds until key auto-repeats for left/right/soft-drop

  const topMargin = 5;
  const leftMargin = 15;
  const rightMargin = 10;

  const playfieldXPos = leftMargin;
  const playfieldYPos = topMargin;

  const playfieldWidth = blockSize * cols;
  const playfieldHeight = blockSize * rows;

  const nextQueueLeftMargin = 0.2 * playfieldWidth; 
  const nextQueueXPos = playfieldXPos + playfieldWidth + nextQueueLeftMargin;
  const nextQueueYPos = topMargin + 50;

  const nextQueueWidth = blockSize * 4;
  const nextQueueHeight = blockSize * rows;

  const canvasWidth = leftMargin + rightMargin + playfieldWidth + nextQueueWidth + nextQueueLeftMargin;
  const canvasHeight = playfieldHeight + 75;


// Create and initialize canvas
let canvasElem = document.createElement("canvas");
canvasElem.setAttribute('width', canvasWidth);
canvasElem.setAttribute('height', canvasHeight);
canvasElem.id = "defaultCanvas0";
canvasElem.textContent = "This is a Tetris game! But you'll need a modern web browser with JavaScript enabled to play the game.";
document.body.appendChild(canvasElem);

// Set up 2d drawing context, which provides access to all drawing functions
const draw = canvasElem.getContext('2d');
console.log(draw);




  // Will be updated in game loop 
  let gameOver = false;

  // To track how many millis have elapsed since previous game loop tick
  let previousTimestamp = 0;
 
  // Create instance of Tetris module
  let tetris = new Tetris(rows, cols);

  // Will update this on key press, pass to gameLoopTick
  let nextMove;
  let lastDirectionKeyDown; // Repeat left/right/down continuosly
  
  // Update on every game loop tick
  let gameState;


document.addEventListener("keydown", function(event) {
  
  // Normalize key codes across browsers (see notes in constants.js)
  const currentKey = KEY_MAP[event.key || event.keyCode];
  
  // Prevent default behavior for keys being used as game controls (except for Ctrl)
  if (OVERRIDE_KEYS.includes(currentKey)) {
    event.preventDefault();
  }

  // If this key isn't part of game controls, or this key is already currently pressed,
  // don't do anything!
  // NOTE: Key repeat rates are inconsistent across operating systems/devices,
  // so let's not rely on that for game behavior =P
  if (currentKey === undefined || pressedKeys[currentKey]) { return; }

  // If left and right keys are pressed down at the same time, use the most recent
  if (currentKey === KEYS.LEFT && pressedKeys[KEYS.RIGHT]) {
    pressedKeys[KEYS.RIGHT] = false; 
  } else if (currentKey === KEYS.RIGHT && pressedKeys[KEYS.LEFT] ) {
    pressedKeys[KEYS.LEFT] = false; 
  }
  // NOTE: #TIL keyboards differ in how they handle simultaneous key presses!
  // See: https://en.wikipedia.org/wiki/Rollover_(key)
  // Key jamming: it's not a bug, it's a feature! ¯\_(ツ)_/¯

  // Track when a game key was initially pressed down (used for repeating moves after a delay)
  // NOTE: important to do this *after* the return condition above; track INITIAL keypress only!
  keyDownTimestamp = window.performance.now();

  // Track which keys are being held down
  pressedKeys[currentKey] = true;

  // Set the next move to whichever key was most recently held down
  // (this may be overridden based on multiple keys / key repeat delay)
  nextMove = KEY_MOVE_MAP[currentKey];

}); // end keyDown handler

document.addEventListener("keyup", function(event) {
  const currentKey = KEY_MAP[event.key || event.keyCode];
  if (currentKey === undefined) { return; } // only handle game control keys
  pressedKeys[currentKey] = false; // Remove from pressedKeys once released
});

// Release all keys when window loses focus
// (to prevent weird bugs when switching windows while keys are still held down)
// Thanks to p5js library source code for making me aware of this issue!
window.addEventListener("blur", function(event) {
  pressedKeys = {};
});


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////



function updateGame () {

    // Run game loop every X milliseconds (loopIntervalMillis) -- or initiate
    if (window.performance.now() - previousTimestamp >= loopIntervalMillis || window.performance.now() < loopIntervalMillis) {
      previousTimestamp = window.performance.now();

      // Update game state with next move, returns updated state with: sqaures array, score number, gameOver, and tetrominoQueue array
      // NOTE: must run this BEFORE key repeat/reset conditions below; otherwise, non-repeatable moves like rotation WON'T be triggered at all
      gameState = tetris.gameLoopTick(nextMove);

      // For left/right, repeat on keydown but only after a delay! Matches original game better, and easier to move 1 space at a time if needed
      // (Otherwise, it's easy to accidentally move 2 or more spaces if you don't release the key soon enough)
      if (window.performance.now() - keyDownTimestamp >= keyRepeatDelay && (pressedKeys[KEYS.LEFT] || pressedKeys[KEYS.RIGHT]) ) {

        if (pressedKeys[KEYS.DOWN] && pressedKeys[KEYS.LEFT]) {
          nextMove = MOVES.LEFT_SOFT_DROP;
        } else if (pressedKeys[KEYS.DOWN] && pressedKeys[KEYS.RIGHT]) {
          nextMove = MOVES.RIGHT_SOFT_DROP;
        } else if (pressedKeys[KEYS.LEFT]) {
          nextMove = MOVES.LEFT;
        } else if (pressedKeys[KEYS.RIGHT]) {
          nextMove = MOVES.RIGHT;
        } 

      // Soft-drop is the only move that repeats immediately on keydown (no delay before repeating)
      } else if (pressedKeys[KEYS.DOWN]) {
        nextMove = MOVES.SOFT_DROP;

      // For all other moves, don't repeat them on keydown! Reset nextMove after each tick of game loop
      } else { 
        nextMove = undefined;
      }

    } //end game loop interval check

  return gameState;
} // end updateGame();



function drawFrame(gameState) {

  // Clear canvas between frames and draw background color
  draw.clearRect(0, 0, canvasWidth, canvasHeight);
  draw.fillStyle = '#eee';
  draw.fillRect(playfieldXPos, playfieldYPos, playfieldWidth, playfieldHeight);

  // Draw ALL tetromino squares on each frame
  gameState.squares.forEach( s => {

    // Actual coordinates for drawing: multiple row/col by the blockSize (pixel value)
    let xPos = playfieldXPos + s.col * blockSize;
    let yPos = playfieldYPos + s.row * blockSize;

    draw.fillStyle = s.color;
    draw.fillRect(xPos, yPos, blockSize, blockSize);
  });

  // Display score! (TODO: display as a DOM element? or expand canvas to have an area for the game and separate area for UI)
  draw.fillStyle = "#000";
  draw.font = "25px";
  draw.textAlign = "center";
  draw.fillText("Score: " + gameState.score, canvasWidth/2, canvasHeight - 5);

  // Draw "Next" title:
  draw.fillStyle = "#000";
  draw.font = "25px";
  draw.textAlign = "center";
  draw.fillText("Next:", nextQueueXPos + (nextQueueWidth/2), nextQueueYPos - 30); 



  // Starting coordinates for first tetromino in the queue
  let nextXStart = nextQueueXPos;
  let nextYStart = nextQueueYPos;

  // Draw the next tetrominoes in the queue
  gameState.tetrominoQueue.forEach( tetromino => {

    let xPos;
    let yPos;

    // Get the lowest (left-most) column value; use that to remove the offset, shift back to column 0
    let colOffset = tetromino.squares.map(s => s.col).reduce( (min, cur) => {return Math.min(min, cur)}, cols);
    [0].col;

    tetromino.squares.forEach ( s => {

      // Draw each square based on its coordinates but relative to the queue section
      // and remove offset so the column values start at 0 (unlike in the game, where they spawn in the center column)
      xPos = nextXStart + (s.col - colOffset) * blockSize;
      yPos = nextYStart + s.row * blockSize;

      draw.fillStyle = s.color;
      draw.fillRect(xPos, yPos, blockSize, blockSize);

    }); 

    // Next tetromino will be drawn below the previous one, with a margin of 1 row
    nextYStart = yPos + blockSize * 2;

  });

  // If the game is over, say so! (TODO: replay option)
  if (gameState.gameOver) {
    draw.fillStyle = "red";
    draw.font = "50px";
    draw.textAlign = "center";
    draw.fillText("Game over!\n:(", canvasWidth/2, canvasHeight/2 - 50); 
  }

} // end drawFrame()







// This unique ID lets us turn the animation off later if needed
let animationId;
let nextFrameTimestamp = 0;

// Animation loop with requestAnimationFrame 
function animate(currentTimestamp) {

  // Repeat the loop WITHOUT animating if it hasn't been long enough yet.
  if (currentTimestamp < nextFrameTimestamp) {
    animationId = window.requestAnimationFrame(animate);
    return;
  }
  
  // If it HAS been long enough, update time for the next animation frame
  nextFrameTimestamp = currentTimestamp + (FRAMES_PER_SECOND * 10);
  
  // Clear the whole canvas between each animation frame
  draw.clearRect(0, 0, canvasWidth, canvasHeight);
 
  // Repeat the animation loop forever (until we stop it)
  animationId = window.requestAnimationFrame(animate);
  
  // Update the game state, drawing everything for the current animation frame as needed
  let gameState = updateGame();
  drawFrame(gameState);
}

// Start the animation loop!
animationId = window.requestAnimationFrame(animate);

