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
    [[1,2,1,1]],
  
    // "T" shape:
    [
      [1,0],
      [2,1],
      [1,0]
    ],

    // "L" shape (reflection of "J" shape)  
    [  
      [1,0],
      [2,0],
      [1,1]
    ],
 
    // "S" shape (reflection of "Z" shape) 
    [   // NOTE: shapeZ is the reflection of shapeS
      [1,0],
      [2,1],
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
  // and set centerSquare as its own property of this tetromino!
  this.updateSquares = function(shape, topLeftRow, topLeftCol, color) {

    return shape.map( (row, rowIndex) => {
      return row.map ( (square, colIndex) => {
        if (square > 0) { // if this is a 1 or a 2, make a square object
          let newSquare = new Square(topLeftRow + rowIndex, topLeftCol + colIndex, color);
          // If this is a 2, save a reference to this square object as tetromino's centerSquare property
          if (square === 2) { this.centerSquare = newSquare; }
          return newSquare;
        }
      }).filter(elem => elem != undefined);
  
    }).reduce( (accum, elem) => {
       return accum.concat(elem);
    }, []);

    console.log("center square: " + this.centerSquare.row + ", " + this.centerSquare.col);
  
  }; //end updateSquares


  // ON INSTANTIATION, generate internal squares array:
  this.squares = this.updateSquares(this.shape, this.topLeftRow, this.topLeftCol, this.color);

  
  // Rotate clockwise (for now) -- update shape, no output
  this.rotate = function(clockwise) {
    // For now, just clockwise ... later could use this param as a boolean to indicate direction

    console.log("called rotate");

    let rotatedSquares = this.squares.map(curSquare => {

      console.log("center square: " + this.centerSquare.row + ", " + this.centerSquare.col);

      let origRowOffset = curSquare.row - this.centerSquare.row;
      let origColOffset = curSquare.col - this.centerSquare.col;

      console.log("cur square: " + curSquare.row + ", " + curSquare.col);
      console.log("offset from center: " + origRowOffset + ", " + origColOffset);

      let newRow = this.centerSquare.row + origColOffset;
      let newCol = this.centerSquare.col - origRowOffset;

      console.log("rotate: (" + curSquare.row + "," + curSquare.col + ") >> (" + newRow + "," + newCol + ")");

      return new Square(newRow, newCol, this.color);
    });

    console.log(rotatedSquares);

    this.squares = rotatedSquares;

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

    // TODO: don't need this anymore.... don't need to store this as a property anymore at all!
    this.topLeftRow = this.topLeftRow + rowOffset;
    this.topLeftCol = this.topLeftCol + colOffset;
 
    // NOTE: mutating this object; TODO: generate a new square object here instead 
    this.centerSquare.row = this.centerSquare.row + rowOffset;
    this.centerSquare.col = this.centerSquare.col + colOffset;
  

    // return this tetromino object (with updated squares array):
    return this;
   
  }; // end this.move()
  
  
} //end Tetromino constructor

