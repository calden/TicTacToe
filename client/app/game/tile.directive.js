'use strict';

angular.module('ticTacToeApp')
      .directive('tile', [ function(){
        function controllerTile ($scope) {
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
          controller: controllerTile,
          templateUrl: 'app/game/tile.template.html',
          replace: true,
          // transclude: true,
          // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
          link: function($scope, iElm, iAttrs, controller) {

          }
        };
      }]);
