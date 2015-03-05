'use strict';

angular.module('ticTacToeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        resolve: {
          games: function (Game) {
            return Game.getAll();
            }
        },
        controller: 'MainCtrl'
      })
      .state('main.gameboard', {
        url: "/gameboard",
        templateUrl: 'app/main/gameboard.html'
      })
      .state('main.creategame', {
        url: "/creategame",
        templateUrl: 'app/main/creategame.html'
      });
  });
