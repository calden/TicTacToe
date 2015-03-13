'use strict';

angular.module('ticTacToeApp')
  .controller(
  'controllerTictactoeCanvas',
  ['$scope', '$rootScope', 'signEmpty', 'signPlayer1', 'signPlayer2', 'Auth', 'gameService', 'ticTacToeRenderer',
    function ($scope, $rootScope, signEmpty, signPlayer1, signPlayer2, Auth, gameService, TicTacToeRenderer) {

      var renderer, messageTarget = 'center', currentMessageTarget = 'center';

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

      /*function isMessageDisplay() {
        return isBlocked() && numberUserInGame() !== 0;
      }*/

      function getMessage() {
        //if (isMessageDisplay()) {
          if ($scope.game.stateGame === 'Over') {
            if (numberUserInGame() === $scope.game.numberWinner) {
              messageTarget = 'victory';
              return 'Vous avez gagné !';
            } else {
              if ($scope.game.numberWinner !== 0) {
                messageTarget = 'loose';
                return 'Vous avez perdu !';
              } else {
                messageTarget = 'victory';
                return 'Match nul !';
              }
            }
          } else if ($scope.game.stateGame === 'Opened') {
            return 'En attente de joueurs';
          } else if (numberUserInGame() !== $scope.game.turnPlayer) {
            return 'Attente du coup de votre adversaire !';
          }
        //}

        return undefined;
      }

      function updateMessage() {
        var msg = getMessage();
        renderer.setMessage(messageTarget, msg);
        if (messageTarget !== currentMessageTarget) {
          renderer.setMessage(currentMessageTarget, undefined);
          currentMessageTarget = messageTarget;
        }
      }

      function syncBoard() {

        console.log('Game updated', $scope.game.stateGame/*, $scope.game*/);

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

        updateGameState();
      }

      function updateGameState() {

        // Update board message
        updateMessage();

        // block the board
        if (isBlocked()) {
          if (!renderer.locked) {
            renderer.locked = true;
          }
        } else {
          if (renderer.locked) {
            renderer.locked = false;
          }
        }

      }

      function playerTurnRequestHandler(cell) {

        var player;

        updateGameState();

        // Cell is not empty
        if (cell === undefined || cell.state !== undefined) {
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

        // Message and game locked state update
        updateGameState();

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

        // Set game board options
        var options = {
          container: elem,
          width: attrs.gameWidth || 3,
          height: attrs.gameHeight || 3,
          colors: {
            bg: '#F8F8F8',                        // Background color
            grid: 'blue',                         // Grid line color
            p1: 'rgba(0,255,0,1)',                // Player 1 color
            p2: 'rgba(200,0,0,1)'                 // PLayer 2 Color
          },
          draw: {p1: 'cross', p2: 'circle'},      // Players drawing forms
          messages: [                             // Canvas message board definition
            {
              id: 'center',                           // Id used for setMessage method
              position: 'center',                     // Message position in canvas 'center' or 'x,y' in pixel units
              fontSize: 24,                           // Text font size
              font: 'Verdana',                        // Text font family
              text: undefined,                        // Initial text value (undefined if hide)
              color: 'rgba(255, 255, 255, 0.5)',      // Text color
              bgcolor: 'rgba(100, 0, 0, 0.5)'         // Text background color
            },
            {
              id: 'victory',                          // Color and font size for victory message
              position: 'center',
              fontSize: 36,
              font: 'Verdana',
              text: undefined,
              color: 'rgba(255, 255, 255, 1)',
              bgcolor: 'rgba(0,150,0,0.8)'
            },
            {
              id: 'loose',                           // Color and font size for defeat message
              position: 'center',
              fontSize: 36,
              font: 'Verdana',
              text: undefined,
              color: 'rgba(255, 255, 255, 1)',
              bgcolor: 'rgba(100,0,0,0.5)'
            }
          ]
        };

        // Start game render
        controller.init(options);

      }
    };
  }]);
