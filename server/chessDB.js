const knex = require('knex')(require('../knexfile'));

// const newRoomWhite = (game) => {
//   knex.insert({
//     room: game.room,
//     white: game.display,
//     black: null,
//     result: null,
//     turns: 0,
//     history: '[]',
//     black_pieces: '[]',
//     white_pieces: '[]',
//   }).into('games').then((res) => {
//     console.log(res);
//   });
// }

// const newRoomBlack = (game) => {
//   knex.insert({
//     room: game.room,
//     white: null,
//     black: game.display,
//     result: null,
//     turns: 0,
//     history: '[]',
//     black_pieces: '[]',
//     white_pieces: '[]',
//   }).into('games').then((res) => {
//     console.log(res);
//   });
// };

// const joinRoomWhite = (game) => {
//   knex('games').where({ room: game.room }).update({
//     white: game.display,
//   }).then((res) => {
//     console.log(res);
//   });
// };

// const joinRoomBlack = (game) => {
//   knex('games').where({ room: game.room }).update({
//     black: game.display,
//   }).then((res) => {
//     console.log(res);
//   });
// };

// const saveMove = (game) => {
//   knex('games').where({ room: game.room })
//     .increment('turns', 1)
//     .then((res) =>
//       console.log(res)
//    );

//   knex('games').where('room', game.room).then((res) => { 

//   var history = JSON.parse(res[0].history);
//   history.push(game.history);

//     knex('games').where({ room: game.room }).update({
//       history: JSON.stringify(history)
//     }).then((res) =>
//         console.log(res)
//     )
//   });
// }

// const saveWhitePiece = (game) => {

//   knex('games').where('room', game.room).then((res) => {

//   var history = JSON.parse(res[0].white_pieces);
//   history.push(JSON.parse(game.white_pieces));

//     knex('games').where({ room: game.room }).update({
//     white_pieces: JSON.stringify(history),
//   }).then((res) =>
//       console.log(res)
//    );
//   });



// }

// const saveBlackPiece = (game) => {

//   knex('games').where('room', game.room).then((res) => {

//   var history = JSON.parse(res[0].black_pieces);
//   history.push(JSON.parse(game.black_pieces));

//     knex('games').where({ room: game.room }).update({
//     black_pieces: JSON.stringify(history),
//   }).then((res) =>
//       console.log(res)
//    );
//   });

// }

// // game = {
// //   session_id: 'session_id'
// //   result: 'name/name2' || 'draw'
// //   white: 'name',
// //   black: 'name2',
// // }


// const finishGame = (game) => {
//   if (game.result == 'draw'){
//     knex('games').where({room: game.room}).update({
//       result: 'Draw'
//     }).then((res) => 
//       console.log(res)
//     );

//     knex('profiles').where({display: game.white}).increment('draw', 1)
//     .then((res) => 
//       console.log(res)
//     );

//     knex('profiles').where({display: game.black}).increment('draw', 1)
//     .then((res) => 
//       console.log(res)
//     );

//     knex('profiles').where({ display: game.white }).increment('total_games', 1)
//     .then((res) =>
//       console.log(res)
//     );

//     knex('profiles').where({ display: game.black }).increment('total_games', 1)
//     .then((res) =>
//       console.log(res)
//     );

//   } else if (game.result == game.white) {

//     knex('games').where({room: game.room}).update({
//       result: game.result
//     }).then((res) => 
//       console.log(res)
//     );

//     knex('profiles').where({display: game.result}).increment('win', 1)
//     .then((res) => 
//       console.log(res)
//     );

//     knex('profiles').where({ display: game.black }).increment('loss', 1)
//     .then((res) =>
//       console.log(res)
//     );

//     knex('profiles').where({ display: game.white }).increment('total_games', 1)
//     .then((res) =>
//       console.log(res)
//     );

//     knex('profiles').where({ display: game.black }).increment('total_games', 1)
//     .then((res) =>
//       console.log(res)
//     );
//   } else {

//     knex('games').where({room: game.room}).update({
//       result: game.result
//     }).then((res) => 
//       console.log(res)
//     );

//     knex('profiles').where({display: game.result}).increment('win', 1)
//     .then((res) =>
//       console.log(res)
//     );

//     knex('profiles').where({ display: game.white }).increment('loss', 1)
//     .then((res) =>
//       console.log(res)
//     );

//     knex('profiles').where({ display: game.white }).increment('total_games', 1)
//     .then((res) =>
//       console.log(res)
//     );

//     knex('profiles').where({ display: game.black }).increment('total_games', 1)
//     .then((res) =>
//       console.log(res)
//     );

//   }
// };





// const requestClient = (user) => {
//   knex('profiles').where('display', user.display).then((res) =>
//      console.log(res[0])
//   );
// };

// const requestGame = (game) => {
//   knex('games').where('room', game.room).then((res) =>
//      console.log(res[0])
//   );
// };

// const requestHistory = (game) => {
//   knex('games').where('room', game.room).then((res) =>
//      console.log(res[0].history)
//   );
// };

// const requestWhitePieces = (game) => {
//   knex('games').where('room', game.room).then((res) =>
//      console.log(res[0].white_pieces)
//   );
// };

// const requestBlackPieces = (game) => {
//   knex('games').where('room', game.room).then((res) =>
//      console.log(res[0].black_pieces)
//   );
// };

// module.exports.newRoomWhite = newRoomWhite;
// module.exports.newRoomBlack = newRoomBlack;
// module.exports.joinRoomWhite = joinRoomWhite;
// module.exports.joinRoomBlack = joinRoomBlack;
// module.exports.saveWhitePiece = saveWhitePiece;
// module.exports.saveBlackPiece = saveBlackPiece;
// module.exports = finishGame;
// module.exports = requestClient;
// module.exports = requestGame;
// module.exports.requestHistory = requestHistory;
// module.exports = requestWhitePieces;
// module.exports = requestBlackPieces;


const saveDeepRedWhite = (entry) => {
  if (entry.white_win === 1) {
    knex('DeepRed_WhiteMoves').where({
      parent: entry.parent,
      board: entry.board,
    })
      .then((res) => {
        if (res.length === 0) {
          knex.insert({
            parent: entry.parent,
            board: entry.board,
            white_win: entry.white_win,
            black_win: entry.black_win,
            draw: entry.draw,
            winPercentage: 100,
          }).into('DeepRed_WhiteMoves').then((resp) => {
            console.log('** INSERT new White move **');
          });
        } else {
          knex('DeepRed_WhiteMoves').where({
            parent: entry.parent,
            board: entry.board,
          })
            .update({
              'white_win': res[0].white_win + 1,
              'winPercentage': (res[0].white_win + 1) / (res[0].white_win + 1 + res[0].black_win + res[0].draw) * 100,
            })
            .then((resp) => {
              console.log('** UPDATED White move **');
            });
        }
      });
  } else if (entry.black_win === 1) {
    knex('DeepRed_WhiteMoves').where({
      parent: entry.parent,
      board: entry.board,
    })
      .then((res) => {
        if (res.length === 0) {
          knex.insert({
            parent: entry.parent,
            board: entry.board,
            white_win: entry.white_win,
            black_win: entry.black_win,
            draw: entry.draw,
            winPercentage: 0,
          }).into('DeepRed_WhiteMoves').then((resp) => {
            console.log('** INSERT new White move **');
          });
        } else {
          knex('DeepRed_WhiteMoves').where({
            parent: entry.parent,
            board: entry.board,
          })
            .update({
              'black_win': res[0].black_win + 1,
              'winPercentage': (res[0].white_win) / (res[0].white_win + res[0].black_win + 1 + res[0].draw) * 100,
            })
            .then((resp) => {
              console.log('** UPDATED White move **');
            });
        }
      });
  } else {
    knex('DeepRed_WhiteMoves').where({
      parent: entry.parent,
      board: entry.board,
    })
      .then((res) => {
        if (res.length === 0) {
          knex.insert({
            parent: entry.parent,
            board: entry.board,
            white_win: entry.white_win,
            black_win: entry.black_win,
            draw: entry.draw,
            winPercentage: 0,
          }).into('DeepRed_WhiteMoves').then((resp) => {
            console.log('** INSERT new White move **');
          });
        } else {
          knex('DeepRed_WhiteMoves').where({
            parent: entry.parent,
            board: entry.board,
          })
            .update({
              'draw': res[0].draw + 1,
              'winPercentage': (res[0].white_win) / (res[0].white_win + res[0].black_win + res[0].draw + 1) * 100,
            })
            .then((resp) => {
              console.log('** UPDATED White move **');
            });
        }
      });
  }
};

const saveDeepRedBlack = (entry) => {
  if (entry.white_win === 1) {
    knex('DeepRed_BlackMoves').where({
      parent: entry.parent,
      board: entry.board,
    })
      .then((res) => {
        if (res.length === 0) {
          knex.insert({
            parent: entry.parent,
            board: entry.board,
            white_win: entry.white_win,
            black_win: entry.black_win,
            draw: entry.draw,
            winPercentage: 0,
          }).into('DeepRed_BlackMoves').then((resp) => {
            console.log('** INSERT new Black move **');
          });
        } else {
          knex('DeepRed_BlackMoves').where({
            parent: entry.parent,
            board: entry.board,
          })
            .update({
              'white_win': res[0].white_win + 1,
              'winPercentage': (res[0].black_win) / (res[0].white_win + 1 + res[0].black_win + res[0].draw) * 100,
            })
            .then((resp) => {
              console.log('** UPDATED Black move **');
            });
        }
      });
  } else if (entry.black_win === 1) {
    knex('DeepRed_BlackMoves').where({
      parent: entry.parent,
      board: entry.board,
    })
      .then((res) => {
        if (res.length === 0) {
          knex.insert({
            parent: entry.parent,
            board: entry.board,
            white_win: entry.white_win,
            black_win: entry.black_win,
            draw: entry.draw,
            winPercentage: 100,
          }).into('DeepRed_BlackMoves').then((resp) => {
            console.log('** INSERT new Black move **');
          });
        } else {
          knex('DeepRed_BlackMoves').where({
            parent: entry.parent,
            board: entry.board,
          })
            .update({
              'black_win': res[0].black_win + 1,
              'winPercentage': (res[0].black_win + 1) / (res[0].white_win + res[0].black_win + 1 + res[0].draw) * 100,
            })
            .then((resp) => {
              console.log('** UPDATED Black move **');
            });
        }
      });
  } else {
    knex('DeepRed_BlackMoves').where({
      parent: entry.parent,
      board: entry.board,
    })
      .then((res) => {
        if (res.length === 0) {
          knex.insert({
            parent: entry.parent,
            board: entry.board,
            white_win: entry.white_win,
            black_win: entry.black_win,
            draw: entry.draw,
            winPercentage: 0,
          }).into('DeepRed_BlackMoves').then((resp) => {
            console.log('** INSERT new Black move **');
          });
        } else {
          knex('DeepRed_BlackMoves').where({
            parent: entry.parent,
            board: entry.board,
          })
            .update({
              draw: res[0].draw + 1,
              winPercentage: (res[0].black_win) / (res[0].white_win + res[0].black_win + res[0].draw + 1) * 100,
            })
            .then((resp) => {
              console.log('** UPDATED Black move **');
            });
        }
      });
  }
};

const getMovesFromDB = (encodedBoardWithState, color, foundFn, notFoundFn) => {
  if (color === 'W') {
    knex('DeepRed_WhiteMoves').where({
      parent: encodedBoardWithState,
    }).orderByRaw('white_win + black_win + draw DESC')
      .then((res) => {
        if (res.length === 0) {
          console.log('No Entry Found');
          notFoundFn();
        } else {
          foundFn(res);
        }
      })
      .catch(err => console.warn('db error: ', err));
  } else {
    knex('DeepRed_BlackMoves').where({
      parent: encodedBoardWithState,
    }).orderByRaw('white_win + black_win + draw DESC')
      .then((res) => {
        if (res.length === 0) {
          console.log('No Entry Found');
          notFoundFn();
        } else {
          foundFn(res);
        }
      });
  }
};

const getNewMove = (encodedBoardWithState, color) => {
  if (color === 'white') {
    knex('DeepRed_WhiteMoves').where({
      parent: encodedBoardWithState,
    }).orderBy('winPercentage', 'desc')
      .then((res) => {
        if (JSON.stringify(res) === '[]') {
          console.log('No Entry Found');
        } else {
          console.log(res);
        }
      });
  } else {
    knex('DeepRed_BlackMoves').where({
      parent: encodedBoardWithState,
    }).orderBy('winPercentage', 'desc')
      .then((res) => {
        if (JSON.stringify(res) === '[]') {
          console.log('No Entry Found');
        } else {
          console.log(res);
        }
      });
  }
};

const getAllMoves = (color, foundFn) => {
  if (color === 'W') {
    knex.column('white_win', 'black_win', 'draw').select().from('DeepRed_WhiteMoves').then((res) => {
      let total = 0;
      res.forEach((entry) => { total += entry.white_win + entry.black_win + entry.draw });
      console.log('Total Learned Moves: ', total);
      foundFn(total);
    });
  } else {
    knex.column('white_win', 'black_win', 'draw').select().from('DeepRed_BlackMoves').then((res) => {
      let total = 0;
      res.forEach((entry) => { total += entry.white_win + entry.black_win + entry.draw });
      console.log('Total Learned Moves: ', total);
      foundFn(total);
    });
  }
};

module.exports = {
  saveDeepRedWhite,
  saveDeepRedBlack,
  getMovesFromDB,
  getNewMove,
  getAllMoves,
};
