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
  let currentTetromino = new Tetromino(-1,0); // initialize game with first Tetromino, starts above screen because drawing loop runs once on page load and will move it down immediately

  let lastTickTimestamp = 0; // for now, number of frames
  
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


  this.createTetromino  = function (row, col) {
    
    console.log(" *** CREATING TETROMINO ***");
    // console.log(row + ", " + col);

    // Save current tetromino's squares to fallenSquares array
    fallenSquares = [...fallenSquares, ...currentTetromino.squares];
    
    return new Tetromino(row, col);
  
  }
  
 
  this.gameLoopTick = function(nextMove) {

    console.log("called gameLoopTick with nextMove: " + nextMove);
    
    // Update count for how often to move the tetromino down (every X milliseconds or game ticks)
    lastTickTimestamp++; // for now, just counting frames

    console.log("lastTick: " + lastTickTimestamp);  
 
    // Default to "down" if interface didn't pass any next move 
    if (nextMove == undefined) { nextMove = "down";}

   
    console.log("gameGrid before updating:");
    this.print(gameGrid);


    if (this.hasRoomForNextMove(currentTetromino, nextMove, gameGrid)) {

      let prevSquares = currentTetromino.squares;

      // Get updated tetromino object with updated squares array
      currentTetromino = currentTetromino.move(nextMove);

      gameGrid = this.updateGameGrid(prevSquares, currentTetromino.squares, gameGrid); 

    } 
  
       
    // TODO --- refactor this, repetitive!!!
    // On every X ticks / milliseconds, move the block down (regardless of user inputs)
    if (lastTickTimestamp % 5 === 0) {

      console.log("time to move the block down!!!!!!!!!!!!!!!");

      // Move down the current tetromino if there's room below:
      if (this.hasRoomForNextMove(currentTetromino, "down", gameGrid)) {

        let prevSquares = currentTetromino.squares;

        // Get updated tetromino object with updated squares array
        currentTetromino = currentTetromino.move("down");

        gameGrid = this.updateGameGrid(prevSquares, currentTetromino.squares, gameGrid); 
 
      // Otherwise if the current tetromino has landed (and fits on the screen), drop the next one!
      } else {
       
        // Otherwise if current tetromino has landed, drop the next one!
        currentTetromino = this.createTetromino(0,0); // NOTE: entire tetromino appears on screen all at once, by design. (this varies in different versions of tetris)
        console.log("****** Dropping next tetromino! *******");        
     

        if ( this.overlapsOtherSquares(currentTetromino, gameGrid) ) {
          console.log("new tetromino does NOT have room below");
          this.endGame();
        }

 
        // Check if a row has been completed
        let completedRows = this.getCompletedRows(gameGrid);
        
        if (completedRows.length > 0) {
          // Update gameGrid and update fallenSquares to remove completed rows, shift down other rows as needed
          gameGrid = this.clearRowsInGameGrid(completedRows, gameGrid);
          fallenSquares = this.clearAndUpdateSquares(completedRows, fallenSquares);
        }


      }// end else: current tetromino has landed
    }//end if lastTickTimestamp..

    console.log("gameGrid after updating:");
    this.print(gameGrid);

    // Return all squares in the game to be drawn on each frame:
    return [...fallenSquares, ...currentTetromino.squares];
  }; 



  // Return true if any of current tetromino's squares lie on top of occupied squares of the gameGrid
  this.overlapsOtherSquares = function (currentTetromino, gameGrid) {

     for (let square of currentTetromino.squares) {
      if (gameGrid[square.row] && gameGrid[square.row][square.col] === 1) {
        console.log("square at " + square.row + ", " + square.col + "overlaps another square!!!!");
        return true;
      }
    }

    // Otherwise if all squares are on the screen, return false
    console.log("All squares fit on screen");
    return false;

  };



  // Return true if there's room for the next move
  // FOR NOW, ONLY CHECKING BELOW BLOCK (not left or right) 
  this.hasRoomForNextMove = function(currentTetromino, nextMove, gameGrid) {
    console.log("called hasRoomForNextMove: " + nextMove);

    console.log("shape:");
    console.log(currentTetromino.shape);

    // Set which squares / grid spaces to check based on the next move:
    let rowOffsetToCheck = 1; // default is 1; change for left/right
    let colOffsetToCheck = 0; // default is 0; change for left/right

    // For checking squares against each other within the tetromino, since this only checks each unique pair once, it checks in order of the array of squares: top to bottom, left to right -- so looking to the right of each square works, but looking to the left doesn't work (because we're already on the left-most square when we check each pair!)
    // SOLUTION (for now): always check to the right, but switch which square in the pair is pushed into indexesToRemove based on left/right
    if (nextMove === "left" || nextMove === "right") {
      rowOffsetToCheck = 0;
      colOffsetToCheck = 1;
    } 

    // Compile list of edge squares
    // NOTE: This is so complicated!!! Surely I can refactor this quite a bit. But for now, at least it works. =P
    let squares = [...currentTetromino.squares];
    let indexesToRemove = [];

    for (let outerIndex = 0; outerIndex < squares.length; outerIndex++) {

      for (let innerIndex = outerIndex + 1; innerIndex < squares.length; innerIndex++) {

        console.log(outerIndex + " vs " + innerIndex);
        console.log("(" + squares[outerIndex].row + "," + squares[outerIndex].col + ") vs (" + squares[innerIndex].row + "," + squares[innerIndex].col + ")");

          console.log("1st square's row plus offset: " + (squares[outerIndex].row + rowOffsetToCheck));
          console.log("1st square's col plus offset: " + (squares[outerIndex].col + colOffsetToCheck));

        // If the square being checked (outerIndex) has a square on its {lower/right/left} border, add it to indexesToRemove
        if (squares[outerIndex].row + rowOffsetToCheck === squares[innerIndex].row && squares[outerIndex].col + colOffsetToCheck === squares[innerIndex].col)  {

            console.log(squares[outerIndex].col + colOffsetToCheck + " matches " + squares[innerIndex].col);

            console.log("remove this square from the list: index " + outerIndex + " - (" + squares[outerIndex].row + "," + squares[outerIndex].col + ")");

            // If looking to the left, remove the OTHER square (the check is REVERSED!), see comment further up. yes, this is ugly and complicated right now. Gotta refactor this later, or at least try to! =P
            if (nextMove === "left") {
              indexesToRemove.push(innerIndex);
            } else {
              indexesToRemove.push(outerIndex);
            }

          } // end if square is not an edge square
      
      } // inner for
    } // outer for

    console.log("indexesToRemove:");
    console.log(indexesToRemove);

    let edgeSquares = squares.filter( (square, index) => !indexesToRemove.includes(index) ); 

    console.log("edge squares: ");
    console.log(edgeSquares);

    // For checking gameGrid spaces, left/right positioning works fine:
    if (nextMove === "left") {
      rowOffsetToCheck = 0;
      colOffsetToCheck = -1;
    } else if (nextMove === "right") {
      rowOffsetToCheck = 0;
      colOffsetToCheck = 1;
    }

    // Check the grid space for the {lower/left/right} edge of each edge square; if any collisions, return false!
    for (let square of edgeSquares) {

      // If adjacent grid square is outside the range of gameGrid, or if the square does NOT have a value of 0 (if 1 or undefined/empty), collision!
      if (!gameGrid[square.row + rowOffsetToCheck] || !gameGrid[square.col + colOffsetToCheck] || gameGrid[square.row + rowOffsetToCheck][square.col + colOffsetToCheck] !== 0) {
        console.log("COLLISION DETECTED!");
        console.log("checking row: " + (square.row + rowOffsetToCheck));
        console.log("checking col: " + (square.col + colOffsetToCheck));
      
        return false;
      } else {

        console.log("No collision in this square:");
        console.log("checking row: " + (square.row + rowOffsetToCheck));
        console.log("checking col: " + (square.col + colOffsetToCheck));
      
      }

    }

    console.log("no game grid collisions detected; returning TRUE for hasRoomForNextMove");
    this.print(gameGrid);
    // If all the squares have room below, return true:
    return true;

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


  // PURE FUNCTION -- given a gameGrid, return array of row indexes that have been completed
  this.getCompletedRows = function (gameGrid) {
  
    console.log("called getCompletedRows");
  
    return gameGrid.map ( (row, index) => {
      let rowSum = row.reduce( (square,sum) => sum + square);
       
      if (rowSum === row.length) {
        return index;
      }
    }).filter(row => row != undefined); 
  
  }
  
  // Return a new gameGrid with all completed rows cleared and new empty rows added to the top
  // Pure function :)
  this.clearRowsInGameGrid = function (completedRows, gameGrid) {
  
    // ALSO TODO: INCREASE SCORE FOR EACH COMPLETED ROW
  
    console.log("called clearRowsInGameGrid");
  
    let newGameGrid = Array.from(gameGrid);
  
    // For each completed row, remove it from gameGrid and add a new empty row to the top
    completedRows.forEach( rowIndex => {
      newGameGrid.splice(rowIndex, 1);
      newGameGrid.unshift( new Array(cols).fill(0) );
    });
  
    return newGameGrid;
  }
  
  // Remove and shift down squares as needed after rows have been completed
  this.clearAndUpdateSquares = function (completedRows, fallenSquares) {
  
    console.log("called clearAndUpdateSquares");
  
    // Filter fallenSquares array to remove any that belonged to any of completedRows,
    let remainingSquares = fallenSquares.filter(square => completedRows.indexOf(square.row) === -1 );
  
    console.log("After filtering clear rows:");
    console.log(remainingSquares); 


    // Shift each remaining square's row down X times, where X is the number of cleared rows below it
    let updatedFallenSquares = remainingSquares.map(square => {

      let numClearedRowsBelow = completedRows.filter(rowIndex => rowIndex > square.row).length;
      return {...square, row: square.row + numClearedRowsBelow};

    });


    console.log("after moving squares down:");
    console.log(updatedFallenSquares);

    return updatedFallenSquares;
 
  }
  
  // Later: a nicer "game over" screen -- and turn off game loop / controls!
  this.endGame = function () {
    console.log("Game over!");
    
    // let x = document.body.innerHTML;
    let elem = document.createElement("h1");
    elem.textContent = "Game over!";
    document.body.appendChild(elem);
  
  };
  
}; // end Tetris() constructor




