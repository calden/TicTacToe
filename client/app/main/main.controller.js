'use strict';

angular.module('ticTacToeApp')
  .controller('MainCtrl',['$scope', '$state','games', 'socket',function ($scope,$state,games, socket) {
    socket.manageGames(games);
    $scope.select = function (game) {
      $state.go("main.gameboard", {idGame: game._id});
    };
    $scope.createGame = function (){
      $state.go("main.creategame");
    };

    $scope.games = games ;

    $scope.$on('$destroy', function(){
      socket.removeListeners();
    })
    
  }]);
