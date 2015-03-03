'use strict';

angular.module('ticTacToeApp')
      .directive('gameBoard', function factory() {
        function controllerGameBoard($scope) {

        };
        var directiveDefinitionObject = {
          restrict: 'E',
          replace: true,
          controller: controllerGameBoard,
          templateUrl: 'app/game/game.template.html',
        };
        return directiveDefinitionObject;
      });
