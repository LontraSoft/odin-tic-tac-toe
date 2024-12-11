const tic_tac_toe_game = (function(win, doc) {
    const BOARD_SIDE_LENGTH = 3;
    
    function Scoreboard(playerCount) {
	scores = new Array(playerCount).fill(0);
	
	function incrementScore(playerNumber) {
	    scores[playerNumber] += 1;
	}
	function getScore(playerNumber) {
	    return scores[playerNumber];
	}
	
	return {
	    incrementScore,
	    getScore
	}
    }

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

    // Tic-tac-toe constants
    const PLAYER_COUNT = 2;
    const PLAYERS = {
	X : "X",
	O : "O"
    }
    const NO_WINNER = null;
    const BOARD_STATE_TO_WINNER = Object.freeze({
	[gameboard.SPACE_STATES.X] : PLAYERS.X,
	[gameboard.SPACE_STATES.O] : PLAYERS.O,
	[gameboard.SPACE_STATES.UNUSED] : NO_WINNER
    });

    // Tic-tac-toe variables
    let playerTurn = PLAYERS.X;
    let roundWinner = NO_WINNER;
    let gameWinner = NO_WINNER;

    // Initializations
    let gameScoreboard = Scoreboard(PLAYER_COUNT);

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
		win.console.log(`DEBUG: horizontal winner detected ${possibleWinnerState}`);		
		return BOARD_STATE_TO_WINNER[possibleWinnerState];
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
		return BOARD_STATE_TO_WINNER[possibleWinnerState];
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
	    return BOARD_STATE_TO_WINNER[gameboard.getSpaceState(1, 1)];
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

	if (playerTurn === PLAYERS.X) {
	    gameboard.setSpaceState(x, y, gameboard.SPACE_STATES.X);
	}
	else {
	    gameboard.setSpaceState(x, y, gameboard.SPACE_STATES.O);
	}

	updateWinner();
	win.console.log(`Debug: Winner state: ${roundWinner}`);

	if (roundWinner !== NO_WINNER) {
	    gameScoreboard.incrementScore(roundWinner);
	    win.console.log("Winner is " + roundWinner + "!");
	}
	
	playerTurn = (playerTurn === PLAYERS.X) ? PLAYERS.O : PLAYERS.X;
    }
    
    function isRoundWinner() {
	return roundWinner !== null;
    }

    function getRoundWinner() {
	return roundWinner;
    }

    function prepareNextRound() {
	gameboard.resetBoard();
	roundWinner = NO_WINNER;
	playerTurn = PLAYERS.X;
    }
    
    function printBoard() {
	gameboard.printToLog();
    }

    return {
	PLAYERS, fillSpace, printBoard, prepareNextRound, isRoundWinner, getRoundWinner
    }
})(window, document);
