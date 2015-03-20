'use strict';

var _ = require('lodash');
var Game = require('./game.model');

var signEmpty ='_';

var signPlayer = { '1': 'X', '2':'O' };

var stateOver = "Over";

/**
 * Fonction permettant de valider que le coup est possible
 */
exports.validateTurn = function(req,res,game) {
  var charAtPosition =  game.stateBoard.charAt(req.params.position);
   if ( charAtPosition === '' || charAtPosition!=='_' ) {
     return res.send(500,"Impossible de jouer sur cette case.");
   }
};

/**
 * Fonction permettant de jouer le coup , verifier si il y a un gagnant et de sauver l'etat du jeu
 */
exports.playTurn = function(req,res,game) {
  var numberPlayer = identifyPlayer(game,req.user.name);
  var state = game.stateBoard;
  var pos = parseInt(req.params.position);
  game.stateBoard =state.substring(0,pos)+signPlayer[numberPlayer]+state.substring(pos+1,9);
  if (checkWinnerGame(game,signPlayer[numberPlayer])) {
    game.stateGame = stateOver;
    game.winner = req.user.name;
  } else {
   if(checkDraw(game)) {
     game.stateGame = stateOver;
   } else {
     game.turnPlayer = numberPlayer===1 ? 2 : 1;
   }
  }
  game.save(function (err) {
    if (err) { return handleError(res, err); }
    Game.emit('game:save', game);
    if(game.winner){
      var top10;
//      top10 = aggregat Mongo
      Game.emit('game:endGame', top10);
    }
    return res.json(200, game);
  });

};

function checkWinnerGame(currentGame,signPlayer) {
   var winnerState = [[0,1,2],[0,4,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]] ;
   return _.some(winnerState,function (position) {
      return _.every(position,function (index) {
        return currentGame.stateBoard.charAt(index)===signPlayer;
        });
   });
}

function checkDraw(currentGame) {
   return !_.some(currentGame.stateBoard,function (position) {
     return position === '_';
   });

}

function identifyPlayer(currentGame,name) {
   var numberUser = 0;
   if (currentGame.player1===name) {
     numberUser = 1;
   } else {
     if (currentGame.player2===name) {
       numberUser = 2;
     }
   }
   return numberUser;
}

function handleError(res, err) {
  return res.send(500, err);
}
