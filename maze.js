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
        setInterval(toggleObstacleVisibility, 2000);
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
                        mazeMap[pos.x][pos.y][direction] = true;
                        mazeMap[nx][ny][modDir[direction].o] = true;
                        mazeMap[nx][ny].priorPos = pos;
                        pos = {
                            x: nx,
                            y: ny
                        };
                        cellsVisited++;
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

        chaser2.x = endCoord.x;
        chaser2.y = endCoord.y;
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
                    ctx.fillStyle = "rgba(100, 34, 140, 1)"; //maze wall color?
                } else {
                    ctx.fillStyle = "rgba(100, 34, 140, 1)";
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



function makeMaze() {
    playAudio();
    if (player != undefined) {
        player.unbindKeyDown();
        player = null;
    }
    document.getElementById("menu").style.visibility = "hidden";
    var sizeSelect = document.getElementById("sizeSelect");
    var levelSelect = document.getElementById("levelSelect");
    difficulty = sizeSelect.options[sizeSelect.selectedIndex].value;
    level = levelSelect.options[levelSelect.selectedIndex].value;
    cellSize = mazeCanvas.width / difficulty;
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite, chaserSprite);
    player = new Player(maze, mazeCanvas, cellSize, winGame, sprite);

    // Check if the selected level is 3 or 4
    if (level === "3" || level === "4") {
        setTimeout(startChaser, 5000);
    }
    if (document.getElementById("mazeContainer").style.opacity < "100") {
        document.getElementById("mazeContainer").style.opacity = "100";
    }


    // Start chaser movement after 5 seconds
    setTimeout(startchaser2, 10000);
    setTimeout(startChaser, 15000);
}

