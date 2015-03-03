'use strict';

angular.module('ticTacToeApp')
      .directive('gameBoard', [ function(){
        function controllerGameBoard ($scope) {
          // body...
        };
        // Runs during compile
        return {
          // name: '',
          // priority: 1,
          // terminal: true,
          // scope: {}, // {} = isolate, true = child, false/undefined = no change
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
