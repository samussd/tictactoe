import { moveFinder } from "/scripts/util.js";

const gameBoard = (() => {

  const _array = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]

  const change = (row, column, content) => {
    _array[row][column].changeContent(content);

  }

  const reset = () => {
    for (let i = 0; i < _array.length; i++) {
      for (let j = 0; j < _array.length; j++) {
        _array[i][j].changeContent(0);
      }
    }
  }

  const getContent = (row, column) => {
    return _array[row][column].getContent();
  }

  const start = () => {
    const gameboardTiles = document.querySelectorAll('.gameboard__tile');
    gameboardTiles.forEach((tileElem, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      tileElem.setAttribute("data-row", row);
      tileElem.setAttribute("data-col", col);

      const tile = makeTile(row, col);
      tile.changeContent(0);
      _array[row][col] = tile;

      tileElem.addEventListener('click', (e) => { gameController.handleTileClick(tile) });
    });
  }

  return {
    change,
    getContent,
    reset,
    start,
    _array
  };
})();

const makeTile = (row, col) => {
  const tile = document.querySelector(`.gameboard__tile[data-row="${row}"][data-col="${col}"]`);

  let content = 0; //0 empty, 1 X, 2 O

  const changeContent = (newContent) => {
    content = newContent;
    if (newContent === 0) tile.style.backgroundColor = 'transparent';
    else if (newContent === 1) {
      tile.style.backgroundColor = 'var(--icon-clr)';
      tile.style.webkitMaskImage = "url('assets/x.svg')";
      tile.style.maskImage = "url('assets/x.svg')";
    }
    else if (newContent === 2) {
      tile.style.backgroundColor = 'var(--icon-clr)';
      tile.style.webkitMaskImage = "url('assets/o.svg')";
      tile.style.maskImage = "url('assets/o.svg')";
    };
  }

  const getContent = () => {
    return content;
  }

  return {
    changeContent,
    getContent
  }
}

const gameController = (() => {
  let turn = 'player'; //either 'player' or 'enemy'
  let playerOption = 0; //0 didn't choose, 1 X, 2 O
  let enemyOption = 0; //0 didn't choose, 1 X, 2 O
  let gameWinner = 0; //0 game didnt end, 1 X, 2 O, 3 draw
  let difficulty = 0; //0 easy, 1 impossible

  const xBtn = document.querySelector('.utility__x-btn-wrapper');
  const oBtn = document.querySelector('.utility__o-btn-wrapper');
  const resetBtn = document.querySelector('.utility__reset-btn-wrapper');
  const diffBtn = document.querySelector('.utility__diff-btn-wrapper');

  const winnerScreen = document.querySelector('.winner');
  const winnerSymbol = document.querySelector('.winner__symbol');
  const winnerText = document.querySelector('.winner__text');

  //add all event listeners
  const start = () => {
    xBtn.addEventListener('click', () => {
      if (xBtn.classList.contains('active')) return;
      playerOption = 1;
      xBtn.classList.add('active');
      oBtn.classList.remove('active');
      gameReset();
      gameStart();
    });

    oBtn.addEventListener('click', () => {
      if (oBtn.classList.contains('active')) return;
      turn = 'enemy';
      oBtn.classList.add('active');
      xBtn.classList.remove('active');
      playerOption = 2;
      gameReset();
      gameStart();
    });

    resetBtn.addEventListener('click', () => {
      if (turn === 'enemy') return;
      gameReset();
      gameStart();
    })

    diffBtn.addEventListener('click', () => {
      difficulty = (difficulty===1 ? 0 : 1);
      diffBtn.classList.toggle('active');
    })

    winnerScreen.addEventListener('click', () => {
      gameReset();
      gameStart();
    })
  }

  const gameStart = () => {
    if (playerOption === 1) {
      enemyOption = 2;
      turn = 'player';
    }
    if (playerOption === 2) {
      enemyOption = 1;
      turn = 'enemy';
      enemyTurn();
    }
  }
  
  const gameReset = () => {
    winnerScreen.classList.remove('display');
    gameBoard.reset();
    gameWinner = 0;
    turn = 'player';
  }
  
  const handleTileClick = (tile) => {
    //player didnt select side yet -> chose X auto
    if (playerOption === 0) {
      xBtn.click();
    }

    if (tile.getContent() === 0 && turn === 'player') {
      turn = 'enemy';
      tile.changeContent(playerOption);
      gameWinner = checkForGameEnd();
      if (gameWinner != 0) handleGameEnd();
      else enemyTurn();
    }
  }

  const enemyTurn = () => {
    setTimeout(() => {
      let i = 0;
      let j = 0;
      if (difficulty === 0) {
        while (turn === 'enemy') {
          const randi = Math.floor(Math.random() * 3);
          const randj = Math.floor(Math.random() * 3);

          if (gameBoard.getContent(randi, randj) === 0) {
            i = randi;
            j = randj
            break;
          }
        }
      }
      else {
        const rawBoard = gameBoard._array.map((row) => row.map((e) => e.getContent()));
        const bestMove = moveFinder.findBestMove(rawBoard);
        i = bestMove.row;
        j = bestMove.col;
      }

      gameBoard.change(i, j, enemyOption);
      gameWinner = checkForGameEnd();
      if (gameWinner != 0) handleGameEnd();
      else turn = 'player';

    }, 500);
  }

  const handleGameEnd = () => {
    setTimeout(() => {
      winnerScreen.classList.add('display');
      winnerText.textContent = (gameWinner == 3 ? 'DRAW' : 'WON THE GAME!');
      if (gameWinner == 1) {
        winnerSymbol.style.display = 'block';
        winnerSymbol.style.webkitMaskImage = `url('assets/x.svg')`;
        winnerSymbol.style.maskImage = "url('assets/x.svg')";
      } else if (gameWinner == 2) {
        winnerSymbol.style.display = 'block';
        winnerSymbol.style.webkitMaskImage = `url('assets/o.svg')`;
        winnerSymbol.style.maskImage = "url('assets/o.svg')";
      } else {
        winnerSymbol.style.display = 'none';
      }
      gameBoard.reset();
    }, 500);
  }


  //return 0 for not end, 1 for X win, 2 for O win, 3 for draw
  const checkForGameEnd = () => {
    for (let i = 0; i < 3; i++) {
      if (
        gameBoard.getContent(i, 0) !== 0 &&
        gameBoard.getContent(i, 0) === gameBoard.getContent(i, 1) &&
        gameBoard.getContent(i, 0) === gameBoard.getContent(i, 2)
      ) {
        return gameBoard.getContent(i, 0);
      }
      if (
        gameBoard.getContent(0, i) !== 0 &&
        gameBoard.getContent(0, i) === gameBoard.getContent(1, i) &&
        gameBoard.getContent(0, i) === gameBoard.getContent(2, i)
      ) {
        return gameBoard.getContent(0, i);
      }
    }
    if (
      gameBoard.getContent(0, 0) !== 0 &&
      gameBoard.getContent(0, 0) === gameBoard.getContent(1, 1) &&
      gameBoard.getContent(0, 0) === gameBoard.getContent(2, 2)
    ) {
      return gameBoard.getContent(0, 0);
    }
    if (
      gameBoard.getContent(0, 2) !== 0 &&
      gameBoard.getContent(0, 2) === gameBoard.getContent(1, 1) &&
      gameBoard.getContent(0, 2) === gameBoard.getContent(2, 0)
    ) {
      return gameBoard.getContent(0, 2);
    }
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (gameBoard.getContent(row, column) === 0) {
          return 0;
        }
      }
    }
    return 3;
  }

  return {
    start,
    handleTileClick
  }
})();

gameBoard.start();
gameController.start();
