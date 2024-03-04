var bgAudio = new Audio('audio/sound.mp3');
var winAudio = new Audio('audio/win.mp3');
var loseAudio = new Audio('audio/windows-error.mp3');
var chaserAudio = new Audio('audio/run.mp3');

function playAudio() {
  bgAudio.play();
}

function pauseAudio() {
  bgAudio.pause();
}

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

function toggleVisablity(id) {
  if (document.getElementById(id).style.visibility == "visible") {
    document.getElementById(id).style.visibility = "hidden";
    return;
  } else {
    document.getElementById(id).style.visibility = "visible";
    return;
  }
}

function winGame() {
  gameActive = false;
  bgAudio.pause();
  chaserAudio.pause();
  winAudio.play();
  toggleVisablity("Win-Message-Container");
  clearInterval(chaserInterval);
  clearInterval(chaser2Interval);
}

function loseGame() {
  gameActive = false;
  bgAudio.pause();
  chaserAudio.pause();
  loseAudio.play();
  toggleVisablity("Lose-Message-Container");
  clearInterval(chaserInterval);
  clearInterval(chaser2Interval);
}

function resetGame() {
  window.location.href = "index.html";
}



var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite, finishSprite, chaserSprite;
var maze, draw, player;
var cellSize;
var difficulty;
var chaserInterval;
var chaser2Interval;
var gameActive = true;



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

  sprite = new Image();
  sprite.src =
    "./img/student.png" +
    "?" +
    new Date().getTime();
  sprite.setAttribute("crossOrigin", " ");
  sprite.onload = function () {
    completeOne = true;
    console.log(completeOne);
    isComplete();
  };

  //goal
  finishSprite = new Image();
  finishSprite.src = "./img/diploma.gif" +
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