# Yay, Tetris!

:video_game: [**Play version 1 here!**](https://yay-tetris.glitch.me/) :video_game:


<br/>

Just for fun, here's a simple Tetris game built "from scratch" with vanilla JavaScript and the web browsers' built-in [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). This project was originally part of my #100DaysOfCode experiment to explore some new programming topics every day.

<br/>

:speech_balloon: **Suggestions / advice always appreciated!** You can make [an issue](https://github.com/LearningNerd/yay-tetris/issues) or a [pull request](https://github.com/LearningNerd/yay-tetris/pulls) to share your ideas and coding wisdom. :)

<br/>

:notebook: **Sections below:**
  - [Features to add next](#next-steps)
  - [My daily notes while building this project](#daily-notes)

<hr/>

## Next steps:

Version 1 is complete, and it's on hold for the moment. But when I'm ready for more Tetris, here's my backlog of to-dos:

  - More refactoring! (*Always* more refactoring!)
  - Bundle the JS files and transpile for older browsers (learn about Webpack etc for this, probably!)
  - Add replay button (so users don't need to refresh the page to play again)
  - Add basic wall kicks (see [bottom of this page on Tetris rotation systems](https://strategywiki.org/wiki/Tetris/Rotation_systems) for reference)
  - Maybe: flesh out the scoring system
  - Maybe: sound effects
  - Maybe: add pause/resume feature

Obviously, the sky's the limit as far as other feature ideas go! Game modes, a multiplayer version, various experimental variations on the game logic, mashups between Tetris and other games... But I need to stop somewhere!

<hr/>

## Daily notes:

How was it building Tetris? Below are all my raw notes that I wrote in my #100DaysOfCode journal, in case anyone's curious.

**Note:** I'm planning to upload a timelapse video showing the process, since I recorded my screen while making this game!

### Day 62: 2018-07-22

Today I think I feel like taking a break from messing around with trees and recursion. Today I feel like doing something completely different. At least for a little while. I'm pretty sleepy too, but I know I can make time for a little programming practice today. So I was thinking, maybe I can make a game! Tetris has been on my mind for a while now since I was helping one student work towards building it herself. I'm not sure just how much work it would take to finish it, so that might be fun!

[**Project on Glitch (for now)**](https://glitch.com/edit/#!/yay-tetris)

**Tetris features / problems to solve:**

  - Animating blocks to move down the screen
  - Making them stop at the bottom
  - Drawing another block after the previous block has fallen
  - Collision detection
  - Moving blocks left and right on key press
  - Game over when blocks reach the top of the screen
  - Making the blocks into each Tetris shape
  - Randomizing which block is next
  - Rotating the blocks on key press
  - Deleting when a row is completed
  - Tracking the score

**Finished:**
  - Animating a block to move down the screen
  - A tetromino object constructor, with methods for movement
  - A method for checking if the tetromino has reached the bottom
  - Create a new block when the previous block lands
  
<hr/>

### Day 63: 2018-07-23

I'd love to finish Tetris today! Since I worked both days this weekend, I planned for today to be my Sunday. (Update: I only spent an hour or two coding today though.)

**Finished:**
  - Set up a 2D array, tracking which squares in the game grid are occupied.
  - Refactored `isFalling` to `hasRoomBelow`, which checks the `gameGrid` for collisions (instead of checking based on pixel calculations).
  - Refactored the tetrmino's `moveDown` method to switch blocks on/off inside the `gameGrid`.
  
  - Learned how to generate an array with the `Array` constructor, `fill`, and `map`. Found a couple interesting quirks:
  
    - The `Array` constructor will generate an array of the given size, but the elements are "empty" -- they have no value, not even `null` or `undefined`! So weird! And that means you can't iterate over them with `map`. So the solution is to first `fill` them with a value like `null`, and then use `map`.
    - Lesson learned: don't use a nested `fill` -- since arrays are objects, the generated array will be filled with pointers that all point to the *same* array, rather than separate arrays with the same elements.

<hr/>

### Day 64: 2018-07-24

**Finished:**

  - Finally moved this notes file to my computer so I can work on it locally and get more practice using Vim.
  - Also moved my Tetris project code to a local Git repo and started (finally!) writing my code in Vim.
  - Refactored to rename tetrominos' `x` and `y` properties to `row` and `col`.

  - Can now move blocks left and right on key press. (Also fixed it up so key presses draw the next frame, not clicks.)
  - Added a bit of logic to prevent tetrominoes from being moved off screen.
  - Bug fix: the game grid now updates accordingly when blocks are moved left or right. (For now, the game grid is updated *twice* in every tick of the game loop. Will need to clean this up later.)

  - Added game over condition which displays a message on the screen
  - Random pastel colors for each tetromino

<hr/>

### Day 65: 2018-07-25

**Finished:**

  - Completed rows now get deleted and remaining rows are shifted down. (The simple logic here won't hold up with more complex tetromino shapes, though. But it's a start!)
 
  - Created nested arrays of 0s and 1s to represent each tetromino shape, then wrote a function that converts those into a flat array of Square objects with coordinates (starting at 0,0 for the top left square).

<hr/>

### Day 66: 2018-07-26

**Finished:**

  - (Re)learned the very basics of using import/export modules (ES6 syntax) and after quite a few annoying bugs and successfully avoiding a rabbit hole (my global npm packages don't seem to be working), I got this working example: [my ES6 module import/export example code on Gist](https://gist.github.com/LearningNerd/08a5039a7c5cddf7342ecd0a32da94e3).
  
  - Separated code into modules: main file (renamed to `tetris.js`), tetromino constructor, and a module for helper functions.
  
  - Switched to using p5js in ["instance mode"](https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace), which was the only way I could figure out how to use p5js with my own code organized as modules. (My best guess: the difference between global scope and module scope is what's messing this up!)
  
  - To solve scope issues (the Tetromino module can no longer access "global" vars in `tetris.js`), for now I'm just passing the variables for `gameGrid`, `blockSize`, and the p5js instance object all as arguments for the Tetromino constructor. There must be a better way, but this works for now. 


**Resources and notes on ES6 modules:**
  
  - I like [the info in this article](https://medium.com/dev-channel/es6-modules-in-chrome-canary-m60-ba588dfb8ab7) on using ES6 modules as a "high water mark" for browsers that use modern JS!  
  - I'm still confused about how "default" exports/imports work, but I'll save that for another day.


**Misc stuff to look at later:**
  - Learn more about module scope vs block scope and best practices for how to structure module relationships!
  - [The p5js website has a beginner-friendly intro to test-driven development](https://p5js.org/learn/tdd.html), which I've been wanting to finally start learning.


<hr/>

### Day 67: 2018-07-27

**Finished:**
  - Wrote down a bunch of notes as comments in my code, brainstorming how to refactor into separate components
  - Successfully updated my code with a Square module and changes to the Tetromino model, integrating the code I wrote yesterday to generate an array of Square objects from an array of 1s and 0s representing each tetromino shape.
  - Did a quick test with a new p5js draw function to draw a single tetromino -- it works! (I commented out the old drawing code for now, since I need to reorganize everything and rewrite practically every method.)
  - Created a new branch for the previous version named `single-square-tetris`, so I can easily jump back to my first "finished" version.


<hr/>

### Day 68: 2018-07-28

No coding today. After teaching all afternoon, and being pretty sleep-deprived again, I just didn't feel like it. I'm thinking that as far as habits go, taking a day off once a week is totally fine by me. Or the weekends. Or just treating it like going to the gym: 3 or 4 days a week works great.

<hr/>

### Day 69: 2018-07-29

**Finished:**
  - Refactored Tetris file to break it up into two modules: one with a Tetris constructor, and a separate file for the drawing interface. So I moved all the p5js code there.
  - Now the Tetris constructor has parameters for number of rows and columns, which are defined as constants in the drawing interface file
  - The drawing loop calls `gameLoopTick()` which, for now, does nothing except return an array of squares to be drawn.
  - Gutted the Tetromino module, removing all the movement and collision-detection code and removing all references to p5js or the game grid.

<hr/>

### Day 70: 2018-07-30

**Finished:**
  - Now each new tetromino has a random shape
  
  - Wrote up some notes to try to visualize the code that I'll be writing for this new version, but I was probably just over-thinking it. I wanted to start writing the code to move a tetromino down the screen, but then I ran out of time. And I ran into a bunch of annoying bugs, and realized my local server just wasn't loading the updated files. I could've sworn that Command + the refresh button on the touch bar worked last time, but it didn't this time! (Only using the refresh button in the browser window works for a hard refresh.)

<hr/>

### Day 71: 2018-07-31

**Finished:**
  - Successfully moving a tetromino down the screen on each frame, yay!
  - Added `hasRoomForNextMove` method to Tetris module with downard collision detection. And it works! Phew!

  - Refactoring: now storing `fallenSquares` as an array, separate from the current tatromino object (containing its own squares), instead of keeping track of a merges `squares` object. Overly complicated! Instead, now the Tetris module passes a merged array of all squares to the interface module.
  - Refactoring: now the Tetromino's `move` method returns the entire tetromino object, not just its squares array. Makes more sense.

  - Wrote a new `updateGameGrid` method for the Tetris module, which switches grid spaces on and off based on old and new coordinates of the current tetromino.
  - Refactored `print` method to use a copy of the `gameGrid` (otherwise the console would always show the newest version of the array, or I'd have to pass in a copy of it every time I call the print method, which is annoying... so I'm starting to see the usefulness of not mutating arrays, for sure!)

<hr/>

### Day 72: 2018-08-01

**Finished:**
  - Added left/right collision checking to `hasRoomForNextMove`, which was broken at first. (I forgot that I can't check for *both* sideways and downward collisions at the same time (I don't think); if there isn't room to the side, the tetromino also doesn't move down. That's no good!)

  - Interface now sets the `nextMove` variable and passes it to the Tetris module's `gameLoopTick` method, which passes it along to `hasRoomForNextMove` and the Tetromino module's `move` method.

  - Fixed left/right movement! Current tetromino now moves left or right *only*, without also moving down. And now it moves down on its own every X frames. (Later might change this to every X milliseconds based on timestamp. Not sure which is better.)


<hr/>

### Day 73: 2018-08-02

**Finished:**
  - Yesterday I got it to create a new tetromino when the previous one lands, but now I also got the canvas to draw all the previous squares in addition to the new squares. And I fixed a little bug I had created, where they weren't moving all the way down the screen even though they had room. (Forgot to switch out one argument, oops! Tiny fix!)

  - The game ends now, yay! I added an `isOffScreen` method to the Tetris module. At first I had a couple little bugs, but I fixed them up! Now each new tetromino appears fully on the screen, and the game ends when any of its squares are in the top row. (Probably still needs some tweaking, though.)

- New bug discovered: my collision detection is off in a few important cases! For the "S" shape, only its bottom-most square checks for collisions, so it actually *sinks* into the squares below in certain situations, because one of its squares ignores collisions! My logic was oversimplified. Oops.

<hr/>

### Day 74: 2018-08-03

**Finished:**
  - Completely rewrote the collision detection logic in `hasRoomForNextMove`, which feels super complicated but at least it works now! I'm checking every square against every other square in the tetromino, then removing every square that has a neighbor (below, to the left, or to the right), and finally checking the adjacent `gameGrid` locations for each of the remaining `edgeSquares`.

  - Along the way to rewriting that method, I created all sorts of new little bugs and made some silly mistakes related to array indexes and trying to modify an array in place -- bad, bad, very bad!

  - I discovered a new bug (or re-discovered it?): the game-over condition has false positives, if moving the tetromino left or right while it's still at the top of the screen. Gotta rewrite that one from scratch too, probably!

**#TIL:**
  - I found a very cool little algorithm for filtering an array in place [from this StackOverflow thread](https://stackoverflow.com/questions/37318808/what-is-the-in-place-alternative-to-array-prototype-filter), where you keep track of two indexes to overwrite the elements to remove with elements to keep from further down the array, and then reset the array's length manually at the end to chop off the last half. I didn't even know you could do that! [This thread on "index adjustment" and why it's clunky to change an array in place](https://stackoverflow.com/questions/18305431/how-to-remove-all-odd-numbers-in-an-array-using-javascript/18305442) was interesting.

<hr/>

### Day 75: 2018-08-04

No coding. (Aside from spending all of 2 minutes starting to write notes in here, and then I stopped to play games the rest of the night because I felt pretty burnt out after my class.)

<hr/>

### Day 76: 2018-08-05

No coding. I just didn't feel like it. Taking a nap and finally eating, and then rock climbing, and then going out for food... and then I was too tired to even *think* about working on anything at night. I guess I have it in my head already that it's OK to take a break on weekends, especially since I taught a class both days this weekend (again), and it's pretty exhausting.

<hr/>

### Day 77: 2018-08-06

**Finished:**
  - Rewrote game-over condition: as soon as a new tetromino is created, check if it overlaps any squares on the game grid. Works like a charm!

  - Reimplemented clearing rows and shifting down squares, hurray!

  - Bug or feature? Sometimes a square will be left floating in mid-air, if there was a bigger gap below it. I forgot if the original game did this, and it looks like it does! But I still have this nagging feeling that my implementation is missing something... Oh well, good enough for now.

  - A little refactoring: now reusing `updateGameGrid` after clearing rows and updating the array of squares, instead of creating another method to accomplish the same thing. (Now `updateGameGrid` is called after moving the current tetromino *and* after clearing any rows.)

  - Implemented rotation, woohoo!!! It was easier than I thought -- at least the first step. The last row becomes the first column, and the first row becomes the last column, for each clockwise rotation. Just a couple of nested for loops, incrementing one counter and decrementing the other. What a beautifully simple pattern! Very satisfying to figure out. But...

  - Bug to solve: I don't know why the tetromino moves down the screen when it's rotated. It looks like the coordinates of its squares don't match the game grid anymore. Not sure why. I'll also probably have to rewrite the collision detection *yet again*, because it seems downright impossible to use the current implementation to check for collisions caused by rotations. Eep!


<hr/>

### Day 78: 2018-08-07

**Finished:**

  - Worked it out on paper: I can indeed rotate the tetrominoes using only their coordinates, no need for rotating the shape and then updating their coordinates in two separate steps. Time to try implementing it in code now! I'm excited by just how simple this might be!

  - Implemented new rotation algorithm and added `centerSquare` property, marking the center in the `shapes` templates with the number 2. New algorithm: calculate each square's offset from center square, switch row/column offset and negate one of them, apply new offset to generate new coordinates. So much simpler, no need to rotate the shape template itself!

  - Rewrote collision detection to be *so much simpler!* Now instead of checking the edges of a tetromino, I just changed the `move` method into a `getNewTetromino` method that returns a new tetromino object with the coordinates that result from the proposed move. Then I check if any of those squares overlap or go outside the game grid; if not, I set the current tetromino to that new version!

  - Fixed a tricky bug: I forgot that `[...myArray]` only makes a *shallow* copy of an array, and I'm using nested arrays! So now, instead of making a copy of the game grid and switching off the tetromino's previous coordinates (which also switched them off in the actual grid, oops!), now it's checking for coordinates that overlap but *excluding* any from the previous coordinates. 

<hr/>

### Day 79: 2018-08-08

Since I solved what I thought were the hard problems of Tetris, I'm basically done now! But I'm also nowhere close to done, because there are lots of little details I haven't implemented. I recognize this feeling from every project I've ever done -- the moment when I need to decide: how much is enough? 

Today I discovered there's *a lot* of nuance to the Tetris rotation system, and it varies from game to game. The [Tetris Guideline](http://tetris.wikia.com/wiki/Tetris_Guideline) is the current specification, developed in 2001 to standardize all official Tetris games.

Now that I know this exists, my inner perfectionist wants to keep going until my version matches the official specs. But my original goal here was just to find out how hard it would be to build Tetris, and how long it would take me, and to learn whatever I could from the challenge. Turns out, as with most projects, it took me way longer than I thought it would!

OK, time to decide.

**Final-ish list of features for my good-enough Tetris:**

  - Fix the rotation bug for the O shape -- it doesn't rotate at all!
  - Track number of lines cleared (I don't care about the intricacies of the official scoring system)
  - Use all 7 Tetris shapes
  - Assign a fixed color to each Tetris shape
  - Show a queue of upcoming shapes


**Some misc notes and rabbit holes for another day:**

  - [This StrategyWiki overview of Tetris rotation systems](https://strategywiki.org/wiki/Tetris/Rotation_systems) is fascinating!  

  - So now I know that *wall kicks* are a thing. I might want to try implementing the most simple variation, so the tetromino can be rotated when against the side walls, if there's room.

  - Apparently it's *tetrominos*, no "e"! That's according to The Tetris Company, supposedly. But Wikipedia and other sites write it as "tetrominoes", so I'll stick with that.

  - Officially, there actually is a non-visible portion of the grid ("playfield")! Good to know!

  - Each piece has a specific spawn rule: horizontal, with J/L and T pointing up, and in particular columns!


**Finished:**

  - For the "O" shape, set its `centerSquare` property to `undefined` and updated the `rotate` method to end early and return an uneditied copy of the tetromino in that case, so now the "O" shape literally *does not* rotate.

<hr/>

### Day 80: 2018-08-09

**Finished:**

  - Added score (just the number of lines cleared)
  
  - Refactoring: now `gameLoopTick` returns an object containing the squares to draw, whether the game is over, and the score. Now the interface module handles displaying "game over" and displays the score too.

  - Added all 7 shapes, each with an assigned color. Refactored: Tetris module stores the shape templates and handles randomly generating shapes, passing them to the Tetromino constructor (instead of the Tetromino handling that).

  - Added queue of next tetrominoes! Now the canvas draws the next tetrominoes off to the side, and the playfield is now a subset of the canvas. The Tetris module now stores the queue of next tetrominoes, taking the next one and pushing another to the queue each time a new tetromino is dropped. (I'm not doing that "7 bag" algorithm that the official game uses, so the randomness of the shapes could use some tweaking, but whatever. This is good-enough Tetris.)

  - Added animation! Now the game animates itself! Fixed a couple little bugs: now the piece doesn't move down on every single game loop tick (and for now, game loop ticks are the same as animation frames). Another interesting bug was that at first, the pieces kept repeating their move on every frame until pressing a different button. The fix was simple: use the p5js `keyIsDown` method *inside* the draw loop to update (and reset) on every frame.


**Questions and threads to follow later:**

  - What are the pros and cons of defining local variables within an object constructor, compared to setting them as properties of the object? (Using `let blah` versus `this.blah`)
  - Look into use cases for creating custom events
  

<hr/>

### Day 81: 2018-08-10

**Finished:**

  - Implemented counter-clockwise rotation, following the [Tetris Guideline](http://tetris.wikia.com/wiki/Tetris_Guideline) to map it to the "Z" or "Ctrl" keys.

  - Tetrominoes now spawn horizontally, and in the left/center columns, according to the official guideline.

  - Re-implemented the "soft drop" move: when the user presses the down arrow, the tetromino moves down immediately (potentially on every game loop tick if the key is held)

  - Added "hard drop" move: when user presses Space, immediately move the tetromino as far down as it has room for. My code's a bit messy in my attempt to keep it DRY... something to take another look at later! At first I had a little bug where the tetromino could still be moved after the hard drop, but I fixed it with one tiny change to the logic.

  - To prevent the page from scrolling when pressing the arrow keys, I just used `preventDefault()` with the "keydown" DOM event. For whatever reason, it didn't work with the p5js `keyPressed` method. Right now I'm using the `which` property to get the key codes for the game controls and only disabling those.


<hr/>

### Day 82: 2018-08-11

No coding, totally fine with taking the weekend off.

<hr/>

### Day 83: 2018-08-12

No coding. Nice lazy Sunday.

<hr/>

### Day 84: 2018-08-13

**Finished:**
  - Fixed key-repeat issue. After a bit of a wild goose chase, I finally realized that the official Tetris game has a delay befor repeating a move! The solution ended up being pretty simple: register the initial key press, but then ignore it until reaching the threshhold (some number of milliseconds), and then repeat the move as long as the key is held down.

  - The soft-drop repeats immediately though, no delay. (That's what it seems to do in the official game.)
    
  - I spent *a lot* of time experimenting with it to try to get the right feel for the controls. I'm reasonably happy with it now!

<hr/>

### Day 85: 2018-08-14

**Finished:**
  - Implemented left/right plus soft-drop combined move, so now if you hold down both keys it'll move quickly down and to the side simultaneously. Feels much more intuitive this way!

  - Fixed a tiny edge case: previously, holding left and then also holding down right arrow key would cause the tetromino to still repeat moving to the left, because that was the order of the conditional statements. I'm sure it would rarely happen, but it definitely shouldn't work that way! One small change to fix it: track which key was the most recent one pressed, and only repeat left or right if it's held down *and* the most recently pressed key.

  - Published version 1 on GitHub here: https://github.com/LearningNerd/yay-tetris/! I included these notes in the README file for the project, along with the below list of next to-dos for whenever I decide to revisit the project.

<hr/>

### 2018-12-07 (No longer counting days, lol)

Hello, again! After a nice long break spent on other projects and learning more cool stuff, I'm back to do some refactoring! This Tetris code really needs some love and attention.

Today I removed all p5js code, to review my understanding of the canvas API, to practice refactoring, and to submit this project for my application to [the Recurse Center](https://www.recurse.com/) (which requires a "from scratch" code sample).

**Finished:**

  - Read all about cross-browser compatibility issues with keyboard events and looked through the p5js source code to see what details I'll now need to handle myself

  - Created a file for constants: names of keyboard events, names of game moves, and a mapping for normalized key names.

  - Looked at source code for p5js `millis()` method and found it's literally just a renaming of `window.performance.now()`, lol
 
   - Reused some old code I had written to implement an animation/game loop "from scratch" for the classic Snake game: https://codepen.io/LearnTeachCode/pen/PWVZJZ?editors=0010

  - Relearned how to run a local web server with Python: `python -m SimpleHTTPServer`

  - Solved my bug regarding key presses -- I just need to manually track which keys are being held down!

  - Learned about the "focus" and "blur" events and how they don't bubble up -- but "focusin" and "focusout" do bubble. And you can listen for these events on the `window` object, but not on the `document` object! See: https://www.quirksmode.org/dom/events/blurfocus.html

  - Learned about keyboard "ghosting" and "jamming" -- because of how some keyboards are wired, it won't even register a fourth key if you hold down some combinations of 3 keys! See: https://en.wikipedia.org/wiki/Rollover_(key)
    - Although that still doesn't totally explain why my keyboard won't register *three* simultaneous arrow key presses... I'm assuming it's just a wiring issue. I want to test this on other keyboards now just for fun!

**Notes on cross-browser keyboard event annoyingness:**

  - Modern browsers implement the "key" property, but IE/Edge use different values for some keys
  - keyCode "is supported in effectively all browsers (since IE6+, Firefox 2+, Chrome 1+ etc)" via https://caniuse.com/#search=KeyboardEvent.keyCode

Resources:
  - https://w3c.github.io/uievents/
  - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
  - https://medium.com/@uistephen/keyboardevent-key-for-cross-browser-key-press-check-61dbad0a067a

<hr/>

### 2018-12-10

**Done:**
  - Confirmed that I've successfully removed all p5js code without breaking the game, yay!
  - Fixed up and experimented with canvas drawing styles; added some subtle drop shadows, made text bigger and a bit lighter in color
  - Added ASCII emojis to show a random one for each "game over" screen, so cute!
  - Updated the top of this README file and pushed these updates to GitHub and to Glitch

<hr/>

### 2018-12-12

**Done:**
  - Refactored interface module, much cleaner now! Moved stuff into separate functions, re-ordered some code into a coherent order.
  - Moved "ticks until lock" to `config.js` and moved the definition of tetromino shapes to `constants.js`
  - Minor refactoring for Tetris module
  - Reviewed how the game works, why I had basically 3 loops for animation/game loop
  - Removed loop for throttle animation FPS; don't need it! Refactored to move game ticks per second loop into the `animate` function in `interface.js`, pulling it outside of the `updateGame` function.

