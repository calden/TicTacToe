'use strict';

angular.module('ticTacToeApp')
  .controller('GameboardCtrl', ['$scope', '$stateParams', 'games',
    function ($scope, $stateParams, games) {

      $scope.activeGame = _.find(games, function (game) {
          return game._id === $stateParams.idGame;
        });

      $scope.$on('$destroy', function () {

      });

    }]);
