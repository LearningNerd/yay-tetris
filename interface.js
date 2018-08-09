import {Tetris} from "./tetris.js"

/*

User Interface (p5js drawing):
  - setup
    -- drawing params initialized here
    -- create game object

  - draw
    -- detect which key is pressed, call game.moveLeft/Right 
    -- run gameLoopTick, get array of  squares output. convert row/col/color to drawing rectangles at the proper coordinates 
 
  - keypressed
    -- for now: draw next frame

*/


// Set up p5js to run in instance mode
// -- for now, this solves the issue of p5js not working when my main JS file has type="module"
let p5js = new p5(p5jsInstance);

function p5jsInstance ( p5js) {

  // Params for drawing:
  const rows = 12, cols = 6;
  const blockSize = 25;
  const canvasWidth = blockSize * cols;
  const canvasHeight = blockSize * rows;
  
  // Create instance of Tetris module
  let tetris = new Tetris(rows, cols);

  // Will update this on key press, pass to gameLoopTick
  let nextMove;

  // Runs once to set up the canvas element and p5js animation stuff
  p5js.setup = function() {

    console.log("Called p5js setup()");
    
    // Fix for retina displays (bug: clear() only clears top left corner of canvas)
    p5js.pixelDensity(1);
    
    p5js.createCanvas(canvasWidth, canvasHeight);

    // 2 frames per second, easier for testing :)
    p5js.frameRate(2);
    
    // For now, run next frame on mouse click!
    p5js.noLoop();
    
  }; // end p5js.setup


  // FOR TESTING UPDATE WITH REAL TETROMINOES:
  p5js.draw = function() {
    // console.log("called draw()");
    
    // Clear the canvas on each frame, with a background color
    p5js.background("lightgrey");


    // TODO: Pass "left" or "right" to gameLoopTick
    // based on key presses

    // RUN GAME LOOP ON EVERY FRAME, pass in nextMove
    // and get back an updated game state
    // Game state: sqaures array, score number, gameOver
    let gameState = tetris.gameLoopTick(nextMove);


    // Draw ALL tetromino squares on each frame
    gameState.squares.forEach( s => {
  
      // Actual coordinates for drawing: multiple row/col by the blockSize (pixel value)
      let xPos = s.col * blockSize;
      let yPos = s.row * blockSize;
   
      p5js.fill(s.color); 
      p5js.rect(xPos, yPos, blockSize, blockSize);
    });

  
    // Display score! (TODO: display as a DOM element? or expand canvas to have an area for the game and separate area for UI)
    p5js.fill(0);
    p5js.textSize(20);
    p5js.textAlign("center");
    p5js.text("Score: " + gameState.score, canvasWidth/2, 0 + 20); 


    // If the game is over, say so! (TODO: replay option)
    if (gameState.gameOver) {
      p5js.fill("red");
      p5js.textSize(25);
      p5js.textAlign("center");
      p5js.text("Game over!\n:(", canvasWidth/2, canvasHeight/2); 
    }



  }; // end updated p5js draw()


  // Draw next frame when pressing any arrow key
  p5js.keyPressed = function() {
    if (p5js.keyCode === p5js.LEFT_ARROW || p5js.keyCode === p5js.RIGHT_ARROW || p5js.keyCode === p5js.UP_ARROW || p5js.keyCode === p5js.DOWN_ARROW) {

      if (p5js.keyCode === p5js.LEFT_ARROW) {
        nextMove = "left";
        console.log("Key pressed: left");
      } else if (p5js.keyCode === p5js.RIGHT_ARROW) {
        nextMove = "right";
        console.log("Key pressed: right");
      } else if (p5js.keyCode === p5js.UP_ARROW) {
        nextMove = "rotate";
        console.log("Key pressed: up");
      } else {
        nextMove = "down";
        console.log("Key pressed: default to move down");
      } 
 

      p5js.redraw();
    }
  }; // end p5js.keyPressed


} // end p5jsInstance

