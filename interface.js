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
  const rows = 8, cols = 4;  
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
    // and get array of squares to be drawn:
    let squares = tetris.gameLoopTick(nextMove);

    // Draw ALL tetromino squares on each frame
    squares.forEach( s => {
  
      // Actual coordinates for drawing: multiple row/col by the blockSize (pixel value)
      let xPos = s.col * blockSize;
      let yPos = s.row * blockSize;
   
      p5js.fill(s.color); 
      p5js.rect(xPos, yPos, blockSize, blockSize);
    });
  

  }; // end updated p5js draw()



/*
*********************** START OF PREV DRAW FUNCTION *********************

  // Animation loop, runs once per frame
  p5js.draw = function() {

    console.log("Called p5js draw()");
   
    // Update coords based on which keys are currently being pressed
    if (p5js.keyIsDown(p5js.LEFT_ARROW)) {
     currentTetromino.moveLeft();
     console.log("---- LEFT");
    } else if (p5js.keyIsDown(p5js.RIGHT_ARROW)) {
     currentTetromino.moveRight();
     console.log("---- RIGHT");
    }
  
    // Clear the canvas on each frame, with a background color
    p5js.background("lightgrey");
    
    console.log("Tetrominoes array:");
    console.log(tetrominoes);
   
    console.log("*******************");
    console.log("cur coords: " + currentTetromino.row + ", " + currentTetromino.col);
    console.log("*******************");
  
  
    // If there's room below this tetromino, let it keep falling
    if (currentTetromino.hasRoomBelow() ) {
      console.log("has room below!");
      currentTetromino.moveDown();  // update position for the next tick
   
    // Otherwise, if the newest tetromino has no room and it's sitting above the screen, game over!
    } else if (currentTetromino.row === -1) {
  
      endGame();
    
    // Otherwise if the current tetromino has landed
    } else {
  
      // Check for any completed rows
      let completedRows = getCompletedRowIndexes(gameGrid);
  
      // If there are any, update the game grid and tetrominoes array to remove cleared rows and move down upper rows
      if (completedRows.length !== 0) {
        console.log("completedRows");
        console.log(completedRows)
  
        gameGrid = clearRows(completedRows, gameGrid); 
        tetrominoes = updateTetrominoes(tetrominoes, completedRows);
      }
      
      // Drop the next tetromino
      createTetromino(p5js);

    } // end of if/elseif/else 

    // Draw ALL tetrominoes on each frame, AFTER updating position 
    tetrominoes.forEach( t => t.draw() );

    for (x of tetrominoes) {
   
      x.draw();
  
    } // end for/of loop

  }; // end p5js.draw

*********************** END OF PREV DRAW FUNCTION *********************
*/


  // Draw next frame when pressing any arrow key
  p5js.keyPressed = function() {
    if (p5js.keyCode === p5js.LEFT_ARROW || p5js.keyCode === p5js.RIGHT_ARROW || p5js.keyCode === p5js.UP_ARROW || p5js.keyCode === p5js.DOWN_ARROW) {

      if (p5js.keyCode === p5js.LEFT_ARROW) {
        nextMove = "left";
        console.log("Key pressed: left");
      } else if (p5js.keyCode === p5js.RIGHT_ARROW) {
        nextMove = "right";
        console.log("Key pressed: right");
      } else {
        nextMove = "down";
        console.log("Key pressed: default to move down");
      } 
 

      p5js.redraw();
    }
  }; // end p5js.keyPressed


} // end p5jsInstance

