import {getRandomIntInclusive} from "./helperFunctions.js";
import {Square} from "./square.js";


/*
Tetromino:
  - color
  - shape
  - squares: array of square objects
  - move (down, down/left, down/right)
*/


export function Tetromino (row, col) {

  console.log("****** TETROMINO CONSTRUCTOR CALLED *********");

  const colors = ["#ffeaa7", "#55efc4", "#74b9ff", "#ff7675"];
 
  const shapes = [
    // "O" shape:
    [
      [1,1],
      [1,1]
    ],
  
    // "I" shape:
    [[1,1,1,1]],
  
    // "T" shape:
    [
      [1,0],
      [1,1],
      [1,0]
    ],

    // "L" shape (reflection of "J" shape)  
    [  
      [1,0],
      [1,0],
      [1,1]
    ],
 
    // "S" shape (reflection of "Z" shape) 
    [   // NOTE: shapeZ is the reflection of shapeS
      [1,0],
      [1,1],
      [0,1]
    ]
  ];


  // ****TODO: set default row/col starting pos (middle of canvas?)
  this.topLeftRow = row;
  this.topLeftCol = col;

  // console.log(this.topLeftRow + ", " + this.topLeftCol);

  // Assign a random shape to each new tetromino
  this.shape = shapes[getRandomIntInclusive(0, shapes.length-1)];

  // console.log(this.shape);

  // Each new tetromino has a random color
  this.color = colors[getRandomIntInclusive(0, colors.length-1)];

  // Output flat array of square objects with coordinates based on shape (2d array) and top left coords
  this.updateSquares = function(shape, topLeftRow, topLeftCol, color) {

    return shape.map( (row, rowIndex) => {
      return row.map ( (square, colIndex) => {
        if (square) { // if this is a 1
          return new Square(topLeftRow + rowIndex, topLeftCol + colIndex, color);
        }
      }).filter(elem => elem != undefined);
  
    }).reduce( (accum, elem) => {
       return accum.concat(elem);
    }, []);
  
  }; //end updateSquares


  // ON INSTANTIATION, generate internal squares array:
  this.squares = this.updateSquares(this.shape, this.topLeftRow, this.topLeftCol, this.color);

  
  // Rotate clockwise (for now) -- update shape, no output
  this.rotate = function(clockwise) {
    // For now, just clockwise ... later could use this param as a boolean to indicate direction

    let prevRowLength = this.shape.length;
    let prevColLength = this.shape[0].length;

    let newRowLength = prevColLength;
    let newColLength = prevRowLength;

    let newShape = [];

    // For each row in the new shape,
    for (let newRowIndex = 0; newRowIndex < newRowLength; newRowIndex++) {

      // Create a nested array for each row
      newShape.push([]);

      // For each column in the new shape / each row in the previous shape:
      for (let newColIndex = 0, prevRowIndex = prevRowLength - 1; newColIndex < newColLength; newColIndex++, prevRowIndex--) {
  
        // Copy the value, following clockwise rotation
        // -- last row becomes first column, first row becomes last column
        newShape[newRowIndex][newColIndex] = this.shape[prevRowIndex][newRowIndex];
      }
    }

    console.log("rotated shape:");
    console.log(newShape);

    console.log("topleftrow: " + this.topLeftRow + ", topleftcol: " + this.topLeftCol);
    console.log("squares before rotate:");
    console.log([...this.squares]);


    // Update this tetromino's shape
    this.shape = newShape;

    // Regenerate squares array from new shape, maintaining top left coordinate (may need to change this!!!!!)
    this.squares = this.updateSquares(this.shape, this.topLeftRow, this.topLeftCol, this.color);

    console.log("squares after rotate:");
    console.log(this.squares);

    // TODO: figure out exactly how the shape gets rotated ... keep the center square at the same base coord?
    // ....and how does this interact with collision detection?

  };//end rotate()



  // *** params: "down", "left", "right"
  this.move = function(nextMove) {
    console.log("called move: " + nextMove);

    // Set offset values based on nextMove
    let rowOffset = 1; // default for down
    let colOffset = 0; // default for down

    if (nextMove === "left") {
      rowOffset = 0;
      colOffset = -1;
    } else if (nextMove === "right") {
      rowOffset = 0;
      colOffset = 1;
    } else if (nextMove === "rotate") {
      this.rotate();
    }
 
    // MOVE THE SQUARES:
    this.squares = this.squares.map( square => {
      return {row: square.row + rowOffset, col: square.col + colOffset, color: square.color};
    });

    this.topLeftRow = this.topLeftRow + rowOffset;
    this.topLeftCol = this.topLeftCol + colOffset;
  
    // return this tetromino object (with updated squares array):
    return this;
   
  }; // end this.move()
  
  
} //end Tetromino constructor

