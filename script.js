
function rand(max) {
  return Math.floor(Math.random() * max);
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function winGame(moves) {
  toggleVisablity("Win-Message-Container");
  clearInterval(chaserInterval);
  clearInterval(diplomaInterval);
}
function loseGame() {
  toggleVisablity("Lose-Message-Container");
  clearInterval(chaserInterval);
  clearInterval(diplomaInterval);
}
function toggleVisablity(id) {
  if (document.getElementById(id).style.visibility == "visible") {
    document.getElementById(id).style.visibility = "hidden";
    return;
  } else {
    document.getElementById(id).style.visibility = "visible";
    return;
  }
}

function newGame() {
  toggleVisablity('Win-Message-Container');
  makeMaze();
}
function tryAgain() {
  toggleVisablity('Lose-Message-Container');
  makeMaze();
}

function Maze(Width, Height) {
  var mazeMap;
  var width = Width;
  var height = Height;
  var startCoord, endCoord;
  var dirs = ["n", "s", "e", "w"];
  var modDir = {
    n: {
      y: -1,
      x: 0,
      o: "s"
    },
    s: {
      y: 1,
      x: 0,
      o: "n"
    },
    e: {
      y: 0,
      x: 1,
      o: "w"
    },
    w: {
      y: 0,
      x: -1,
      o: "e"
    }
  };
  this.map = function () {
    return mazeMap;
  };
  this.startCoord = function () {
    return startCoord;
  };
  this.endCoord = function () {
    return endCoord;
  };
  function genMap() {
    mazeMap = new Array(height);
    for (y = 0; y < height; y++) {
      mazeMap[y] = new Array(width);
      for (x = 0; x < width; ++x) {
        mazeMap[y][x] = {
          n: false,
          s: false,
          e: false,
          w: false,
          visited: false,
          priorPos: null,
          obstacle: false
        };
      }
    }
    // Function to toggle obstacle visibility
    function toggleObstacleVisibility() {
      mazeMap[obstacleY][obstacleX].obstacle = !mazeMap[obstacleY][obstacleX].obstacle;
    }


    var level = document.getElementById("levelSelect");
    var selectedLevel = level.options[level.selectedIndex].value;
    setInterval(toggleObstacleVisibility, 5000);
    // Check the selected level and generate obstacles accordingly
    if (selectedLevel === "1") {
      // mazeMap[obstacleY][obstacleX].obstacle = true;
    } else {
      var obstacleX = rand(width);
      var obstacleY = rand(height);
      mazeMap[obstacleY][obstacleX].obstacle = true;
    }
    // Function to check prohibited list are in the coners of maze for obstacle   
    function isProhibitedCoordinate(x, y) {
      return (x === -1 && y === -1) || (x === 0 && y === 0) || (x === 0 && y === -1) || (x === -1 && y === 0);
    }
    //Checking is the coordinates are prohibited
    if (isProhibitedCoordinate(obstacleX, obstacleY)) {
      //if the coordinates are in the corners, this will repetivly select coordinates that are not corners
      while (true) {
        obstacleX = rand(width);
        obstacleY = rand(height);
        if (!isProhibitedCoordinate(obstacleX, obstacleY)) {
          break; //break the loop when the coordinates are okay
        }
      }
    }
  }
  function defineMaze() {
    var isComp = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var pos = {
      x: 0,
      y: 0
    };
    var numCells = width * height;
    while (!isComp) {
      move = false;
      mazeMap[pos.x][pos.y].visited = true;
      if (numLoops >= maxLoops) {
        shuffle(dirs);
        maxLoops = Math.round(rand(height / 8));
        numLoops = 0;
      }
      numLoops++;
      for (index = 0; index < dirs.length; index++) {
        var direction = dirs[index];
        var nx = pos.x + modDir[direction].x;
        var ny = pos.y + modDir[direction].y;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          //Check if the tile is already visited
          if (!mazeMap[nx][ny].visited) {
            //Carve through walls from this tile to next
            mazeMap[pos.x][pos.y][direction] = true;
            mazeMap[nx][ny][modDir[direction].o] = true;
            //Set Currentcell as next cells Prior visited
            mazeMap[nx][ny].priorPos = pos;
            //Update Cell position to newly visited location
            pos = {
              x: nx,
              y: ny
            };
            cellsVisited++;
            //Recursively call this method on the next tile
            move = true;
            break;
          }
        }
      }
      if (!move) {
        //  If it failed to find a direction,
        //  move the current position back to the prior cell and Recall the method.
        pos = mazeMap[pos.x][pos.y].priorPos;
      }
      if (numCells == cellsVisited) {
        isComp = true;
      }
    }
  }
  // make sure Jack starts from bottom frame
  function defineStartEnd() {
    switch (rand(2)) {
      case 0:
        startCoord = {
          x: height - 1,
          y: width - 1
        };
        endCoord = {
          x: 0,
          y: 0
        };
        break;
      case 1:
        startCoord = {
          x: 0,
          y: width - 1
        };
        endCoord = {
          x: height - 1,
          y: 0
        };
        break;
    }
    chaser.x = startCoord.x;
    chaser.y = startCoord.y;
    // Reset chaser movement interval if it exists
    // if (chaserInterval) {
    //   clearInterval(chaserInterval);
    // }
    // // Start chaser movement after 5 seconds
    // setTimeout(startChaser, 5000);



    diploma.x = endCoord.x;
    diploma.y = endCoord.y;
    // Reset chaser movement interval if it exists
    // if (diplomaInterval) {
    //   clearInterval(diplomaInterval);
    // }
    // Start chaser movement after 5 seconds
    setTimeout(startDiploma, 10000);
  }
  genMap();
  defineStartEnd();
  defineMaze();
}
function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
  var map = Maze.map();
  var cellSize = cellsize;
  var drawEndMethod;
  ctx.lineWidth = cellSize / 40;
  this.redrawMaze = function (size) {
    cellSize = size;
    ctx.lineWidth = cellSize / 50;
    drawMap();
    drawEndMethod();
  };
  function drawCell(xCord, yCord, cell) {
    var x = xCord * cellSize;
    var y = yCord * cellSize;
    if (cell.obstacle) {
      // ctx.fillStyle = "red";
      // ctx.fillRect(x + cellSize / 4, y + cellSize / 4, cellSize / 2, cellSize / 2);
      // Draw text "LAZY" 
      ctx.fillStyle = "red";
      ctx.font = "bold " + "12px Arial";
      ctx.fillText("LAZY", x + cellSize / 8, y + cellSize / 2);
    }
    if (cell.n == false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    if (cell.s === false) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.e === false) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.w === false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
  }
  function drawMap() {
    for (x = 0; x < map.length; x++) {
      for (y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
  }
  function drawEndFlag() {
    var coord = Maze.endCoord();
    var gridSize = 4;
    var fraction = cellSize / gridSize - 2;
    var colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 == 0) {
        colorSwap = !colorSwap;
      }
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.rect(
          coord.x * cellSize + x * fraction + 4.5,
          coord.y * cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (colorSwap) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        }
        ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }
  function drawEndSprite() {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    var coord = Maze.endCoord();
    ctx.drawImage(
      endSprite,
      2,
      2,
      endSprite.width,
      endSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }
  function clear() {
    var canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  }
  if (endSprite != null) {
    drawEndMethod = drawEndSprite;
  } else {
    drawEndMethod = drawEndFlag;
  }
  clear();
  drawMap();
  drawEndMethod();
}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
  var ctx = c.getContext("2d");
  var drawSprite;
  var moves = 0;
  if (sprite != null) {
    drawSprite = drawSpriteImg;
  }
  var player = this;
  var map = maze.map();
  var cellCoords = {
    x: maze.startCoord().x,
    y: maze.startCoord().y
  };
  var cellSize = _cellsize;
  var obstacleCellSize = cellSize / 2;
  this.redrawPlayer = function (_cellsize) {
    cellSize = _cellsize;
    drawSpriteImg(cellCoords);
    // Check for collision with chaser
    if (chaser.x === cellCoords.x && chaser.y === cellCoords.y) {
      loseGame();
      player.unbindKeyDown();
    }

    // Check for collision with chaser
    if (diploma.x === cellCoords.x && diploma.y === cellCoords.y) {
      winGame();
      player.unbindKeyDown();
    }
  };
  function drawSpriteImg(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.drawImage(
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }
  function removeSprite(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.clearRect(
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }
  function check(e) {
    var cell = map[cellCoords.x][cellCoords.y];
    var nextCellCoords = { x: cellCoords.x, y: cellCoords.y };
    moves++;

    // Check if the player is already at the end goal
    // if (cellCoords.x === maze.endCoord().x && cellCoords.y === maze.endCoord().y) {
    //   return; // Prevent movement if the player is already at the end goal
    // }
    // Check if the player is within 3 steps of the end goal
    var playerCoord = { x: cellCoords.x, y: cellCoords.y };
    var endGoalCoord = maze.endCoord();
    var stepsToGoal = Math.abs(playerCoord.x - endGoalCoord.x) + Math.abs(playerCoord.y - endGoalCoord.y);
    // var endGoalChanged = false;
    // var count = 1;
    // if (count === 1) {
    //   if (stepsToGoal <= 2) {
    //     // moveEndGoal();
    //     // maze.endCoord().x = 0;
    //     // maze.endCoord().y = 0;

    //     var newEndCoord = {
    //       x: rand(maze.map().length),
    //       y: rand(maze.map()[0].length)
    //     };

    //     ctx.clearRect(maze.endCoord().x * cellSize, maze.endCoord().y * cellSize, cellSize, cellSize);


    //     // Update the end goal position
    //     maze.endCoord = function () {
    //       return newEndCoord;
    //     };

    //     // Redraw the maze with the new end goal position
    //     draw.redrawMaze(cellSize);
    //     count = 0;
    //   }

    // }
    // Add a flag variable to track if the end goal position has been changed
    var endGoalChanged = false;

  //   if (stepsToGoal <= 2) {
  //     // Check if the end goal position has already been changed
  //     if (!endGoalChanged) {
  //         var newEndCoord = {
  //             x: rand(maze.map().length),
  //             y: rand(maze.map()[0].length)
  //         };

  //         ctx.clearRect(maze.endCoord().x * cellSize, maze.endCoord().y * cellSize, cellSize, cellSize);

  //         // Update the end goal position
  //         maze.endCoord = function () {
  //             return newEndCoord;
  //         };

  //         // Redraw the maze with the new end goal position
  //         draw.redrawMaze(cellSize);

  //         endGoalChanged = true; // Set the flag to true to indicate that the end goal position has changed
  //     }
  // } else {
  //     // Reset the endGoalChanged flag if the player is not within 3 steps of the end goal
  //     endGoalChanged = false;
  // }

    switch (e.keyCode) {
      // west
      case 65: // JS keycode for "A"
      case 37: // JS keycode for "<"
        if (cell.w == true) {
          nextCellCoords.x = cellCoords.x - 1;
          nextCellCoords.y = cellCoords.y;
        }
        break;
      // north
      case 87: // JS keycode for "W"
      case 38: // JS keycode for "^"
        if (cell.n == true) {
          nextCellCoords.x = cellCoords.x;
          nextCellCoords.y = cellCoords.y - 1;
        }
        break;
      // east  
      case 68: // JS keycode for "D"
      case 39: // JS keycode for ">"
        if (cell.e == true) {
          nextCellCoords.x = cellCoords.x + 1;
          nextCellCoords.y = cellCoords.y;
        }
        break;
      // south
      case 83:  // JS keycode for "S"
      case 40:  // JS keycode for "v"
        if (cell.s == true) {
          nextCellCoords.x = cellCoords.x;
          nextCellCoords.y = cellCoords.y + 1;
        }
        break;
    }
    // Check if the next cell contains an obstacle
    if (map[nextCellCoords.x][nextCellCoords.y].obstacle) {
      loseGame(); // Call loseGame function
      return; // Stop further execution
    }
    // If no obstacle, update player's position and redraw
    removeSprite(cellCoords);
    cellCoords = nextCellCoords;
    drawSprite(cellCoords);
  }
  this.bindKeyDown = function () {
    window.addEventListener("keydown", check, false);
    $("#view").swipe({
      swipe: function (
        event,
        direction,
        distance,
        duration,
        fingerCount,
        fingerData
      ) {
        console.log(direction);
        switch (direction) {
          case "up":
            check({
              keyCode: 38
            });
            break;
          case "down":
            check({
              keyCode: 40
            });
            break;
          case "left":
            check({
              keyCode: 37
            });
            break;
          case "right":
            check({
              keyCode: 39
            });
            break;
        }
      },
      threshold: 0
    });
  };
  this.unbindKeyDown = function () {
    window.removeEventListener("keydown", check, false);
    $("#view").swipe("destroy");
  };
  drawSprite(maze.startCoord());
  this.bindKeyDown();
}


var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;
var chaserInterval;
var diplomaInterval;
window.onload = function () {
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }
  //Load and edit sprites
  var completeOne = false;
  var completeTwo = false;
  // var isComplete = () => {
  // if (completeOne === true && completeTwo === true) {
  //   console.log("Runs");
  //   setTimeout(function () {
  //     makeMaze();
  //   }, 500);
  // }
  // };
  sprite = new Image();
  sprite.src =
    "./student.gif" +
    "?" +
    new Date().getTime();
  sprite.setAttribute("crossOrigin", " ");
  sprite.onload = function () {
    completeOne = true;
    console.log(completeOne);
    isComplete();
  };
  finishSprite = new Image();
  finishSprite.src = "./diploma.gif" +
    "?" +
    new Date().getTime();
  finishSprite.setAttribute("crossOrigin", " ");
  finishSprite.onload = function () {
    completeTwo = true;
    console.log(completeTwo);
    isComplete();
  };
};
window.onresize = function () {
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }
  cellSize = mazeCanvas.width / difficulty;
  if (player != null) {
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);
  }
};

function makeMaze() {
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
  var e = document.getElementById("sizeSelect");
  var sizeSelect = document.getElementById("sizeSelect");
  var levelSelect = document.getElementById("levelSelect");
  document.getElementById("menu").style.visibility = "hidden";
  difficulty = e.options[e.selectedIndex].value;
  cellSize = mazeCanvas.width / difficulty;
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  player = new Player(maze, mazeCanvas, cellSize, winGame, sprite);

  // // Check if level 4 is selected
  // if (levelSelect.options[levelSelect.selectedIndex].value === "4") { 
  //   // setTimeout(startDiploma, 2000);
  //   startDiploma();
  //   // setTimeout(startChaser, 5000);
  // }

  // Check if the selected level is 3 or 4
  if (levelSelect.options[levelSelect.selectedIndex].value === "3") {
    // Start the chaser only for level 3 or 4
    setTimeout(startChaser, 5000);
  }
  // Check if the selected level is 3 or 4
  if (levelSelect.options[levelSelect.selectedIndex].value === "4") {
    // Start the chaser only for level 3 or 4
    setTimeout(startChaser, 5000);

  }
  if (document.getElementById("mazeContainer").style.opacity < "100") {
    document.getElementById("mazeContainer").style.opacity = "100";
  }
}
function moveEndGoal() {
  // var newEndCoord = getRandomPosition();
  // maze.endCoord = function() {
  //     return newEndCoord;
  // };
  // draw.redrawMaze(cellSize); // Redraw the maze with the new position of the end goal
  endCoord = {
    x: height - 1,
    y: width - 1
  };
}

// Define a chaser object
var chaser = {
  x: 0,
  y: 0,
};


function moveChaser() {
  // Check the selected level
  var levelSelect = document.getElementById("levelSelect");
  var selectedLevel = levelSelect.options[levelSelect.selectedIndex].value;
  // Stop the chaser if the selected level is 1 or 2
  // if (selectedLevel === "1" || selectedLevel === "2") {
  //   return;
  // }

  var possibleMoves = [];
  if (maze.map()[chaser.x][chaser.y].n == true) {
    possibleMoves.push({ x: chaser.x, y: chaser.y - 1 }); // North
  }
  if (maze.map()[chaser.x][chaser.y].s == true) {
    possibleMoves.push({ x: chaser.x, y: chaser.y + 1 }); // South
  }
  if (maze.map()[chaser.x][chaser.y].e == true) {
    possibleMoves.push({ x: chaser.x + 1, y: chaser.y }); // East
  }
  if (maze.map()[chaser.x][chaser.y].w == true) {
    possibleMoves.push({ x: chaser.x - 1, y: chaser.y }); // West
  }
  // If there are possible moves, choose one randomly
  if (possibleMoves.length > 0) {
    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    var randomMove = possibleMoves[randomIndex];
    chaser.x = randomMove.x;
    chaser.y = randomMove.y;
  }
}
function drawChaser() {

  // Check the selected level
  var levelSelect = document.getElementById("levelSelect");
  var selectedLevel = levelSelect.options[levelSelect.selectedIndex].value;

  // Only draw the diploma if the selected level is 4
  if (selectedLevel === "3" || selectedLevel === "4") {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);
    // ctx.fillStyle = "yellow";
    // ctx.fillRect(
    //   chaser.x * cellSize + offsetLeft,
    //   chaser.y * cellSize + offsetLeft,
    //   cellSize - offsetRight,
    //   cellSize - offsetRight
    // );
    // Display text "TIME"
    ctx.fillStyle = "black";
    ctx.font = "bold " + "15px Arial";
    ctx.fillText("TIME", chaser.x * cellSize, chaser.y * cellSize + offsetLeft + 20);
  }
}

function startChaser() {
  chaserInterval = setInterval(updateChaser, 100);
}

function updateChaser() {
  moveChaser();
  drawChaser();
}



// Define a diploma object
var diploma = {
  x: 0,
  y: 0
};

// Function to move the diploma
function moveDiploma() {

  var levelSelect = document.getElementById("levelSelect");
  var selectedLevel = levelSelect.options[levelSelect.selectedIndex].value;
  // Stop the chaser if the selected level is 1 or 2
  // if (selectedLevel === "1" || selectedLevel === "2" || selectedLevel === "3") {
  //   return;
  // }

  var possibleMoves = [];
  if (maze.map()[diploma.x][diploma.y].n == true) {
    possibleMoves.push({ x: diploma.x, y: diploma.y - 1 }); // North
  }
  if (maze.map()[diploma.x][diploma.y].s == true) {
    possibleMoves.push({ x: diploma.x, y: diploma.y + 1 }); // South
  }
  if (maze.map()[diploma.x][diploma.y].e == true) {
    possibleMoves.push({ x: diploma.x + 1, y: diploma.y }); // East
  }
  if (maze.map()[diploma.x][diploma.y].w == true) {
    possibleMoves.push({ x: diploma.x - 1, y: diploma.y }); // West
  }
  // If there are possible moves, choose one randomly
  if (possibleMoves.length > 0) {
    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    var randomMove = possibleMoves[randomIndex];
    diploma.x = randomMove.x;
    diploma.y = randomMove.y;
  }
}

// Function to draw the diploma
function drawDiploma() {
  // Check the selected level
  var levelSelect = document.getElementById("levelSelect");
  var selectedLevel = levelSelect.options[levelSelect.selectedIndex].value;

  // Only draw the diploma if the selected level is 4
  if (selectedLevel === "4") {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    var coord = { x: diploma.x, y: diploma.y };

    ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);

    ctx.drawImage(
      finishSprite,
      0,
      0,
      finishSprite.width,
      finishSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }
}

// Function to start moving the diploma
function startDiploma() {
  diplomaInterval = setInterval(updateDiploma, 100); // Change the interval as needed
}

// Function to update the diploma's position and redraw
function updateDiploma() {
  moveDiploma();
  drawDiploma();
}