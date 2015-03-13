'use strict';

angular.module('ticTacToeApp')
      .controller('controllerGameBoard',[
        '$scope',
        '$rootScope',
        'signEmpty',
        'signPlayer1',
        'signPlayer2',
        'Auth',
        'Game',
        'gameService',
        function ($scope,$rootScope,signEmpty,signPlayer1,signPlayer2,Auth,Game,gameService) {

          if (angular.isDefined(Auth.getCurrentUser().name)){
            $scope.localPlayer = Auth.getCurrentUser();
          } else {
            $scope.localPlayer = undefined;
          }

          $scope.numberUserInGame = function () {
            return gameService.identifyPlayer($scope.game, angular.isDefined($scope.localPlayer) ? $scope.localPlayer.name : '');
          };

          $scope.isMessageDisplay = function (/*game*/) {
            return $scope.message() !== ''; //$scope.isBlocked() && $scope.numberUserInGame() !== 0;
          };

          $scope.resetEventTilePlayed = $rootScope.$on('tilePlayed', function(event, position) {
            var oldGame = $scope.game;
            // Playing Front
            gameService.playTurn($scope.game,position,$scope.numberUserInGame());
            // Playing/Validating Back
            Game.playTurn({ position: position },$scope.game,function(data) {}, function (err) {
               $scope.game = oldGame;
            });
          });

          $scope.isBlocked = function () {
            return gameService.isBlocked($scope.game, $scope.numberUserInGame());
          };

          $scope.message = function () {
            //if ($scope.isMessageDisplay()) {
              if ($scope.game.stateGame === 'Over') {
                if ($scope.numberUserInGame() === $scope.game.numberWinner) {
                  return 'La partie est terminée. Vous avez gagné!';
                } else {
                  if ($scope.game.numberWinner !== 0) {
                    return 'La partie est terminée. Vous avez perdu!';
                  }
                  return 'La partie est terminée. Match nul!';
                }
              } else if ($scope.game.stateGame === 'Opened') {
                return 'En attente de joueurs';
              } else if ($scope.numberUserInGame() !== $scope.game.turnPlayer) {
                return 'Votre adversaire doit jouer!';
              }
            //}
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
