'use strict';

angular.module('ticTacToeApp')
  .constant('signPlayer1', 'X')
  .constant('signPlayer2', 'O')
  .constant('signEmpty', '_')
  .constant('player1', '1')
  .constant('player2', '2')
  .factory('Game', ['$resource', 'Auth', function ($resource, Auth) {

    var game;

    game= $resource(
      '/api/games/:id',
      {
        id: '@_id'
      },
      {
        update: {
          method: 'PUT'
        },
        get: {
          method: 'GET'
        },
        getAll: {
          method: 'GET',
          isArray: true
        }
      }
    );

    game.prototype.canJoin = function () {
      return this.stateGame === 'Opened' && this.player1 !== Auth.getCurrentUser().name;
    };

    game.prototype.canTrash = function () {
      return this.player1 === Auth.getCurrentUser().name;
    };

    // TODO : Ajout EventEmitter sur l'instance, à voir...
    game.prototype.onChange = function (fn) {
      if (this._updHandler === undefined) {
        this._updHandler = [];
      }
      this._updHandler.push(fn);
    };

    game.prototype.triggerChange = function (propertyName, oldvalue) {
      if (this._updHandler !== undefined) {
        this._updHandler.forEach(function (fn) {
          fn.call(this, propertyName, oldvalue);
        });
      }
    };

    game.prototype.offChange = function (fn) {
      if (this._updHandler === undefined) {
        return;
      }
      var index = this._updHandler.indexOf(fn);
      this._updHandler.splice(index, 1);
    };

    return game;
  }])
  .service('gameService', ['_', 'Game', 'signPlayer1', 'signPlayer2', function (_, Game, signPlayer1, signPlayer2) {

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

    function playTurn(currentGame, position, numberUser) {
      var pos = parseInt(position);
      var state = currentGame.stateBoard;
      var sign = (numberUser === 1) ? signPlayer1 : signPlayer2;
      currentGame.stateBoard = state.substring(0, pos) + sign + state.substring(pos + 1, 9);
      if (checkWinnerGame(currentGame, sign)) {
        currentGame.stateGame = 'Over';
        currentGame.numberWinner = numberUser;
      } else {
        if (checkDraw(currentGame)) {
          currentGame.stateGame = 'Over';
          currentGame.numberWinner = 0;
        }
        else {
          currentGame.turnPlayer = (numberUser === 1) ? 2 : 1;
        }
      }
      Game.update(currentGame);
    }

    function isBlocked(currentGame, numberUser) {
      return !(numberUser === currentGame.turnPlayer && currentGame.stateGame !== 'Over');
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

    // Exposed methods
    return {
      identifyPlayer: identifyPlayer,
      isBlocked: isBlocked,
      playTurn: playTurn
    };

  }]);
