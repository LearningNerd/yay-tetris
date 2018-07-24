console.log('hi');

// Params for drawing:

// Size of squares in the game, in pixels
const blockSize = 25;
const rows = 4, cols = 2;

const canvasWidth = blockSize * cols, canvasHeight = blockSize * rows;



// ..... data, blocks?
let tetrominoes = [];
let blockNum = -1;      // probably should use a game object so this isn't global
                        // first block will be block # 0

// Generate 2D array based on rows / cols, each element populated with 0s
let gameGrid = new Array(rows).fill(null).map(row => new Array(cols).fill(0));

console.log("****** GRID CREATED *********");
// To see the grid in console:
// gameGrid.forEach(row => console.log(row));



// Tetromino constructor
function Tetromino (row, col) {
  
  console.log("****** TETROMINO CONSTRUCTOR CALLED *********");
  
  // Default to top left corner of canvas
  if (row == null) {
    this.row = 0;
  } else {
    this.row = row;
  }
  
  if (col == null) {
    this.col = 0;
  } else {
    this.col = col;
  }
  
  console.log("row and col: " + this.row + ", " + this.col);
  
  // TODO: draw each block of this tetromino with randomized color
  this.color = "yellow";
 
  
  // Add EACH BLOCK to the gameGrid:
  gameGrid[this.row][this.col] = 1;
  
  
      // To see the grid in console:
    //gameGrid.forEach(row => console.log(row));
  
  // Just for testing:
  this.blockNum = blockNum + 1;
  
  this.draw = function() {
        
    // Actual coordinates for drawing: multiple row/col by the blockSize (pixel value)
    let xPos = this.col * blockSize;
    let yPos = this.row * blockSize;
    
    rect(xPos, yPos, blockSize, blockSize);
  };
  
  
  this.moveDown = function() {
    console.log("called moveDown");
    
    let prevX = this.row;
    let prevY = this.col;

    
    console.log("prev coords: " + prevX + ", " + prevY);
    
    // Move down 1 row
    this.row++;
    
    // Update position in the game grid (switch off prev position, switch on next position)
    gameGrid[prevX][prevY] = 0;
    gameGrid[this.row][this.col] = 1;
    
    console.log("new coords: " + this.row + ", " + this.col);
    
    // To see the grid in console:
    // gameGrid.forEach(row => console.log(row));
    
  };
  
  
  this.moveLeft = function() {
    this.col--;
  };
  
  this.moveRight = function() {
    this.col++;
  };
  
  // Returns true if this tetromino has an empty square below
  // TODO: will need to do this comparison for this Tetromino's block with lowest y coordinate
  this.hasRoomBelow = function() {
    
    // console.log("checking coords: " + this.row + ", " + this.col);
    
    // If square below this block is empty, return true!
    if (gameGrid[this.row + 1] && gameGrid[this.row + 1][this.col] === 0) {
      return true; 
    }
    
    console.log("NO ROOM below. The block has landed.");
    
    return false;
  };
  
  
  
//   // Return true if this block is falling (it's NOT at the bottom of the canvas)
//   this.isFalling = function () {
  
//     let yPos = this.col * blockSize;
    
//     // If it's at the bottom, return false!
//     if (yPos >= canvasHeight - blockSize) {
//       return false;
//     }

//     return true;

//     /*     0  ____  If a single block is at the bottom of canvas:
//            1 |    |   canvasHeight: 3
//      y  >> 2 |_   |   blockSize: 1
//            3 |_|__|     when y coordinate is canvasHeight - blockSize, it's at the bottom!
//                         3 - 1 = 2
//     */
//   }
  
} //end Tetromino constructor


// Create a new tetromino and add to tetrominoes array
function createTetromino () {
  // FOR TESTING: increase counter to identify each block
  blockNum++;
  
  console.log(" *** CREATING TETROMINO #" + blockNum);
  
  let tetromino = new Tetromino();
  tetrominoes.push(tetromino);
  
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP FOR P5JS DRAWING:
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setup() {
  
  // Fix for retina displays (bug: clear() only clears top left corner of canvas)
  pixelDensity(1);
  
  createCanvas(canvasWidth, canvasHeight);

  // 2 frames per second, easier for testing :)
  // frameRate(2);
  
  // For now, run next frame on mouse click!
  noLoop();
  
  // INITIALIZE THE GAME -- create the first tetromino
  createTetromino();
  
}



// Animation loop / game loop:
function draw() {

  // Clear the canvas on each frame, with a background color
  background("pink");
  
  console.log("Tetrominoes array:");
  console.log(tetrominoes);
  
  let t = tetrominoes[0];
  
  // Draw ALL tetrominoes on each frame. NOTE: drawing first, so on first frame it starts at y=0
  for (tetromino of tetrominoes) {
  //  console.log("block num #" + tetromino.blockNum + " -- initial y: " + tetromino.y);
 
    tetromino.draw();

  } // end for/of loop

  let currentTetromino = tetrominoes[tetrominoes.length - 1]; 

  if (currentTetromino.hasRoomBelow() ) {
    console.log("has room below!");
    currentTetromino.moveDown();  // update position for the next tick
 
  // Otherwise if the current tetromino has landed, drop the next one!
  } else {
  
    console.log("Current tetromino has landed");
    createTetromino();
  }


  
} // end draw()



// For now, run next frame on mouse click!
function mousePressed() {
  redraw();
}

