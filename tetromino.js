import {getRandomIntInclusive} from "./helperFunctions.js";
import {Square} from "./square.js";


/*
Tetromino:
  - color
  - shape
  - squares: array of square objects
  - getNewTetromino (down, down/left, down/right)
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

    let centerRow;
    let centerCol;

    let newSquares = shape.map( (row, rowIndex) => {
      return row.map ( (square, colIndex) => {
        if (square > 0) { // if this is a 1 or a 2, make a square object
          let newSquare = new Square(topLeftRow + rowIndex, topLeftCol + colIndex, color);
          // If this is a 2, save a reference to this square object as tetromino's centerSquare property
          if (square === 2) {
            centerRow = newSquare.row; 
            centerCol = newSquare.col;
          }
          return newSquare;
        }
      }).filter(elem => elem != undefined);
  
    }).reduce( (accum, elem) => {
       return accum.concat(elem);
    }, []);

    // console.log("squares generated:");
    // console.log([...newSquares]);

    // The centerSquare property is only defined for shapes with a center of rotation, so NOT for the "O" shape
    if (centerRow == undefined || centerCol == undefined) {
      this.centerSquare = undefined;
      // console.log("Setting center square to undefined; this is an O shape!");
    } else {
      this.centerSquare = new Square(centerRow, centerCol, color);
      // console.log("center square: " + this.centerSquare.row + ", " + this.centerSquare.col);
    }


    return newSquares;
  
  }; //end updateSquares


  // ON INSTANTIATION, generate internal squares array:
  this.squares = this.updateSquares(this.shape, this.topLeftRow, this.topLeftCol, this.color);

  
  // Rotate clockwise (for now) -- update shape, no output
  this.rotate = function(clockwise) {
    // For now, just clockwise ... later could use this param as a boolean to indicate direction

    console.log("called rotate");

    // If no center of rotation (for the "O" shape), just return a copy of this tetromino as-is:
    if ( this.centerSquare == undefined) {
      console.log("No center of rotation. Returning this tetromino as-is.");
      return {...this};
    }

    let rotatedSquares = this.squares.map(curSquare => {

      // console.log("center square: " + this.centerSquare.row + ", " + this.centerSquare.col);

      let origRowOffset = curSquare.row - this.centerSquare.row;
      let origColOffset = curSquare.col - this.centerSquare.col;

      // console.log("cur square: " + curSquare.row + ", " + curSquare.col);
      // console.log("offset from center: " + origRowOffset + ", " + origColOffset);

      let newRow = this.centerSquare.row + origColOffset;
      let newCol = this.centerSquare.col - origRowOffset;

      // console.log("rotate: (" + curSquare.row + "," + curSquare.col + ") >> (" + newRow + "," + newCol + ")");

      return new Square(newRow, newCol, this.color);
    });

    // console.log(rotatedSquares);

    return {...this, squares: rotatedSquares};

  };//end rotate()



  // Return new Tetromino object resulting from the next move:
  // *** params: "down", "left", "right", "rotate"
  this.getNewTetromino = function(nextMove) {
    console.log("called getNewTetromino: " + nextMove);

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
      // Return new copy of Tetromino that results from rotation
      return this.rotate();
    }

    // If NOT rotating, update coordinates based on offset:
    let newSquares = this.squares.map( square => {
      return new Square(square.row + rowOffset, square.col + colOffset, square.color);
    });

    let newCenterSquare;
    if (this.centerSquare != undefined) {
      newCenterSquare = new Square(this.centerSquare.row + rowOffset, this.centerSquare.col + colOffset, this.centerSquare.color);
    }

    // Return new copy of Tetromino object with updated properties:
    return {...this, squares: newSquares, centerSquare: newCenterSquare};
   
  }; // end this.getNewTetromino()
  
  
} //end Tetromino constructor

