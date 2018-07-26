// import {p5} from "./node_modules/p5/lib/p5.min.js"
import {Tetromino} from "./tetromino.js"

console.log('hi');

// Params for drawing:

// Size of squares in the game, in pixels
const blockSize = 25;
const rows = 8, cols = 4;
const colors = ["#ffeaa7", "#55efc4", "#74b9ff", "#ff7675"];

const canvasWidth = blockSize * cols, canvasHeight = blockSize * rows;



// ..... data, blocks?
let tetrominoes = [];
let currentTetromino;
let blockNum = -1;      // probably should use a game object so this isn't global
                        // first block will be block # 0

// Generate 2D array based on rows / cols, each element populated with 0s
let gameGrid = new Array(rows).fill(null).map(row => new Array(cols).fill(0));

console.log("****** GRID CREATED *********");
// To see the grid in console:
// gameGrid.forEach(row => console.log(row));



// Create a new tetromino and add to tetrominoes array
function createTetromino () {
  // FOR TESTING: increase counter to identify each block
  blockNum++;
  
  console.log(" *** CREATING TETROMINO #" + blockNum);
 
  // Create and push to array of tetrominoes 
  let tetromino = new Tetromino();
  tetrominoes.push(tetromino);

  // Update currently active tetromino (global var for now) 
  currentTetromino = tetrominoes[tetrominoes.length - 1]; 
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
function updateTetrominoes(completedRows) {

      // Filter tetrominoes array to remove any that belonged to any of completedRows,
      // and shift down all the tetrominoes above 
      tetrominoes = tetrominoes.filter(tetromino => completedRows.indexOf(tetromino.row) === -1 );
  
      tetrominoes = tetrominoes.map(tetromino => {
        if (tetromino.row === -1) {
          return tetromino;
        } else {
          return {...tetromino, row: tetromino.row + 1};
        }
      });

      console.log("filtered tetrominoes:");
      console.log(tetrominoes);
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

function setup() {

  console.log("Called p5js setup()");
  
  // Fix for retina displays (bug: clear() only clears top left corner of canvas)
  pixelDensity(1);
  
  createCanvas(canvasWidth, canvasHeight);

  // 2 frames per second, easier for testing :)
  frameRate(2);
  
  // For now, run next frame on mouse click!
  noLoop();
  
  // INITIALIZE THE GAME -- create the first tetromino
  createTetromino();
  
}



// Animation loop / game loop:
function draw() {

  console.log("Called p5js setup()");
 
  // Update coords based on which keys are currently being pressed
  if (keyIsDown(LEFT_ARROW)) {
   currentTetromino.moveLeft();
   console.log("---- LEFT");
  } else if (keyIsDown(RIGHT_ARROW)) {
   currentTetromino.moveRight();
   console.log("---- RIGHT");
  }

  // Clear the canvas on each frame, with a background color
  background("lightgrey");
  
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
    if (completedRows) {
      console.log("completedRows");
      console.log(completedRows)

      gameGrid = clearRows(completedRows, gameGrid); 
      tetrominoes = updateTetrominoes(completedRows);
    }
    
    // Drop the next tetromino
    createTetromino();
  }

  // Draw ALL tetrominoes on each frame, AFTER updating position 
  for (tetromino of tetrominoes) {
  //  console.log("block num #" + tetromino.blockNum + " -- initial y: " + tetromino.y);
 
    tetromino.draw();

  } // end for/of loop



} // end draw()


// Draw next frame when pressing any arrow key
function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    console.log("Key pressed!");
    redraw();
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS:
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get a random integer between two values, inclusive -- via MDN
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}



