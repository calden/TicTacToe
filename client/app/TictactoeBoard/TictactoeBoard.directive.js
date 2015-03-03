'use strict';

angular.module('ticTacToeApp')
  .directive('TictactoeBoard', function () {
    return {
      templateUrl: 'app/TictactoeBoard/TictactoeBoard.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });