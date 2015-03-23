'use strict';

var _ = require('lodash');
var Game = require('./game.model');

var signEmpty = '_';

var signPlayer = {'1': 'X', '2': 'O'};

var stateOver = "Over";
var statePending = "Pending";

/**
 * Fonction permettant de jouer le coup , verifier si il y a un gagnant et de sauver l'etat du jeu
 */
exports.validateAndplayTurn = function (game, position, userName, callback) {
  // Jeux ouvert
  if (game.stateGame !== statePending) {
    callback("Cette partie n'est pas en cours.");
    return;
  }
  // C'est bien mon tour
  var numberPlayer = identifyPlayer(game, userName);
  if (numberPlayer !== game.turnPlayer) {
    callback("Ce n'est pas à ce joueur de jouer.");
    return;
  }
  // La case est libre
  var charAtPosition = game.stateBoard.charAt(position);
  if (charAtPosition === '' || charAtPosition !== '_') {
    callback("Impossible de jouer sur cette case.");
    return;
  }
  // Prise en compte du coup demandé
  var state = game.stateBoard;
  var pos = parseInt(position, 10);
  game.stateBoard = state.substring(0, pos) + signPlayer[numberPlayer] + state.substring(pos + 1, 9);
  if (checkWinnerGame(game, signPlayer[numberPlayer])) {
    game.stateGame = stateOver;
    game.winner = userName;
  } else {
    if (checkDraw(game)) {
      game.stateGame = stateOver;
    } else {
      game.turnPlayer = numberPlayer === 1 ? 2 : 1;
    }
  }
  callback(null, game);
};

function checkWinnerGame(currentGame, signPlayer) {
  var winnerState = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
  return _.some(winnerState, function (position) {
    return _.every(position, function (index) {
      return currentGame.stateBoard.charAt(index) === signPlayer;
    });
  });
}

function checkDraw(currentGame) {
  return !_.some(currentGame.stateBoard, function (position) {
    return position === '_';
  });
}

function identifyPlayer(currentGame, name) {
  var numberUser = 0;
  if (currentGame.player1 === name) {
    numberUser = 1;
  } else {
    if (currentGame.player2 === name) {
      numberUser = 2;
    }
  }
  return numberUser;
}

function handleError(res, err) {
  return res.send(500, err);
}
