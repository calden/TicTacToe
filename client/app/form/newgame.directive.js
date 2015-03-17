'use strict';

angular.module('ticTacToeApp')
  .controller('controllerNewGame', [
    '$scope',
    '$state',
    'Auth',
    'Game',
    function ($scope, $state, Auth, Game) {

      $scope.userConnected = angular.isDefined(Auth.getCurrentUser().name);

      $scope.gameCreated = false;

      $scope.firstPlayer = true;

      $scope.newGame = {
        player1: Auth.getCurrentUser().name,
        player2: ''
      };

      $scope.validateNewGame = function () {
        $scope.newGame.turnPlayer = $scope.firstPlayer ? 1 : 2;
        $scope.newGame = Game.save($scope.newGame);
        $scope.gameCreated = true;
      };

      $scope.display = function () {
        $state.go('main.gameboard', {idGame: $scope.newGame._id});
      };

    }])
  .directive('newGame', [function () {
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      controller: 'controllerNewGame',
      templateUrl: 'app/form/newgame.template.html',
      replace: true,
      link: function (/*$scope, iElm, iAttrs, controller*/) {}
    };
  }]);
