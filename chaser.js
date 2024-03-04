var chaser = {
    x: 0,
    y: 0,
};


function moveChaser() {
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
    var levelSelect = document.getElementById("levelSelect");
    var selectedLevel = levelSelect.options[levelSelect.selectedIndex].value;

    // Only draw the chaser2 if the selected level is 4
    if (selectedLevel === "3" || selectedLevel === "4") {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);

        ctx.fillStyle = "black";
        ctx.font = "bold " + "15px Arial";
        ctx.fillText("TIME", chaser.x * cellSize, chaser.y * cellSize + offsetLeft + 20);
    }
}




function startChaser() {
    if (gameActive == false) return;
    var levelSelect = document.getElementById("levelSelect");
    var selectedLevel = levelSelect.options[levelSelect.selectedIndex].value;

    // Only draw the chaser2 if the selected level is 4
    if (selectedLevel === "3" || selectedLevel === "4") {
        chaserAudio.play();
        clearInterval(chaser2Interval);
        chaserInterval = setInterval(updateChaser, 100);
    }
}



function updateChaser() {
    moveChaser();
    drawChaser();
}



var chaser2 = {
    x: 0,
    y: 0
};




function movechaser2() {
    var possibleMoves = [];
    if (maze.map()[chaser2.x][chaser2.y].n == true) {
        possibleMoves.push({ x: chaser2.x, y: chaser2.y - 1 }); // North
    }
    if (maze.map()[chaser2.x][chaser2.y].s == true) {
        possibleMoves.push({ x: chaser2.x, y: chaser2.y + 1 }); // South
    }
    if (maze.map()[chaser2.x][chaser2.y].e == true) {
        possibleMoves.push({ x: chaser2.x + 1, y: chaser2.y }); // East
    }
    if (maze.map()[chaser2.x][chaser2.y].w == true) {
        possibleMoves.push({ x: chaser2.x - 1, y: chaser2.y }); // West
    }

    // If there are possible moves, choose one randomly
    if (possibleMoves.length > 0) {
        var randomIndex = Math.floor(Math.random() * possibleMoves.length);
        var randomMove = possibleMoves[randomIndex];
        chaser2.x = randomMove.x;
        chaser2.y = randomMove.y;
    }
}



function drawchaser2() {
    var levelSelect = document.getElementById("levelSelect");
    var selectedLevel = levelSelect.options[levelSelect.selectedIndex].value;

    // Only draw the chaser2 if the selected level is 4
    if (selectedLevel === "4") {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        var coord = { x: chaser2.x, y: chaser2.y };

        ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);

        ctx.fillStyle = "black";
        ctx.font = "bold " + "12px Arial";
        ctx.fillText("DELAY", chaser2.x * cellSize, chaser2.y * cellSize + offsetLeft + 20);
    }
}


function startchaser2() {
    if (gameActive == false) return;
    clearInterval(chaserInterval);
    chaser2Interval = setInterval(updatechaser2, 100);
}



function updatechaser2() {
    movechaser2();
    drawchaser2();
}