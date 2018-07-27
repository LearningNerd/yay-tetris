// import {p5} from "./node_modules/p5/lib/p5.min.js"
import {Tetromino} from "./tetromino.js"

console.log('hi');

// Params for drawing:

// Size of squares in the game, in pixels
const blockSize = 25;
const rows = 8, cols = 4;

const canvasWidth = blockSize * cols, canvasHeight = blockSize * rows;



// ..... data, blocks?
let tetrominoes = [];
let currentTetromino;

// Generate 2D array based on rows / cols, each element populated with 0s
let gameGrid = new Array(rows).fill(null).map(row => new Array(cols).fill(0));

console.log("****** GRID CREATED *********");
// To see the grid in console:
// gameGrid.forEach(row => console.log(row));



// Create a new tetromino and add to squares array
function createTetromino (row, col) {
  
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
function getCompletedRowIndexes (gameGrid) {

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
function clearRows (completedRows, gameGrid) {

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
function updateTetrominoes(tetrominoes, completedRows) {

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
function endGame() {
  console.log("Game over!");
  
  let x = document.body.innerHTML;  
  document.body.innerHTML = x + " <h1>Game over!</h1>"; 

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP FOR P5JS DRAWING:
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Set up p5js to run in instance mode
// -- for now, this solves the issue of p5js not working when my main JS file has type="module"
let p5js = new p5(p5jsInstance);

function p5jsInstance ( p5js) {

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

     /* 
    for (x of tetrominoes) {
   
      x.draw();
  
    } // end for/of loop
    */

  }; // end p5js.draw




  // Draw next frame when pressing any arrow key
  p5js.keyPressed = function() {
    if (p5js.keyCode === p5js.LEFT_ARROW || p5js.keyCode === p5js.RIGHT_ARROW || p5js.keyCode === p5js.UP_ARROW || p5js.keyCode === p5js.DOWN_ARROW) {
      console.log("Key pressed!");
      p5js.redraw();
    }
  }; // end p5js.keyPressed


  


} // end p5jsInstance

