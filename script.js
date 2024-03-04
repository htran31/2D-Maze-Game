
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
}
function loseGame() {
  toggleVisablity("Lose-Message-Container");
  clearInterval(chaserInterval);
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




var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;
var chaserInterval;
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

