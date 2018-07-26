import {getRandomIntInclusive} from "./helperFunctions.js";
export function Tetromino (gameGrid, blockSize, p5js, row, col) {
  
  console.log("****** TETROMINO CONSTRUCTOR CALLED *********");
 
  const colors = ["#ffeaa7", "#55efc4", "#74b9ff", "#ff7675"];
 
  // Default to top left corner of canvas -- first tick will move it down row 0 and draw it there!
  if (row == null) {
    this.row = -1;
  } else {
    this.row = row;
  }
  
  if (col == null) {
    this.col = 0;
  } else {
    this.col = col;
  }
  
  console.log("row and col: " + this.row + ", " + this.col);

  
  // Each tetromino has a random color from the (global) colors array defined for the game
  this.color = colors[getRandomIntInclusive(0, colors.length-1)];

  // To see the grid in console:
    //gameGrid.forEach(row => console.log(row));
  
  this.draw = function() {
        
    // Actual coordinates for drawing: multiple row/col by the blockSize (pixel value)
    let xPos = this.col * blockSize;
    let yPos = this.row * blockSize;
   
    p5js.fill(this.color); 
    p5js.rect(xPos, yPos, blockSize, blockSize);
  };
  
  // NOTE: moveDown should be called on every "tick" of game loop,
  // but calling moveLeft or moveRight should instantly redraw... I think?
  // But, leaving that for later.
  this.moveDown = function() {
    console.log("called moveDown");
    
    let prevRow = this.row;
    let prevCol = this.col;

    
    console.log("prev coords: " + prevRow + ", " + prevCol);
    
    // Move down 1 row -- NOTE: checking externally for collisions only BELOW each block.
    // ....should probably fix that!
    this.row++;
    
    // Update position in the game grid (switch off prev position, switch on next position)
    
    // Only switch off previous position if this tetromino is already on the screen
    if (prevRow >= 0) {
      gameGrid[prevRow][prevCol] = 0;
    }

    gameGrid[this.row][this.col] = 1;
    
    console.log("new coords: " + this.row + ", " + this.col);
    
    // To see the grid in console:
    // gameGrid.forEach(row => console.log(row));
    
  };
  
  
  this.moveLeft = function() {

    // If there's an empty square to the left, move it. Otherwise, don't move it!
    if (gameGrid[this.row] && gameGrid[this.row][this.col - 1] === 0) {

      let prevRow = this.row;
      let prevCol = this.col;

      console.log("prev coords: " + prevRow + ", " + prevCol);
      
      this.col--;

      // Only switch off previous position if this tetromino is already on the screen
      if (prevRow >= 0) {
        gameGrid[prevRow][prevCol] = 0;
      }

      // Switch on new position to the side (and shortly after, moveDown will update position down!)
      gameGrid[this.row][this.col] = 1;
  
      console.log("new coords: " + this.row + ", " + this.col);
  
    } else {
      console.log("No room to the left!!!!!");
    }

  };
  

  this.moveRight = function() {

    // If there's an empty square to the right, move it. Otherwise, don't move it!
    if (gameGrid[this.row] && gameGrid[this.row][this.col + 1] === 0) {

      let prevRow = this.row;
      let prevCol = this.col;

      console.log("prev coords: " + prevRow + ", " + prevCol);
      
      this.col++;

      // Only switch off previous position if this tetromino is already on the screen
      if (prevRow >= 0) {
        gameGrid[prevRow][prevCol] = 0;
      }

      // Switch on new position to the side (and shortly after, moveDown will update position down!)
      gameGrid[this.row][this.col] = 1;
  
      console.log("new coords: " + this.row + ", " + this.col);
  
    } else {
      console.log("No room to the right!!!!!");
    }

  };
  


  // Returns true if this tetromino has an empty square below
  // TODO: will need to do this comparison for the lowest square of each of the teromino's columns
  this.hasRoomBelow = function() {
    
    // console.log("checking coords: " + this.row + ", " + this.col);
    
    // If square below this block is empty, return true!
    if (gameGrid[this.row + 1] && gameGrid[this.row + 1][this.col] === 0) {
      return true; 
    }
   
  console.log("*******************");
  console.log("NEXT coords checking against: " + (this.row + 1) + ", " + this.col);
  console.log("*******************");
 
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


