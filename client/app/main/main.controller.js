'use strict';

angular.module('ticTacToeApp')
  .controller('MainCtrl',['$scope', '$state','games',function ($scope,$state,games) {
    $scope.select = function (game) {
      $scope.currentGame = game;
      $state.go("main.gameboard");
    }
    $scope.games = games ;

  }]);
