var gameService = require('./game.service.js');
var sinon = require('sinon');

describe('game management', function(){

  it('should reply 500 if position is already played', function(){
    var spy = sinon.spy()
    var res = {
      send : spy
    };
    var req = {
      params:{
        position:5
      }
    };

    var game = {
      stateBoard:'_____X___'
    };

    gameService.validateTurn(req, res, game);

    sinon.assert.calledWith(spy, 500)
  })

})
