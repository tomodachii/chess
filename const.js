const whiteRook = {
    side: "white",
    type: "Rook",
    special: 1
}
const whiteKnight = {
    side: "white",
    type: "Knight",
    special: 0
}
const whiteBishop = {
    side: "white",
    type: "Bishop",
    special: 0
}
const whiteKing = {
    side: "white",
    type: "King",
    special: 1
}
const whiteQueen = {
    side: "white",
    type: "Queen",
    special: 0
}
const whitePawn = {
    side: "white",
    type: "Pawn",
    special: 1
}

const blackRook = {
    side: "black",
    type: "Rook",
    special: 1
}
const blackKnight = {
    side: "black",
    type: "Knight",
    special: 0
}
const blackBishop = {
    side: "black",
    type: "Bishop",
    special: 0
}
const blackKing = {
    side: "black",
    type: "King",
    special: 1
}
const blackQueen = {
    side: "black",
    type: "Queen",
    special: 0
}
const blackPawn = {
    side: "black",
    type: "Pawn",
    special: 1
}

function Piece(pieceObj) {
    this.side = pieceObj.side;
    this.type = pieceObj.type;
    this.special = pieceObj.special;
}

const whitePieces = [whiteRook, whiteKnight, whiteBishop, whiteKing, whiteQueen, whitePawn];
const blackPieces = [blackRook, blackKnight, blackBishop, blackKing, blackQueen, blackPawn];