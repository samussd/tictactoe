const gameBoard = (() => {

  const array = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]

  const change = (row, column, content) => {
    array[row][column].changeContent(content);

  }

  const reset = () => {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        array[i][j].changeContent(0);
      }
    }
  }

  const getContent = (row, column) => {
    return array[row][column].getContent();
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
      array[row][col] = tile;

      tileElem.addEventListener('click', (e) => { gameController.handleTileClick(tile) });
    });
  }

  return {
    change,
    getContent,
    reset,
    start
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
  let turn = 'player';
  let playerOption = 1;
  let enemyOption = 2;
  let gameStatus = 0;

  const start = () => {
    //TODO: check player option => check who plays first
    const gameboardTiles = document.querySelectorAll('.gameboard__tile');
  }

  const handleTileClick = (tile) => {
    if (tile.getContent() === 0 && turn === 'player') {
      turn = 'enemy';
      tile.changeContent(playerOption);
      gameStatus = checkForGameEnd();
      if (gameStatus != 0) handleGameEnd();
      else enemyTurn();
    }
  }

  const enemyTurn = () => {
    setTimeout(() => {
      while (true) {
        const randi = Math.floor(Math.random() * 3);
        const randj = Math.floor(Math.random() * 3);

        if (gameBoard.getContent(randi, randj) === 0) {
          gameBoard.change(randi, randj, enemyOption);
          gameStatus = checkForGameEnd();
          if (gameStatus != 0) handleGameEnd();
          else turn = 'player';
          break;
        }
      }
    }, 500);
  }

  const handleGameEnd = () => {
    setTimeout(() => {
      gameBoard.reset();
      gameStatus = 0;
      turn = 'player';
    }, 1000);
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
}) ();

gameBoard.start();
gameController.start();
