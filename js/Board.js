Board = function (myGame, isMyTurn_bool) {
    // tile indexes used to change the tile/appearance on the board
    var EMPTY = 1;
    var FILLED = 2;
    var SQUARE = 3;

    //Constants used for status messages
    var MESSAGE_MYTURN = "Your turn";
    var MESSAGE_OPPONENTSTURN = "Opponents Turn";
    var MESSAGE_PLAYERLEFT = "The other player ran away - You Win";
    var MESSAGE_WON = "You Won!";
    var MESSAGE_LOST = "You lost, the other player won";
    var MESSAGE_DRAW = "The game is a draw";

    var _isMyTurn_bool = isMyTurn_bool;
    var _myGame = myGame;
    var _map;
    var _tileLayer;
    var _myMark;
    var _numMoves = 0;
    var _inPlay_bool = true;

    var _click = function (pointer, event) {
    }; // end of _click()

    var _checkWin = function () {
        // Check for winning combination /* Check if all lines have been filled */
        // return winner
    }; // end of _checkWin()
    
        var _checkSquare = function () {
        // Check top
        // Check bottom
        // Check left
        // Check right
            // return true /* fill square */
            // return false
    }; // end of _checkSquare()

    var updateLine = function () {
        // check mouse position
        // check for win/lose/draw
		        // If the game is in play, tell this player
    }; // end of updateLine()

    // respond to the other player leaving ths game/room
    this.opponentLeft = function () {
        // If the game is in play, tell this player
        if (_inPlay_bool) {
            _inPlay_bool = false;
            uiStatusMsg(MESSAGE_PLAYERLEFT);
        }
    }; // end of opponentLeft()

    // setup the board ready for a new game
    
    // 4 X 4 BOARD ALREADY STARTED
    
    }; // end of setUp()

    /* MAIN CONSTRUCTOR CODE */

    // Initialise the board

}; // end of Board()