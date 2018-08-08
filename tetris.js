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

  console.log("**** INITIALIZED FIRST TETROMINO ****");
  console.log([...currentTetromino.squares]);
  console.log({...currentTetromino});

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
    
    console.log("old fallenSquares:");
    console.log([...fallenSquares]);
 
    // Save current tetromino's squares to fallenSquares array
    fallenSquares = [...fallenSquares, ...currentTetromino.squares];

    console.log("new tetromin's squares:");
    console.log([...currentTetromino.squares]);   

    console.log("new fallenSquares:");
    console.log([...fallenSquares]);
 
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

    // Save copy of original coordinates
    let prevSquares = [...currentTetromino.squares];
    
    // Get updated tetromino object with updated coordinates for potential move
    let updatedTetromino = currentTetromino.getNewTetromino(nextMove);
    console.log("updatedTetromino obj:");
    console.log(updatedTetromino);
    this.print(gameGrid);

    if (!this.overlapsOtherSquares(updatedTetromino, gameGrid, prevSquares)) {

      currentTetromino = updatedTetromino;

      gameGrid = this.updateGameGrid(prevSquares, currentTetromino.squares, gameGrid); 

    } 
  
    this.print(gameGrid);
       
    // TODO --- refactor this, repetitive!!!
    // On every X ticks / milliseconds, move the block down (regardless of user inputs)
    if (lastTickTimestamp % 5 === 0) {

      console.log("time to move the block down!!!!!!!!!!!!!!!");

      // Save copy of original coordinates
      let prevSquares = [...currentTetromino.squares];
      
      // Get updated tetromino object with updated coordinates for potential move
      let updatedTetromino = currentTetromino.getNewTetromino("down");
      console.log("updatedTetromino obj:");
      console.log(updatedTetromino);

      // Move down the current tetromino if there's room below:
      if (!this.overlapsOtherSquares(updatedTetromino, gameGrid, prevSquares)) {

        currentTetromino = updatedTetromino;

        gameGrid = this.updateGameGrid(prevSquares, currentTetromino.squares, gameGrid); 
 
      // Otherwise if the current tetromino has landed (and fits on the screen), drop the next one!
      } else {
       
        // Otherwise if current tetromino has landed, drop the next one!
        currentTetromino = this.createTetromino(0,0); // NOTE: entire tetromino appears on screen all at once, by design. (this varies in different versions of tetris)
        console.log("****** Dropping next tetromino! *******");        
     

        if ( this.overlapsOtherSquares(currentTetromino, gameGrid) ) {
          console.log("new tetromino overlaps; game over!");
          this.endGame();
        }

 
        // Check if a row has been completed
        let completedRows = this.getCompletedRows(gameGrid);
        
        if (completedRows.length > 0) {
          // Update fallenSquares to remove completed rows, shift down other rows as needed
          let prevSquares = [...fallenSquares];
          fallenSquares = this.clearAndUpdateSquares(completedRows, fallenSquares);
          gameGrid = this.updateGameGrid(prevSquares, fallenSquares, gameGrid);
        }


      }// end else: current tetromino has landed
    }//end if lastTickTimestamp..

    console.log("gameGrid after updating:");
    this.print(gameGrid);

    // Return all squares in the game to be drawn on each frame:
    return [...fallenSquares, ...currentTetromino.squares];
  }; 



  // Return true if any of current tetromino's squares lie on top of occupied squares of the gameGrid
  this.overlapsOtherSquares = function (currentTetromino, gameGrid, prevSquares) {

    let prevCoords = [];

    // If prevSquares argument is given,
    if (prevSquares != undefined) {
      // Keep an array of coordinates to ignore for collisions
      for (let prevSquare of prevSquares) {
        prevCoords.push(prevSquare.row + "-" + prevSquare.col); 
      }
    }

    // For each updated square, there's a collision if the row or col is off the grid,
    // OR if it overlaps an existing square on the grid (excluding previous coords of the current tetromino)
     for (let square of currentTetromino.squares) {
      
      if (!gameGrid[square.row] || ( gameGrid[square.row][square.col] !== 0 && !prevCoords.includes(square.row+"-"+square.col) )  ) {
        console.log("square at " + square.row + ", " + square.col + "has a collision!!!");
        return true;
      }
    }

    // Otherwise if all squares are on the screen, return false
    console.log("All squares fit on screen");
    return false;

  };


  // Return updated game grid after switching squares on/off based on prev and next coords
  // TODO: update based on completed rows too, if any
  // TODO: pass in nextMove param ???
  this.updateGameGrid = function(prevSquares, newSquares, gameGrid) {
    console.log("called updateGameGrid");

    console.log("prev quesres:");
    console.log(prevSquares);
    console.log("new sq:");
    console.log(newSquares);

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




