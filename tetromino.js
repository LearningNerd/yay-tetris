import {getRandomIntInclusive} from "./helperFunctions.js";
import {Square} from "./square.js";


/*
Tetromino:
  - color
  - shape
  - squares: array of square objects
  - moveDown, moveLeft, moveRight -- CHANGE: only update row/col

*/


export function Tetromino (row, col) {

  console.log("****** TETROMINO CONSTRUCTOR CALLED *********");

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


  // ****TODO: set default row/col starting pos (middle of canvas?)
  this.topLeftRow = row;
  this.topLeftCol = col;

  console.log(this.topLeftRow + ", " + this.topLeftCol);


  // ******TODO: randomize which shape.
  // For now, hard-coded to test them:
  let shapeType = "S";

  this.shape = shapes[shapeType];


  // Each tetromino has a random color from the (global) colors array defined for the game
  this.color = colors[getRandomIntInclusive(0, colors.length-1)];


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


   
  // NOTE: moveDown should be called on every "tick" of game loop,
  // but calling moveLeft or moveRight should instantly redraw... I think?
  // But, leaving that for later.
  this.moveDown = function() {
    console.log("called moveDown");
    
    let prevRow = this.row;
    let prevCol = this.col;

    
    console.log("prev coords: " + prevRow + ", " + prevCol);
    
    this.row++;
    
    console.log("new coords: " + this.row + ", " + this.col);
    
  };
  
  
  this.moveLeft = function() {
  
  };
  

  this.moveRight = function() {

  };
  
  
} //end Tetromino constructor

