'use strict';

angular.module('ticTacToeApp')
  .controller(
  'controllerTictactoeCanvas',
  ['$scope', '$rootScope', 'signEmpty', 'signPlayer1', 'signPlayer2', 'Auth', 'gameService', 'ticTacToeRenderer',
    function ($scope,$rootScope,signEmpty,signPlayer1,signPlayer2,Auth,gameService, tttRenderer) {

      var renderer;

      if (angular.isDefined(Auth.getCurrentUser().name)){
        $scope.localPlayer = Auth.getCurrentUser();
      } else {
        $scope.localPlayer = undefined;
      }

      function numberUserInGame() {
        return gameService.identifyPlayer($scope.game,angular.isDefined($scope.localPlayer)?$scope.localPlayer.name:"");
      }

      function isBlocked() {
        return gameService.isBlocked($scope.game, numberUserInGame());
      }

      function getMessage() {
        if (isMessageDisplay()) {
          if ($scope.game.stateGame==="Over") {
            if (numberUserInGame() === $scope.game.numberWinner) {
              return "La partie est terminée. Vous avez gagné!";
            } else {
              if ($scope.game.numberWinner!==0) {
                return "La partie est terminée. Vous avez perdu!";
              }
              return "La partie est terminée. Match nul!";
            }
          }
          if (numberUserInGame()!==$scope.game.turnPlayer) {
            return "Attente de votre adversaire !";
          }
        }
        return undefined;
      }
      function updateMessage() {
        renderer.setMessage("center", getMessage());
      }

      function isMessageDisplay(game) {
        return isBlocked() && numberUserInGame()!==0;
      }

      function syncBoard() {
        var gameState = $scope.game.stateBoard;

        renderer.forEachCell(
          function (cell) {

            var remoteSate;
            switch(gameState.charAt(cell.index)) {
            case "X":
              remoteSate = 1;
              break;
            case "O":
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
        gameService.playTurn($scope.game, cell.index , player);

        updateMessage();
      }

      this.init = function(options) {

        if ($scope.game === undefined) {
          // TODO : Recup jeux en cours (cas du refresh de page)
          console.error("Instance game non injecté");
          return;
        }

        renderer = new tttRenderer(options);

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
  .directive('tictactoeCanvas', [ function(){
    // Runs during compile
    return {
      scope: {
        game: '='
      },
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      controller: 'controllerTictactoeCanvas',
      template: '<div class="tictactoeContainer"></div>',
      replace: true,
      link: function($scope, elem, attrs, controller) {

        var options = {
          container: elem,
          width: attrs.gameWidth || 3,
          height: attrs.gameHeight || 3,
          colors: {
            bg: "rgba(0,0,0,1)",
            grid: "blue",
            p1: "rgba(0,255,0,1)",
            p2: "rgba(200,0,0,1)"
          },
          draw: { p1: "cross", p2: "circle" },
          messages: [
            { id: "center", position: "center", fontSize: 24, font: "Verdana", text: undefined, color: "rgba(255, 255, 255, 0.5)", bgcolor: "rgba(100, 0, 0, 0.5)" }
          ]
        };

        controller.init(options);

      }
    };
  }]);
