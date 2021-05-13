const view = {
    display: function(name, location) {
        let cell = document.getElementById(location);
        cell.classList.add(name);
    },
    removeDisplay: function(name, location) {
        let cell = document.getElementById(location);
        cell.classList.remove(name);
    },
    repeatDisplay: function(name, locationArr) {
        for (i = 0; i < locationArr.length; i++) {
            this.display(name, locationArr[i]);
        }
    },
    repeatRemoveDisplay: function(name, locationArr) {
        for (i = 0; i < locationArr.length; i++) {
            this.removeDisplay(name, locationArr[i]);
        }
    }
}

const model = {
    boardSize: 8,
    numPieces: 32,
    pieceSides: ["white", "black"],
    pieceTypes: ["Rook", "Knight", "Bishop", "King", "Queen", "Pawn"],
    moveDirection: ["horizon", "vertical", "diagonal", "L"],
    boardCells: [],
    possibleMoves: [],
    killablePieces: [],
    generateBoard: function () {
        for (i = 0; i < this.boardSize; i++) {
            if (!this.boardCells[i]) this.boardCells[i] = [];
            for (j = 0; j < this.boardSize; j++) {
                this.boardCells[i][j] = {};
            }
        }
        for (i = 0, j = this.boardSize - 1; i < 3 && j > 4; i++, j--) {
            this.generatePiece(whitePieces[i], 7, i);
            this.generatePiece(whitePieces[i], 7, j);
            this.generatePiece(blackPieces[i], 0, i);
            this.generatePiece(blackPieces[i], 0, j);
        }
        this.generatePiece(whiteKing, 7, 3);
        this.generatePiece(whiteQueen, 7, 4);
        this.generatePiece(blackKing, 0, 3);
        this.generatePiece(blackQueen, 0, 4);

        for (i = 0; i < this.boardSize; i++) {
            this.generatePiece(whitePawn, 6, i);
            this.generatePiece(blackPawn, 1, i);
        }
    },
    generatePiece: function(pieceObj, x, y) {
        let piece = new Piece(pieceObj);
        view.display(Support.getName(piece), Support.toLocation(x, y));
        this.boardCells[x][y] = piece;
    },
    removePiece: function(x, y) {
        if (!Support.isEmptyObj(this.boardCells[x][y])) {
            let tmp = {};
            tmp = this.boardCells[x][y];
            this.boardCells[x][y] = {};
            view.removeDisplay(Support.getName(tmp), Support.toLocation(x, y));
            return tmp;
        }
    },
    pushKillable: function(x1, y1, x2, y2) {
        if (!Support.isEmptyObj(this.boardCells[x2][y2])) {
            if (this.isDifferentSide(this.boardCells[x1][y1], this.boardCells[x2][y2]))
                this.killablePieces.push(Support.toLocation(x2, y2));
        }
    },
    findPossibleMove: function(x, y) {
        if (!Support.isEmptyObj(this.boardCells[x][y])) {
            let type = this.boardCells[x][y].type;
            switch (type) {
                case "Rook": {
                    this.moveHorizontally(x, y, false);
                    this.moveVertically(x, y, false);
                    break;
                }
                case "Knight": {
                    this.moveKnightly(x, y);
                    break;
                }
                case "Bishop": {
                    this.moveDiagonally(x, y, false);
                    break;
                }
                case "King": {
                    this.moveHorizontally(x, y, true);
                    this.moveVertically(x, y, true);
                    this.moveDiagonally(x, y, true)
                    break;
                }
                case "Queen": {
                    this.moveHorizontally(x, y, false);
                    this.moveVertically(x, y, false);
                    this.moveDiagonally(x, y, false);
                    break;
                }
                case "Pawn": {
                    let side = this.boardCells[x][y].side;
                    if (!this.boardCells[x][y].special) {
                        this.moveVertically(x, y, true);
                    } else {
                        this.enPassant(x, y, side);
                    }
                    this.killablePieces = [];
                    if (side == "white") {
                        if (x - 1 >= 0) {
                            if (y + 1 < this.boardSize) this.pushKillable(x, y, x - 1, y + 1);
                            if (y - 1 >= 0) this.pushKillable(x, y, x - 1, y - 1);
                        }
                    }
                    if (side == "black") {
                        if (x + 1 < this.boardSize) {
                            if (y + 1 < this.boardSize) this.pushKillable(x, y, x + 1, y + 1);
                            if (y - 1 >= 0) this.pushKillable(x, y, x + 1, y - 1);
                        }
                    }
                    break;
                }
                default: {
                    break;
                }  
            }
            view.repeatDisplay("possible", this.possibleMoves);
            view.repeatDisplay("killable", this.killablePieces);
        }
    },
    checkPossibleMove: function(x, y) {
        for (i = 0; i < this.possibleMoves.length; i++) {
            if (Support.toLocation(x, y) == this.possibleMoves[i]) return true;
        }
        for (i = 0; i < this.killablePieces.length; i++) {
            if (Support.toLocation(x, y) == this.killablePieces[i]) return true;
        }
        return false;
    },
    deletePossibleMove: function() {
        view.repeatRemoveDisplay("possible", this.possibleMoves);
        this.possibleMoves = [];
        view.repeatRemoveDisplay("killable", this.killablePieces);
        this.killablePieces = [];
    },
    move: function(x1, y1, x2, y2) {
        if (this.checkPossibleMove(x2, y2)) {
            if (this.boardCells[x1][y1].special == 1) this.boardCells[x1][y1].special = 0;
            let tmp = this.removePiece(x1, y1);
            if (!Support.isEmptyObj(this.boardCells[x2][y2])) this.removePiece(x2, y2);
            this.generatePiece(tmp, x2, y2);
        }
    },
    isDifferentSide: (piece1, piece2) => piece1.side !== piece2.side,
    parseCell: function(x1, y1, x2, y2) {
        if (!Support.isEmptyObj(this.boardCells[x2][y2])) {
            if (this.isDifferentSide(this.boardCells[x1][y1], this.boardCells[x2][y2]))
                this.killablePieces.push(Support.toLocation(x2, y2));
            return false;
        }
        this.possibleMoves.push(Support.toLocation(x2, y2));
        return true;
    },
    moveHorizontally: function(x, y, limit) {
        if (limit) {
            if (y + 1 < this.boardSize) {
                this.parseCell(x, y, x, y + 1);
            }
            if (y - 1 >= 0) {
                this.parseCell(x, y, x, y - 1);
            }
        } else {
            for (i = y + 1; i < this.boardSize; i++) {
                if (!this.parseCell(x, y, x, i)) break;
            }
            for (i = y - 1; i >= 0; i--) {
                if (!this.parseCell(x, y, x, i)) break;
            }
        }
    },
    moveVertically: function(x, y, limit) {
        if (limit) {
            let name = Support.getName(this.boardCells[x][y]);
            if (x + 1 < this.boardSize && name != "whitePawn") {
                this.parseCell(x, y, x + 1, y);
            }
            if (x - 1 >= 0 && name != "blackPawn") {
                this.parseCell(x, y, x - 1, y);
            }
        } else {
            for (i = x + 1; i < this.boardSize; i++) {
                if (!this.parseCell(x, y, i, y)) break;
            }
            for (i = x - 1; i >= 0; i--) {
                if (!this.parseCell(x, y, i, y)) break;
            }
        }
    },
    moveDiagonally: function(x, y, limit) {
        if (limit) {
            if (x + 1 < this.boardSize && y + 1 < this.boardSize) {
                this.parseCell(x, y, x + 1, y + 1);
            }
            if (x + 1 < this.boardSize && y - 1 >= 0) {
                this.parseCell(x, y, x + 1, y - 1);
            }
            if (x - 1 >=0 && y + 1 < this.boardSize) {
                this.parseCell(x, y, x - 1, y + 1);
            }
            if (x - 1 >=0 && y - 1 >= 0) {
                this.parseCell(x, y, x - 1, y - 1);
            }
        } else {
            for (i = x + 1, j = y + 1; i < this.boardSize && j < this.boardSize; i++, j++) {
                if (!this.parseCell(x, y, i, j)) break;
            }
            for (i = x + 1, j = y - 1; i < this.boardSize && j >= 0; i++, j--) {
                if (!this.parseCell(x, y, i, j)) break;
            }
            for (i = x - 1, j = y + 1; i >= 0 && j < this.boardSize; i--, j++) {
                if (!this.parseCell(x, y, i, j)) break;
            }
            for (i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
                if (!this.parseCell(x, y, i, j)) break;
            }
        }
    },
    moveKnightly: function(x, y) {
        if (x + 1 < this.boardSize && y + 2 < this.boardSize) this.parseCell(x, y, x + 1, y + 2);
        if (x + 1 < this.boardSize && y - 2 >= 0) this.parseCell(x, y, x + 1, y - 2);
        if (x - 1 >= 0 && y + 2 < this.boardSize) this.parseCell(x, y, x - 1, y + 2); 
        if (x - 1 >= 0 && y - 2 >= 0) this.parseCell(x, y, x - 1, y - 2); 
        if (x + 2 < this.boardSize && y + 1 < this.boardSize) this.parseCell(x, y, x + 2, y + 1);
        if (x + 2 < this.boardSize && y - 1 >= 0) this.parseCell(x, y, x + 2, y - 1);
        if (x - 2 >= 0 && y + 1 < this.boardSize) this.parseCell(x, y, x - 2, y + 1); 
        if (x - 2 >= 0 && y - 1 >= 0) this.parseCell(x, y, x - 2, y - 1);
    },
    enPassant: function(x, y, side) {
        if (side == "white" && this.parseCell(x, y, x - 1, y)) {
            this.parseCell(x, y, x - 2, y);
        }
        else if (side == "black" && this.parseCell(x, y, x + 1, y)) {
            this.parseCell(x, y, x + 2, y);
        }   
    }
}

const controller = {
    turn: model.pieceSides[0],
    movesCounter: 0,
    selected: "",
    parseLocation: (location) => [+location[0], +location[1]],
    changeTurn: function() {
        this.movesCounter++;
        this.turn = model.pieceSides[this.movesCounter % 2]; 
    },
    createNewgame: function() {
        model.generateBoard();
        // model.generatePiece(whiteKnight, 3, 3);
        // model.findPossibleMove(3, 3);
        // console.log(model.possibleMoves);
        // console.log(model.killablePieces);
        // console.log(model.boardCells);
        // model.move(3, 3, 1, 2);
        // this.unselect(3, 3);
    },
    isMovable: function(location) {
        for (i = 0; i < model.possibleMoves.length; i++) {
            if (model.possibleMoves[i] === location) return location;
        }
        for (i = 0; i < model.killablePieces.length; i++) {
            if (model.killablePieces[i] === location) return location;
        }
        return "";
    },
    parseClick: function(location) {
        let [x, y] = this.parseLocation(location);
        if (!this.selected) {
            if (model.boardCells[x][y].side == this.turn) this.select(x, y);
        }
        else if (this.selected) {
            if (location == this.selected) {
                this.unselect(x, y);
            } else {
                let [sx, sy] = this.parseLocation(this.selected);
                if (this.isMovable(location)) {
                    model.move(sx, sy, x, y);
                    this.unselect(sx, sy);
                    this.changeTurn();
                }
                if (model.boardCells[x][y].side == this.turn) {
                    this.unselect(sx, sy);
                    this.select(x, y); 
                }
            }
        }
    },
    select: function(x, y) {
        if (!Support.isEmptyObj(model.boardCells[x][y])) {
            view.display("selected", Support.toLocation(x, y));
            model.findPossibleMove(x, y);
            this.selected = Support.toLocation(x, y);
        } 
    },
    unselect: function(x, y) {
        if (Support.checkClassExist(Support.toLocation(x, y), "selected")) {
            view.removeDisplay("selected", Support.toLocation(x, y));
        }
        model.deletePossibleMove();   
        this.selected = "";
    }
}

window.onload = ()=> {
    controller.createNewgame();

    let elementsArray = document.querySelectorAll("td");
    elementsArray.forEach(function(elem) {
        elem.addEventListener("click", function(eventObj) {
            let cell = eventObj.target;
            let location = cell.id;
            controller.parseClick(location);
        })
    });
}