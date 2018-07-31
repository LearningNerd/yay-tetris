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

  console.log(this.topLeftRow + ", " + this.topLeftCol);

  // Assign a random shape to each new tetromino
  this.shape = shapes[getRandomIntInclusive(0, shapes.length-1)];

console.log(this.shape);

  // Each new tetromino has a random color
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


  // *** params: "down", "downleft", "downright" for now
  this.move = function() {
    console.log("called move");

    // Get top left coordinate    
    let prevRow = this.squares[0].row;
    let prevCol = this.squares[0].col;

    
    console.log("prev coords: " + prevRow + ", " + prevCol);
    console.log(this.squares);   
 
    // MOVE DOWN:

  this.squares = this.squares.map( square => {
      return {row: square.row + 1, col: square.col, color: square.color};
  });

  console.log("new:");
  console.log(this.squares); 

  // return new squares array:
  return this.squares;   
 
  }; // end this.move()
  
  
  this.moveLeft = function() {
  
  };
  

  this.moveRight = function() {

  };
  
  
} //end Tetromino constructor

