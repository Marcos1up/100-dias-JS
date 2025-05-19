const PLAYER_X = 'x';
const PLAYER_O = 'o';
const NO_PLAYER = 'none';

// Estado del juego
let playerTurn = PLAYER_X;
let moves = 0;
let isGameOver = false;

const boardCells = document.getElementsByTagName('span');
const body = document.getElementsByTagName('body')[0];

//SVG para el reinicio
const restartIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/></svg>';
const restartButton = `<button onclick="playAgain()">${restartIcon}</button>`;

//combinaciones
const winningCombinations = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

function play(cell) {
  if (cell.dataset.player === NO_PLAYER && !isGameOver) {
    cell.innerHTML = playerTurn;
    cell.dataset.player = playerTurn;
    moves++;

    //cambiar jugador
    playerTurn = playerTurn === PLAYER_X ? PLAYER_O : PLAYER_X;

    checkAllWinningCombinations();

    //empate?
    if (moves === 9 && !isGameOver) {
      showDrawAlert();
    }
  }
}

function checkAllWinningCombinations() {
  winningCombinations.forEach((combination) => {
    checkWinner(combination[0], combination[1], combination[2]);
  });
}

function checkWinner(a, b, c) {
  const i = a - 1;
  const j = b - 1;
  const k = c - 1;

  const cellI = boardCells[i];
  const cellJ = boardCells[j];
  const cellK = boardCells[k];

  if (
    !isGameOver &&
    cellI.dataset.player !== NO_PLAYER &&
    cellI.dataset.player === cellJ.dataset.player &&
    cellJ.dataset.player === cellK.dataset.player
  ) {
    //marca de celdas ganadoras
    highlightWinningCells([cellI, cellJ, cellK]);
    showWinnerAlert(cellI.dataset.player);
  }
}

function highlightWinningCells(cells) {
  cells.forEach((cell) => {
    cell.parentNode.classList.add('activeBox');
  });
}

//alerta de juego ganado
function showWinnerAlert(winner) {
  const message = `
    <b>Juego terminado</b><br><br> 
    El jugador ${winner.toUpperCase()} ha ganado! <br><br>
    ${restartButton}
  `;
  showAlert(message);
  endGame();
}

//alerta de empate
function showDrawAlert() {
  const message = `<b>EMPATE!</b><br><br>${restartButton}`;
  showAlert(message);
  endGame();
}

function showAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert';
  alertDiv.innerHTML = message;
  body.appendChild(alertDiv);
}

function endGame() {
  isGameOver = true;
  moves = 0;
}

function playAgain() {
  removeAlert();

  resetGameState();

  removeWinningHighlights();
}

//eliminar la alerta
function removeAlert() {
  const alert = document.getElementsByClassName('alert')[0];
  if (alert) {
    alert.parentNode.removeChild(alert);
  }
}

function removeWinningHighlights() {
  for (let i = 0; i < boardCells.length; i++) {
    boardCells[i].parentNode.classList.remove('activeBox');
  }
}

//reinicia el estado del jueg

function resetGameState() {
  for (let i = 0; i < boardCells.length; i++) {
    boardCells[i].dataset.player = NO_PLAYER;
    boardCells[i].innerHTML = '&nbsp;';
  }

  playerTurn = PLAYER_X;
  isGameOver = false;
  moves = 0;
}
