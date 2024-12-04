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
})(window, document);
