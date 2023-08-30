// Initial references from HTML doc
const container = document.querySelector('.container');
const playerTurn = document.querySelector('#player-turn');
const startScreen = document.querySelector('.start-screen');
const startButton = document.getElementById('start');
const message = document.getElementById('message');
const playerOne = document.querySelector('.player-one');
const playerTwo = document.querySelector('.player-two');

let userOneName = document.querySelector('.player-container-one');
let userTWoName = document.querySelector('.player-container-two');

let playerNames = {};

let playerScores = {};

let playerOneScoreCard = document.getElementById('player-one-score');
let playerTwoScoreCard = document.getElementById('player-two-score');

// let chipOneColor = document.getElementById('player-one-color').value;
// let chipTwoColor = document.getElementById('player-two-color').value;
//const playerChipOne = document.querySelector('.player-one::before');
//const playerChipTwo = document.querySelector('.player-two::before');

let initialMatrix = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

let currentPlayer;

// Random number between Range
const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

//Loop through array and check for same values (chips)
const verifyArray = (arrayElement) => {
  let bool = false;
  let elementCount = 0;
  arrayElement.forEach((element) => {
    if (element === currentPlayer) {
      elementCount += 1;
      if (elementCount === 4) {
        bool = true;
      }
    } else {
      elementCount = 0;
    }
  });
  return bool;
};

// check for game over
const gameOverCheck = () => {
  let truthCount = 0;
  for (let innerArray of initialMatrix) {
    if (innerArray.every((val) => val != 0)) {
      truthCount += 1;
    } else {
      return false;
    }
  }
  if (truthCount === 6) {
    message.innerText = 'Game Over'
    startScreen.classList.remove('hide');
  }
};

// check rows
const checkAdjacentRowValues = (row) => {
  return verifyArray(initialMatrix[row]);
};

// check columns
// similar logic to verifyArray but need to use entire initialMatrix, not just the individual array like rows
const checkAdjacentColumnValues = (column) => {
  let colWinCount = 0,
    colWinBool = false;
  initialMatrix.forEach((chip, index) => {
    if (chip[column] === currentPlayer) {
      colWinCount += 1;
      if (colWinCount === 4) {
        colWinBool = true;
      }
    } else {
      colWinCount = 0;
    }
  });
  // no match
  return colWinBool;
}

// Get Right diagonal values
const getRightDiagonal = (row, column, rowlength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let rightDiagonal = [];
  while (rowCount > 0) {
    if (columnCount >= columnLength - 1) {
      break;
    }
    rowCount -= 1;
    columnCount += 1;
    rightDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  while (rowCount < rowlength) {
    if (columnCount < 0) {
      break;
    }
    rightDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount -= 1;
  }
  return rightDiagonal;
};

// Get Left diagonal values
const getLeftDiagonal = (row, column, rowlength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let leftDiagonal = [];
  while (rowCount > 0) {
    if (columnCount >= columnLength - 1) {
      break;
    }
    rowCount -= 1;
    columnCount -= 1;
    leftDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  while (rowCount < rowlength) {
    if (columnCount < 0) {
      break;
    }
    leftDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount += 1;
  }
  return leftDiagonal;
};

// needed values in order to check diagonally
// Check Diagonal
const checkAdjacentDiagonalValues = (row, column) => {
  let diagWinBool = false;
  let tempChecks = {
    leftTop: [],
    rightTop: [],
  };
  let columnLength = initialMatrix[row].length;
  let rowLength = initialMatrix.length;

  //Store left and right diagonal array
  tempChecks.leftTop = [
    ...getLeftDiagonal(row, column, rowLength, columnLength),
  ];
  tempChecks.rightTop = [
    ...getRightDiagonal(row, column, rowLength, columnLength),
  ];
  diagWinBool = verifyArray(tempChecks.rightTop);
  if (!diagWinBool) {
    diagWinBool = verifyArray(tempChecks.leftTop)
  }
  return diagWinBool;
};

const winCheck = (row, column) => {
  // if any of the functions return true we return true
  return checkAdjacentRowValues(row)
    ? true
    : checkAdjacentColumnValues(column)
      ? true
      : checkAdjacentDiagonalValues(row, column)
        ? true
        : false;
};

// update player scores
const updateScores = () => {
  playerOneScoreCard.textContent = playerScores[1];
  playerTwoScoreCard.textContent = playerScores[2];
}

// Set the chip
const setChip = async (startCount, colValue) => {
  let rows = document.querySelectorAll('.grid-row');
  // initially it will place the circles in the last row else if no place available we will decrement the count until we find empty sot
  if (initialMatrix[startCount][colValue] != 0) {
    startCount -= 1;
    //await new Promise((resolve) => setTimeout(resolve, 500));
    setChip(startCount, colValue);
  } else {
    // place chip
    let currentRow = rows[startCount].querySelectorAll('.grid-box');
    // currentRow[colValue].style.setProperty('top', `${(5 - startCount) * 5}em`);
    currentRow[colValue].classList.add('filled', `player${currentPlayer.innerHTML}`);


    // get the player chip color
    let chipColor = currentPlayer === 1 ? getComputedStyle(playerOne).getPropertyValue('--player-one-color')
      : getComputedStyle(playerTwo).getPropertyValue('--player-two-color');
    currentRow[colValue].style.setProperty('background', chipColor);
    // create the radial gradient background value with the desired sizes
    let radialGradientValue = `radial-gradient(circle, ${chipColor} 1.37em, transparent 1.12em)`;
    currentRow[colValue].style.setProperty('background', radialGradientValue);
    //currentRow[colValue].style.setProperty('transition', `${(5 - startCount) * 5}em`);

    //update matrix
    initialMatrix[startCount][colValue] = currentPlayer;
    //check for wins
    if (winCheck(startCount, colValue)) {
      message.innerHTML = `<span> ${playerNames[currentPlayer]}</span> wins!`;
      playerScores[currentPlayer]++; // increment the player's score
      updateScores();
      localStorage.setItem('playerScores', JSON.stringify(playerScores)); // store scores even after page refresh
      startScreen.classList.remove('hide');
      return false;
    }
  }
  // check if all are full
  gameOverCheck();
};

//When user clicks on a box
const fillBox = (e) => {
  // get column value
  let colValue = parseInt(e.target.getAttribute('data-value'));
  // 5 because we have 6 rows (0-5)
  setChip(5, colValue);


  currentPlayer = currentPlayer === 1 ? 2 : 1;
  playerTurn.innerHTML = `<span>${playerNames[currentPlayer]}'s</span> turn`;
};

// create matrix
const matrixCreator = () => {
  for (let innerArray in initialMatrix) {
    let outerDiv = document.createElement('div');
    outerDiv.classList.add('grid-row');
    outerDiv.setAttribute('data-value', innerArray);
    for (let j in initialMatrix[innerArray]) {
      // set all matrix values to 0
      initialMatrix[innerArray][j] = 0;
      let innerDiv = document.createElement('div');
      innerDiv.classList.add('grid-box');
      innerDiv.setAttribute('data-value', j);
      innerDiv.addEventListener('click', (e) => {
        fillBox(e);
      });
      outerDiv.appendChild(innerDiv);
    }
    container.appendChild(outerDiv);
  }
};



//initialise game
window.onload = startGame = async () => {
  const storedPlayerScores = JSON.parse(localStorage.getItem('playerScores'));
  if (storedPlayerScores) {
    playerScores = storedPlayerScores; // restore player scores
    updateScores(); // update score display
  }
  // between 1 and 2
  currentPlayer = generateRandomNumber(1, 3);
  container.innerHTML = '';
  await matrixCreator();
  playerTurn.innerHTML = `<span> ${playerNames[currentPlayer]}'s</span> turn`;
};

//start game
startButton.addEventListener('click', () => {
  startScreen.classList.add('hide');
  let playerOneName = document.getElementById('player-one-name').value;
  let playerTwoName = document.getElementById('player-two-name').value;
  let chipOneColor = document.getElementById('player-one-color').value;
  let chipTwoColor = document.getElementById('player-two-color').value;
  playerOne.innerHTML = playerOneName;
  playerTwo.innerHTML = playerTwoName;


  document.documentElement.style.setProperty('--player-one-color', chipOneColor);
  document.documentElement.style.setProperty('--player-two-color', chipTwoColor);

  playerNames = {
    1: playerOneName,
    2: playerTwoName,
  }

  playerScores = {
    1: 0,
    2: 0,
  }; //initialize player scores
  updateScores(); // initialize score display
  startGame();
});





