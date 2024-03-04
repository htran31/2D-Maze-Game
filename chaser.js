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
    if (selectedLevel === "1" || selectedLevel === "2") {
      return;
    }
    
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
  function startChaser() {
    chaserInterval = setInterval(updateChaser, 100);
  }
   
  function updateChaser() {
    moveChaser();
    drawChaser();
  }
  