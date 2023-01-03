let board, context, appleAudio, gameOverAudio;

let blockSize = 20,
  cols = 30,
  rows = 20;

let snakeX = 0,
  snakeY = 0,
  velocityX = 1,
  velocityY = 0,
  tail = [];

let foodX = 0,
  foodY = 0;

let score = 0,
  isGameOver = false;

window.onload = () => {
  board = document.getElementById('board');
  context = board.getContext('2d');

  appleAudio = new Audio('apple_sound.mp3');
  gameOverAudio = new Audio('game_over_sound.mp3');

  board.width = cols * blockSize;
  board.height = rows * blockSize;

  document.addEventListener('keyup', changeDirection);

  board.addEventListener('click', () => {
    isGameOver = false;
    score = 0;
  });

  foodPlace();

  setInterval(update, 1000 / 10);
};

function update() {
  // clear screen
  createRect(0, 0, board.width, board.height);

  if (isGameOver) {
    // game end screen
    createText(
      'Game Over',
      board.width / 2,
      board.height / 2 - 25,
      'center',
      50
    );

    createText(
      `Score: ${score}`,
      board.width / 2,
      board.height / 2 + 25,
      'center'
    );

    createText(
      'Click to start again',
      (cols * blockSize) / 2,
      board.height - 50,
      'center'
    );

    return;
  }

  // write score
  createText(`Score: ${score}`, 30, 40);

  // create first food
  createRect(foodX, foodY, blockSize, blockSize, 'lime');

  // did it eat
  if (snakeX === foodX && snakeY === foodY) {
    tail.push([foodX, foodY]);

    score += 10;

    appleAudio.play();

    foodPlace();
  }

  // snake tail
  for (let i = tail.length - 1; i > 0; i--) {
    tail[i] = tail[i - 1];
  }

  if (tail.length) {
    tail[0] = [snakeX, snakeY];
  }

  //snake position
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;

  createRect(snakeX, snakeY, blockSize, blockSize, 'orange');

  for (let i = 0; i < tail.length; i++) {
    createRect(tail[i][0], tail[i][1], blockSize, blockSize, 'lime');
  }

  // hit the wall
  if (
    snakeX < 0 ||
    snakeX > cols * blockSize ||
    snakeY < 0 ||
    snakeY > rows * blockSize
  ) {
    gameOverEvent();
  }

  // shot herself
  for (let i = 0; i < tail.length; i++) {
    if (snakeX === tail[i][0] && snakeY === tail[i][1]) {
      gameOverEvent();
    }
  }
}

function foodPlace() {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
}

function changeDirection(e) {
  switch (e.code) {
    case 'ArrowUp':
      velocityX = 0;
      velocityY = -1;
      break;
    case 'ArrowDown':
      velocityX = 0;
      velocityY = 1;
      break;
    case 'ArrowLeft':
      velocityX = -1;
      velocityY = 0;
      break;
    case 'ArrowRight':
      velocityX = 1;
      velocityY = 0;
      break;

    default:
      velocityX = 1;
      velocityY = 0;
      break;
  }
}

function gameOverEvent() {
  isGameOver = true;
  gameOverAudio.play();
  tail = [];
  snakeX = 0;
  snakeY = 0;
  velocityX = 1;
  velocityY = 0;
}

function createRect(x, y, width, height, color = 'black') {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

function createText(text, x, y, textAlign = 'start', fontSize = 20) {
  context.fillStyle = 'lime';
  context.font = `${fontSize}px Roboto Mono`;
  context.textAlign = textAlign;
  context.fillText(text, x, y);
}
