const tic_tac_toe_game = (function(win, doc) {
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
    let gameboard = (function () {
	const SPACE_STATES = {
	    UNUSED : " ",
	    X : "X",
	    O : "O"
	};
	const BOARD_SIDE_LENGTH = 3;
	const INITIAL_BOARD =
	    Array.from({length: BOARD_SIDE_LENGTH},
		() => Array(BOARD_SIDE_LENGTH).fill(SPACE_STATES.UNUSED));

	// A deep copy is needed to prevent the board from reusing the
	// old board state
	function deepCopyArray(array) {
	    return JSON.parse(JSON.stringify(array));
	}

	let board = deepCopyArray(INITIAL_BOARD);
	
	function getSpaceState(x, y) {
	    return board[y][x];
	}

	function setSpaceState(x, y, state) {
	    board[y][x] = state;
	}

	function isSpaceEmpty(x, y) {
	    return board[y][x] === SPACE_STATES.UNUSED;
	}

	function resetBoard() {
	    board = deepCopyArray(INITIAL_BOARD);
	}

	// Returns the game state of the winning player or null if no player
	// has won on the horizontals
	function getHorizontalWinner() {
	    let winner = null;
	    for (y = 0; y < BOARD_SIDE_LENGTH; y++) {
		let previous_board_state = board[y][0];
		
		if (lastSpaceState === SPACE_STATES.UNUSED) {
		    continue;
		}

		winner = previous_board_state;
		for (x = 0; x < BOARD_SIDE_LENGTH; x++) {
		    if (board[y][x] !== lastSpaceState) {
			winner = null;
		    }
		}
	    }
	    return winner;
	}

	// Returns the game state of the winning player or null if no player
	// has won on the verticals
	function getVerticalWinner() {
	    let winner = null;
	    for (x = 0; x < BOARD_SIDE_LENGTH; x++) {
		let previous_board_state = board[0][x];
		
		if (lastSpaceState === SPACE_STATES.UNUSED) {
		    continue;
		}
		
		winner = previous_board_state;
		for (y = 0; y < BOARD_SIDE_LENGTH; y++) {
		    if (board[y][x] !== lastSpaceState) {
			winner = null;
		    }
		}
	    }
	    return winner;
	}

	// Returns the game state of the winning player or null if no player
	// has won on the diagonals
	function getDiagonalWinner() {
	    isMiddleFilled = board[1][1] !== SPACE_STATES.UNUSED;
	    if (!isMiddleFilled) {
		return null;
	    }
	    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0]) {
		return board[0][0];
	    }
	    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2]) {
		return board[0][2];
	    }
	    return null;
	}

	function isWinner() {
	    let horizontalWinner = getHorizontalWinner();
	    let verticalWinner = getVerticalWinner();
	    let diagonalWinner = getDiagonalWinner();

	    if (horizontalWinner !== null) {
		return horizontalWinner;
	    }
	    if (verticalWinner !== null) {
		return verticalWinner;
	    }
	    if (diagonalWinner !== null) {
		return diagonalWinner;
	    }
	    return null;
	}

	function printToLog()
	{
	    let boardString = "------------- \n";
	    for (y = BOARD_SIDE_LENGTH - 1; y >= 0; y--) {
		boardString += "| ";
		for (x = 0; x < BOARD_SIDE_LENGTH; x++) {
		    boardString += getSpaceState(x, y) + " | ";
		}
		boardString += "\n";
	    }
	    boardString += "-------------";
	    win.console.log(boardString);
	}
    }
})(window, document);
