// import {p5} from "./node_modules/p5/lib/p5.min.js"
import {Tetromino} from "./tetromino.js"

/*

Game:
  - gameGrid
  - squares -- array of all squares on the board 
    --- OR just an array of squares??
  - currentTetromino
  - nextMove (left, right, or only down)

  - createTetromino -- new tetromino, add squares to list of squares, update the current tetromino

  - getCompletedRowIndexes -- input: gameGrid; output: array of row indexes to delete

  - clearRows -- gameGrid, completedRowIndexes; output: new gameGrid
    -- delete rows in gameGrid, add empty rows at the top, effectively shifting down all remaining rows. ***will need to change this!

  - updateTetrominoes -- CHANGE: update squares array, remove those from completedRowIndexes; and shift down square.row for remaining squares. ***will need to change this too! 

  - hasRoomForNextMove -- input: array of current tetromino's squares, gameGrid; output: true OR false (false if the move would cause a collision)
  
  - updateGameGrid -- input: array of current tetromino's squares (after calling hasRoom, updateTetrominoes, etcetc, gameGrid; output: new gameGrid 

  - endGame -- display message

  - gameLoopTick -- run once every animation frame in p5js, output array of squares to be drawn -- MOVE ALL GAME LOGIC TO HERE!

  - updateNextMove -- input: left/right. update this.NextMove, to be used by other function calls ... ??
 
*/

export function Tetris () {

  // Size of the game:
  const rows = 8, cols = 4;
  let squares = [];
  let currentTetromino;
  
  // Generate 2D array based on rows / cols, each element populated with 0s
  let gameGrid = new Array(rows).fill(null).map(row => new Array(cols).fill(0));
  
  console.log("****** GRID CREATED *********");
  // To see the grid in console:
  // gameGrid.forEach(row => console.log(row));
 

 
  // To see the grid in console:
  this.print = function() {
   let stringGrid = gameGrid.reduce( (str, row) => {
      return str += row.join(" ") + "\n";
    }, "\n");
    console.log(stringGrid);
  };
  

  // Create a new tetromino and add to squares array
  this.createTetromino  = function (row, col) {
    
    console.log(" *** CREATING TETROMINO ***");
    console.log(row + ", " + col);
    
    // Create and merge new squares with squares array
    let tetromino = new Tetromino(row, col, gameGrid, 25);
  
    console.log(tetromino.squares);
  
    squares = squares.concat(tetromino.squares);
  
    console.log(squares);
  
  
    // Update currently active tetromino (global var for now) 
    currentTetromino = tetromino;
  }
  
  
  // PURE FUNCTION -- given a gameGrid, return array of row indexes that have been completed
  // TO REFACTOR: this should probably belong to the game or gameGrid object
  this.getCompletedRowIndexes  = function (gameGrid) {
  
    console.log("called getCompletedRowIndexes");
  
    return gameGrid.map ( (row, index) => {
      let rowSum = row.reduce( (square,sum) => sum + square);
       
      if (rowSum === row.length) {
        return index;
      }
    }).filter(row => row != undefined); 
  
  }
  
  // Return a new gameGrid with all completed rows cleared and new empty rows added to the top
  // Pure function :)
  this.clearRows  = function (completedRows, gameGrid) {
  
    // ALSO TODO: INCREASE SCORE FOR EACH COMPLETED ROW
  
    console.log("called clearRows");
  
    let newGameGrid = Array.from(gameGrid);
  
    completedRows.forEach( rowIndex => {
      newGameGrid.splice(rowIndex, 1);
      // NOTE: shouldn't be using global cols var here:
      newGameGrid.unshift( new Array(4).fill(0) );
    });
  
    return newGameGrid;
  }
  
  // Remove and shift down tetrominoes as needed after rows have been completed.
  // Pure function :)
  //    TODO: this WILL NOT work once tetrominoes come in multiple shapes, 
  //          because not all rows will need to be shifted down; only those ABOVE the removed rows!
  this.updateTetrominoes = function (tetrominoes, completedRows) {
  
    console.log("called updateTetrominoes");
    console.log("initial tetrominoes:");
    console.log(tetrominoes);
  
    // Filter tetrominoes array to remove any that belonged to any of completedRows,
    tetrominoes = tetrominoes.filter(tetromino => completedRows.indexOf(tetromino.row) === -1 );
  
    console.log("Tetrominoes AFTER filtering in updateTetrominoes:");
    console.log(tetrominoes); 
  
    // And shift down all the remaining tetrominoes 
    // and RETURN this new array as output
    return tetrominoes.map(tetromino => {
      if (tetromino.row === -1) {
        return tetromino;
      } else {
        return {...tetromino, row: tetromino.row + 1};
      }
    });
  }
  
  // Later: a nicer "game over" screen
  this.endGame = function () {
    console.log("Game over!");
    
    let x = document.body.innerHTML;  
    document.body.innerHTML = x + " <h1>Game over!</h1>"; 
  
  };
  
}; // end Tetris() constructor



////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP FOR P5JS DRAWING:
////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  
  // Size of squares in the game, in pixels
  const blockSize = 25;
  
  const canvasWidth = blockSize * cols, canvasHeight = blockSize * rows;
  


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
    
    // INITIALIZE THE GAME -- create the first tetromino
    createTetromino(0,1);
    
  }; // end p5js.setup



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

  // FOR TESTING UPDATE WITH REAL TETROMINOES:
  p5js.draw = function() {

    // Clear the canvas on each frame, with a background color
    p5js.background("lightgrey");
    
    console.log("squares array:");
    console.log(squares);
   
    // ********** TO DO: CALL gameTickLoop,
    // which exports array of squares; then draw them as below:


    // Draw ALL tetromino squares on each frame
    squares.forEach( s => {
      // Use drawing params to draw each square
  console.log(s); 
  
    // Actual coordinates for drawing: multiple row/col by the blockSize (pixel value)
    let xPos = s.col * blockSize;
    let yPos = s.row * blockSize;
   
    p5js.fill(s.color); 
    p5js.rect(xPos, yPos, blockSize, blockSize);
  });
  



  }; // end updated p5js draw()





  // Draw next frame when pressing any arrow key
  p5js.keyPressed = function() {
    if (p5js.keyCode === p5js.LEFT_ARROW || p5js.keyCode === p5js.RIGHT_ARROW || p5js.keyCode === p5js.UP_ARROW || p5js.keyCode === p5js.DOWN_ARROW) {
      console.log("Key pressed!");
      p5js.redraw();
    }
  }; // end p5js.keyPressed


  


} // end p5jsInstance

