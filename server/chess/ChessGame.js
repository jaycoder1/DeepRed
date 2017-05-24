
// P = Pawn
// R = Rook
// N = Knight
// B = Bishop
// Q = Queen
// K = King

const isLegalMove = require('./isLegalMove');

class ChessGame {

  constructor() {
    this.board = [
      ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
      ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
      ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
    ];
    this.blackCapPieces = [];
    this.whiteCapPieces = [];
  }

  movePiece(origin, dest) {
    let originPiece = this.board[dest[0]][dest[1]];
    const originPieceColor = originPiece[0];
    let destPiece = this.board[dest[0]][dest[1]];
    const destPieceColor = destPiece[0];

    if (isLegalMove(this.board, origin, dest)) {
      if (dest) {
        if (originPieceColor === destPieceColor) {
          throw new Error('Attempted to capture own piece');
        } else {
          this.capturePiece(destPiece);
        }
      }
      destPiece = originPiece;
      originPiece = null;
      // check for check/checkmate/stalemate
      return this.board;
    }
    throw new Error ('Attempted Move is Illegal')
  }

  capturePiece(piece) {
    if (piece[0] === 'W') {
      this.blackCapPieces.push(piece);
    } else {
      this.whiteCapPieces.push(piece);
    }
  }

}

module.exports = ChessGame;