'use strict';

angular.module('ticTacToeApp')
  .controller(
  'controllerTictactoeCanvas',
  ['$scope', '$rootScope', 'signEmpty', 'signPlayer1', 'signPlayer2', 'Auth', 'gameService', 'ticTacToeRenderer',
    function ($scope, $rootScope, signEmpty, signPlayer1, signPlayer2, Auth, gameService, TicTacToeRenderer) {

      var renderer;

      if (angular.isDefined(Auth.getCurrentUser().name)) {
        $scope.localPlayer = Auth.getCurrentUser();
      } else {
        $scope.localPlayer = undefined;
      }

      function numberUserInGame() {
        return gameService.identifyPlayer($scope.game, angular.isDefined($scope.localPlayer) ? $scope.localPlayer.name : '');
      }

      function isBlocked() {
        return gameService.isBlocked($scope.game, numberUserInGame());
      }

      function getMessage() {
        if (isMessageDisplay()) {
          if ($scope.game.stateGame === 'Over') {
            if (numberUserInGame() === $scope.game.numberWinner) {
              return 'La partie est terminée. Vous avez gagné!';
            } else {
              if ($scope.game.numberWinner !== 0) {
                return 'La partie est terminée. Vous avez perdu!';
              }
              return 'La partie est terminée. Match nul!';
            }
          }
          if (numberUserInGame() !== $scope.game.turnPlayer) {
            return 'Attente de votre adversaire !';
          }
        }
        return undefined;
      }

      function updateMessage() {
        renderer.setMessage('center', getMessage());
      }

      function isMessageDisplay() {
        return isBlocked() && numberUserInGame() !== 0;
      }

      function syncBoard() {
        var gameState = $scope.game.stateBoard;

        renderer.forEachCell(
          function (cell) {

            var remoteSate;
            switch (gameState.charAt(cell.index)) {
            case 'X':
              remoteSate = 1;
              break;
            case 'O':
              remoteSate = 2;
              break;
            }

            if (remoteSate !== cell.state) {
              renderer.setCell(cell.ix, cell.iy, remoteSate);
            }

          }
        );

        updateMessage();
      }

      function playerTurnRequestHandler(cell) {

        var player;

        // Update board message
        updateMessage();

        // block the board
        if (isBlocked()) {
          if (!renderer.blocked) {
            renderer.blocked = true;
          }
          return;
        } else {
          if (renderer.blocked) {
            renderer.blocked = false;
          }
        }

        // Cell is not empty
        if (cell.state !== undefined) {
          return;
        }

        player = numberUserInGame();

        // Display played tile on local board
        renderer.setPlayerTurn(cell.ix, cell.iy, player);

        // Send to server
        gameService.playTurn($scope.game, cell.index, player);

        updateMessage();
      }

      this.init = function (options) {

        if ($scope.game === undefined) {
          // TODO : Recup jeux en cours (cas du refresh de page)
          console.error('Instance game non injecté');
          return;
        }

        renderer = new TicTacToeRenderer(options);

        syncBoard();

        renderer.onCellRequest(playerTurnRequestHandler);

        // On remote update received
        $scope.game.onChange(syncBoard);

      };


      $scope.$on('$destroy', function destroy() {

        if ($scope.game === undefined) {
          return;
        }

        $scope.game.offChange(syncBoard);

        renderer.destroy();
        renderer = undefined;

      });

    }])
  .directive('tictactoeCanvas', [function () {
    // Runs during compile
    return {
      scope: {
        game: '='
      },
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      controller: 'controllerTictactoeCanvas',
      template: '<div class="tictactoeContainer"></div>',
      replace: true,
      link: function ($scope, elem, attrs, controller) {

        var options = {
          container: elem,
          width: attrs.gameWidth || 3,
          height: attrs.gameHeight || 3,
          colors: {
            bg: 'rgba(0,0,0,1)',              // Background color
            grid: 'blue',                     // Grid line color
            p1: 'rgba(0,255,0,1)',            // Player 1 color
            p2: 'rgba(200,0,0,1)'             // PLayer 2 Color
          },
          draw: {p1: 'cross', p2: 'circle'},  // Players drawing forms
          messages: [                         // Canvas message board definition
            {
              id: 'center',                       // Id used for setMessage method
              position: 'center',                 // Message position in canvas 'center' or 'x,y' in pixel units
              fontSize: 24,                       // Text font size
              font: 'Verdana',                    // Text font family
              text: undefined,                    // Initial text value (undefined if hide)
              color: 'rgba(255, 255, 255, 0.5)',  // Text color
              bgcolor: 'rgba(100, 0, 0, 0.5)'     // Text background color
            }
          ]
        };

        controller.init(options);

      }
    };
  }]);
