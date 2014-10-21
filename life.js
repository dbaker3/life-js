var boardWidth = 500;
var boardHeight = 500;
var cellSize = 4;
var generation = 0;
var speed = 50; /* in ms. Lower is faster */

var cellsWide = boardWidth / cellSize;
var cellsHigh = boardHeight / cellSize;

var alive = 1;
var dead = 0;

/*Initialize board*/
var board = new Array();
var row = new Array();
for (var i=0; i<(boardHeight/cellSize); i++) {
   board[i] = new Array();
   for (var j=0; j<(boardWidth/cellSize); j++) {
      board[i][j] = 0;
   }
}

/*For storing the next state of each cell before redrawing board*/
var nextState = new Array();
var row = new Array();
for (var i=0;i<(boardHeight/cellSize); i++) {
   nextState[i] = new Array();
   for (var j=0; j<(boardWidth/cellSize); j++) {
      nextState[i][j] = 0;
   }
}

var theCanvas = document.getElementById("board");
theCanvas.addEventListener("click", changeCellState);
function changeCellState(e) {
   var cell = getCursorPosition(e);
   if (board[cell[0]][cell[1]] == dead) {
      birthCell(cell[0],cell[1]);
   }
   else {
      killCell(cell[0],cell[1]);
   }
}

function getCursorPosition(e) {
   var x = e.pageX - theCanvas.offsetLeft;
   var y = e.pageY - theCanvas.offsetTop;
   return Array(Math.floor(x/cellSize), Math.floor(y/cellSize));
} 

var playPauseButton = document.getElementById("playPause");
playPauseButton.addEventListener("click", playPause);

var isPlaying = false;
var refresherIntervalId;

var myCanvas = document.getElementById("board");
var context = myCanvas.getContext("2d");
context.lineWidth = 1;
context.fillStyle = "#46008C";


function playPause() {
   if (isPlaying) {
      clearInterval(refresherIntervalId);
      isPlaying = false;
      playPauseButton.value = "Play";
   }
   else {
      refresherIntervalId = setInterval(playRound, speed);
      isPlaying = true;
      playPauseButton.value = "Pause";
   }   
}

function drawCell(x,y,isAlive) {
   if (x >= (boardWidth/cellSize) || y >= (boardHeight/cellSize)) {
      alert("Out of bounds");
   }
   else {
      if (isAlive) {
         context.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
      }
      else {
         context.clearRect(x*cellSize, y*cellSize, cellSize, cellSize);
      }
   }
}

function birthCell(x,y) {
   board[x][y] = 1;
   drawCell(x, y, alive);
}

function killCell(x,y) {
   board[x][y] = 0;
   drawCell(x, y, dead);
}

function evaluateCell(x,y) {
   var liveNeighbors = 0;
   
   if ((x-1 >=0) && (x+1 < cellsWide) && (y-1 >= 0) && (y+1 < cellsHigh)) {
      if (board[x-1][y-1] == alive) {liveNeighbors++;}
      if (board[x][y-1] == alive) {liveNeighbors++;}
      if (board[x+1][y-1] == alive) {liveNeighbors++;}
      if (board[x-1][y] == alive) {liveNeighbors++;}  
      if (board[x+1][y] == alive) {liveNeighbors++;}  
      if (board[x-1][y+1] == alive) {liveNeighbors++;}
      if (board[x][y+1] == alive) {liveNeighbors++;}  
      if (board[x+1][y+1] == alive) {liveNeighbors++;}
   }

   /* mark for birth or death */
   if (board[x][y] == alive) {
      if (liveNeighbors < 2) {
         nextState[x][y] = 'X';
      }
      else if (liveNeighbors > 3) {
         nextState[x][y] = 'X';
      }
   }
   else { 
      if (liveNeighbors == 3) {
         nextState[x][y] = '.';
      }
   }
}

function evaluateBoard() {
   for (var i=0; i<(boardHeight/cellSize); i++) {
      for (var j=0; j<(boardWidth/cellSize); j++) {
         evaluateCell(i,j);
      }
   }
}

/* birth or kill cells */
function updateBoard() {
   for (var i=0; i<(boardHeight/cellSize); i++) {
      for (var j=0; j<(boardWidth/cellSize); j++) {
         if (nextState[i][j] == '.') {birthCell(i,j);}
         else if (nextState[i][j] == 'X') {killCell(i,j);}
      }
   }
}

function playRound() {
   evaluateBoard();
   updateBoard();
   generation++;
}



