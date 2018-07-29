import {getRandomIntInclusive} from "./helperFunctions.js";
import {Square} from "./square.js";


/*
Tetromino:
  - color
  - shape
  - squares: array of square objects
  - moveDown, moveLeft, moveRight -- CHANGE: only update row/col

*/


export function Tetromino (row, col, gameGrid, blockSize) {

  console.log("****** TETROMINO CONSTRUCTOR CALLED *********");

  console.log(row + ", " + col);
 
  const colors = ["#ffeaa7", "#55efc4", "#74b9ff", "#ff7675"];
 
  const shapes = {
    O: [
      [1,1],
      [1,1]
    ],
  
    I: [[1,1,1,1]],
  
    T: [
      [1,0],
      [1,1],
      [1,0]
    ],
  
    L: [   // NOTE: shapeJ is the reflection of shapeL
      [1,0],
      [1,0],
      [1,1]
    ],
  
    S: [   // NOTE: shapeZ is the reflection of shapeS
      [1,0],
      [1,1],
      [0,1]
    ]
  };


  // ******TODO: randomize which shape.
  // For now, hard-coded to test them:
  let shapeType = "S";

  this.shape = shapes[shapeType];

  // Each tetromino has a random color from the (global) colors array defined for the game
  this.color = colors[getRandomIntInclusive(0, colors.length-1)];

  // ****TODO: set default row/col starting pos (middle of canvas?)
  this.topLeftRow = row;
  this.topLeftCol = col;

  console.log(this.topLeftRow + ", " + this.topLeftCol);

  // Based on one of the shapes above, generate a flat array of Square objects with coordinates relative to topLeftRow, topLeftCol for top-left of Tetromino
  this.squares = this.shape.map( (row, rowIndex) => {
    return row.map ( (square, colIndex) => {
      if (square) { // if this is a 1
        return new Square(this.topLeftRow + rowIndex, this.topLeftCol + colIndex, this.color);
      }
    }).filter(elem => elem != undefined);

  }).reduce( (accum, elem) => {
     return accum.concat(elem);
  }, []);



  // To see the grid in console:
  this.print = function() {
   let stringGrid = this.shape.reduce( (str, row) => {
      return str += row.join(" ") + "\n"
    }, "\n");
    console.log(stringGrid);
  };
  

    // To see the grid in console:
    //gameGrid.forEach(row => console.log(row));
 


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


