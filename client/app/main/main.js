'use strict';

angular.module('ticTacToeApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        resolve: {
          games: function (Game) {
            return Game.getAll().$promise;
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
