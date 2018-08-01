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

  - updateSquares -- CHANGE: update squares array, remove those from completedRowIndexes; .... 

  - hasRoomForNextMove -- input: array of current tetromino's squares, gameGrid; output: true OR false (false if the move would cause a collision)
  
  - updateGameGrid -- input: array of current tetromino's squares (after calling hasRoom, updateTetrominoes, etcetc, gameGrid; output: new gameGrid 

  - endGame -- display message

  - gameLoopTick -- run once every animation frame in p5js, output array of squares to be drawn -- MOVE ALL GAME LOGIC TO HERE!

  - updateNextMove -- input: left/right. update this.NextMove, to be used by other function calls ... ??
 
*/

export function Tetris (rows, cols) {

  let fallenSquares = [];
  let currentTetromino;
  
  // Generate 2D array based on rows / cols, each element populated with 0s
  let gameGrid = new Array(rows).fill(null).map(row => new Array(cols).fill(0));
  
  console.log("****** GRID CREATED *********");
  // To see the grid in console:
  // gameGrid.forEach(row => console.log(row));
 

 
  // To see the grid in console:
  this.print = function(gameGrid) {
    let grid = [...gameGrid];
    let stringGrid = grid.reduce( (str, row) => {
      return str += row.join(" ") + "\n";
    }, "\n");
    console.log(stringGrid);
  };
 
  this.gameLoopTick = function() {
    console.log("called gameLoopTick");
    // Run the game logic to update on each tick
   
    // For now, just move the tetromino down on every tick. and for now, no params for move():


    // console.log(currentTetromino);

    // **** this is super incomplete and wrong =P

    console.log("gameGrid before updating:");
    this.print(gameGrid);


    if (this.hasRoomForNextMove(currentTetromino, "down", gameGrid)) {

      let prevSquares = currentTetromino.squares;

      // Get updated tetromino object with updated squares array
      currentTetromino = currentTetromino.move("down");

      gameGrid = this.updateGameGrid(prevSquares, currentTetromino.squares, gameGrid); 

    }

    console.log("gameGrid after updating:");
    this.print(gameGrid);


    // *** Need to update the gameGrid and new squares array after movement

 

    /*
    // Pretend code, what this might look like when completed:
    //

    if (hasRoomForNextMove() ) {

      gameGrid = updateGameGrid(gameGrid);
      squares = updateSquares(squares);
    }


    let completedRows = getCompletedRows(gameGrid);
      
    if (completedRows) {
        gameGrid = clearRows(completedRows, gameGrid);
        squares = updateSquares(squares, completedRows);
    }    

    // Pseudocode:
    // 1. Based on the next move (down, right, or left),
    //    check if hasRoomForNextMove
    // 2. If there's room, move the tetromino
    // 3. Then check if this completes a row
    // 4. If so, clear the rows and shift down the
    //    rows above.

   */

    // Return all squares in the game to be drawn on each frame:
    return [...fallenSquares, ...currentTetromino.squares];
  }; 



  // Return true if there's room for the next move
  // FOR NOW, ONLY CHECKING BELOW BLOCK (not left or right) 
  this.hasRoomForNextMove = function(currentTetromino, nextMove, gameGrid) {
    console.log("called hasRoomForNextMove");

    // Set which squares / grid spaces to check based on the next move:
    let rowOffsetToCheck = 1;
    let colOffsetToCheck = 0; // default is 0; change for left/right checks
    let filterFunction;

    // ALWAYS CHECK BOTTOM ROW, REGARDLESS OF MOVE
    // *** NOTE: this will change when allowing user to move left/right before square moves down 
      
      // Get the highest row value (for bottom-most squares):
      let bottomRowValue = currentTetromino.squares.reduce( (highestValue, square) => {
        return Math.max(square.row, highestValue);
      }, -1);
      // *** IMPORTANT NOTE: start by comparing to -1, because tetrominoes start at row -1 when created,
      // because p5js calls the draw() function once on page load first, before advancing the frames,
      // so by starting at row -1, it appears at row 0 once the page is visible.
  
      // console.log("bottom row value: " + bottomRowValue);
  
      filterFunction = square => square.row >= bottomRowValue;

    // If "downleft" or "left", update filter function
    if (nextMove.includes("left")) {

      colOffsetToCheck = -1;
      
      // Get the lowest col value (for left-most suqares):
      let leftColValue = currentTetromino.squares.reduce( (lowestValue, square) => {
        return Math.min(square.col, lowestValue);
      }, 0);
 
      // Filter squares: bottom and left-most
      filterFunction = square => square.row >= bottomRowValue || square.col <= leftColValue;


    // Otherwise if "downright" or "right", update filter function
    } else if (nextMove.includes("right")) {

      colOffsetToCheck = 1;

      // Get the highest col value (for right-most suqares):
      let rightColValue = currentTetromino.squares.reduce( (highestValue, square) => {
        return Math.max(square.col, highestValue);
      }, 0);
 
      // Filter squares: bottom and left-most
      filterFunction = square => square.row >= bottomRowValue || square.col >= rightColValue;


    } // later: implement for "left" and "right" ... and for rotations, eep!

    // Filter the squares
    let squaresToCheck = currentTetromino.squares.filter(filterFunction);

    console.log(squaresToCheck);

    // Check grid squares adjacent to every tetromino square:
    for (let s of squaresToCheck) {
      
      if (!gameGrid[s.row + rowOffsetToCheck] || gameGrid[s.row + rowOffsetToCheck][s.col + colOffsetToCheck] !== 0) {
        console.log("Square at " + s.row + ", " + s.col + " does NOT have room below.");
        return false;
      }

    }

    console.log("All squares have room below!");
    // If all the squares have room below, return true:
    return true;


    /*
      STUFF TO CHECK:
        
      "down" -- get bottomRowValue with max value of rows, filter by row >= bottomRowValue
            -- check grid[row + 1][col] for each bottom square

      "left" -- get leftColVal with MIN value of COLs, filter by col <= leftColValue
            --  check grid[row][col - 1] for each left square

      "right" -- get rightColVal with MAX value of COLS, filter by col >= rightColValue
            --  check grid[row][col + 1] for each right square



      "downleft" -- filter to bottom AND left squares,
                -- check grid[row + 1][col - 1]

      "downright" -- filter to bottom AND right squares,
                --  check grid[row + 1][col + 1]

    */



  }; // end hasRoomForNextMove()
  

  // Return updated game grid after switching squares on/off based on prev and next coords
  // TODO: update based on completed rows too, if any
  // TODO: pass in nextMove param ???
  this.updateGameGrid = function(prevSquares, newSquares, gameGrid) {
    console.log("called updateGameGrid");

    // Modify a copy of previous gameGrid, return new array instead of mutating
    let newGameGrid = [...gameGrid];

    // Switch off previous coordinates for each square:
    for (let prevSquare of prevSquares) {
      // Only switch off previous position if this tetromino is already on the screen
      if (prevSquare.row >= 0) {
        newGameGrid[prevSquare.row][prevSquare.col] = 0;
      }

    } 

    // Switch on new coordinates for each square:
    for (let newSquare of newSquares) {
      newGameGrid[newSquare.row][newSquare.col] = 1;
    }

    return newGameGrid;

  }; // end updateGameGrid()



  // Create a new tetromino and add to squares array
  this.createTetromino  = function (row, col) {
    
    // console.log(" *** CREATING TETROMINO ***");
    // console.log(row + ", " + col);
    
    // Create and merge new squares with squares array
    let tetromino = new Tetromino(row, col);
  
    // Update currently active tetromino (global var for now) 
    currentTetromino = tetromino;

    console.log(currentTetromino.squares);

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




