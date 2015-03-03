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
      });
  });
