'use strict';

angular.module('ticTacToeApp')
  .controller('GameboardCtrl', ['$scope', '$rootScope', '$stateParams', 'games', 'GameLogic', 'Auth',
    function ($scope, $rootScope, $stateParams, games, GameLogic, Auth) {

      $rootScope.currentGameId = $stateParams.idGame;

      // Connected user
      $scope.localPlayer = angular.isDefined(Auth.getCurrentUser().name) ?
        Auth.getCurrentUser() : undefined;

      // Get game instance data from state argument (id)
      $scope.activeGame = _.find(games, function (game) {
        return game._id === $stateParams.idGame;
      });

      // Game logic handler
      $scope.gameLogic = new GameLogic($scope.activeGame, $scope.localPlayer);

      // Play turn from directive
      $scope.playTurnRequest = function (cell) {
        if ($scope.localPlayer !== undefined) {
          $scope.message = $scope.gameLogic.playTurn(cell.index);
        }
      };

      // Gameboard message
      $scope.message = $scope.gameLogic.getMessage();

      // Watch remote game updates
      var $offGameRemoteUpdate = $rootScope.$on('game:remoteUpdate', function (e, g) {
        if (g._id === $scope.activeGame._id) {
          $scope.message = $scope.gameLogic.getMessage();
        }
      });

      $scope.$on('$destroy', function () {
        $offGameRemoteUpdate();
      });

    }]);
