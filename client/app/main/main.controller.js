'use strict';

angular.module('ticTacToeApp')
  .controller('MainCtrl',['$scope', '$state','games', 'socket',function ($scope,$state,games, socket) {
    socket.manageGames(games);
    $scope.select = function (game) {
      $scope.currentGame = game;
      $state.go("main.gameboard");
    }
    $scope.games = games ;

    $scope.$on('$destroy', function(){
      socket.removeListeners();
    })

  }]);
