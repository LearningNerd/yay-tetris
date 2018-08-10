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
  const rows = 20, cols = 10;
  const blockSize = 25;

  const topMargin = 5;

  const playfieldXPos = 75;
  const playfieldYPos = topMargin;;

  const playfieldWidth = blockSize * cols;
  const playfieldHeight = blockSize * rows;
  
  const canvasWidth = playfieldWidth * 3;
  const canvasHeight = playfieldHeight + 75;

  const nextQueueXPos = playfieldXPos + playfieldWidth + 0.65*playfieldWidth;
  const nextQueueYPos = topMargin + 50;

  const nextQueueWidth = blockSize * 4;
  const nextQueueHeight = blockSize * rows;


  // Will be updated in game loop 
  let gameOver = false;

 
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
    p5js.frameRate(10);
    
    // For now, run next frame on mouse click!
//    p5js.noLoop();
    
  }; // end p5js.setup


  // FOR TESTING UPDATE WITH REAL TETROMINOES:
  p5js.draw = function() {
    // console.log("called draw()");

    // Clear the canvas on each frame
    p5js.clear();    


    // Draw the Tetris playfield
    p5js.fill("#eee");
    p5js.rect(playfieldXPos, playfieldYPos, playfieldWidth, playfieldHeight);
   
    // Pass along the next move on each frame, if a key is being held down:
      if (p5js.keyIsDown(p5js.LEFT_ARROW)) {
        nextMove = "left";
        console.log("Key pressed: left");
      } else if (p5js.keyIsDown(p5js.RIGHT_ARROW)) {
        nextMove = "right";
        console.log("Key pressed: right");
      } else if (p5js.keyIsDown(p5js.UP_ARROW)) {
        nextMove = "rotate";
        console.log("Key pressed: up");
      } else {
        nextMove = "down";
        console.log("Key pressed: default to move down");
      } 
 


    // RUN GAME LOOP ON EVERY FRAME, pass in nextMove
    // and get back an updated game state
    // Game state: sqaures array, score number, gameOver, and tetrominoQueue array
    let gameState = tetris.gameLoopTick(nextMove);
    gameOver = gameState.gameOver;

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
    //    p5js.fill("#eee");
    //    p5js.rect(nextQueueXPos, nextQueueYPos, nextQueueWidth, nextQueueHeight);

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
 
      tetromino.squares.forEach ( s => {

        // Draw each square based on its coordinates but relative to the queue section
        xPos = nextXStart + s.col * blockSize;
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


  // Draw next frame when pressing any arrow key
  p5js.keyPressed = function() {
    //if (p5js.keyCode === p5js.LEFT_ARROW || p5js.keyCode === p5js.RIGHT_ARROW || p5js.keyCode === p5js.UP_ARROW || p5js.keyCode === p5js.DOWN_ARROW) {

    if (gameOver) {
      p5js.noLoop();      
      return;
    }

/*
      if (p5js.keycode === p5js.left_arrow) {
        nextmove = "left";
        console.log("key pressed: left");
      } else if (p5js.keycode === p5js.right_arrow) {
        nextmove = "right";
        console.log("key pressed: right");
      } else if (p5js.keycode === p5js.up_arrow) {
        nextmove = "rotate";
        console.log("key pressed: up");
      } else {
        nextmove = "down";
        console.log("key pressed: default to move down");
      } 
 
*/


     // p5js.redraw();
//    }
  }; // end p5js.keyPressed


} // end p5jsInstance

