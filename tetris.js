// import {p5} from "./node_modules/p5/lib/p5.min.js"
import {Tetromino} from "./tetromino.js"

/*

Game:
  - gameGrid
  - squares -- array of all squares on the board 
    --- OR just an array of squares??
  - currentTetromino
  - nextMove (left, right, or only down)

  - createTetromino -- new tetromino, add squares to list of squares, update the current tetromino

  - getCompletedRowIndexes -- input: gameGrid; output: array of row indexes to delete

  - clearRows -- gameGrid, completedRowIndexes; output: new gameGrid
    -- delete rows in gameGrid, add empty rows at the top, effectively shifting down all remaining rows. ***will need to change this!

  - updateTetrominoes -- CHANGE: update squares array, remove those from completedRowIndexes; and shift down square.row for remaining squares. ***will need to change this too! 

  - hasRoomForNextMove -- input: array of current tetromino's squares, gameGrid; output: true OR false (false if the move would cause a collision)
  
  - updateGameGrid -- input: array of current tetromino's squares (after calling hasRoom, updateTetrominoes, etcetc, gameGrid; output: new gameGrid 

  - endGame -- display message

  - gameLoopTick -- run once every animation frame in p5js, output array of squares to be drawn -- MOVE ALL GAME LOGIC TO HERE!

  - updateNextMove -- input: left/right. update this.NextMove, to be used by other function calls ... ??
 
*/

export function Tetris (rows, cols) {

  let squares = [];
  let currentTetromino;
  
  // Generate 2D array based on rows / cols, each element populated with 0s
  let gameGrid = new Array(rows).fill(null).map(row => new Array(cols).fill(0));
  
  console.log("****** GRID CREATED *********");
  // To see the grid in console:
  // gameGrid.forEach(row => console.log(row));
 

 
  // To see the grid in console:
  this.print = function() {
   let stringGrid = gameGrid.reduce( (str, row) => {
      return str += row.join(" ") + "\n";
    }, "\n");
    console.log(stringGrid);
  };
 
  this.gameLoopTick = function() {
    // Run the game logic to update on each tick
    //
    // For now, just return squares array:
    return squares;
  }; 

  // Create a new tetromino and add to squares array
  this.createTetromino  = function (row, col) {
    
    console.log(" *** CREATING TETROMINO ***");
    console.log(row + ", " + col);
    
    // Create and merge new squares with squares array
    let tetromino = new Tetromino(row, col);
  
    squares = squares.concat(tetromino.squares);
    console.log(squares);
  
    // Update currently active tetromino (global var for now) 
    currentTetromino = tetromino;
  }
  
  
  // PURE FUNCTION -- given a gameGrid, return array of row indexes that have been completed
  this.getCompletedRowIndexes  = function (gameGrid) {
  
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
  this.clearRows  = function (completedRows, gameGrid) {
  
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
  this.updateTetrominoes = function (tetrominoes, completedRows) {
  
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
  this.endGame = function () {
    console.log("Game over!");
    
    let x = document.body.innerHTML;  
    document.body.innerHTML = x + " <h1>Game over!</h1>"; 
  
  };
  
}; // end Tetris() constructor




