'use strict';

angular.module('ticTacToeApp')
  .constant('signPlayer1', 'X')
  .constant('signPlayer2', 'O')
  .constant('signEmpty', '_')
  .constant('player1', '1')
  .constant('player2', '2')
  .factory('Game', ['$resource', 'Auth', function ($resource, Auth) {

    var game;

    game = $resource(
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
        },
        playTurn: {
          method: 'POST',
          url: '/api/games/:id/:position'
        },
        getScores: {
          method: 'GET',
          url: '/api/games/scores/10',
          isArray: true
        }
      });
    game.prototype.canJoin = function () {
      return angular.isDefined(Auth.getCurrentUser().name) && this.stateGame === 'Opened' && this.player1 !== Auth.getCurrentUser().name;
    };

    game.prototype.canTrash = function () {
      return this.player1 === Auth.getCurrentUser().name && this.stateGame === 'Opened';
    };

    return game;
  }])
  .service('gameService', ['_', 'Game', 'signPlayer1', 'signPlayer2', function (_, Game, signPlayer1, signPlayer2) {

    function playTurn(currentGame, position, numberUser) {
      var pos = parseInt(position);
      var state = currentGame.stateBoard;
      var sign = (numberUser === 1) ? signPlayer1 : signPlayer2;
      currentGame.stateBoard = state.substring(0, pos) + sign + state.substring(pos + 1, 9);
    }

    function isBlocked(currentGame, numberUser) {
      return !(numberUser === currentGame.turnPlayer && currentGame.stateGame === 'Pending'); //&& currentGame.stateGame !== 'Over' && currentGame.stateGame !== 'Opened');
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
