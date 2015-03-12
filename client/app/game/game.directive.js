'use strict';

angular.module('ticTacToeApp')
      .controller('controllerGameBoard',[
        '$scope',
        '$rootScope',
        'signEmpty',
        'signPlayer1',
        'signPlayer2',
        'Auth',
        'gameService',
        function ($scope,$rootScope,signEmpty,signPlayer1,signPlayer2,Auth,gameService) {

          if (angular.isDefined(Auth.getCurrentUser().name)){
            $scope.localPlayer = Auth.getCurrentUser();
          } else {
            $scope.localPlayer = undefined;
          }

          $scope.numberUserInGame = function () {
            return gameService.identifyPlayer($scope.game, angular.isDefined($scope.localPlayer) ? $scope.localPlayer.name : '');
          };

          $scope.isMessageDisplay = function (/*game*/) {
            return $scope.isBlocked() && $scope.numberUserInGame() !== 0;
          };

          $scope.resetEventTilePlayed = $rootScope.$on('tilePlayed', function(event, position) {
            gameService.playTurn($scope.game, position,$scope.numberUserInGame());
          });

          $scope.isBlocked = function () {
            return gameService.isBlocked($scope.game, $scope.numberUserInGame());
          };

          $scope.message = function () {
            if ($scope.isMessageDisplay()) {
              if ($scope.game.stateGame === 'Over') {
                if ($scope.numberUserInGame() === $scope.game.numberWinner) {
                  return 'La partie est terminée. Vous avez gagné!';
                } else {
                  if ($scope.game.numberWinner !== 0) {
                    return 'La partie est terminée. Vous avez perdu!';
                  }
                  return 'La partie est terminée. Match nul!';
                }
              }
              if ($scope.numberUserInGame() !== $scope.game.turnPlayer) {
                return 'Votre adversaire doit jouer!';
              }
            }
            return '';
          };

          $scope.$on('$destroy', function(){
            $scope.resetEventTilePlayed();
          });

        }])
      .directive('gameBoard', [ function(){
         // Runs during compile
        return {
          scope: {
            game: '='
          },
          restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
          controller: 'controllerGameBoard',
          templateUrl: 'app/game/game.template.html',
          replace: true,
          // transclude: true,
          // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
          link: function(/*$scope, iElm, iAttrs, controller*/) {}
        };
      }]);
