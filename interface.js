import {Tetris} from "./tetris.js"

// Set up p5js to run in instance mode
// -- for now, this solves the issue of p5js not working when my main JS file has type="module"
let p5js = new p5(p5jsInstance);

let keyCodesList = [88, 90, 32, 38, 40, 37, 39];

document.addEventListener("keydown", function(event){
  // Prevent default behavior for keys being used as game controls (except for Ctrl)
  if (keyCodesList.includes(event.which)) {
    event.preventDefault();
  }
});

function p5jsInstance ( p5js) {

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

  // Will be updated in game loop 
  let gameOver = false;

  // To track how many millis have elapsed since previous game loop tick
  let previousTimestamp = 0;
 
  // Create instance of Tetris module
  let tetris = new Tetris(rows, cols);

  // Will update this on key press, pass to gameLoopTick
  let nextMove;

  // Update on every game loop tick
  let gameState;

  // Track when a key was initially pressed down (used for repeating moves after a delay)
  let keyDownTimestamp = 0;

  // Runs once to set up the canvas element and p5js animation stuff
  p5js.setup = function() {

    //console.log("Called p5js setup()");
    
    // Fix for retina displays (bug: clear() only clears top left corner of canvas)
    p5js.pixelDensity(1);
    
    p5js.createCanvas(canvasWidth, canvasHeight);

    // 2 frames per second, easier for testing :)
    p5js.frameRate(frameRate);
    
    // FOR TESTING: don't automatically draw next frames!
    //  p5js.noLoop();
    
  }; // end p5js.setup


  // FOR TESTING UPDATE WITH REAL TETROMINOES:
  p5js.draw = function() {
    //30console.log("called draw()");

    // Clear the canvas on each frame
    p5js.clear();    

    // Draw the Tetris playfield
    p5js.fill("#eee");
    p5js.rect(playfieldXPos, playfieldYPos, playfieldWidth, playfieldHeight);
 

    // console.log("DRAW nextmove: " + nextMove);
    
 
    // Run game loop every X milliseconds (loopIntervalMillis) -- or initiate
    if (p5js.millis() - previousTimestamp >= loopIntervalMillis || p5js.millis() < loopIntervalMillis) {
      previousTimestamp = p5js.millis();


      // Game state: sqaures array, score number, gameOver, and tetrominoQueue array
      gameState = tetris.gameLoopTick(nextMove);
      gameOver = gameState.gameOver;

            // For left/right, repeat on keydown but only after a delay
      if (p5js.millis() - keyDownTimestamp >= keyRepeatDelay && (p5js.keyIsDown(p5js.LEFT_ARROW) || p5js.keyIsDown(p5js.RIGHT_ARROW) ) ) {
        
        // Set left/right or down + left/right as nextMove
        if (p5js.keyIsDown(p5js.DOWN_ARROW) && p5js.keyIsDown(p5js.LEFT_ARROW) ) {
          nextMove = "left-soft-drop";
        } else if (p5js.keyIsDown(p5js.DOWN_ARROW) && p5js.keyIsDown(p5js.RIGHT_ARROW) ) {
          nextMove = "right-soft-drop";
        } else if (p5js.keyIsDown(p5js.LEFT_ARROW)) {
          nextMove = "left";
        } else if (p5js.keyIsDown(p5js.RIGHT_ARROW)) {
          nextMove = "right";
        } 

      // Soft-drop is the only move that repeats immediately on keydown
      } else if (p5js.keyIsDown(p5js.DOWN_ARROW)) {
        nextMove = "soft-drop";

      // For all other moves, don't repeat them on keydown! Reset nextMove after each tick of game loop
      } else { 
        nextMove = undefined;
      }

    } //end game loop interval check

    //console.log(p5js.millis());
    //console.log(p5js.millis() - previousTimestamp);


    // Draw ALL tetromino squares on each frame
    gameState.squares.forEach( s => {
  
      // Actual coordinates for drawing: multiple row/col by the blockSize (pixel value)
      let xPos = playfieldXPos + s.col * blockSize;
      let yPos = playfieldYPos + s.row * blockSize;
   
      p5js.fill(s.color); 
      p5js.rect(xPos, yPos, blockSize, blockSize);
    });

  
    // Display score! (TODO: display as a DOM element? or expand canvas to have an area for the game and separate area for UI)
    p5js.fill(0);
    p5js.textSize(25);
    p5js.textAlign("center");
    p5js.text("Score: " + gameState.score, canvasWidth/2, canvasHeight - 5);


    // Draw background for queue of next tetrominoes
    // p5js.fill("#eee");
    // p5js.rect(nextQueueXPos, nextQueueYPos, nextQueueWidth, nextQueueHeight);

    // Draw "Next" title:
    p5js.fill(0);
    p5js.textSize(25);
    p5js.textAlign("center");
    p5js.text("Next:", nextQueueXPos + (nextQueueWidth/2), nextQueueYPos - 30); 



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
   
        p5js.fill(s.color); 
        p5js.rect(xPos, yPos, blockSize, blockSize);
           
      }); 

      // Next tetromino will be drawn below the previous one, with a margin of 1 row
      nextYStart = yPos + blockSize * 2;

    });


    // If the game is over, say so! (TODO: replay option)
    if (gameOver) {
      p5js.fill("red");
      p5js.textSize(50);
      p5js.textAlign("center");
      p5js.text("Game over!\n:(", canvasWidth/2, canvasHeight/2 - 50); 
      p5js.noLoop();      
    }


  }; // end updated p5js draw()


  p5js.keyPressed = function() {
    if (p5js.keyCode === 32) {
      nextMove = "hard-drop";
      //console.log("Key pressed: space");
    
    } else if (p5js.keyCode === p5js.UP_ARROW || p5js.keyCode === 88) {
      nextMove = "rotate-clockwise";
      //console.log("Key pressed: up or X");
    
    } else if (p5js.keyCode === p5js.CONTROL || p5js.keyCode === 90) {
      nextMove = "rotate-counterclockwise";
      //console.log("Key pressed: Ctrl or Z");
    
    } else if (p5js.keyCode === p5js.LEFT_ARROW) {
      nextMove = "left";
      //console.log("Key pressed: left");

      keyDownTimestamp = p5js.millis();

    } else if (p5js.keyCode === p5js.RIGHT_ARROW) {
      nextMove = "right";
      //console.log("Key pressed: right");
      
      keyDownTimestamp = p5js.millis();

    } else if (p5js.keyCode === p5js.DOWN_ARROW) {
      nextMove = "soft-drop";
      //console.log("Key pressed: down");
      
      keyDownTimestamp = p5js.millis();
    }

    //console.log("keydowntime: " + keyDownTimestamp);

    //console.log("KEYPRESSED nextmove: " + nextMove);

  };


  // FOR TESTING: only draw next frame on key press:
  // p5js.keyPressed = function() {
    // p5js.redraw();
  // };

} // end p5jsInstance

