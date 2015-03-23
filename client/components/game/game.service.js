'use strict';

angular.module('ticTacToeApp')

  // Game constants
  .constant('signPlayer1', 'X')
  .constant('signPlayer2', 'O')
  .constant('signEmpty', '_')
  .constant('player1', '1')
  .constant('player2', '2')
  .constant('GameState', { PENDING: "Pending", OVER: "Over", WAITING: "Opened" } )

  // Game ressource ajax rest access
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
      //return this.player1 === Auth.getCurrentUser().name && this.stateGame === 'Opened';
      return this.player1 === Auth.getCurrentUser().name || this.stateGame === 'Over';
    };

    return game;
  }])

  .factory('GameLogic', [ 'Game', 'GameState', 'signPlayer1', 'signPlayer2', function (Game, GameState, signPlayer1, signPlayer2) {

    function GameLogic(gameData, player) {

      var that = this, numberPlayer;

      function ctor() {
        if (player !== undefined) {
          numberPlayer = that.identifyPlayer(player.name);
        }
      }

      Object.defineProperty(that, 'player', {
        set: function (pl) {
          player = pl;
          numberPlayer = that.identifyPlayer(player.name);
        },
        get: function () { return player; }
      });

      that.playTurn = function playTurn(position) {
        // I can play
        if (that.isBlocked) {
          return that.getMessage();
        }
        Game.playTurn({position: position}, gameData);
        return that.getMessage();
      };

      Object.defineProperty(that, 'isBlocked', {
        get: function () {
          return !(numberPlayer === gameData.turnPlayer && gameData.stateGame === GameState.PENDING);
        }
      });

      that.identifyPlayer = function identifyPlayer(name) {
        var numberUser = 0;
        if (gameData.player1 === name) {
          numberUser = 1;
        } else {
          if (gameData.player2 === name) {
            numberUser = 2;
          }
        }
        return numberUser;
      };

      that.getMessage = function () {
        var msg, target = "center";
        if (gameData.stateGame === 'Over') {
          if (player !== undefined && player.name === gameData.winner) {
            target = 'victory';
            msg = 'Vous avez gagné !';
          } else {
            if (gameData.winner !== undefined && gameData.winner !== player.name) {
              target = 'loose';
              msg = 'Vous avez perdu !';
            } else {
              target = 'victory';
              msg = 'Match nul !';
            }
          }
        } else if (gameData.stateGame === 'Opened') {
          msg = 'En attente d\'un adversaire';
        } else if (numberPlayer !== gameData.turnPlayer) {
          msg = 'Attente du coup de votre adversaire !';
        }
        if (msg !== undefined) {
          return {
            message: msg,
            target: target
          }
        }
        return undefined;
      };

      ctor();
    }

    return GameLogic;

  }]);
  //
  //// Game helpers
  //.service('gameService', ['_', 'signPlayer1', 'signPlayer2', function (_, signPlayer1, signPlayer2) {
  //
  //  function playTurn(currentGame, position, numberUser) {
  //    var pos = parseInt(position);
  //    var state = currentGame.stateBoard;
  //    var sign = (numberUser === 1) ? signPlayer1 : signPlayer2;
  //    currentGame.stateBoard = state.substring(0, pos) + sign + state.substring(pos + 1, 9);
  //  }
  //
  //  function isBlocked(currentGame, numberUser) {
  //    return !(numberUser === currentGame.turnPlayer && currentGame.stateGame === 'Pending');
  //    //&& currentGame.stateGame !== 'Over' && currentGame.stateGame !== 'Opened');
  //  }
  //
  //  function identifyPlayer(currentGame, name) {
  //    var numberUser = 0;
  //    if (currentGame.player1 === name) {
  //      numberUser = 1;
  //    } else {
  //      if (currentGame.player2 === name) {
  //        numberUser = 2;
  //      }
  //    }
  //    return numberUser;
  //  }
  //
  //  // Exposed methods
  //  return {
  //    identifyPlayer: identifyPlayer,
  //    isBlocked: isBlocked,
  //    playTurn: playTurn
  //  };
  //
  //}]);
