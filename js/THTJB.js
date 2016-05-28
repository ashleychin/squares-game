var _game, counter = 0, lastMove;
var THTJB = {
    canMove: false,
    lineArray: new Array(
    0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,
    0,0,0,0,0,
    0,0,0,0),
    
    squareArray: new Array(
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0),
    
    colors: {
    0: 0xffcc00,
    1: 0xb90404,
    2: 0x044cb9,
    }
};

function createGame() {
    _game = new Phaser.Game(450, 450, Phaser.CANVAS, "game-container", { preload: onPreload, create: onCreate});

}

// the game is preloading **************************
function onPreload() {
    // preload the tile image
    _game.load.image("dot", "assets/dot-1.png");
    _game.load.image("vline", "assets/vertical-line.png");
    _game.load.image("hline", "assets/horizontal-line.png");
    _game.load.image("square", "assets/square-1.png");
    // preload the audio files
    //game.load.audio('blop', 'assets/blop.mp3');
}

// the game has been created ***********************
function onCreate() {
    
    // sprite group declaration
    THTJB.dotsSprites = _game.add.group();
    THTJB.lineSprites = _game.add.group();
    THTJB.squareSprites = _game.add.group();
    
    // create the text for the moves footer
    THTJB.movesText = _game.add.text(20, 400, 'Begin game', { font: '22px Arial', fill: '#fff' });
    // hide the moves and score text until needed
    THTJB.movesText.visible = false;
    startGame();

    sfs.addEventListener(SFS2X.SFSEvent.OBJECT_MESSAGE, onObjectMessage, this);
}

function startGame() {

    // remove all tiles from play
    THTJB.squareSprites.removeAll(true);
    THTJB.lineSprites.removeAll(true);
    // reset all values to zero
    for (var i=0; i<THTJB.lineArray.length; i++) {
        THTJB.lineArray[i]=0;
    }
    for (var i=0; i<THTJB.squareArray.length; i++) {
        THTJB.squareArray[i]=0;
    }

    loadDots();
    loadLines();
    
    if (counter == 0 && _playerNum == 1) {
        THTJB.movesText.text = 'Player ' + _playerNum + ': Your move';
        THTJB.canMove = true;
    } else if (counter == 0 && _playerNum == 2) {
        THTJB.movesText.text = 'Player ' + _playerNum + ': Opponent\'s move';
        THTJB.canMove = false;
    }

    // show footer text
    THTJB.movesText.visible = true;
    
    // allow player movement
    if (THTJB.canMove == true) {
        canMove();
    } else {
        cantMove();
    }
}

// load the 'dot grid'
function loadDots() {
    for (var i=0; i<25; i++) {
        // create new sprites with 'dot.png' image
        if (i<5) {
            var dot = _game.add.sprite(i*110, 0, "dot");
        } else if (i>=5 && i<10) {
            var dot = _game.add.sprite(i*110-550, 110, "dot");
        } else if (i>=10 && i<15) {
            var dot = _game.add.sprite(i*110-1100, 220, "dot");
        } else if (i>=15 && i<20) {
            var dot = _game.add.sprite(i*110-1650, 330, "dot");
        } else {
            var dot = _game.add.sprite(i*110-2200, 440, "dot");
        }
        THTJB.dotsSprites.add(dot);
    }
}

function loadLines() {
    for (var i=0; i<20; i++) {
        // create new sprites with 'horizontal-line.png' image
        if (i<4) {
            var hline = _game.add.sprite(i*110+10, 0, "hline");
            hline.pos = (i);
        } else if (i>=4 && i<8) {
            var hline = _game.add.sprite(i*110-430, 110, "hline");
            hline.pos = (i+5);
        } else if (i>=8 && i<12) {
            var hline = _game.add.sprite(i*110-870, 220, "hline");
            hline.pos = (i+10);
        } else if (i>=12 && i<16) {
            var hline = _game.add.sprite(i*110-1310, 330, "hline");
            hline.pos = (i+15);
        } else  if (i>=16) {
            var hline = _game.add.sprite(i*110-1750, 440, "hline");
            hline.pos = (i+20);
        }
        THTJB.lineSprites.add(hline);
        var value = THTJB.lineArray[hline.pos];
        hline.tint = THTJB.colors[value];
        hline.alpha = 0.5;
        hline.inputEnabled = true;
        //hline.events.onInputDown.add(listener, this);
        hline.events.onInputOver.add(over, this);
        hline.events.onInputOut.add(out, this);
    }
    
    for (var i=0; i<20; i++) {
        // create new sprites with 'vertical-line.png' image
        if (i<5) {
            var vline = _game.add.sprite(i*110, 10, "vline");
            vline.pos = (i+4);
        } else if (i>=5 && i<10) {
            var vline = _game.add.sprite(i*110-550, 120, "vline");
            vline.pos = (i+8);
        } else if (i>=10 && i<15) {
            var vline = _game.add.sprite(i*110-1100, 230, "vline");
            vline.pos = (i+12);
        } else {
            var vline = _game.add.sprite(i*110-1650, 340, "vline");
            vline.pos = (i+16);
        }
        THTJB.lineSprites.add(vline);
        var value = THTJB.lineArray[vline.pos];
        vline.tint = THTJB.colors[value];
        vline.alpha = 0.5;
        vline.inputEnabled = true;
        //vline.events.onInputDown.add(listener, this);
        vline.events.onInputOver.add(over, this);
        vline.events.onInputOut.add(out, this);
    }

}

function canMove() {
    THTJB.lineSprites.forEach(function (item) {
        if (item.alpha != 1) {
            item.events.onInputDown.add(listener, this);
        }
    })
    THTJB.movesText.text = 'Player ' + _playerNum + ': Your move';
    THTJB.canMove = true;
}

function cantMove() {
    THTJB.lineSprites.forEach(function (item) {
            item.events.onInputDown.remove(listener, this);
    })
    THTJB.movesText.text = 'Player ' + _playerNum + ': Opponent\'s move';
    THTJB.canMove = false;
}


function over (line) {

    uiTrace("Into GameManager: mouseOver");
    line.alpha = 1;
}

function out (line) {
    if (THTJB.lineArray[line.pos] == 0) {
        uiTrace("Into GameManager: mouseOut");
        line.alpha = 0.5;
    }
}

function listener (line) {

    line.events.onInputOut.remove(out, this);
    line.events.onInputOver.remove(over, this);
    line.events.onInputDown.remove(listener, this);

    counter++;
    uiTrace("Into GameManager: Click" + counter);
        THTJB.lineArray[line.pos] = _playerNum;

    uiTrace("Into GameManager: arrayValue" + THTJB.lineArray[line.pos]);

    line.alpha = 1;
    line.tint = THTJB.colors[THTJB.lineArray[line.pos]];

    // Send my movement to all players
    var dataObj = {};
    dataObj.pos = line.pos;
    
    sfs.send(new SFS2X.Requests.System.ObjectMessageRequest(dataObj));

    lastMove = true;

    squareCheck(line);
}

function onObjectMessage(evtParams)
{
    counter++;
    var dataObj = evtParams.message;
    var line;
    
    THTJB.lineSprites.forEach(function (item) {
        if (item.pos == dataObj.pos) {
            line = item;
        }
    })

    counter++;

    if (_playerNum == 1) {
        THTJB.lineArray[line.pos] = 2;
    } else {
        THTJB.lineArray[line.pos] = 1;
    }

    uiTrace("Into GameManager: arrayValue" + THTJB.lineArray[line.pos]);

    line.events.onInputOut.remove(out, this);
    line.events.onInputOver.remove(over, this);
    line.events.onInputDown.remove(listener, this);

    line.alpha = 1;
    line.tint = THTJB.colors[THTJB.lineArray[line.pos]];

    lastMove = false;

    squareCheck(line);
    
}


function squareCheck(line) {
    var linePosition = line.pos;
    var colourUpdate;
    var squareAdded = false;

    if (lastMove == true) {
        colourUpdate = _playerNum;
    } else if (lastMove == false && _playerNum == 1) {
        colourUpdate = 2;
    } else if (lastMove == false && _playerNum == 2) {
        colourUpdate = 1;
    }

    if (linePosition < 4) {
        if ((THTJB.lineArray[linePosition+4] != 0) && (THTJB.lineArray[linePosition+5] != 0) && (THTJB.lineArray[linePosition+9] != 0)) {
            THTJB.squareArray[linePosition] = colourUpdate;
            var fillSquare = _game.add.sprite((linePosition*110 + 10), 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = linePosition;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 4) {
        if ((THTJB.lineArray[0] != 0) && (THTJB.lineArray[5] != 0) && (THTJB.lineArray[9] != 0)) {
            THTJB.squareArray[0] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 0;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 5) {
        if ((THTJB.lineArray[0] != 0) && (THTJB.lineArray[4] != 0) && (THTJB.lineArray[9] != 0)) {
            THTJB.squareArray[0] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 0;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[1] != 0) && (THTJB.lineArray[6] != 0) && (THTJB.lineArray[10] != 0)) {
            THTJB.squareArray[1] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 1;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 6) {
        if ((THTJB.lineArray[1] != 0) && (THTJB.lineArray[5] != 0) && (THTJB.lineArray[10] != 0)) {
            THTJB.squareArray[1] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 1;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[2] != 0) && (THTJB.lineArray[7] != 0) && (THTJB.lineArray[11] != 0)) {
            THTJB.squareArray[2] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 2;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 7) {
        if ((THTJB.lineArray[2] != 0) && (THTJB.lineArray[6] != 0) && (THTJB.lineArray[11] != 0)) {
            THTJB.squareArray[2] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 2;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[3] != 0) && (THTJB.lineArray[8] != 0) && (THTJB.lineArray[12] != 0)) {
            THTJB.squareArray[3] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 3;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 8) {
        if ((THTJB.lineArray[3] != 0) && (THTJB.lineArray[7] != 0) && (THTJB.lineArray[12] != 0)) {
            THTJB.squareArray[3] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 3;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 9) {
        if ((THTJB.lineArray[0] != 0) && (THTJB.lineArray[4] != 0) && (THTJB.lineArray[5] != 0)) {
            THTJB.squareArray[0] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 0;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[13] != 0) && (THTJB.lineArray[14] != 0) && (THTJB.lineArray[18] != 0)) {
            THTJB.squareArray[4] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 4;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 10) {
        if ((THTJB.lineArray[1] != 0) && (THTJB.lineArray[5] != 0) && (THTJB.lineArray[6] != 0)) {
            THTJB.squareArray[1] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 1;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[14] != 0) && (THTJB.lineArray[15] != 0) && (THTJB.lineArray[19] != 0)) {
            THTJB.squareArray[5] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 5;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 11) {
        if ((THTJB.lineArray[2] != 0) && (THTJB.lineArray[6] != 0) && (THTJB.lineArray[7] != 0)) {
            THTJB.squareArray[2] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 2;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[15] != 0) && (THTJB.lineArray[16] != 0) && (THTJB.lineArray[20] != 0)) {
            THTJB.squareArray[6] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 6;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 12) {
        if ((THTJB.lineArray[3] != 0) && (THTJB.lineArray[7] != 0) && (THTJB.lineArray[8] != 0)) {
            THTJB.squareArray[3] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 10, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 3;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[16] != 0) && (THTJB.lineArray[17] != 0) && (THTJB.lineArray[21] != 0)) {
            THTJB.squareArray[7] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 7;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 13) {
        if ((THTJB.lineArray[9] != 0) && (THTJB.lineArray[14] != 0) && (THTJB.lineArray[18] != 0)) {
            THTJB.squareArray[4] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 4;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 14) {
        if ((THTJB.lineArray[9] != 0) && (THTJB.lineArray[13] != 0) && (THTJB.lineArray[18] != 0)) {
            THTJB.squareArray[4] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 4;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[10] != 0) && (THTJB.lineArray[15] != 0) && (THTJB.lineArray[19] != 0)) {
            THTJB.squareArray[5] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 5;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 15) {
        if ((THTJB.lineArray[10] != 0) && (THTJB.lineArray[14] != 0) && (THTJB.lineArray[19] != 0)) {
            THTJB.squareArray[5] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 5;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[11] != 0) && (THTJB.lineArray[16] != 0) && (THTJB.lineArray[20] != 0)) {
            THTJB.squareArray[6] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 6;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 16) {
        if ((THTJB.lineArray[11] != 0) && (THTJB.lineArray[15] != 0) && (THTJB.lineArray[20] != 0)) {
            THTJB.squareArray[6] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 6;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[12] != 0) && (THTJB.lineArray[17] != 0) && (THTJB.lineArray[21] != 0)) {
            THTJB.squareArray[7] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 7;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 17) {
        if ((THTJB.lineArray[12] != 0) && (THTJB.lineArray[16] != 0) && (THTJB.lineArray[21] != 0)) {
            THTJB.squareArray[7] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 7;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 18) {
        if ((THTJB.lineArray[9] != 0) && (THTJB.lineArray[13] != 0) && (THTJB.lineArray[14] != 0)) {
            THTJB.squareArray[4] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 4;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[22] != 0) && (THTJB.lineArray[23] != 0) && (THTJB.lineArray[27] != 0)) {
            THTJB.squareArray[8] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 8;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 19) {
        if ((THTJB.lineArray[10] != 0) && (THTJB.lineArray[14] != 0) && (THTJB.lineArray[15] != 0)) {
            THTJB.squareArray[5] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 5;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[23] != 0) && (THTJB.lineArray[24] != 0) && (THTJB.lineArray[28] != 0)) {
            THTJB.squareArray[9] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 9;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 20) {
        if ((THTJB.lineArray[11] != 0) && (THTJB.lineArray[15] != 0) && (THTJB.lineArray[16] != 0)) {
            THTJB.squareArray[6] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 6;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[24] != 0) && (THTJB.lineArray[25] != 0) && (THTJB.lineArray[29] != 0)) {
            THTJB.squareArray[10] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 10;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 21) {
        if ((THTJB.lineArray[12] != 0) && (THTJB.lineArray[16] != 0) && (THTJB.lineArray[17] != 0)) {
            THTJB.squareArray[7] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 120, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 7;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[25] != 0) && (THTJB.lineArray[26] != 0) && (THTJB.lineArray[30] != 0)) {
            THTJB.squareArray[11] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 11;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 22) {
        if ((THTJB.lineArray[18] != 0) && (THTJB.lineArray[23] != 0) && (THTJB.lineArray[27] != 0)) {
            THTJB.squareArray[8] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 8;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 23) {
        if ((THTJB.lineArray[18] != 0) && (THTJB.lineArray[22] != 0) && (THTJB.lineArray[27] != 0)) {
            THTJB.squareArray[8] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 8;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[19] != 0) && (THTJB.lineArray[24] != 0) && (THTJB.lineArray[28] != 0)) {
            THTJB.squareArray[9] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 9;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 24) {
        if ((THTJB.lineArray[19] != 0) && (THTJB.lineArray[23] != 0) && (THTJB.lineArray[28] != 0)) {
            THTJB.squareArray[9] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 9;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[20] != 0) && (THTJB.lineArray[25] != 0) && (THTJB.lineArray[29] != 0)) {
            THTJB.squareArray[10] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 10;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 25) {
        if ((THTJB.lineArray[20] != 0) && (THTJB.lineArray[24] != 0) && (THTJB.lineArray[29] != 0)) {
            THTJB.squareArray[10] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 10;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[21] != 0) && (THTJB.lineArray[26] != 0) && (THTJB.lineArray[30] != 0)) {
            THTJB.squareArray[11] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 11;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 26) {
        if ((THTJB.lineArray[21] != 0) && (THTJB.lineArray[25] != 0) && (THTJB.lineArray[30] != 0)) {
            THTJB.squareArray[11] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 11;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 27) {
        if ((THTJB.lineArray[18] != 0) && (THTJB.lineArray[22] != 0) && (THTJB.lineArray[27] != 0)) {
            THTJB.squareArray[8] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 8;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[31] != 0) && (THTJB.lineArray[32] != 0) && (THTJB.lineArray[36] != 0)) {
            THTJB.squareArray[12] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 12;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 28) {
        if ((THTJB.lineArray[19] != 0) && (THTJB.lineArray[23] != 0) && (THTJB.lineArray[24] != 0)) {
            THTJB.squareArray[9] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 9;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[32] != 0) && (THTJB.lineArray[33] != 0) && (THTJB.lineArray[37] != 0)) {
            THTJB.squareArray[13] = colourUpdate;
            var fillSquare = _game.add.sprite(120,340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 13;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 29) {
        if ((THTJB.lineArray[20] != 0) && (THTJB.lineArray[24] != 0) && (THTJB.lineArray[25] != 0)) {
            THTJB.squareArray[10] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 10;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[33] != 0) && (THTJB.lineArray[34] != 0) && (THTJB.lineArray[38] != 0)) {
            THTJB.squareArray[14] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 14;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 30) {
        if ((THTJB.lineArray[21] != 0) && (THTJB.lineArray[25] != 0) && (THTJB.lineArray[26] != 0)) {
            THTJB.squareArray[11] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 230, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 11;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[34] != 0) && (THTJB.lineArray[35] != 0) && (THTJB.lineArray[39] != 0)) {
            THTJB.squareArray[15] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 15;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 31) {
        if ((THTJB.lineArray[27] != 0) && (THTJB.lineArray[32] != 0) && (THTJB.lineArray[36] != 0)) {
            THTJB.squareArray[12] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 12;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 32) {
        if ((THTJB.lineArray[27] != 0) && (THTJB.lineArray[31] != 0) && (THTJB.lineArray[36] != 0)) {
            THTJB.squareArray[12] = colourUpdate;
            var fillSquare = _game.add.sprite(10, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 12;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[28] != 0) && (THTJB.lineArray[33] != 0) && (THTJB.lineArray[37] != 0)) {
            THTJB.squareArray[13] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 13;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 33) {
        if ((THTJB.lineArray[28] != 0) && (THTJB.lineArray[32] != 0) && (THTJB.lineArray[37] != 0)) {
            THTJB.squareArray[13] = colourUpdate;
            var fillSquare = _game.add.sprite(120, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 13;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[29] != 0) && (THTJB.lineArray[34] != 0) && (THTJB.lineArray[38] != 0)) {
            THTJB.squareArray[14] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 14;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 34) {
        if ((THTJB.lineArray[29] != 0) && (THTJB.lineArray[33] != 0) && (THTJB.lineArray[38] != 0)) {
            THTJB.squareArray[14] = colourUpdate;
            var fillSquare = _game.add.sprite(230, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 14;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
        if ((THTJB.lineArray[30] != 0) && (THTJB.lineArray[35] != 0) && (THTJB.lineArray[39] != 0)) {
            THTJB.squareArray[15] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 15;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }

    if (linePosition == 35) {
        if ((THTJB.lineArray[30] != 0) && (THTJB.lineArray[34] != 0) && (THTJB.lineArray[39] != 0)) {
            THTJB.squareArray[15] = colourUpdate;
            var fillSquare = _game.add.sprite(340, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = 15;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }    }

    if (linePosition > 35) {
        if ((THTJB.lineArray[linePosition-5] != 0) && (THTJB.lineArray[linePosition-4] != 0) && (THTJB.lineArray[linePosition-9] != 0)) {
            THTJB.squareArray[linePosition-24] = colourUpdate;
            var fillSquare = _game.add.sprite((linePosition-36)*110+10, 340, "square");
            THTJB.squareSprites.add(fillSquare);
            fillSquare.pos = linePosition-24;
            fillSquare.tint = THTJB.colors[THTJB.squareArray[fillSquare.pos]];
            fillSquare.alpha = 1;
            squareAdded = true;
        }
    }
    if (squareAdded == true && lastMove == true) {
        canMove();
    } else if (squareAdded == false && lastMove == true) {
        cantMove();
    } else if (squareAdded == false && lastMove == false) {
        canMove();
    } else if (squareAdded == true && last == false) {
        cantMove();
    }
    checkWin();
}


function checkWin() {
    var squareCount = 0, player1tally = 0, player2tally = 0;
    for (i=0; i<THTJB.squareArray.length; i++) {
        if (THTJB.squareArray[i] != 0){
            squareCount++;
        }
    }

    if (squareCount == 16) {

        for (i=0; i<THTJB.squareArray.length; i++) {
            if (THTJB.squareArray[i] == 1) {
                player1tally++;
        } else if (THTJB.squareArray[i] == 2) {
            player2tally++;
        }
    }
        // Game over
        cantMove();

        if (player1tally > player2tally) {
            THTJB.movesText.text = 'GAME OVER: Player 1 wins';
        } else if (player2tally > player1tally) {
            THTJB.movesText.text = 'GAME OVER: Player 2 wins';
        } else if (player1tally == player2tally) {
            THTJB.movesText.text = 'GAME OVER: It\'s a draw!';
        }
    }
}

/*
    // create new sprite with 'tile.png' image
    var tile = game.add.sprite(toCol(randomValue) * AshleysTiles.tileSize, toRow(randomValue) * AshleysTiles.tileSize + 125, "tile");
    // assign it a custom 'pos' property and give it the index from the Array
    tile.pos = randomValue;
    // assign custom property for when we want to delete batches of tiles later
    tile.markForRemoval = false;
    // set tile to transparent
    tile.alpha = 0;
    //add tile sprites to group
    AshleysTiles.tileSprites.add(tile);
    // create a new tween to make tile opaque in 250 milliseconds
    var fadeIn = game.add.tween(tile);
    fadeIn.to({alpha: 1}, 250);
    fadeIn.onComplete.add(endGameCheck, this);
    // retrieving the proper value to show
    var value = AshleysTiles.fieldArray[tile.pos];
    // tinting the tile
    tile.tint = AshleysTiles.colors[value];
    // call tween
    fadeIn.start();
    blop_snd.play();
}

/*
    
// function to return the row in the 1-dimensional array
function toRow(n) {
    // number entered in, divided by number of rows, gives row number
    return Math.floor(n / AshleysTiles.gridRows);
}
    
// function to return the column in a 1-dimensional array
function toCol(n) {
    // remainder of number entered in, divided by number of grid Columns, gives column number
    return n % AshleysTiles.gridColumns;
}
    
// move tiles left ***************************************
function moveLeft() {
    if (AshleysTiles.canMove) {
        AshleysTiles.canMove = false;
        // sort the group ordering by x co-ordinate property, so tiles on the left are moved first
        AshleysTiles.tileSprites.sort("x", Phaser.Group.SORT_ASCENDING);
        // loop through every tile
        AshleysTiles.tileSprites.forEach(function (item) {
            // get row and column position from 1-dimensional array
            var row = toRow(item.pos);
            var col = toCol(item.pos);
            // if the tile is not already on the left-most column
            if (col !== 0) {
            // if column 0 is free move there
                if (AshleysTiles.fieldArray[row * 4] === 0) {
                    moveTile(item, row * 4 + col, row * 4);
                // otherwise if column 1 is free move there
                } else if (AshleysTiles.fieldArray[row * 4 + 1] === 0) {
                    moveTile(item, row * 4 + col, row * 4 + 1);
                // otherwise if column 2 is free, and tile is currently in column 3, move there
                } else if (AshleysTiles.fieldArray[row * 4 + 2] === 0 && col === 3) {
                    moveTile(item, row * 4 + col, row * 4 + 2);
                }
            }
        });
        if (AshleysTiles.moved == false) {
                AshleysTiles.canMove = true;
            }
    }
}
    
// move tiles up ***************************************
function moveUp() {
        if (AshleysTiles.canMove) {
            AshleysTiles.canMove = false;
            // sort the group ordering by y co-ordinate property, so tiles on the top are moved first
            AshleysTiles.tileSprites.sort("y", Phaser.Group.SORT_ASCENDING);
            // loop through every tile
            AshleysTiles.tileSprites.forEach(function(item){
                // get row and column position from 1-dimensional array
                var row = toRow(item.pos);
                var col = toCol(item.pos);
                // if the tile isn't already on the top row
                if(row == 0) { // do nothing
                // otherwise if row 0 is free move there    
                } else if (AshleysTiles.fieldArray[col] == 0) {
                    moveTile(item, row*4+col, col);
                // otherwise if row 1 is free move there
                } else if (AshleysTiles.fieldArray[col+4] == 0) {
                    moveTile(item, row*4+col, col+4);
                // otherwise if row 2 is free, and tile is currently in row 3, move there
                } else if (AshleysTiles.fieldArray[col+8] == 0 && row == 3) {
                    moveTile(item, row*4+col, col+8);
                }
                })
            if (AshleysTiles.moved == false) {
                AshleysTiles.canMove = true;
            }
        }
    }
    
// move tiles right ***************************************
function moveRight() {
        if (AshleysTiles.canMove) {
            AshleysTiles.canMove = false;
            // sort the group ordering by x co-ordinate property, so tiles on the right are moved first
            AshleysTiles.tileSprites.sort("x", Phaser.Group.SORT_DESCENDING);
            // loop through every tile
            AshleysTiles.tileSprites.forEach(function(item) {
                // get row and column position from 1-dimensional array
                var row = toRow(item.pos);
                var col = toCol(item.pos);
                // if the tile isn't already on the right-most column
                if(col == 3) { // do nothing
                // otherwise if column 3 is free move there    
                } else if (AshleysTiles.fieldArray[row*4+3] == 0) {
                    moveTile(item, row*4+col, row*4+3);
                // otherwise if column 2 is free move there
                } else if (AshleysTiles.fieldArray[row*4+2] == 0) {
                    moveTile(item, row*4+col, row*4+2);
                // otherwise if column 1 is free, and tile is currently in column 0, move there
                } else if (AshleysTiles.fieldArray[row*4+1] == 0 && col == 0) {
                    moveTile(item, row*4+col, row*4+1);
                }
                })
            if (AshleysTiles.moved == false) {
                AshleysTiles.canMove = true;
            }
        }
    }
    
// move tiles down ***************************************
function moveDown() {
        if (AshleysTiles.canMove) {
            AshleysTiles.canMove = false;
            // sort the group ordering by y co-ordinate property, so tiles on the bottom are moved first
            AshleysTiles.tileSprites.sort("y", Phaser.Group.SORT_DESCENDING);
            // loop through every tile
            AshleysTiles.tileSprites.forEach(function(item) {
                // get row and column position from 1-dimensional array
                var row = toRow(item.pos);
                var col = toCol(item.pos);
                // if the tile isn't already on the bottom row
                if(row == 3) { // do nothing
                // otherwise if row 3 is free move there    
                } else if (AshleysTiles.fieldArray[col+12] == 0) {
                    moveTile(item, row*4+col, col+12);
                // otherwise if row 2 is free move there
                } else if (AshleysTiles.fieldArray[col+8] == 0) {
                    moveTile(item, row*4+col, col+8);
                // otherwise if row 1 is free, and tile is currently in row 0, move there
                } else if (AshleysTiles.fieldArray[col+4] == 0 && row == 0) {
                    moveTile(item, row*4+col, col+4);
                }
                })
            if (AshleysTiles.moved == false) {
                AshleysTiles.canMove = true;
            }
        }
    }
    
// function to move a tile
function moveTile(tile, from, to) {
    AshleysTiles.numberMoving++;
    // a legal tile move has taken place
    AshleysTiles.moved = true;
    // update position of tile in the array
    AshleysTiles.fieldArray[to] = AshleysTiles.fieldArray[from];
    AshleysTiles.fieldArray[from] = 0;
    // update pos property to new index value
    tile.pos = to;
    // new tween animation to move tile
    var movement = game.add.tween(tile);
    movement.to({x:AshleysTiles.tileSize*(toCol(to)), y:AshleysTiles.tileSize*(toRow(to))+125}, 150);
    movement.onComplete.add(finishMove, this);
    // begin tween
    movement.start();
}

function finishMove() {
    AshleysTiles.numberMoving--;
    if (AshleysTiles.numberMoving == 0){
        console.log("numberMoving is 0");
        // if a tile has moved, call the function to check if there are any matches
        checkMatches();
        // after all tiles have been checked, call the removeTileGroup function
        removeTileGroup();    
        // increase number of moves by one
        AshleysTiles.movesNum++;
        // update the 'moves' text
        AshleysTiles.movesText.text = 'Moves: ' + AshleysTiles.movesNum;
        levelChecker();
        // call the function to add a new tile
        addTile(); 
        // reset 'legal move' variable
        AshleysTiles.moved = false;
    // allows player to move again
    AshleysTiles.canMove = true;
    }
}

function levelChecker() {
    if (AshleysTiles.movesNum == 10 || AshleysTiles.movesNum == 20 || AshleysTiles.movesNum == 30 || AshleysTiles.movesNum == 40 || AshleysTiles.movesNum == 50 || AshleysTiles.movesNum == 60 || AshleysTiles.movesNum == 70 || AshleysTiles.movesNum == 80 || AshleysTiles.movesNum == 90 || AshleysTiles.movesNum == 100) {
        AshleysTiles.levelUp_txt.visible = true;
        var levelUpTimer = setTimeout(disappearText, 500);
    }
}

function disappearText() {
    AshleysTiles.levelUp_txt.visible = false;
}

function checkMatches() {
    // loop through all tiles
    AshleysTiles.tileSprites.forEach(function(item){
        // set matches counter to zero
        var matchesCounter = 0;
        
        // get row and column position from 1-dimensional array
        var row = toRow(item.pos);
        var col = toCol(item.pos);
        
        var leftTileRemove = false, rightTileRemove = false, aboveTileRemove = false, belowTileRemove = false, tileLeft = false, tileAbove = false, tileRight = false, tileBelow = false;
        
        // variable to hold position of tile to the left
        var tileLeftPos = undefined;
        // if the tiles aren't already on the left
        if (col > 0) {
            // find the position of the tile on the left
            tileLeftPos = (item.pos)-1;
            // if the tile to the left's array value matches that of the 'current' tile
            if (AshleysTiles.fieldArray[tileLeftPos] == AshleysTiles.fieldArray[item.pos]) {
                // mark as a match
                matchesCounter++;
                // mark for possible removal
                leftTileRemove = true;
            }
        }
        
        // variable to hold position of tile above
        var tileAbovePos = undefined;
        // if the tiles aren't already on the top
        if (row > 0) {
            // find the position of the tile above
            tileAbovePos = (item.pos)-4;
            // if the tile above's array value matches that of the 'current' tile
            if (AshleysTiles.fieldArray[tileAbovePos] == AshleysTiles.fieldArray[item.pos]) {
                // mark as a match
                matchesCounter++;
                // mark for possible removal
                aboveTileRemove = true;
            }
        }
        
        // variable to hold position of tile to the right
        var tileRightPos = undefined;
        // if the tiles aren't already on the right
        if (col < 3) {
            // find the position of the tile to the right
            tileRightPos = (item.pos)+1;
            // if the tile to the right's array value matches that of the 'current' tile
            if (AshleysTiles.fieldArray[tileRightPos] == AshleysTiles.fieldArray[item.pos]) {
                // mark as a match
                matchesCounter++;
                // mark for possible removal
                rightTileRemove = true;
            }
        }
        
        // variable to hold position of tile below
        var tileBelowPos = undefined;
        // if the tiles aren't already on the bottom
        if (row < 3) {
            // find the position of the tile below
            tileBelowPos = (item.pos)+4;
            // if the tile below's array value matches that of the 'current' tile
            if (AshleysTiles.fieldArray[tileBelowPos] == AshleysTiles.fieldArray[item.pos]) {
                // mark as a match
                matchesCounter++;
                // mark for possible removal
                belowTileRemove = true;
            }
        }
        
        // if there are more than 2 matches - indicating a group of 3+ tiles
        if (matchesCounter >= 2) {
            // set the tile itself to be removed
            item.markForRemoval = true;
            console.log(item.pos + "tile to remove");
            // if the left tile matched, set the left tile to be removed
            if (leftTileRemove == true) {
                // find the tile sprite in that position
                tileLeft = AshleysTiles.tileSprites.iterate("pos", tileLeftPos, Phaser.Group.RETURN_CHILD);
                tileLeft.markForRemoval = true;
                console.log(tileLeftPos + "tileLeft to remove");
            }
            // if the above tile matched, set the above tile to be removed
            if (aboveTileRemove == true) {
                // find the tile sprite in that position
                tileAbove = AshleysTiles.tileSprites.iterate("pos", tileAbovePos, Phaser.Group.RETURN_CHILD);
                tileAbove.markForRemoval = true;
                console.log(tileAbovePos + "tileAbove to remove");
            }
            // if the right tile matched, set the right tile to be removed
            if (rightTileRemove == true) {
                // find the tile sprite in that position
                tileRight = AshleysTiles.tileSprites.iterate("pos", tileRightPos, Phaser.Group.RETURN_CHILD);
                tileRight.markForRemoval = true;
                console.log(tileRightPos + "tileRight to remove");
            }
            // if the below tile matched, set the below tile to be removed
            if (belowTileRemove == true) {
                // find the tile sprite in that position
                tileBelow = AshleysTiles.tileSprites.iterate("pos", tileBelowPos, Phaser.Group.RETURN_CHILD);
                tileBelow.markForRemoval = true;
                console.log(tileBelowPos + "tileBelow to remove");
            }
        }
    })
}

function removeTileGroup(){
            // loop through all the tile sprites
            AshleysTiles.tileSprites.forEach(function (currentTile) {
                console.log(currentTile.pos);
            // if the tile has been marked for removal
            if (currentTile.markForRemoval) {
                console.log(currentTile.pos + "delete");
                // increase the score by the same amount as the value of the tile being deleted x20, because higher level tiles are worth more
                AshleysTiles.score = AshleysTiles.score + (AshleysTiles.fieldArray[currentTile.pos]*20);
                // update score text
                AshleysTiles.scoreText.text = 'Score: ' + AshleysTiles.score;
                // set the array value to 0
                AshleysTiles.fieldArray[currentTile.pos] = 0;
                // create a new tween to make tile transparent in 250 milliseconds
                var fadeOut = game.add.tween(currentTile);
                fadeOut.to({alpha: 0}, 250);
                fadeOut.onComplete.add(destroyEmptyTiles, this);
                fadeOut.start();
            }
        })
}

function destroyEmptyTiles(tileToDestroy) {
            if (tileToDestroy != undefined) {
            tileToDestroy.destroy();
            }
        }

function endGameCheck() {
        // if the 'board' is full of tiles
    if (AshleysTiles.tileSprites.total >= 16){
        // check matches a final time to see if the last tile added creates a group
        checkMatches();
        // remove group if necessary
        removeTileGroup();
        // check if the board is still full
        if (AshleysTiles.tileSprites.total >=16) {
            // then the game is finished
            gameOver();
        }
    }
}

function gameOver() {
    AshleysTiles.colorTimer = setInterval(changeColor, 1000);
    // show the game over text
    AshleysTiles.gameOver_txt.visible = true;
    AshleysTiles.restart_txt.visible = true;
    // add listener to restart the game
    game.input.onTap.add(startGame, this);
    // play a 'game over' sound clip
    aTone_snd.play();
    // don't let the player continue to move
    AshleysTiles.canMove = false;
}

*/