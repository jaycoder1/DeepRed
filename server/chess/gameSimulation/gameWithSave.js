const safeMoves = require('../deepRed/safeMoves');
const endGameChecks = require('../deepRed/endGameChecks');
const basic = require('../deepRed/basic');
const display = require('../deepRed/display');
const chessEncode = require('../chessEncode');
const gameConfig = require('./gameConfig');
const chessDB = require('../../chessDB');
const pieceState = require('../pieceState');

const { displayBoard } = display;
const { transcribeBoard, encodeBoard, encodeWithState } = chessEncode;
const { saveDeepRedWhite, saveDeepRedBlack } = chessDB;

const { mutateBoard } = basic;

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
} = safeMoves;

const {
  isCheckmateWhite,
  isCheckmateBlack,
  isStalemateWhite,
  isStalemateBlack,
} = endGameChecks;

const { MAX_GAME_LENGTH } = gameConfig;
const { evalPieceState } = pieceState;

const whiteMove = (board, state) => {
  const moves = getSafeMovesWhite(board, state);
  const newState = state;
  newState.moveCount += 1;

  let count = 0;
  const keys = Object.keys(moves);
  let move = {};

  for (let i = 0; i < keys.length; i += 1) {
    count += moves[keys[i]].length;
  }

  const choice = Math.floor(Math.random() * count);

  count = 0;
  for (let i = 0; i < keys.length; i += 1) {
    if ((count + moves[keys[i]].length) > choice) {
      if (keys[i] !== 'specialMoves') {
        move = [keys[i], moves[keys[i]][choice - count]];
      } else {
        move = moves[keys[i]][choice - count];
      }
      break;
    }
    count += moves[keys[i]].length;
  }

  newState.canEnPassantB = '';

  if (!Array.isArray(move)) {
    if (move.move === 'castle') {
      newState.hasMovedWK = true;
      newState.castle += 1;
      if (move.side === 'O-O') {
        newState.hasMovedWKR = true;
      } else {
        newState.hasMovedWQR = true;
      }
    }
    if (move.move === 'enpassant') {
      newState.lastCapture = newState.moveCount;
      newState.capturedWhite.push('BP');
      newState.countBlackPieces -= 1;
      newState.enPassant += 1;
    }
    if (move.move === 'pawnPromotion') {
      const row = move.to[0];
      const col = move.to[1];
      if (board[row][col]) {
        newState.countBlackPieces -= 1;
        newState.capturedWhite.push(board[row][col]);
      }
    }
  } else {
    const row = move[0][0];
    const toRow = move[1][0];
    const col = move[0][1];
    const toCol = move[1][1];
    if (board[row][col][1] === 'P') newState.lastPawn = newState.moveCount;
    if (board[toRow][toCol]) {
      newState.lastCapture = newState.moveCount;
      newState.capturedWhite.push(board[toRow][toCol]);
      newState.countBlackPieces -= 1;
    }

    if (board[row][col] === 'WP' && +row === 6 && +toRow === 4) {
      newState.canEnPassantB = `4${col}`;
    }
  }

  return [move, newState];
};

const blackMove = (board, state) => {
  const moves = getSafeMovesBlack(board, state);
  const newState = state;
  newState.moveCount += 1;

  let count = 0;
  const keys = Object.keys(moves);
  let move = {};

  for (let i = 0; i < keys.length; i += 1) {
    count += moves[keys[i]].length;
  }

  const choice = Math.floor(Math.random() * count);

  count = 0;
  for (let i = 0; i < keys.length; i += 1) {
    if ((count + moves[keys[i]].length) > choice) {
      if (keys[i] !== 'specialMoves') {
        move = [keys[i], moves[keys[i]][choice - count]];
      } else {
        move = moves[keys[i]][choice - count];
      }
      break;
    }
    count += moves[keys[i]].length;
  }

  newState.canEnPassantW = '';

  if (!Array.isArray(move)) {
    if (move.move === 'castle') {
      newState.hasMovedWK = true;
      newState.castle += 1;
      if (move.side === 'O-O') {
        newState.hasMovedWKR = true;
      } else {
        newState.hasMovedWQR = true;
      }
    }
    if (move.move === 'enpassant') {
      newState.lastCapture = newState.moveCount;
      newState.capturedBlack.push('WP');
      newState.countWhitePieces -= 1;
      newState.enPassant += 1;
    }
    if (move.move === 'pawnPromotion') {
      const row = move.to[0];
      const col = move.to[1];
      if (board[row][col]) {
        newState.countWhitePieces -= 1;
        newState.capturedBlack.push(board[row][col]);
      }
    }
  } else {
    const row = move[0][0];
    const toRow = move[1][0];
    const col = move[0][1];
    const toCol = move[1][1];
    if (board[row][col][1] === 'P') newState.lastPawn = newState.moveCount;
    if (board[toRow][toCol]) {
      newState.lastCapture = newState.moveCount;
      newState.capturedBlack.push(board[toRow][toCol]);
      newState.countWhitePieces -= 1;
    }
    if (board[row][col] === 'WP' && +row === 1 && +toRow === 3) {
      newState.canEnPassantW = `3${col}`;
    }
  }

  return [move, newState];
};

const saveToDB = (movesList, winner) => {
  for (let i = 0; i < movesList.length - 1; i += 1) {
    console.log(movesList[i]);
    const entry = {
      parent: movesList[i],
      board: movesList[i + 1],
      white_win: (winner === 'W') ? 1 : 0,
      black_win: (winner === 'B') ? 1 : 0,
      draw: (winner === 'D') ? 1 : 0,
    };
    if (i % 2 === 0) {
      saveDeepRedWhite(entry);
    } else {
      saveDeepRedBlack(entry);
    }
  }
};

const simulateGames = (number, displayAll, displayFn) => {
  let transcribeCount = 0;
  let encodeCount = 0;

  let gameCount = 0;
  // const interval = 2;
  const gameSummary = {
    games: 0,
    whiteWins: 0,
    blackWins: 0,
    stalemateByMoves: 0,
    stalemateByPieces: 0,
    stalemateNoWhiteMoves: 0,
    stalemateNoBlackMoves: 0,
    end100moves: 0,
    castleKing: 0,
    castleQueen: 0,
    pawnPromotion: 0,
    enPassant: 0,
    averageMovesPerGame: 0,
  };

  const gamesHistory = [];

  while (gameCount < number) {
    console.log('Game Count: ', gameCount, '/', number);
    console.log(gameSummary);
    let gameEnded = false;
    gameSummary.games += 1;

    let board = [
      ['BR', null, 'BB', 'BQ', 'BK', 'BB', null, 'BR'],
      ['BP', 'BP', 'BP', 'BP', null, 'BP', 'BP', 'BP'],
      [null, null, 'WN', null, null, 'BN', null, null],
      [null, null, null, null, 'BP', null, null, null],
      [null, null, null, null, 'WP', null, null, null],
      [null, null, 'WN', null, null, 'WN', null, null],
      ['WP', 'WP', 'WP', 'WP', null, 'WP', 'WP', 'WP'],
      ['WR', null, 'WB', 'WQ', 'WK', 'WB', null, 'WR'],
    ];

    transcribeCount += transcribeBoard(board).length;
    encodeCount += encodeBoard(board).length;

    const state = {
      hasMovedWK: false,
      hasMovedWKR: false,
      hasMovedWQR: false,
      hasMovedBK: false,
      hasMovedBKR: false,
      hasMovedBQR: false,
      canEnPassantW: '',
      canEnPassantB: '',
      countBlackPieces: 16,
      countWhitePieces: 16,
      capturedWhite: [],
      capturedBlack: [],
      lastCapture: 0,
      lastPawn: 0,
      moveCount: 0,
    };


    let movesList = [];
    let encodeState = Object.assign({}, state);
    movesList.push(encodeWithState(board, state));

    
    if (displayAll) {
      console.log('=== START GAME ===');
      displayFn(board);
    }

    let currentMoveWhite;
    let currentMoveBlack;
    let move;
    let newState;
    let moveCount = 1;

    while (!gameEnded) {
      if (displayAll) console.log(`=== [${moveCount}] WHITE MOVE ===`);
      currentMoveWhite = whiteMove(board, state);
      move = currentMoveWhite[0];

      if (!Array.isArray(move)) {
        if (move.move === 'castle') {
          if (move.side === 'O-O') {
            gameSummary.castleKing += 1;
          } else {
            gameSummary.castleQueen += 1;
          }
        }
        if (move.move === 'enpassant') gameSummary.enPassant += 1;
        if (move.move === 'pawnPromotion') gameSummary.pawnPromotion += 1;
      }

      newState = currentMoveWhite[1];

      encodeState = evalPieceState(board, move, 'W', encodeState);
      board = mutateBoard(board, move);
      movesList.push(encodeWithState(board, encodeState));

      /* DISPLAY BOARD   */

      !gameEnded && displayFn(board);

      transcribeCount += transcribeBoard(board).length;
      encodeCount += encodeBoard(board).length;

      /* END */

      if (isCheckmateWhite(board)) {
        gameEnded = true;
        console.log('**** WHITE CHECKMATE ***');
        gameSummary.whiteWins += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);

        // saveToDB(movesList, 'W');

        gamesHistory.push([movesList.slice(0), 'W']);

        console.log('# Moves: ', newState.moveCount);
        movesList = [];
      }
      if (isStalemateBlack(board)) {
        gameEnded = true;
        console.log('**** STALEMATE: BLACK CAN NOT MOVE ***', newState);
        gameSummary.stalemateNoBlackMoves += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
        movesList = [];
      }
      if ((newState.moveCount - newState.lastCapture > 50) &&
        (newState.moveCount - newState.lastPawn > 50)
      ) {
        gameEnded = true;
        console.log('**** STALEMATE BY MOVES ***', newState);
        gameSummary.stalemateByMoves += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
        movesList = [];
      }

      /*  ONE HUNDRED MOVES */

      if ((newState.moveCount >= MAX_GAME_LENGTH)) {
        gameEnded = true;
        console.log(`**** Max Moves ${MAX_GAME_LENGTH} ***`, newState);
        gameSummary.end100moves += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
        movesList = [];
      }

      /* END */

      if (newState.countBlackPieces + newState.countWhitePieces === 2) {
        gameEnded = true;
        console.log('**** STALEMATE BY PIECES ***', newState);
        gameSummary.stalemateByPieces += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
        movesList = [];
      }

      if (!gameEnded) {
        currentMoveBlack = blackMove(board, newState);
        move = currentMoveBlack[0];

        if (!Array.isArray(move)) {
          if (move.move === 'castle') {
            if (move.side === 'O-O') {
              gameSummary.castleKing += 1;
            } else {
              gameSummary.castleQueen += 1;
            }
          }
          if (move.move === 'enpassant') gameSummary.enPassant += 1;
          if (move.move === 'pawnPromotion') gameSummary.pawnPromotion += 1;
        }

        newState = currentMoveBlack[1];

        encodeState = evalPieceState(board, move, 'B', encodeState);
        board = mutateBoard(board, move);
        movesList.push(encodeWithState(board, encodeState));

        transcribeCount += transcribeBoard(board).length;
        encodeCount += encodeBoard(board).length;

        if (displayAll) console.log(`                             === [${moveCount}] BLACK MOVE ===`);
        !gameEnded && displayFn(board);
        if (isCheckmateBlack(board)) {
          gameEnded = true;
          console.log('**** BLACK CHECKMATE ***');
          gameSummary.blackWins += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);

          // saveToDB(movesList, 'B');
          gamesHistory.push([movesList.slice(0), 'B']);
          console.log('# Moves: ', newState.moveCount);
          movesList = [];
        }
        if (isStalemateWhite(board)) {
          gameEnded = true;
          console.log('**** STALEMATE: WHITE CAN NOT MOVE ***', newState);
          gameSummary.stalemateNoWhiteMoves += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
          movesList = [];
        }
        if ((newState.moveCount - newState.lastCapture > 50) &&
          (newState.moveCount - newState.lastPawn > 50)
        ) {
          gameEnded = true;
          console.log('**** STALEMATE BY MOVES ***', newState);
          gameSummary.stalemateByMoves += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
          movesList = [];
        }


        /*  ONE HUNDRED MOVES */

        if ((newState.moveCount >= 100)) {
          gameEnded = true;
          console.log('**** 100 Moves ***', newState);
          gameSummary.end100moves += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
          movesList = [];
        }

      /* END */


        if (newState.countBlackPieces + newState.countWhitePieces === 2) {
          gameEnded = true;
          console.log('**** STALEMATE BY PIECES ***', newState);
          gameSummary.stalemateByPieces += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
          movesList = [];
        }
      }

      moveCount += 1;
    }
    moveCount = 1;
    gameCount += 1;
  }

  console.log('Games Played:     ', gameCount);
  console.log('Transcribe Count: ', transcribeCount);
  console.log('Encode Count:     ', encodeCount);
  console.log('Data compression: ', 1 - (encodeCount / transcribeCount));
  console.log('Game summary:     ', gameSummary);

  console.log();
  console.log();
  console.log(gamesHistory);

  for (let i = 0; i < gamesHistory.length; i += 1) {
    setTimeout(() => saveToDB(gamesHistory[0], gamesHistory[1]), 2000 * i);
  }

  return gameSummary;
};

const displayTranscribe = (board) => {
  console.log(transcribeBoard(board));
};

const displayEncode = (board) => {
  console.log(encodeBoard(board));
};

const displayFullBoard = (board) => {
  displayBoard(board);
};

module.exports = {
  simulateGames,
  displayFullBoard,
  displayTranscribe,
  displayEncode,
  whiteMove,
  blackMove,
  mutateBoard,
};

simulateGames(50, false, () => { });
