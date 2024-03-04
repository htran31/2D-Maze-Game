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