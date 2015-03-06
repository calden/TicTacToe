/* global io */
'use strict';

angular.module('ticTacToeApp')
  .factory('socket', ['socketFactory', 'Game', function(socketFactory, Game) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });


    return {
      socket: socket,


      manageGames: function(games){
        socket.on('game:save', function(game){
          var gameToUpdate = _.find(games, {_id:game._id});
          gameToUpdate.stateBoard = game.stateBoard;
          gameToUpdate.stateGame = game.stateGame;
          gameToUpdate.turnPlayer = game.turnPlayer;
        });
        socket.on('game:remove', function(game){
          _.remove(games, {_id: game._id});
        });
        socket.on('game:create', function(game){
          games.push(new Game(game));
        });

      },

      removeListeners: function () {
        socket.removeAllListeners('game:save');
        socket.removeAllListeners('game:remove');
        socket.removeAllListeners('game:create');
      }
    };
  }]);
