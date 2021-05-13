function generatePiece(pieceObj, x, y) {
    var piece = new Piece(pieceObj);
    boardCells[x][y] = piece;
}

function isEmptyObj(obj) {
    return (Object.keys(obj).length === 0 && obj.constructor === Object);
}

function toLocation(x, y) {
    return x + "" + y;
}

function Piece(pieceObj) {
    this.side = pieceObj.side;
    this.type = pieceObj.type;
    this.special = pieceObj.special;
}

var blackRook = {
    side: "black",
    type: "Rook",
    special: 1
}

var whiteKing = {
    side: "white",
    type: "King",
    special: 1
}

var blackKnight = {
    side: "black",
    type: "Knight",
    special: 0
}

var boardSize = 8;
var boardCells = [];

generateBoard = function () {
    for (i = 0; i < boardSize; i++) {
        if (!boardCells[i]) boardCells[i] = [];
        for (j = 0; j < boardSize; j++) {
            boardCells[i][j] = {};
        }
    }
}

generateBoard();
generatePiece(blackRook, 0, 1);
generatePiece(whiteKing, 0, 0);
generatePiece(blackKnight, 0, 3);

var x = isEmptyObj(boardCells[0][0]);

function move(x1, y1, x2, y2, arr) {
    if(isEmptyObj(arr[x2][y2])) {
        arr[x2][y2] = arr[x1][y1];
        arr[x1][y1] = {};
    }
}

function removePiece(x, y) {
    if (!isEmptyObj(boardCells[x][y])) {
        var tmp = {};
        tmp = boardCells[x][y];
        boardCells[x][y] = {};
        return tmp;
    }
}
// var temp = removePiece(0, 0);
generatePiece(boardCells[0][0], 1, 2);
var possibleMoves = [];
var killablePieces = []

function checkNextCell(x1, y1, x2, y2) {
    if (!isEmptyObj(boardCells[x2][y2])) {
        if (isDifferentSide(boardCells[x1][y1], boardCells[x2][y2]))
            killablePieces.push(toLocation(x2, y2));
        return false;
    }
    possibleMoves.push(toLocation(x2, y2));
    return true;
}

function moveHorizontally(x, y, limit) {
    if (limit) {
        if (y + 1 < boardSize) {
            checkNextCell(x, y, x, y + 1);
        }
        if (y - 1 >= 0) {
            checkNextCell(x, y, x, y - 1);
        }
    } else {
        for (i = y + 1; i < boardSize; i++) {
            if (!checkNextCell(x, y, x, i)) break;
        }
        for (i = y - 1; i >= 0; i--) {
            if (!checkNextCell(x, y, x, i)) break;
        }
    }
}

function moveVertically(x, y, limit) {
    if (limit) {
        if (x + 1 < boardSize) {
            checkNextCell(x, y, x + 1, y);
        }
        if (x - 1 >= 0) {
            checkNextCell(x, y, x + 1, y);
        }
    } else {
        for (i = x + 1; i < boardSize; i++) {
            if (!checkNextCell(x, y, i, y)) break;
        }
        for (i = x - 1; i >= 0; i--) {
            if (!checkNextCell(x, y, i, y)) break;
        }
    }
}

function isDifferentSide(piece1, piece2) {
    return piece1.side !== piece2.side;
}

var y = isDifferentSide(boardCells[0][3], boardCells[0][1]);
y

generatePiece(blackKnight, 1, 3);
moveHorizontally(1, 2, false);
moveVertically(1, 2, false);

possibleMoves
killablePieces

boardCells
// move(0, 0, 1, 5, boardCells);

const hero = {
    name: 'Batman',
    realName: 'Bruce Wayne'
};

const { name, realName } = hero;

console.log(name);

function parseLocation(location) {
    let x = +location[0];
    let y = +location[1];
    return [x, y];
}

let [num1, num2] = parseLocation("01");

console.log(num1)
console.log(num2)
