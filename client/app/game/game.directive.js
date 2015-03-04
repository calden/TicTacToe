'use strict';

angular.module('ticTacToeApp')
      .directive('gameBoard', ['$rootScope', function($rootScope){
        function controllerGameBoard ($scope) {
          $rootScope.$on('tilePlayed', function(event, position) {
            var pos = parseInt(position);
            $scope.stateboard = $scope.stateboard.substring(0,pos)+"X"+$scope.stateboard.substring(pos+1,9);
          });
        };
        // Runs during compile
        return {
          // name: '',
          // priority: 1,
          // terminal: true,
          scope: {
            stateboard: '='
            // player: '@',
            // opponent: '@',
            // stateGame: '='
          }, // {} = isolate, true = child, false/undefined = no change
          // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
          restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
          controller: controllerGameBoard,
          templateUrl: 'app/game/game.template.html',
          replace: true,
          // transclude: true,
          // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
          link: function($scope, iElm, iAttrs, controller) {

          }
        };
      }]);
