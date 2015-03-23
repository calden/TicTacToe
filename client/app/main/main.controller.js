'use strict';

angular.module('ticTacToeApp')
  .controller('MainCtrl', ['$scope', '$state', '$rootScope', 'games', 'scores', 'socket', 'Auth',
    function ($scope, $state, $rootScope, games, scores, socket, Auth) {
      var main = this;
      socket.manageGames(games);
      socket.manageScores(scores);

      main.scores = scores;
      main.games = games;

      main.stateFilter = '!Over';

      main.select = function (game) {
        $state.go('main.gameboard', {idGame: game._id});
      };

      main.createGame = function () {
        $state.go('main.creategame');
      };

      main.join = function (game) {
        game.player2 = Auth.getCurrentUser().name;
        game.stateGame = 'Pending';
        game.$update();
        $state.go('main.gameboard', {idGame: game._id});
      };

      main.close = function () {
        $rootScope.currentGameId = undefined;
      };

      main.remove = function (game) {
        var index;
        if (game.stateGame === 'Over') {
          index = main.games.indexOf(game);
          main.games.splice(index, 1);
        } else {
          game.$remove();
        }
      };

      $scope.$on('$destroy', function () {
        socket.removeListeners();
      });

    }]);
