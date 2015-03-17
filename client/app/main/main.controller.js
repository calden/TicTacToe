'use strict';

angular.module('ticTacToeApp')
  .controller('MainCtrl', ['$scope', '$state', '$rootScope', 'games', 'socket', 'Auth',
    function ($scope, $state, $rootScope, games, socket, Auth) {

      socket.manageGames(games);

      $scope.select = function (game) {
        $state.go('main.gameboard', {idGame: game._id});
      };

      $scope.createGame = function () {
        $state.go('main.creategame');
      };

      $scope.games = games;

      $scope.join = function (game) {
        game.player2 = Auth.getCurrentUser().name;
        game.stateGame = 'Pending';
        game.$update();
        $state.go('main.gameboard', {idGame: game._id});
      };

      $scope.close = function () {
        $rootScope.currentGameId = undefined;
      };

      $scope.$on('$destroy', function () {
        socket.removeListeners();
      });

    }]);
