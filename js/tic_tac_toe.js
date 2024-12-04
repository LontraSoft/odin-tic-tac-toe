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
    }
})(window, document);
