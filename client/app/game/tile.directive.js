'use strict';

angular.module('ticTacToeApp')
      .directive('tile', [ '$rootScope', function($rootScope){
        function controllerTile ($scope) {
           $scope.value = function () {
             return $scope.statetile==='_'? '': $scope.statetile;
           };
           $scope.isEmpty = function () {
             return $scope.statetile==='_';
           };
           $scope.playThisTile = function () {
             if ($scope.isEmpty()) {
               $rootScope.$emit('tilePlayed',$scope.position);
             }
           };
        };
        // Runs during compile
        return {
          // name: '',
          // priority: 1,
          // terminal: true,
          scope: {
            statetile: '=',
             position: '@'
            // tilePlayed: '&'
          }, // {} = isolate, true = child, false/undefined = no change
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
