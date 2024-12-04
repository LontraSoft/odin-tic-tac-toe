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
