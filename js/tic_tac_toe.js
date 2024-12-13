const tic_tac_toe_game = (function(win, doc) {
    const BOARD_SIDE_LENGTH = 3;
    
    // gameboard coordinates are layed out as a 3x3 grid with y=0 being the
    // bottom and x=0 being the left
    let gameboard = (function (boardSideLength) {
	const SPACE_STATES = Object.freeze({
	    UNUSED : " ",
	    X : "X",
	    O : "O"
	});
	const INITIAL_BOARD =
	    Array.from({length: BOARD_SIDE_LENGTH},
		() => Array(BOARD_SIDE_LENGTH).fill(SPACE_STATES.UNUSED));

	// A deep copy is needed to prevent the board from reusing the
	// old board state
	function deepCopyArray(array) {
	    return JSON.parse(JSON.stringify(array));
	}

	let board = deepCopyArray(INITIAL_BOARD);

	function isCoordinatesInBoard(x, y) {
	    let isXInBoard = x >= 0 || x < boardSideLength;
	    let isYInBoard = y >= 0 || y < boardSideLength;
	    return isXInBoard && isYInBoard;
	}
	
	function getSpaceState(x, y) {
	    if (!isCoordinatesInBoard(x, y)) {
		win.console.error(`Invalid parameters for board size ${boardSideLength}\nX:${x} Y:{y}`); 
		return;
	    }
	    return board[y][x];
	}

	function setSpaceState(x, y, state) {
	    if (!isCoordinatesInBoard(x, y)) {
		win.console.error(`Invalid parameters for board size ${boardSideLength}\nX:${x} Y:{y}`); 
		return;
	    }
	    board[y][x] = state;
	}

	function isSpaceEmpty(x, y) {
	    return board[y][x] === SPACE_STATES.UNUSED;
	}

	function resetBoard() {
	    board = deepCopyArray(INITIAL_BOARD);
	}

	function printToLog()
	{
	    let boardString = "------------- \n";
	    for (y = boardSideLength - 1; y >= 0; y--) {
		boardString += "| ";
		for (x = 0; x < boardSideLength; x++) {
		    boardString += getSpaceState(x, y) + " | ";
		}
		boardString += "\n";
	    }
	    boardString += "-------------";
	    win.console.log(boardString);
	}

	return {
	    SPACE_STATES, getSpaceState, setSpaceState, resetBoard, isSpaceEmpty, printToLog
	}
    })(BOARD_SIDE_LENGTH);

    function createPlayer(name) {
	return {name};
    }

    // Tic-tac-toe constants
    const DEFAULT_PLAYER_X = Object.freeze(createPlayer("Xavier"));
    const DEFAULT_PLAYER_O = Object.freeze(createPlayer("Octavia"));
    const PlayerData = (function(playerX = DEFAULT_PLAYER_X, playerO = DEFAULT_PLAYER_O) {
	function getPlayerX() {return playerX}
	function getPlayerO() {return playerO}
	function setPlayerX(player) {playerX = player}
	function setPlayerO(player) {playerO = player}

	return {getPlayerX, getPlayerO, setPlayerX, setPlayerO};
    })();
    const TURNS = Object.freeze({
	X: "X",
	O: "O"
    });
    const NO_WINNER = null;

    // Tic-tac-toe variables
    let turn = TURNS.X;
    let roundWinner = NO_WINNER;
    let gameWinner = NO_WINNER;

    function getTurnPlayer() {
	return playerTurn === TURNS.X ? PlayerData.X : PlayerData.O;
    }

    function spaceStateToPlayer(spaceState) {
	return spaceState === gameboard.SPACE_STATES.X ? PlayerData.getPlayerX() : PlayerData.getPlayerO();
    }
    
    // Returns the game state of the winning player or null if no player
    // has won on the horizontals
    function getHorizontalWinner() {
	let possibleWinnerState = gameboard.SPACE_STATES.UNUSED;
	for (y = 0; y < BOARD_SIDE_LENGTH; y++) {
	    let previous_board_state = gameboard.getSpaceState(0, y);
	    
	    if (previous_board_state === gameboard.SPACE_STATES.UNUSED) {
		continue;
	    }
	    
	    possibleWinnerState = previous_board_state;
	    for (x = 1; x < BOARD_SIDE_LENGTH; x++) {
		if (gameboard.getSpaceState(x, y) !== possibleWinnerState) {
		    possibleWinnerState = gameboard.SPACE_STATES.UNUSED;
		}
	    }
	    if (possibleWinnerState !== gameboard.SPACE_STATES.UNUSED) {
		return spaceStateToPlayer(possibleWinnerState);
	    }
	}

	return NO_WINNER;
    }
    
    // Returns the game state of the winning player or null if no player
    // has won on the verticals
    function getVerticalWinner() {
	let possibleWinnerState = gameboard.SPACE_STATES.UNUSED;
	for (x = 0; x < BOARD_SIDE_LENGTH; x++) {
	    let previous_board_state = gameboard.getSpaceState(x, 0);
	    
	    if (previous_board_state === gameboard.SPACE_STATES.UNUSED) {
		continue;
	    }
	    
	    possibleWinnerState = previous_board_state;
	    for (y = 0; y < BOARD_SIDE_LENGTH; y++) {
		if (gameboard.getSpaceState(x, y) !== previous_board_state) {
		    possibleWinnerState = gameboard.SPACE_STATES.UNUSED;
		    break;
		}
	    }
	    if (possibleWinnerState !== gameboard.SPACE_STATES.UNUSED) {
		return spaceStateToPlayer(possibleWinnerState);
	    }
	}

	return NO_WINNER;
    }
    
    // Returns the game state of the winning player or null if no player
    // has won on the diagonals
    function getDiagonalWinner() {
	let isMiddleFilled =
	    gameboard.getSpaceState(1, 1) !== gameboard.SPACE_STATES.UNUSED;

	if (!isMiddleFilled) {
	    return NO_WINNER;
	}

	// We know the middle is filled because of the guard clause and
	// can skip checking it again.
	let isForwardDiagonalMatching =
	    gameboard.getSpaceState(0, 0) === gameboard.getSpaceState(1, 1)
	    &&
	    gameboard.getSpaceState(1, 1) === gameboard.getSpaceState(2, 2);
	let isBackwardDiagonalMatching =
	    gameboard.getSpaceState(0, 2) === gameboard.getSpaceState(1, 1)
	    &&
	    gameboard.getSpaceState(1, 1) === gameboard.getSpaceState(2, 0);
	
	if (isForwardDiagonalMatching || isBackwardDiagonalMatching) {
	    return spaceStateToPlayer(gameboard.getSpaceState(1, 1));
	}
	
	return NO_WINNER;
    }
    
    function updateWinner() {
	let horizontalWinner = getHorizontalWinner();
	if (horizontalWinner !== NO_WINNER) {
	    roundWinner = horizontalWinner;
	    return;
	}
	
	let verticalWinner = getVerticalWinner();
	if (verticalWinner !== NO_WINNER) {
	    roundWinner = verticalWinner;
	    return;
	}
	
	roundWinner = getDiagonalWinner();
    }

    // Game functions
    function fillSpace(x, y) {
	if (gameboard.getSpaceState(x, y) !== gameboard.SPACE_STATES.UNUSED)
	{
	    win.console.log("That space already filled!");
	    return;
	}

	if (roundWinner !== NO_WINNER) {
	    win.console.log("The round is already over!");
	    return;
	}

	if (gameWinner !== NO_WINNER) {
	    win.console.log(`The game has already been won by ${gameWinner}`);
	    return;
	}

	if (turn === TURNS.X) {
	    gameboard.setSpaceState(x, y, gameboard.SPACE_STATES.X);
	}
	else {
	    gameboard.setSpaceState(x, y, gameboard.SPACE_STATES.O);
	}

	updateWinner();
	win.console.log(`Debug: Winner state: ${roundWinner}`);
	
	turn = (turn === TURNS.X) ? TURNS.O : TURNS.X;
    }

    function getBoardState(x, y) {
	return gameboard.getSpaceState(x, y);
    }
    
    function isRoundWinner() {
	return roundWinner !== null;
    }

    function getRoundWinner() {
	return roundWinner;
    }

    function getTurn() {
	return turn;
    }

    function reset() {
	gameboard.resetBoard();
	roundWinner = NO_WINNER;
	turn = TURNS.X;
    }
    
    function printBoard() {
	gameboard.printToLog();
    }

    let displayController = (function (win, doc) {
	// DOM constants
	const xNameDisplay = doc.querySelector("#player-x-name-input");
	const oNameDisplay = doc.querySelector("#player-o-name-input");
	const gameGrid = doc.querySelector(".game-board");
	const cell_0_0 = doc.querySelector("#cell-0-0");
	const cell_1_0 = doc.querySelector("#cell-1-0");
	const cell_2_0 = doc.querySelector("#cell-2-0");
	const cell_0_1 = doc.querySelector("#cell-0-1");
	const cell_1_1 = doc.querySelector("#cell-1-1");
	const cell_2_1 = doc.querySelector("#cell-2-1");
	const cell_0_2 = doc.querySelector("#cell-0-2");
	const cell_1_2 = doc.querySelector("#cell-1-2");
	const cell_2_2 = doc.querySelector("#cell-2-2");
	const display = doc.querySelector(".display");
	const resetButton = doc.querySelector("#reset-button");
	
	// Image constants
	const X_URL = "url('./images/x.svg')";
	const O_URL = "url('./images/o.svg')";
	
	// Attach metadata to cells
	cell_0_0.dataset.x = 0;
	cell_0_0.dataset.y = 0;
	
	cell_1_0.dataset.x = 1;
	cell_1_0.dataset.y = 0;
	
	cell_2_0.dataset.x = 2;
	cell_2_0.dataset.y = 0;
	
	cell_0_1.dataset.x = 0;
	cell_0_1.dataset.y = 1;
	
	cell_1_1.dataset.x = 1;
	cell_1_1.dataset.y = 1;
	
	cell_2_1.dataset.x = 2;
	cell_2_1.dataset.y = 1;
	
	cell_0_2.dataset.x = 0;
	cell_0_2.dataset.y = 2;
	
	cell_1_2.dataset.x = 1;
	cell_1_2.dataset.y = 2;
	
	cell_2_2.dataset.x = 2;
	cell_2_2.dataset.y = 2;
	
	function updateCell(cell) {
	    let cellX = cell.dataset.x;
	    let cellY = cell.dataset.y;
	    switch (getBoardState(cellX, cellY)) {
	    case "X":
		cell.style.backgroundImage = X_URL;
		break;
	    case "O":
		cell.style.backgroundImage = O_URL;
		break;
	    default:
		cell.style.backgroundImage = "none";
	    }
	}
	
	function updateGrid() {
	    let cellList = gameGrid.querySelectorAll(".game-cell");
	    console.table(cellList);
	    for (cell of cellList) {
		updateCell(cell);
	    }
	}
	
	
	function updateDisplay() {
	    if (isRoundWinner()) {
		display.textContent = `${roundWinner.name} has won the round!`;
		return;
	    }
	    display.textContent = `${turn}'s turn`;
	}

	function resetBoard() {
	    reset();
	    updateDisplay();
	    updateGrid();
	}
	
	function clickCell(event) {
	    // Figure out which cell was clicked
	    targetX = event.target.dataset.x;
	    targetY = event.target.dataset.y;
	    
	    // Fill the correct grid area in the game if possible
	    fillSpace(targetX, targetY);
	    
	    // Update the view of the gameboard
	    updateGrid();
	    updateDisplay();
	}

	xNameDisplay.value = PlayerData.getPlayerX().name;
	oNameDisplay.value = PlayerData.getPlayerO().name;
	resetButton.addEventListener("click", resetBoard); 
	gameGrid.addEventListener("click", clickCell);
    })(win, doc);
    
    return {
	TURNS, fillSpace, printBoard, reset, isRoundWinner, getRoundWinner, getBoardState, getTurn
    }
})(window, document);
