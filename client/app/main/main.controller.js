'use strict';

angular.module('ticTacToeApp')
  .controller('MainCtrl', function ($scope,games) {
    $scope.games = games ;
    $scope.tableau = "__O_X_O___";
  });
