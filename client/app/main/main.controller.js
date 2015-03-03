'use strict';

angular.module('ticTacToeApp')
  .controller('MainCtrl', function ($scope,games) {
    $scope.games = games ;
  });
