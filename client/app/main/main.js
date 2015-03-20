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
          },
          scores: function (Game) {
            return Game.getScores();
            /*return [
              { name: "Test",    score: 100 },
              { name: "Admin",   score: 75 },
              { name: "Player3", score: 50 },
              { name: "Player4", score: 40 },
              { name: "Player5", score: 30 },
              { name: "Player6", score: 20 },
              { name: "Player7", score: 10 },
              { name: "Player8", score: 9 },
              { name: "Player9", score: 8 },
              { name: "Player10",score: 7 }
            ];*/
          }
        },
        controller: 'MainCtrl'
      })
      .state('main.gameboard', {
        url: 'gameboard/:idGame',
        resolve: {
          activeGame: ['games', '$stateParams', function (games, $stateParams) {
            return _.find(games, function (game) {
              return game._id === $stateParams.idGame;
            });
          }]
        },
        templateUrl: 'app/main/gameboard.html',
        controller: function ($scope, activeGame, $rootScope, $state) {
          if (activeGame === undefined) {
            $rootScope.currentGameId = undefined;
            $state.go('main');
            return;
          }
          $scope.activeGame = activeGame;
          $rootScope.currentGameId = activeGame._id;
        }
      })
      .state('main.creategame', {
        url: 'creategame',
        templateUrl: 'app/main/creategame.html'
      });

  });
