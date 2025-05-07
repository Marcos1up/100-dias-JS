let canvas = document.getElementById('game'),
  ctx = canvas.getContext('2d'),
  ballRadius = 9,
  x = canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3),
  y = canvas.height - 40,
  dx = 1, //velocidad
  dy = -2;

let paddleHeight = 12,
  paddleWidth = 72;

let paddleX = (canvas.width - paddleWidth) / 2;

//organizacion de los bricks
let rowCount = 5,
  columnCount = 9,
  brickWidth = 54,
  brickHeight = 18,
  brickPadding = 12,
  topOffset = 40,
  leftOffset = 33,
  score = 0;

//array de bricks
let bricks = [];
for (let c = 0; c < columnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < rowCount; r++) {
    //coordenadas x y
    bricks[c][r] = { x: 0, y: 0, status: 1 }; //estado (1=visible 0=golpeadd)
  }
}

document.addEventListener('mousemove', mouseMoveHandler, false);

//movimiento del mause
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

//dibujar la paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.roundRect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight,
    30
  );
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.closePath();
}

//dibujar la ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.closePath();
}

//dibujar bricks
function drawBricks() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      //solo dibuja los que no furon golpeados
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + leftOffset;
        let brickY = r * (brickHeight + brickPadding) + topOffset;

        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 30);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//score
function trackScore() {
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#333';
  ctx.fillText('Score : ' + score, 8, 24);
}

//co;liciones
function hitDetection() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let b = bricks[c][r];
      //solo colisiones con bricks visibles
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;

          //si se han eliminado todos los brick
          if (score === rowCount * columnCount) {
            alert('You Win!');
            document.location.reload(); //reload
          }
        }
      }
    }
  }
}

//funcion principal
function init() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //dibujmos todo
  trackScore();
  drawBricks();
  drawBall();
  drawPaddle();
  hitDetection();

  //coliciones
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy; //rebota en la paddle
    } else {
      alert('Game Over!');
      document.location.reload();
    }
  }

  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }

  //actualizamos posicion
  x += dx;
  y += dy;
}

//bucle
setInterval(init, 10);
